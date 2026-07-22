import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { randomBytes } from "node:crypto";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, isAbsolute, join, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { StringDecoder } from "node:string_decoder";

const RPC_TIMEOUT_MS = 30_000;
const AGENT_TIMEOUT_MS = 30 * 60_000;
const MAX_CAPTURE_FILES = 50;
const MAX_CAPTURE_BYTES = 32 * 1024 * 1024;

type RpcCommand = { type: string; [key: string]: unknown };
type RpcRecord = {
  type?: string;
  id?: string;
  success?: boolean;
  error?: string;
  data?: unknown;
  [key: string]: unknown;
};
type PendingRequest = {
  resolve: (record: RpcRecord) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
};
type EventWaiter = {
  resolve: (record: RpcRecord) => void;
  reject: (error: Error) => void;
  timeout: NodeJS.Timeout;
};
type StateData = { sessionFile?: string; sessionId?: string };
type SessionData = { cancelled?: boolean };
type MessagesData = { messages?: Array<{ role?: string; stopReason?: string }> };
type TextData = { text?: string };

export type PiRpcEvent = RpcRecord;
export type CapturedChange = {
  path: string;
  before: string;
  after: string;
  beforeExists: boolean;
  afterExists: boolean;
  beforeMode?: number;
};

export class SessionRunError extends Error {
  readonly captures: CapturedChange[];
  readonly sessionFile?: string;

  constructor(
    message: string,
    captures: CapturedChange[],
    sessionFile?: string,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = "SessionRunError";
    this.captures = captures;
    this.sessionFile = sessionFile;
  }
}

type ParentSessionOptions = {
  piBin: string;
  cwd: string;
  name: string;
};

type SessionRunOptions = ParentSessionOptions & {
  prompt: string;
  onSpawn?: (child: ChildProcessWithoutNullStreams) => void;
  onEvent?: (event: PiRpcEvent) => void;
};
type ChildSessionOptions = SessionRunOptions & { parentSession: string };
type ResumedSessionOptions = SessionRunOptions & { sessionFile: string };

class RpcClient {
  private readonly decoder = new StringDecoder("utf8");
  private readonly pending = new Map<string, PendingRequest>();
  private readonly eventWaiters = new Map<string, Set<EventWaiter>>();
  private readonly onEvent?: (record: RpcRecord) => void;
  readonly process: ChildProcessWithoutNullStreams;
  private buffer = "";
  private stderr = "";
  private requestSequence = 0;
  private exited = false;

  constructor(
    command: string,
    cwd: string,
    env: NodeJS.ProcessEnv,
    onEvent?: (record: RpcRecord) => void,
    extraArgs: string[] = [],
  ) {
    this.onEvent = onEvent;
    this.process = spawn(
      command,
      ["--mode", "rpc", ...extraArgs],
      {
        cwd,
        env,
        stdio: ["pipe", "pipe", "pipe"],
      },
    );

    this.process.stdin.on("error", (error) => this.failAll(error));
    this.process.stdout.on("data", (chunk) => this.consume(chunk));
    this.process.stderr.on("data", (chunk) => {
      this.stderr = `${this.stderr}${chunk.toString("utf8")}`.slice(-16_384);
    });
    this.process.on("error", (error) => this.failAll(error));
    this.process.on("exit", (code, signal) => {
      this.exited = true;
      this.consumeEnd();
      this.failAll(
        new Error(
          `pi rpc exited before completion (${signal ?? `code ${code ?? "unknown"}`})${this.stderr ? `\n${this.stderr}` : ""}`,
        ),
      );
    });
  }

