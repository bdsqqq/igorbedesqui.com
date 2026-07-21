import { type ChildProcess } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { basename } from "node:path";
import { StringDecoder } from "node:string_decoder";
import { createParentSession, runChildSession, type PiRpcEvent } from "./protocol.js";

const HOST = "127.0.0.1";
const DEFAULT_PORT = 4748;
const MAX_REQUEST_BYTES = 1_000_000;
const MAX_QUEUED_ACTIONS = 5;
const RECENT_ACTION_LIMIT = 100;
const RETAINED_TASK_LIMIT = 100;
const MAX_PROJECTION_STREAMS = 4;
const MAX_PROJECTION_MARKDOWN_BYTES = 50 * 1024;
const PROJECTION_BROADCAST_INTERVAL_MS = 100;

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
type TaskSnapshot = {
  type: "task.snapshot";
  taskId: string;
  cwd: string;
  url?: string;
  annotations: ProjectionAnnotation[];
  status: "queued" | "running" | "completed" | "failed";
  detail: string;
  markdown?: string;
  sessionFile?: string;
  error?: string;
};
type Logger = Pick<Console, "info" | "error">;
type AgentationServerOptions = {
  cwd: string;
  piBin?: string;
  port?: number;
  logger?: Logger;
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
}: AgentationServerOptions): Promise<AgentationServer> {
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
  const projectionBroadcastTimers = new Map<string, NodeJS.Timeout>();
  const recentActions = new Set<string>();
  let closing = false;
  let queued = 0;
  let active = 0;
  let queue: Promise<void> = Promise.resolve();

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

  const storeSnapshot = (snapshot: TaskSnapshot): void => {
    projectionSnapshots.delete(snapshot.taskId);
    projectionSnapshots.set(snapshot.taskId, snapshot);

    let terminalCount = [...projectionSnapshots.values()].filter(
      ({ status }) => status === "completed" || status === "failed",
    ).length;
    for (const [taskId, retained] of projectionSnapshots) {
      if (terminalCount <= RETAINED_TASK_LIMIT) break;
      if (retained.status === "queued" || retained.status === "running") continue;
      projectionSnapshots.delete(taskId);
      terminalCount -= 1;
    }
  };

  const broadcastSnapshot = (snapshot: TaskSnapshot): void => {
    storeSnapshot(snapshot);
    const record = `data: ${JSON.stringify(snapshot)}\n\n`;
    for (const stream of projectionStreams) stream.write(record);
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
      setTimeout(() => flushSnapshot(taskId), PROJECTION_BROADCAST_INTERVAL_MS),
    );
  };

  const updateSnapshot = (
    taskId: string,
    update: Partial<Pick<TaskSnapshot, "status" | "detail" | "markdown" | "sessionFile" | "error">>,
    broadcast = true,
  ): void => {
    const snapshot = projectionSnapshots.get(taskId);
    if (!snapshot) return;
    const next = {
      ...snapshot,
      ...update,
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
      broadcastSnapshot({
        type: "task.snapshot",
        taskId: key,
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
      });
      if (recentActions.size > RECENT_ACTION_LIMIT) {
        const oldestAction = recentActions.values().next().value;
        if (oldestAction) recentActions.delete(oldestAction);
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
            updateSnapshot(key, { status: "running", detail: "Working" });
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
                  updateSnapshot(key, { status: "running", detail: `Running ${toolName}` });
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
            updateSnapshot(key, {
              status: "completed",
              detail: "Completed",
              markdown,
              ...(result.sessionFile === undefined ? {} : { sessionFile: result.sessionFile }),
            });
            logger.info(
              `[agentation] completed${result.sessionFile ? ` ${basename(result.sessionFile)}` : ""}`,
            );
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            broadcast(clientId, { type: "child.failed", batchId: key, annotationIds, message });
            updateSnapshot(key, { status: "failed", detail: "Failed", error: message });
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

export { actionKey, childName, childPrompt, isAllowedOrigin, readSubmission };
