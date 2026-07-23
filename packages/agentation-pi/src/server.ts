import { type ChildProcess } from "node:child_process";
import { createHash, randomBytes } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { basename } from "node:path";
import { StringDecoder } from "node:string_decoder";
import {
  createParentSession,
  resumeChildSession,
  runChildSession,
  SessionRunError,
  type CapturedChange,
  type PiRpcEvent,
} from "./protocol.js";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 4748;
const MAX_REQUEST_BYTES = 1_000_000;
const MAX_QUEUED_ACTIONS = 5;
const RECENT_ACTION_LIMIT = 100;
const RETAINED_TASK_LIMIT = 100;
const MAX_PROJECTION_STREAMS = 4;
const MAX_PROJECTION_MARKDOWN_BYTES = 50 * 1024;
const PROJECTION_BROADCAST_INTERVAL_MS = 100;
const MAX_PROJECTION_CONTENT_BYTES = 32 * 1024 * 1024;
const MAX_PROJECTION_REJECTION_OPERATIONS = 200;
const MAX_REPLY_TOMBSTONES = 200;
const MAX_PROJECTION_MESSAGES = 50;
const MAX_PROJECTION_MESSAGE_BYTES = 100 * 1024;
const MAX_REPLY_TEXT_BYTES = 100 * 1024;

type Annotation = {
  id: string;
  comment: string;
  sourceFile?: string;
  element?: string;
  elementPath?: string;
  selectedText?: string;
  reactComponents?: string;
};
type Submission = {
  event: "submit";
  output: string;
  annotations: Annotation[];
  timestamp?: unknown;
  url?: string;
};
type ProgressEvent = {
  type: string;
  batchId: string;
  annotationIds: string[];
  delta?: string;
  markdown?: string;
  message?: string;
  toolName?: string;
};
type ProjectionAnnotation = Pick<
  Annotation,
  | "id"
  | "comment"
  | "sourceFile"
  | "element"
  | "elementPath"
  | "selectedText"
  | "reactComponents"
>;
/**
 * Canonical task state for editor/canvas/browser projections. Consumers replace local state with each
 * snapshot; they never own execution or reconstruct truth from an event log.
 */
type ProjectionMessage = {
  id: string;
  annotationId?: string;
  role: "user" | "assistant";
  body: string;
};
type TaskSnapshot = {
  type: "task.snapshot";
  taskId: string;
  incarnationId: string;
  revision: number;
  settled: boolean;
  updatedAt: number;
  cwd: string;
  url?: string;
  annotations: ProjectionAnnotation[];
  status: "queued" | "running" | "completed" | "failed";
  detail: string;
  markdown?: string;
  sessionFile?: string;
  error?: string;
  changes?: Array<{ path: string }>;
  messages?: ProjectionMessage[];
};
type ProjectionContent = {
  before: string;
  after: string;
  beforeExists: boolean;
  afterExists: boolean;
  beforeMode?: number;
};
type ProjectionRejectionPrepare = {
  generation: string;
  taskId: string;
  path: string;
  requestId: string;
};
type ProjectionRejectionAck = { generation: string; operationId: string };
type ProjectionReply = {
  generation: string;
  taskId: string;
  annotationId: string;
  text: string;
  requestId: string;
};
type ProjectionSettlement = {
  generation: string;
  taskId: string;
  incarnationId: string;
  revision: number;
  settled: boolean;
};
type ProjectionReplyOperation = ProjectionReply & {
  signature: string;
  messageId: string;
  assistantMessageId: string;
};
type ProjectionReplyTombstone = {
  requestId: string;
  taskId: string;
  signature: string;
};
type ProjectionRejectionOperation = ProjectionRejectionPrepare & {
  operationId: string;
  fingerprint: string;
  beforeExists: boolean;
  afterExists: boolean;
};
type Logger = Pick<Console, "info" | "error">;
type AgentationServerOptions = {
  cwd: string;
  piBin?: string;
  port?: number;
  logger?: Logger;
  maxProjectionContentBytes?: number;
  retainedTaskLimit?: number;
  recentActionLimit?: number;
};
type AgentationServer = {
  parentSession: string;
  url: string;
  close: () => Promise<void>;
};