  request<T = unknown>(command: RpcCommand): Promise<RpcRecord & { data?: T }> {
    if (this.exited || !this.process.stdin.writable) {
      return Promise.reject(new Error("pi rpc is not writable"));
    }

    const id = `agentation-${++this.requestSequence}`;
    return new Promise<RpcRecord & { data?: T }>((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`pi rpc request timed out: ${String(command.type)}`));
      }, RPC_TIMEOUT_MS);
      this.pending.set(id, {
        resolve: (record) => resolve(record as RpcRecord & { data?: T }),
        reject,
        timeout,
      });
      try {
        this.process.stdin.write(`${JSON.stringify({ ...command, id })}\n`, (error) => {
          if (error) this.failAll(error);
        });
      } catch (error) {
        this.failAll(error instanceof Error ? error : new Error(String(error)));
      }
    });
  }

  waitForEvent(type: string, timeoutMs = AGENT_TIMEOUT_MS): Promise<RpcRecord> {
    return new Promise<RpcRecord>((resolve, reject) => {
      const waiter: EventWaiter = {
        resolve: (record: RpcRecord) => {
          clearTimeout(waiter.timeout);
          this.eventWaiters.get(type)?.delete(waiter);
          resolve(record);
        },
        reject,
        timeout: setTimeout(() => {
          this.eventWaiters.get(type)?.delete(waiter);
          reject(new Error(`pi rpc event timed out: ${type}`));
        }, timeoutMs),
      };
      const waiters = this.eventWaiters.get(type) ?? new Set();
      waiters.add(waiter);
      this.eventWaiters.set(type, waiters);
    });
  }

  async close(): Promise<void> {
    if (this.exited) return;
    this.process.stdin.end();
    await Promise.race([
      new Promise<void>((resolve) => this.process.once("exit", () => resolve())),
      new Promise<void>((resolve) =>
        setTimeout(() => {
          if (!this.exited) this.process.kill("SIGTERM");
          resolve();
        }, 2_000),
      ),
    ]);
  }

  terminate(): void {
    if (!this.exited) this.process.kill("SIGTERM");
  }

  consume(chunk: Buffer): void {
    this.buffer += this.decoder.write(chunk);
    this.drainLines();
  }

  consumeEnd(): void {
    this.buffer += this.decoder.end();
    if (this.buffer) {
      this.handleLine(this.buffer.endsWith("\r") ? this.buffer.slice(0, -1) : this.buffer);
    }
    this.buffer = "";
  }

  drainLines(): void {
    while (true) {
      const newline = this.buffer.indexOf("\n");
      if (newline === -1) return;
      let line = this.buffer.slice(0, newline);
      this.buffer = this.buffer.slice(newline + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line) this.handleLine(line);
    }
  }

  handleLine(line: string): void {
    let record: RpcRecord;
    try {
      record = JSON.parse(line) as RpcRecord;
    } catch {
      this.failAll(new Error(`invalid pi rpc record: ${line.slice(0, 500)}`));
      this.terminate();
      return;
    }

    if (record.type === "response" && record.id) {
      const pending = this.pending.get(record.id);
      if (!pending) return;
      clearTimeout(pending.timeout);
      this.pending.delete(record.id);
      if (record.success === false) {
        pending.reject(new Error(record.error ?? "pi rpc request failed"));
      } else {
        pending.resolve(record);
      }
      return;
    }

    if (record.type) {
      try {
        this.onEvent?.(record);
      } catch {
        // Observability must not break the RPC transport.
      }
      for (const waiter of [...(this.eventWaiters.get(record.type) ?? [])]) {
        waiter.resolve(record);
      }
    }
  }

  failAll(error: Error): void {
    for (const pending of this.pending.values()) {
      clearTimeout(pending.timeout);
      pending.reject(error);
    }
    this.pending.clear();
    for (const waiters of this.eventWaiters.values()) {
      for (const waiter of waiters) {
        clearTimeout(waiter.timeout);
        waiter.reject(error);
      }
    }
    this.eventWaiters.clear();
  }
}

function entryId() {
  return randomBytes(4).toString("hex");
}

async function readCaptureManifest(path: string): Promise<CapturedChange[]> {
  const value = JSON.parse(await readFile(path, "utf8")) as { files?: unknown };
  if (!Array.isArray(value.files) || value.files.length > MAX_CAPTURE_FILES) {
    throw new Error("invalid capture manifest");
  }

  let bytes = 0;
  const paths = new Set<string>();
  return value.files.map((file) => {
    if (!file || typeof file !== "object") throw new Error("invalid capture manifest");
    const { path, before, after, beforeExists, afterExists, beforeMode } = file as Record<
      string,
      unknown
    >;
    if (
      typeof path !== "string" ||
      !path ||
      path.includes("\0") ||
      path === ".." ||
      path.startsWith(`..${sep}`) ||
      isAbsolute(path) ||
      paths.has(path) ||
      typeof before !== "string" ||
      typeof after !== "string" ||
      typeof beforeExists !== "boolean" ||
      typeof afterExists !== "boolean" ||
      (!beforeExists && before !== "") ||
      (!afterExists && after !== "") ||
      (beforeMode !== undefined &&
        (!Number.isInteger(beforeMode) || (beforeMode as number) < 0 || (beforeMode as number) > 0o7777))
    ) {
      throw new Error("invalid capture manifest");
    }
    paths.add(path);
    bytes += Buffer.byteLength(before, "utf8") + Buffer.byteLength(after, "utf8");
    if (bytes > MAX_CAPTURE_BYTES) throw new Error("capture manifest exceeds 32 MiB");
    return {
      path,
      before,
      after,
      beforeExists,
      afterExists,
      ...(beforeMode === undefined ? {} : { beforeMode: beforeMode as number }),
    };
  });
}

