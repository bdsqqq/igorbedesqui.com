import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { StringDecoder } from "node:string_decoder";

const RPC_TIMEOUT_MS = 30_000;
const AGENT_TIMEOUT_MS = 30 * 60_000;

type RpcRecord = {
  id?: string;
  type?: string;
  success?: boolean;
  error?: string;
  data?: unknown;
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

export type ChildSessionResult = {
  sessionFile?: string;
  response?: string | null;
};

class RpcClient {
  readonly process: ChildProcessWithoutNullStreams;
  private readonly decoder = new StringDecoder("utf8");
  private readonly pending = new Map<string, PendingRequest>();
  private readonly eventWaiters = new Map<string, Set<EventWaiter>>();
  private buffer = "";
  private stderr = "";
  private requestSequence = 0;
  private exited = false;

  constructor(command: string, cwd: string, env: NodeJS.ProcessEnv) {
    this.process = spawn(command, ["--mode", "rpc"], {
      cwd,
      env,
      stdio: ["pipe", "pipe", "pipe"],
    });

    this.process.stdin.on("error", (error) => this.failAll(error));
    this.process.stdout.on("data", (chunk: Buffer) => this.consume(chunk));
    this.process.stderr.on("data", (chunk: Buffer) => {
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

  request(command: Record<string, unknown>): Promise<RpcRecord> {
    if (this.exited || !this.process.stdin.writable) {
      return Promise.reject(new Error("pi rpc is not writable"));
    }

    const id = `agentation-${++this.requestSequence}`;
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`pi rpc request timed out: ${String(command.type)}`));
      }, RPC_TIMEOUT_MS);
      this.pending.set(id, { resolve, reject, timeout });
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
    return new Promise((resolve, reject) => {
      const waiter = {
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
      } satisfies EventWaiter;
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

  private consume(chunk: Buffer): void {
    this.buffer += this.decoder.write(chunk);
    this.drainLines();
  }

  private consumeEnd(): void {
    this.buffer += this.decoder.end();
    if (this.buffer) this.handleLine(this.buffer.endsWith("\r") ? this.buffer.slice(0, -1) : this.buffer);
    this.buffer = "";
  }

  private drainLines(): void {
    while (true) {
      const newline = this.buffer.indexOf("\n");
      if (newline === -1) return;
      let line = this.buffer.slice(0, newline);
      this.buffer = this.buffer.slice(newline + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (line) this.handleLine(line);
    }
  }

  private handleLine(line: string): void {
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
      for (const waiter of [...(this.eventWaiters.get(record.type) ?? [])]) waiter.resolve(record);
    }
  }

  private failAll(error: Error): void {
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

export async function runChildSession(options: {
  piBin: string;
  cwd: string;
  parentSession: string;
  name: string;
  prompt: string;
  onSpawn?: (process: ChildProcessWithoutNullStreams) => void;
}): Promise<ChildSessionResult> {
  const client = new RpcClient(options.piBin, options.cwd, {
    ...process.env,
    AGENTATION_CHILD: "1",
  });
  options.onSpawn?.(client.process);

  try {
    const newSession = await client.request({
      type: "new_session",
      parentSession: options.parentSession,
    });
    if ((newSession.data as { cancelled?: boolean } | undefined)?.cancelled) {
      throw new Error("pi rpc child session creation was cancelled");
    }
    await client.request({ type: "set_session_name", name: options.name });
    const state = await client.request({ type: "get_state" });
    const settled = client.waitForEvent("agent_settled");
    try {
      await client.request({ type: "prompt", message: options.prompt });
      await settled;
    } catch (error) {
      void settled.catch(() => undefined);
      throw error;
    }
    const messages = await client.request({ type: "get_messages" });
    const response = await client.request({ type: "get_last_assistant_text" });
    const lastAssistant = (
      (messages.data as { messages?: Array<{ role?: string; stopReason?: string }> } | undefined)
        ?.messages ?? []
    )
      .toReversed()
      .find(({ role }) => role === "assistant");
    if (lastAssistant?.stopReason === "error" || lastAssistant?.stopReason === "aborted") {
      throw new Error(`pi child ended with ${lastAssistant.stopReason}`);
    }

    return {
      sessionFile: (state.data as { sessionFile?: string } | undefined)?.sessionFile,
      response: (response.data as { text?: string | null } | undefined)?.text,
    };
  } finally {
    await client.close();
  }
}