function readSubmission(req: IncomingMessage): Promise<Submission> {
  return new Promise<Submission>((resolve, reject) => {
    const decoder = new StringDecoder("utf8");
    let body = "";
    let bytes = 0;

    req.on("data", (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > MAX_REQUEST_BYTES) {
        reject(new Error("submission exceeds 1 MB"));
        req.destroy();
        return;
      }
      body += decoder.write(chunk);
    });
    req.on("end", () => {
      body += decoder.end();
      try {
        const value = JSON.parse(body) as Partial<Submission>;
        if (
          value.event !== "submit" ||
          typeof value.output !== "string" ||
          value.output.trim().length === 0 ||
          !Array.isArray(value.annotations) ||
          !value.annotations.every(
            (annotation) =>
              annotation &&
              typeof annotation === "object" &&
              typeof annotation.id === "string" &&
              annotation.id.length > 0 &&
              typeof annotation.comment === "string",
          )
        ) {
          reject(new Error("invalid Agentation submission"));
          return;
        }
        resolve(value as Submission);
      } catch (error) {
        reject(error instanceof Error ? error : new Error("invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function readProjectionRequest(req: IncomingMessage): Promise<Record<string, unknown>> {
  return new Promise((resolveRequest, rejectRequest) => {
    const decoder = new StringDecoder("utf8");
    let body = "";
    let bytes = 0;
    let exceeded = false;
    req.on("data", (chunk: Buffer) => {
      bytes += chunk.length;
      if (bytes > MAX_REQUEST_BYTES) exceeded = true;
      if (!exceeded) body += decoder.write(chunk);
    });
    req.on("end", () => {
      if (exceeded) {
        rejectRequest(new Error("request exceeds 1 MB"));
        return;
      }
      body += decoder.end();
      try {
        const value = JSON.parse(body) as unknown;
        if (!value || typeof value !== "object" || Array.isArray(value)) {
          throw new Error("invalid projection request");
        }
        resolveRequest(value as Record<string, unknown>);
      } catch (error) {
        rejectRequest(error instanceof Error ? error : new Error("invalid JSON"));
      }
    });
    req.on("error", rejectRequest);
  });
}

function isBoundedId(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 512 && !value.includes("\0");
}

function isAllowedOrigin(origin: string | undefined): origin is string {
  if (!origin) return false;
  try {
    const { hostname, port, protocol } = new URL(origin);
    return protocol === "http:" && port === "3000" && (hostname === "localhost" || hostname === HOST);
  } catch {
    return false;
  }
}

function actionKey(submission: Submission): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        timestamp: submission.timestamp,
        output: submission.output,
        annotationIds: submission.annotations.map(({ id }) => id ?? ""),
      }),
    )
    .digest("hex");
}

function childName(submission: Submission): string {
  const firstComment = submission.annotations.find(({ comment }) => comment?.trim())?.comment?.trim();
  return `agentation: ${(firstComment ?? `${submission.annotations.length} annotations`).slice(0, 60)}`;
}

function submittedAnnotationIds(submission: Submission): string[] {
  return submission.annotations.flatMap(({ id }) => (id ? [id] : []));
}

function childPrompt(submission: Submission): string {
  const ids = submittedAnnotationIds(submission);
  return [
    "address this submitted Agentation feedback in the current project.",
    "treat the annotations as one batch, make the requested code changes, and verify the result.",
    ids.length > 0 ? `annotation ids: ${ids.join(", ")}` : undefined,
    submission.url ? `submitted from: ${submission.url}` : undefined,
    "",
    submission.output,
  ]
    .filter((line) => line !== undefined)
    .join("\n");
}

function boundProjectionMessages(messages: ProjectionMessage[]): ProjectionMessage[] {
  let start = Math.max(0, messages.length - MAX_PROJECTION_MESSAGES);
  let bytes = messages
    .slice(start)
    .reduce((total, message) => total + Buffer.byteLength(message.body, "utf8"), 0);
  while (start < messages.length && bytes > MAX_PROJECTION_MESSAGE_BYTES) {
    bytes -= Buffer.byteLength(messages[start].body, "utf8");
    start += 1;
  }
  return messages.slice(start);
}

function projectionContentFingerprint(
  taskId: string,
  path: string,
  content: ProjectionContent,
): string {
  const before = Buffer.from(content.before, "utf8");
  const after = Buffer.from(content.after, "utf8");
  return createHash("sha256")
    .update(
      JSON.stringify({
        taskId,
        path,
        beforeExists: content.beforeExists,
        afterExists: content.afterExists,
        beforeBytes: before.length,
        afterBytes: after.length,
      }),
    )
    .update(before)
    .update(after)
    .digest("hex");
}

function replySignature(reply: ProjectionReply): string {
  return createHash("sha256")
    .update(
      JSON.stringify({
        generation: reply.generation,
        taskId: reply.taskId,
        annotationId: reply.annotationId,
        text: reply.text,
      }),
    )
    .digest("hex");
}

class ReplyTombstoneStore {
  private readonly tombstones = new Map<string, ProjectionReplyTombstone>();

  get size(): number {
    return this.tombstones.size;
  }

  match(requestId: string, taskId: string, signature: string): 202 | 409 | undefined {
    const tombstone = this.tombstones.get(requestId);
    if (!tombstone) return undefined;
    return tombstone.taskId === taskId && tombstone.signature === signature ? 202 : 409;
  }

  add(tombstone: ProjectionReplyTombstone): void {
    this.tombstones.delete(tombstone.requestId);
    this.tombstones.set(tombstone.requestId, tombstone);
    while (this.tombstones.size > MAX_REPLY_TOMBSTONES) {
      const oldestRequestId = this.tombstones.keys().next().value;
      if (!oldestRequestId) break;
      this.tombstones.delete(oldestRequestId);
    }
  }

  deleteTask(taskId: string): void {
    for (const [requestId, tombstone] of this.tombstones) {
      if (tombstone.taskId === taskId) this.tombstones.delete(requestId);
    }
  }

  clear(): void {
    this.tombstones.clear();
  }
}

function replyPrompt(reply: ProjectionReply): string {
  return [
    `follow up on annotation ${reply.annotationId} in this same Agentation task.`,
    "make any requested code changes and verify the result.",
    "",
    reply.text,
  ].join("\n");
}

function waitForExit(child: ChildProcess, timeoutMs: number): Promise<boolean> {
  if (child.exitCode !== null || child.signalCode !== null) return Promise.resolve(true);
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      child.off("exit", onExit);
      resolve(false);
    }, timeoutMs);
    const onExit = () => {
      clearTimeout(timeout);
      resolve(true);
    };
    child.once("exit", onExit);
  });
}

async function stopProcess(child: ChildProcess): Promise<void> {
  if (child.exitCode !== null || child.signalCode !== null) return;
  child.kill("SIGTERM");
  if (await waitForExit(child, 2_000)) return;
  child.kill("SIGKILL");
  await waitForExit(child, 2_000);
}