export async function createParentSession({
  piBin,
  cwd,
  name,
}: ParentSessionOptions): Promise<string> {
  const client = new RpcClient(piBin, cwd, {
    ...process.env,
    AGENTATION_CHILD: "1",
  });

  try {
    const state = await client.request<StateData>({ type: "get_state" });
    const { sessionFile, sessionId } = state.data ?? {};
    if (!sessionFile || !sessionId) throw new Error("pi did not provide a parent session path");
    await client.close();

    const timestamp = new Date().toISOString();
    const nameEntryId = entryId();
    const contents = [
      {
        type: "session",
        version: 3,
        id: sessionId,
        timestamp,
        cwd,
      },
      {
        type: "session_info",
        id: nameEntryId,
        parentId: null,
        timestamp,
        name,
      },
      {
        type: "custom",
        customType: "agentation-parent",
        id: entryId(),
        parentId: nameEntryId,
        timestamp,
        data: { startedAt: timestamp },
      },
    ];
    await mkdir(dirname(sessionFile), { recursive: true });
    await writeFile(sessionFile, `${contents.map((entry) => JSON.stringify(entry)).join("\n")}\n`, {
      flag: "wx",
      mode: 0o600,
    });
    return sessionFile;
  } finally {
    await client.close();
  }
}

type SessionResult = {
  sessionFile?: string;
  response?: string;
  captures: CapturedChange[];
};

export function runChildSession(options: ChildSessionOptions): Promise<SessionResult> {
  return runSession(options, { type: "new_session", parentSession: options.parentSession });
}

export function resumeChildSession(options: ResumedSessionOptions): Promise<SessionResult> {
  return runSession(options, { type: "switch_session", sessionPath: options.sessionFile });
}

async function runSession(
  { piBin, cwd, name, prompt, onSpawn, onEvent }: SessionRunOptions,
  sessionCommand: RpcCommand,
): Promise<SessionResult> {
  const captureDirectory = await mkdtemp(join(tmpdir(), "agentation-capture-"));
  const captureManifest = join(captureDirectory, "manifest.json");
  const captureExtension = fileURLToPath(new URL("./capture-extension.ts", import.meta.url));
  let client: RpcClient | undefined;
  let sessionFile: string | undefined;
  try {
    await writeFile(captureManifest, JSON.stringify({ files: [] }), { mode: 0o600 });
    client = new RpcClient(
      piBin,
      cwd,
      {
        ...process.env,
        AGENTATION_CHILD: "1",
        AGENTATION_CAPTURE_MANIFEST: captureManifest,
      },
      onEvent,
      [
        "--tools",
        "read,grep,find,ls,edit,write",
        "--no-extensions",
        "--extension",
        captureExtension,
      ],
    );
    onSpawn?.(client.process);

    const selectedSession = await client.request<SessionData>(sessionCommand);
    if (selectedSession.data?.cancelled) throw new Error("pi rpc session selection was cancelled");
    if (sessionCommand.type === "new_session") {
      await client.request({ type: "set_session_name", name });
    }
    const state = await client.request<StateData>({ type: "get_state" });
    sessionFile = state.data?.sessionFile;
    const settled = client.waitForEvent("agent_settled");
    try {
      await client.request({ type: "prompt", message: prompt });
      await settled;
    } catch (error) {
      void settled.catch(() => undefined);
      throw error;
    }

    const captures = await readCaptureManifest(captureManifest);
    const messages = await client.request<MessagesData>({ type: "get_messages" });
    const response = await client.request<TextData>({ type: "get_last_assistant_text" });
    const lastAssistant = (messages.data?.messages ?? [])
      .toReversed()
      .find(({ role }) => role === "assistant");
    if (lastAssistant?.stopReason === "error" || lastAssistant?.stopReason === "aborted") {
      throw new Error(`pi child ended with ${lastAssistant.stopReason}`);
    }

    return {
      sessionFile,
      response: response.data?.text,
      captures,
    };
  } catch (error) {
    let captures: CapturedChange[] = [];
    try {
      captures = await readCaptureManifest(captureManifest);
    } catch {
      // The original run failure remains authoritative when capture recovery is unavailable.
    }
    const message = error instanceof Error ? error.message : String(error);
    throw new SessionRunError(message, captures, sessionFile, { cause: error });
  } finally {
    await client?.close();
    await rm(captureDirectory, { recursive: true, force: true });
  }
}