export async function createAgentationServer({
  cwd,
  piBin = process.env.PI_BIN ?? "pi",
  port = DEFAULT_PORT,
  logger = console,
  maxProjectionContentBytes = MAX_PROJECTION_CONTENT_BYTES,
  retainedTaskLimit = RETAINED_TASK_LIMIT,
  recentActionLimit = RECENT_ACTION_LIMIT,
}: AgentationServerOptions): Promise<AgentationServer> {
  maxProjectionContentBytes = Number.isFinite(maxProjectionContentBytes)
    ? Math.min(MAX_PROJECTION_CONTENT_BYTES, Math.max(0, maxProjectionContentBytes))
    : MAX_PROJECTION_CONTENT_BYTES;
  retainedTaskLimit = Number.isFinite(retainedTaskLimit)
    ? Math.min(RETAINED_TASK_LIMIT, Math.max(0, Math.floor(retainedTaskLimit)))
    : RETAINED_TASK_LIMIT;
  recentActionLimit = Number.isFinite(recentActionLimit)
    ? Math.min(RECENT_ACTION_LIMIT, Math.max(0, Math.floor(recentActionLimit)))
    : RECENT_ACTION_LIMIT;
  const parentSession = await createParentSession({
    piBin,
    cwd,
    name: `agentation: ${basename(cwd)}`,
  });
  const childProcesses = new Set<ChildProcess>();
  const eventStreams = new Map<ServerResponse, string>();
  const eventHistory = new Map<string, ProgressEvent[]>();
  const projectionStreams = new Set<ServerResponse>();
  const projectionSnapshots = new Map<string, TaskSnapshot>();
  const projectionContents = new Map<string, Map<string, ProjectionContent>>();
  const projectionBroadcastTimers = new Map<string, NodeJS.Timeout>();
  const projectionGeneration = randomBytes(16).toString("hex");
  const pendingRejectionOperationsById = new Map<string, ProjectionRejectionOperation>();
  const pendingRejectionOperationsByRequest = new Map<string, ProjectionRejectionOperation>();
  const committedRejectionOperationsById = new Map<string, ProjectionRejectionOperation>();
  const committedRejectionOperationsByRequest = new Map<string, ProjectionRejectionOperation>();
  const pendingRepliesByRequest = new Map<string, ProjectionReplyOperation>();
  const pendingReplyByTask = new Map<string, ProjectionReplyOperation>();
  const replyTombstones = new ReplyTombstoneStore();
  const recentActions = new Set<string>();
  let closing = false;
  let queued = 0;
  let active = 0;
  let projectionContentBytes = 0;
  let projectionMutationQueue: Promise<void> = Promise.resolve();
  let queue: Promise<void> = Promise.resolve();

  const serializeProjectionMutation = <T>(operation: () => Promise<T> | T): Promise<T> => {
    const result = projectionMutationQueue.then(operation, operation);
    projectionMutationQueue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  };

  const broadcast = (clientId: string, event: ProgressEvent): void => {
    const history = eventHistory.get(clientId) ?? [];
    history.push(event);
    if (history.length > 200) history.shift();
    eventHistory.set(clientId, history);

    const record = `data: ${JSON.stringify(event)}\n\n`;
    for (const [stream, streamClientId] of eventStreams) {
      if (streamClientId === clientId) stream.write(record);
    }
  };

  const broadcastTaskRemove = (taskId: string): void => {
    const record = `data: ${JSON.stringify({ type: "task.remove", taskId })}\n\n`;
    for (const stream of projectionStreams) stream.write(record);
  };

  const deleteProjectionContents = (taskId: string): void => {
    const contents = projectionContents.get(taskId);
    if (!contents) return;
    for (const { before, after } of contents.values()) {
      projectionContentBytes -=
        Buffer.byteLength(before, "utf8") + Buffer.byteLength(after, "utf8");
    }
    projectionContents.delete(taskId);
  };

  const deleteProjectionOperations = (taskId: string): void => {
    pendingReplyByTask.delete(taskId);
    for (const [requestId, operation] of pendingRepliesByRequest) {
      if (operation.taskId === taskId) pendingRepliesByRequest.delete(requestId);
    }
    replyTombstones.deleteTask(taskId);
    for (const [operationId, operation] of pendingRejectionOperationsById) {
      if (operation.taskId !== taskId) continue;
      pendingRejectionOperationsById.delete(operationId);
      pendingRejectionOperationsByRequest.delete(operation.requestId);
    }
    for (const [operationId, operation] of committedRejectionOperationsById) {
      if (operation.taskId !== taskId) continue;
      committedRejectionOperationsById.delete(operationId);
      committedRejectionOperationsByRequest.delete(operation.requestId);
    }
  };

  const finalizeReplyOperation = (operation: ProjectionReplyOperation): void => {
    const pending = pendingReplyByTask.get(operation.taskId);
    if (pending === operation) pendingReplyByTask.delete(operation.taskId);
    if (pendingRepliesByRequest.get(operation.requestId) !== operation) return;
    pendingRepliesByRequest.delete(operation.requestId);
    if (projectionSnapshots.has(operation.taskId)) {
      replyTombstones.add({
        requestId: operation.requestId,
        taskId: operation.taskId,
        signature: operation.signature,
      });
    }
  };

  const commitProjectionOperation = (operation: ProjectionRejectionOperation): void => {
    pendingRejectionOperationsById.delete(operation.operationId);
    pendingRejectionOperationsByRequest.delete(operation.requestId);
    committedRejectionOperationsById.set(operation.operationId, operation);
    committedRejectionOperationsByRequest.set(operation.requestId, operation);
    while (committedRejectionOperationsById.size > MAX_PROJECTION_REJECTION_OPERATIONS) {
      const oldest = committedRejectionOperationsById.values().next().value;
      if (!oldest) break;
      committedRejectionOperationsById.delete(oldest.operationId);
      committedRejectionOperationsByRequest.delete(oldest.requestId);
    }
  };

  const storeSnapshot = (snapshot: TaskSnapshot): void => {
    projectionSnapshots.delete(snapshot.taskId);
    projectionSnapshots.set(snapshot.taskId, snapshot);

    let terminalCount = [...projectionSnapshots.values()].filter(
      ({ status }) => status === "completed" || status === "failed",
    ).length;
    for (const [taskId, retained] of projectionSnapshots) {
      if (terminalCount <= retainedTaskLimit) break;
      if (retained.status === "queued" || retained.status === "running") continue;
      projectionSnapshots.delete(taskId);
      deleteProjectionContents(taskId);
      deleteProjectionOperations(taskId);
      broadcastTaskRemove(taskId);
      terminalCount -= 1;
    }
  };

  const broadcastSnapshot = (snapshot: TaskSnapshot): void => {
    storeSnapshot(snapshot);
    const record = `data: ${JSON.stringify(snapshot)}\n\n`;
    for (const stream of projectionStreams) stream.write(record);
  };

  const evictProjectionContents = (taskId: string): void => {
    deleteProjectionContents(taskId);
    const snapshot = projectionSnapshots.get(taskId);
    if (!snapshot?.changes) return;
    updateSnapshot(taskId, { changes: undefined });
  };

  const contentBytes = (contents: Map<string, ProjectionContent> | undefined): number =>
    [...(contents?.values() ?? [])].reduce(
      (total, { before, after }) =>
        total + Buffer.byteLength(before, "utf8") + Buffer.byteLength(after, "utf8"),
      0,
    );

  const storeProjectionContents = (
    taskId: string,
    captures: CapturedChange[],
  ): Array<{ path: string }> => {
    const retained = projectionContents.get(taskId);
    const merged = new Map(retained);
    for (const capture of captures) {
      const previous = retained?.get(capture.path);
      const chained =
        previous !== undefined &&
        previous.after === capture.before &&
        previous.afterExists === capture.beforeExists;
      const content: ProjectionContent = chained
        ? {
            before: previous.before,
            after: capture.after,
            beforeExists: previous.beforeExists,
            afterExists: capture.afterExists,
            ...(previous.beforeMode === undefined ? {} : { beforeMode: previous.beforeMode }),
          }
        : {
            before: capture.before,
            after: capture.after,
            beforeExists: capture.beforeExists,
            afterExists: capture.afterExists,
            ...(capture.beforeMode === undefined ? {} : { beforeMode: capture.beforeMode }),
          };
      if (content.before === content.after && content.beforeExists === content.afterExists) {
        merged.delete(capture.path);
      } else {
        merged.set(capture.path, content);
      }
    }

    const bytes = contentBytes(merged);
    const retainedBytes = contentBytes(retained);
    if (bytes > maxProjectionContentBytes) {
      return [...(retained?.keys() ?? [])].map((path) => ({ path }));
    }
    while (projectionContentBytes - retainedBytes + bytes > maxProjectionContentBytes) {
      const oldestTerminal = [...projectionContents.keys()].find((retainedTaskId) => {
        if (retainedTaskId === taskId) return false;
        const status = projectionSnapshots.get(retainedTaskId)?.status;
        return status === "completed" || status === "failed";
      });
      if (!oldestTerminal) return [...(retained?.keys() ?? [])].map((path) => ({ path }));
      evictProjectionContents(oldestTerminal);
    }

    deleteProjectionContents(taskId);
    if (merged.size > 0) {
      projectionContents.set(taskId, merged);
      projectionContentBytes += bytes;
    }
    return [...merged.keys()].map((path) => ({ path }));
  };

  const flushSnapshot = (taskId: string): void => {
    const timer = projectionBroadcastTimers.get(taskId);
    if (!timer) return;
    clearTimeout(timer);
    projectionBroadcastTimers.delete(taskId);
    const snapshot = projectionSnapshots.get(taskId);
    if (snapshot) broadcastSnapshot(snapshot);
  };

  const scheduleSnapshot = (taskId: string): void => {
    if (projectionBroadcastTimers.has(taskId)) return;
    projectionBroadcastTimers.set(
      taskId,
      setTimeout(
        () => void serializeProjectionMutation(() => flushSnapshot(taskId)),
        PROJECTION_BROADCAST_INTERVAL_MS,
      ),
    );
  };

  const updateSnapshot = (
    taskId: string,
    update: Partial<
      Pick<
        TaskSnapshot,
        | "status"
        | "detail"
        | "markdown"
        | "sessionFile"
        | "error"
        | "changes"
        | "messages"
        | "settled"
      >
    >,
    broadcast = true,
  ): void => {
    const snapshot = projectionSnapshots.get(taskId);
    if (!snapshot) return;
    const next: TaskSnapshot = {
      ...snapshot,
      ...update,
      revision: snapshot.revision + 1,
      updatedAt: Math.max(Date.now(), snapshot.updatedAt + 1),
      ...(update.markdown === undefined
        ? {}
        : { markdown: truncateUtf8(update.markdown, MAX_PROJECTION_MARKDOWN_BYTES) }),
    };
    if (broadcast) {
      flushSnapshot(taskId);
      broadcastSnapshot(next);
    } else {
      storeSnapshot(next);
      scheduleSnapshot(taskId);
    }
  };

  const server = createServer(async (req, res) => {
    if (closing) {
      res.writeHead(503).end();
      return;
    }

    const requestUrl = new URL(req.url ?? "/", `http://${HOST}`);
    const origin = req.headers.origin;
    if (requestUrl.pathname === "/projection-settlements") {
      if (origin !== undefined) {
        res.writeHead(403).end();
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(404).end();
        return;
      }
      let value: Record<string, unknown>;
      try {
        value = await readProjectionRequest(req);
      } catch {
        res.writeHead(400).end();
        return;
      }
      if (
        Object.keys(value).length !== 5 ||
        !isBoundedId(value.generation) ||
        !isBoundedId(value.taskId) ||
        !isBoundedId(value.incarnationId) ||
        !Number.isSafeInteger(value.revision) ||
        (value.revision as number) < 1 ||
        typeof value.settled !== "boolean"
      ) {
        res.writeHead(400).end();
        return;
      }
      const settlement = value as ProjectionSettlement;
      if (settlement.generation !== projectionGeneration) {
        res.writeHead(410).end();
        return;
      }
      const result = await serializeProjectionMutation(() => {
        const snapshot = projectionSnapshots.get(settlement.taskId);
        if (!snapshot) return { status: 404 } as const;
        if (snapshot.incarnationId !== settlement.incarnationId) {
          return { status: 409 } as const;
        }
        if (snapshot.settled === settlement.settled) {
          return { status: 200, snapshot } as const;
        }
        if (snapshot.revision !== settlement.revision) return { status: 409 } as const;
        if (
          settlement.settled &&
          (snapshot.status === "queued" || snapshot.status === "running")
        ) {
          return { status: 409 } as const;
        }
        updateSnapshot(settlement.taskId, { settled: settlement.settled });
        return {
          status: 200,
          snapshot: projectionSnapshots.get(settlement.taskId) as TaskSnapshot,
        } as const;
      });
      if (result.status !== 200) {
        res.writeHead(result.status).end();
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(result.snapshot));
      return;
    }
    if (requestUrl.pathname === "/projection-replies") {
      if (origin !== undefined) {
        res.writeHead(403).end();
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(404).end();
        return;
      }
      let value: Record<string, unknown>;
      try {
        value = await readProjectionRequest(req);
      } catch {
        res.writeHead(400).end();
        return;
      }
      if (
        Object.keys(value).length !== 5 ||
        !isBoundedId(value.generation) ||
        !isBoundedId(value.taskId) ||
        !isBoundedId(value.annotationId) ||
        !isBoundedId(value.requestId) ||
        typeof value.text !== "string" ||
        value.text.trim().length === 0 ||
        Buffer.byteLength(value.text, "utf8") > MAX_REPLY_TEXT_BYTES
      ) {
        res.writeHead(400).end();
        return;
      }
      const reply = value as ProjectionReply;
      if (reply.generation !== projectionGeneration) {
        res.writeHead(410).end();
        return;
      }

      const status = await serializeProjectionMutation(() => {
        const signature = replySignature(reply);
        const pending = pendingRepliesByRequest.get(reply.requestId);
        if (pending) return pending.signature === signature ? 202 : 409;
        const tombstoneStatus = replyTombstones.match(reply.requestId, reply.taskId, signature);
        if (tombstoneStatus !== undefined) return tombstoneStatus;
        const snapshot = projectionSnapshots.get(reply.taskId);
        if (!snapshot || !snapshot.annotations.some(({ id }) => id === reply.annotationId)) {
          return 404;
        }
        if (
          snapshot.status === "queued" ||
          snapshot.status === "running" ||
          pendingReplyByTask.has(reply.taskId)
        ) {
          return 409;
        }
        if (!snapshot.sessionFile) return 404;
        if (queued + active >= MAX_QUEUED_ACTIONS) return 429;

        const sessionFile = snapshot.sessionFile;
        const operation: ProjectionReplyOperation = {
          ...reply,
          signature,
          messageId: randomBytes(16).toString("hex"),
          assistantMessageId: randomBytes(16).toString("hex"),
        };
        pendingRepliesByRequest.set(reply.requestId, operation);
        pendingReplyByTask.set(reply.taskId, operation);
        queued += 1;
        updateSnapshot(reply.taskId, {
          settled: false,
          status: "queued",
          detail: "Reply queued",
          markdown: undefined,
          error: undefined,
          messages: boundProjectionMessages([
            ...(snapshot.messages ?? []),
            {
              id: operation.messageId,
              annotationId: reply.annotationId,
              role: "user",
              body: reply.text,
            },
          ]),
        });

        const job = queue
          .then(async () => {
            if (closing) return;
            await serializeProjectionMutation(() => {
              queued -= 1;
              active += 1;
              updateSnapshot(reply.taskId, { status: "running", detail: "Working" });
            });
            try {
              const result = await resumeChildSession({
                piBin,
                cwd,
                sessionFile,
                name: `agentation reply: ${reply.annotationId.slice(0, 60)}`,
                prompt: replyPrompt(reply),
                onSpawn: (child) => {
                  childProcesses.add(child);
                  child.once("exit", () => childProcesses.delete(child));
                },
                onEvent: (event: PiRpcEvent) => {
                  const toolName = typeof event.toolName === "string" ? event.toolName : "tool";
                  if (event.type === "tool_execution_start") {
                    void serializeProjectionMutation(() =>
                      updateSnapshot(reply.taskId, {
                        status: "running",
                        detail: `Running ${toolName}`,
                      }),
                    );
                  }
                  const assistantEvent = event.assistantMessageEvent as
                    | { type?: unknown; delta?: unknown }
                    | undefined;
                  if (
                    event.type === "message_update" &&
                    assistantEvent?.type === "text_delta" &&
                    typeof assistantEvent.delta === "string"
                  ) {
                    void serializeProjectionMutation(() => {
                      const current = projectionSnapshots.get(reply.taskId);
                      if (!current) return;
                      const markdown = `${current.markdown ?? ""}${assistantEvent.delta}`;
                      const messages = [...(current.messages ?? [])];
                      const messageIndex = messages.findIndex(
                        ({ id }) => id === operation.assistantMessageId,
                      );
                      const assistantMessage: ProjectionMessage = {
                        id: operation.assistantMessageId,
                        annotationId: reply.annotationId,
                        role: "assistant",
                        body: markdown,
                      };
                      if (messageIndex === -1) messages.push(assistantMessage);
                      else messages[messageIndex] = assistantMessage;
                      updateSnapshot(
                        reply.taskId,
                        {
                          status: "running",
                          detail: "Responding",
                          markdown,
                          messages: boundProjectionMessages(messages),
                        },
                        false,
                      );
                    });
                  }
                },
              });
              const markdown = result.response ?? "Completed.";
              await serializeProjectionMutation(() => {
                const current = projectionSnapshots.get(reply.taskId);
                if (!current) return;
                const changes = storeProjectionContents(reply.taskId, result.captures);
                const messages = [...(current.messages ?? [])].filter(
                  ({ id }) => id !== operation.assistantMessageId,
                );
                messages.push({
                  id: operation.assistantMessageId,
                  annotationId: reply.annotationId,
                  role: "assistant",
                  body: markdown,
                });
                updateSnapshot(reply.taskId, {
                  status: "completed",
                  detail: "Completed",
                  markdown,
                  sessionFile: result.sessionFile ?? sessionFile,
                  changes: changes.length === 0 ? undefined : changes,
                  messages: boundProjectionMessages(messages),
                });
                finalizeReplyOperation(operation);
              });
            } catch (error) {
              const message = error instanceof Error ? error.message : String(error);
              await serializeProjectionMutation(() => {
                const current = projectionSnapshots.get(reply.taskId);
                const changes = storeProjectionContents(
                  reply.taskId,
                  error instanceof SessionRunError ? error.captures : [],
                );
                updateSnapshot(reply.taskId, {
                  status: "failed",
                  detail: "Failed",
                  markdown: undefined,
                  error: message,
                  ...(error instanceof SessionRunError && error.sessionFile
                    ? { sessionFile: error.sessionFile }
                    : {}),
                  changes: changes.length === 0 ? undefined : changes,
                  messages: current?.messages?.filter(
                    ({ id }) => id !== operation.assistantMessageId,
                  ),
                });
                finalizeReplyOperation(operation);
              });
              logger.error(`[agentation] reply failed: ${message}`);
            } finally {
              await serializeProjectionMutation(() => {
                active -= 1;
                finalizeReplyOperation(operation);
              });
            }
          })
          .catch(() => undefined);
        queue = job;
        return 202;
      });
      res.writeHead(status).end();
      return;
    }
    if (
      requestUrl.pathname === "/projection-rejections/prepare" ||
      requestUrl.pathname === "/projection-rejections/ack"
    ) {
      if (origin !== undefined) {
        res.writeHead(403).end();
        return;
      }
      if (req.method !== "POST") {
        res.writeHead(404).end();
        return;
      }
      let value: Record<string, unknown>;
      try {
        value = await readProjectionRequest(req);
      } catch {
        res.writeHead(400).end();
        return;
      }

      if (requestUrl.pathname === "/projection-rejections/prepare") {
        if (
          Object.keys(value).length !== 4 ||
          !isBoundedId(value.generation) ||
          !isBoundedId(value.taskId) ||
          !isBoundedId(value.path) ||
          !isBoundedId(value.requestId)
        ) {
          res.writeHead(400).end();
          return;
        }
        const rejection = value as ProjectionRejectionPrepare;
        if (rejection.generation !== projectionGeneration) {
          res.writeHead(410).end();
          return;
        }
        const result = await serializeProjectionMutation(() => {
          const existing =
            pendingRejectionOperationsByRequest.get(rejection.requestId) ??
            committedRejectionOperationsByRequest.get(rejection.requestId);
          if (existing) {
            if (
              existing.generation !== rejection.generation ||
              existing.taskId !== rejection.taskId ||
              existing.path !== rejection.path
            ) {
              return { status: 409 } as const;
            }
            return { status: 200, operation: existing } as const;
          }
          const content = projectionContents.get(rejection.taskId)?.get(rejection.path);
          if (!content) return { status: 404 } as const;
          if (pendingRejectionOperationsById.size >= MAX_PROJECTION_REJECTION_OPERATIONS) {
            return { status: 429 } as const;
          }
          const operation: ProjectionRejectionOperation = {
            ...rejection,
            operationId: randomBytes(16).toString("hex"),
            fingerprint: projectionContentFingerprint(rejection.taskId, rejection.path, content),
            beforeExists: content.beforeExists,
            afterExists: content.afterExists,
          };
          pendingRejectionOperationsById.set(operation.operationId, operation);
          pendingRejectionOperationsByRequest.set(operation.requestId, operation);
          return { status: 200, operation } as const;
        });
        if (result.status !== 200) {
          res.writeHead(result.status).end();
          return;
        }
        const { operationId, beforeExists, afterExists } = result.operation;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ operationId, beforeExists, afterExists }));
        return;
      }

      if (
        Object.keys(value).length !== 2 ||
        !isBoundedId(value.generation) ||
        !isBoundedId(value.operationId)
      ) {
        res.writeHead(400).end();
        return;
      }
      const rejection = value as ProjectionRejectionAck;
      if (rejection.generation !== projectionGeneration) {
        res.writeHead(410).end();
        return;
      }
      const status = await serializeProjectionMutation(() => {
        if (committedRejectionOperationsById.has(rejection.operationId)) return 200;
        const operation = pendingRejectionOperationsById.get(rejection.operationId);
        if (!operation) return 404;

        const contents = projectionContents.get(operation.taskId);
        const content = contents?.get(operation.path);
        if (
          !contents ||
          !content ||
          projectionContentFingerprint(operation.taskId, operation.path, content) !==
            operation.fingerprint
        ) {
          pendingRejectionOperationsById.delete(operation.operationId);
          pendingRejectionOperationsByRequest.delete(operation.requestId);
          return 409;
        }

        contents.delete(operation.path);
        projectionContentBytes -=
          Buffer.byteLength(content.before, "utf8") + Buffer.byteLength(content.after, "utf8");
        if (contents.size === 0) projectionContents.delete(operation.taskId);
        const snapshot = projectionSnapshots.get(operation.taskId);
        if (snapshot) {
          const changes = [...contents.keys()].map((path) => ({ path }));
          updateSnapshot(operation.taskId, {
            changes: changes.length === 0 ? undefined : changes,
          });
        }
        commitProjectionOperation(operation);
        return 200;
      });
      res.writeHead(status, status === 200 ? { "Content-Type": "application/json" } : undefined);
      res.end(status === 200 ? JSON.stringify({ acknowledged: true }) : undefined);
      return;
    }
    if (requestUrl.pathname === "/projection-content") {
      if (origin !== undefined) {
        res.writeHead(403).end();
        return;
      }
      if (req.method !== "GET") {
        res.writeHead(404).end();
        return;
      }
      const generation = requestUrl.searchParams.get("generation");
      if (generation !== projectionGeneration) {
        res.writeHead(410).end();
        return;
      }
      const taskId = requestUrl.searchParams.get("taskId");
      const requestedPath = requestUrl.searchParams.get("path");
      const side = requestUrl.searchParams.get("side");
      if (!taskId || !requestedPath || (side !== "before" && side !== "after")) {
        res.writeHead(400).end();
        return;
      }
      const content = projectionContents.get(taskId)?.get(requestedPath);
      const text = content?.[side];
      if (text === undefined) {
        res.writeHead(404).end();
        return;
      }
      res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
      res.end(text);
      return;
    }
    if (requestUrl.pathname === "/projection-events") {
      // This loopback endpoint trusts local non-browser clients; Origin-bearing browser access stays denied.
      if (origin !== undefined) {
        res.writeHead(403).end();
        return;
      }
      if (req.method !== "GET") {
        res.writeHead(404).end();
        return;
      }
      if (projectionStreams.size >= MAX_PROJECTION_STREAMS) {
        res.writeHead(429).end();
        return;
      }
      res.writeHead(200, {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      });
      res.write(": connected\n\n");
      projectionStreams.add(res);
      res.write(
        `data: ${JSON.stringify({ type: "projection.reset", generation: projectionGeneration })}\n\n`,
      );
      for (const snapshot of projectionSnapshots.values()) {
        res.write(`data: ${JSON.stringify(snapshot)}\n\n`);
      }
      const heartbeat = setInterval(() => res.write(": ping\n\n"), 30_000);
      req.on("close", () => {
        clearInterval(heartbeat);
        projectionStreams.delete(res);
      });
      return;
    }
    if (!isAllowedOrigin(origin)) {
      res.writeHead(403).end();
      return;
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.setHeader("Vary", "Origin");
    const clientId = requestUrl.searchParams.get("clientId");

    if (req.method === "OPTIONS") {
      res.writeHead(204).end();
      return;
    }
    if (req.method === "GET" && requestUrl.pathname === "/events") {
      if (!clientId) {
        res.writeHead(400).end();
        return;
      }
      res.writeHead(200, {
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "Content-Type": "text/event-stream",
      });
      res.write(": connected\n\n");
      eventStreams.set(res, clientId);
      for (const event of eventHistory.get(clientId) ?? []) {
        res.write(`data: ${JSON.stringify(event)}\n\n`);
      }
      const heartbeat = setInterval(() => res.write(": ping\n\n"), 30_000);
      req.on("close", () => {
        clearInterval(heartbeat);
        eventStreams.delete(res);
      });
      return;
    }
    if (req.method !== "POST" || requestUrl.pathname !== "/agentation") {
      res.writeHead(404).end();
      return;
    }
    if (!clientId) {
      res.writeHead(400).end();
      return;
    }

    let reserved = false;
    try {
      if (queued + active >= MAX_QUEUED_ACTIONS) {
        res.writeHead(429).end();
        return;
      }
      queued += 1;
      reserved = true;
      const submission = await readSubmission(req);
      if (closing) {
        queued -= 1;
        reserved = false;
        res.writeHead(503).end();
        return;
      }

      const key = actionKey(submission);
      const annotationIds = submittedAnnotationIds(submission);
      if (recentActions.has(key)) {
        queued -= 1;
        reserved = false;
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ completed: true, duplicate: true }));
        return;
      }
      recentActions.add(key);
      broadcast(clientId, { type: "batch.queued", batchId: key, annotationIds });
      await serializeProjectionMutation(() =>
        broadcastSnapshot({
          type: "task.snapshot",
          taskId: key,
          incarnationId: randomBytes(16).toString("hex"),
          revision: 1,
          settled: false,
          updatedAt: Date.now(),
          cwd,
          ...(submission.url === undefined ? {} : { url: submission.url }),
          annotations: submission.annotations.map(
            ({ id, comment, sourceFile, element, elementPath, selectedText, reactComponents }) => ({
              id,
              comment,
              ...(sourceFile === undefined ? {} : { sourceFile }),
              ...(element === undefined ? {} : { element }),
              ...(elementPath === undefined ? {} : { elementPath }),
              ...(selectedText === undefined ? {} : { selectedText }),
              ...(reactComponents === undefined ? {} : { reactComponents }),
            }),
          ),
          status: "queued",
          detail: "Queued",
        }),
      );
      while (recentActions.size > recentActionLimit) {
        const oldestAction = recentActions.values().next().value;
        if (!oldestAction) break;
        recentActions.delete(oldestAction);
      }

      let succeeded = false;
      const job = queue
        .then(async () => {
          if (closing) return;
          queued -= 1;
          active += 1;
          try {
            logger.info(
              `[agentation] running ${submission.annotations.length} annotation(s) in a child session`,
            );
            broadcast(clientId, { type: "child.started", batchId: key, annotationIds });
            await serializeProjectionMutation(() =>
              updateSnapshot(key, { status: "running", detail: "Working" }),
            );
            const result = await runChildSession({
              piBin,
              cwd,
              parentSession,
              name: childName(submission),
              prompt: childPrompt(submission),
              onSpawn: (child) => {
                childProcesses.add(child);
                child.once("exit", () => childProcesses.delete(child));
              },
              onEvent: (event: PiRpcEvent) => {
                const toolName = typeof event.toolName === "string" ? event.toolName : "tool";
                if (event.type === "tool_execution_start") {
                  logger.info(`[agentation] ${toolName}`);
                  broadcast(clientId, {
                    type: "tool.started",
                    batchId: key,
                    annotationIds,
                    toolName,
                  });
                  void serializeProjectionMutation(() =>
                    updateSnapshot(key, { status: "running", detail: `Running ${toolName}` }),
                  );
                }
                const assistantEvent = event.assistantMessageEvent as
                  | { type?: unknown; delta?: unknown }
                  | undefined;
                if (
                  event.type === "message_update" &&
                  assistantEvent?.type === "text_delta" &&
                  typeof assistantEvent.delta === "string"
                ) {
                  broadcast(clientId, {
                    type: "assistant.delta",
                    batchId: key,
                    annotationIds,
                    delta: assistantEvent.delta,
                  });
                  void serializeProjectionMutation(() => {
                    const snapshot = projectionSnapshots.get(key);
                    updateSnapshot(
                      key,
                      {
                        status: "running",
                        detail: "Responding",
                        markdown: `${snapshot?.markdown ?? ""}${assistantEvent.delta}`,
                      },
                      false,
                    );
                  });
                }
              },
            });
            succeeded = true;
            const markdown = result.response ?? "Completed.";
            broadcast(clientId, {
              type: "child.completed",
              batchId: key,
              annotationIds,
              markdown,
            });
            await serializeProjectionMutation(() => {
              const changes = storeProjectionContents(key, result.captures);
              const snapshot = projectionSnapshots.get(key);
              updateSnapshot(key, {
                status: "completed",
                detail: "Completed",
                markdown,
                ...(changes.length === 0 ? {} : { changes }),
                ...(result.sessionFile === undefined ? {} : { sessionFile: result.sessionFile }),
                messages: boundProjectionMessages([
                  ...(snapshot?.messages ?? []),
                  {
                    id: randomBytes(16).toString("hex"),
                    role: "assistant",
                    body: markdown,
                  },
                ]),
              });
            });
            logger.info(
              `[agentation] completed${result.sessionFile ? ` ${basename(result.sessionFile)}` : ""}`,
            );
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            broadcast(clientId, { type: "child.failed", batchId: key, annotationIds, message });
            await serializeProjectionMutation(() => {
              const changes = storeProjectionContents(
                key,
                error instanceof SessionRunError ? error.captures : [],
              );
              updateSnapshot(key, {
                status: "failed",
                detail: "Failed",
                error: message,
                ...(error instanceof SessionRunError && error.sessionFile
                  ? { sessionFile: error.sessionFile }
                  : {}),
                changes: changes.length === 0 ? undefined : changes,
              });
            });
            logger.error(`[agentation] child failed: ${message}`);
          } finally {
            active -= 1;
          }
        })
        .catch(() => undefined);
      queue = job;
      reserved = false;
      await job;

      if (!res.writableEnded && !closing) {
        res.writeHead(succeeded ? 200 : 500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ completed: succeeded }));
      }
    } catch (error) {
      if (reserved) queued -= 1;
      if (!res.writableEnded) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: error instanceof Error ? error.message : "invalid request" }));
      }
    }
  });
  server.requestTimeout = 5_000;
  server.headersTimeout = 5_000;

  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, HOST, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return {
    parentSession,
    url: `http://${HOST}:${port}/agentation`,
    async close() {
      if (closing) return;
      closing = true;
      const serverClosed = new Promise<void>((resolve) => server.close(() => resolve()));
      for (const stream of eventStreams.keys()) stream.end();
      for (const stream of projectionStreams) stream.end();
      eventStreams.clear();
      eventHistory.clear();
      projectionStreams.clear();
      projectionSnapshots.clear();
      projectionContents.clear();
      pendingRejectionOperationsById.clear();
      pendingRejectionOperationsByRequest.clear();
      committedRejectionOperationsById.clear();
      committedRejectionOperationsByRequest.clear();
      pendingRepliesByRequest.clear();
      pendingReplyByTask.clear();
      replyTombstones.clear();
      for (const timer of projectionBroadcastTimers.values()) clearTimeout(timer);
      projectionBroadcastTimers.clear();
      server.closeAllConnections();
      await Promise.all([serverClosed, ...[...childProcesses].map(stopProcess)]);
      childProcesses.clear();
    },
  };
}

function truncateUtf8(value: string, maxBytes: number): string {
  const bytes = Buffer.from(value, "utf8");
  if (bytes.length <= maxBytes) return value;
  return bytes.subarray(0, maxBytes).toString("utf8");
}

export {
  actionKey,
  boundProjectionMessages,
  childName,
  childPrompt,
  isAllowedOrigin,
  readSubmission,
  ReplyTombstoneStore,
  replySignature,
};
