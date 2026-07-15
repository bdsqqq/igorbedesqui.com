import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import agentationExtension, { isAllowedOrigin } from "./index.js";
import { runChildSession } from "./protocol.js";

const delay = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForLog(path: string, expected: string): Promise<string> {
  const deadline = Date.now() + 10_000;
  while (Date.now() < deadline) {
    const content = await readFile(path, "utf8").catch(() => "");
    if (content.includes(expected)) return content;
    await delay(50);
  }
  throw new Error(`timed out waiting for ${expected}`);
}

async function createFakePi(directory: string): Promise<string> {
  const fakePi = join(directory, "fake-pi.mjs");
  await writeFile(
    fakePi,
    `#!/usr/bin/env node
import { appendFileSync } from "node:fs";
let buffer = "";
process.stdin.on("data", chunk => {
  buffer += chunk.toString("utf8");
  while (buffer.includes("\\n")) {
    const newline = buffer.indexOf("\\n");
    const line = buffer.slice(0, newline);
    buffer = buffer.slice(newline + 1);
    if (!line) continue;
    const command = JSON.parse(line);
    appendFileSync(process.env.TEST_RPC_LOG, JSON.stringify(command) + "\\n");
    let data;
    if (command.type === "new_session") data = { cancelled: process.env.TEST_RPC_MODE === "cancel" };
    if (command.type === "get_state") data = { sessionFile: "/tmp/agentation-child.jsonl" };
    if (command.type === "get_messages") data = { messages: [{ role: "assistant", stopReason: "stop" }] };
    if (command.type === "get_last_assistant_text") data = { text: "done" };
    const rejected = command.type === "prompt" && process.env.TEST_RPC_MODE === "reject";
    process.stdout.write(JSON.stringify({ id: command.id, type: "response", command: command.type, success: !rejected, error: rejected ? "prompt rejected" : undefined, data }) + "\\n");
    if (command.type === "prompt" && !rejected) {
      if (process.env.TEST_RPC_MODE === "exit") process.exit(2);
      process.stdout.write(JSON.stringify({ type: "agent_settled" }) + "\\n");
    }
  }
});
`,
  );
  await chmod(fakePi, 0o755);
  return fakePi;
}

test("only local development origins can submit prompts", () => {
  assert.equal(isAllowedOrigin("http://localhost:3000"), true);
  assert.equal(isAllowedOrigin("https://127.0.0.1:5173"), true);
  assert.equal(isAllowedOrigin("https://example.com"), false);
  assert.equal(isAllowedOrigin(undefined), false);
});

test("send submission creates a child linked to the command session", async () => {
  const directory = await mkdtemp(join(tmpdir(), "agentation-extension-"));
  const fakePi = await createFakePi(directory);
  const rpcLog = join(directory, "rpc.jsonl");
  const parentSession = join(directory, "parent.jsonl");
  await writeFile(parentSession, "{}\n");
  const previousPiBin = process.env.PI_BIN;
  const previousLog = process.env.TEST_RPC_LOG;

  process.env.PI_BIN = fakePi;
  process.env.TEST_RPC_LOG = rpcLog;
  delete process.env.AGENTATION_CHILD;

  let commandHandler:
    | ((args: string, context: Record<string, unknown>) => Promise<void>)
    | undefined;
  let shutdownHandler: (() => Promise<void>) | undefined;
  const notifications: string[] = [];
  const pi = {
    registerCommand(_name: string, options: { handler: typeof commandHandler }) {
      commandHandler = options.handler;
    },
    on(event: string, handler: () => Promise<void>) {
      if (event === "session_shutdown") shutdownHandler = handler;
    },
    appendEntry() {},
    getSessionName() {
      return undefined;
    },
    setSessionName() {},
  };

  try {
    agentationExtension(pi as never);
    assert.ok(commandHandler);
    await commandHandler("", {
      cwd: process.cwd(),
      sessionManager: {
        getSessionFile: () => parentSession,
      },
      ui: {
        confirm: async () => true,
        notify: (message: string) => notifications.push(message),
        setStatus: () => undefined,
      },
    });

    const response = await fetch("http://127.0.0.1:4748/agentation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Origin: "http://localhost:3000",
      },
      body: JSON.stringify({
        event: "submit",
        timestamp: 42,
        url: "http://localhost:3000/",
        output: "## Feedback\nmake the button blue",
        annotations: [{ id: "annotation-1", comment: "make it blue" }],
      }),
    });
    assert.equal(response.status, 202);

    const log = await waitForLog(rpcLog, "get_last_assistant_text");
    const commands = log
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line) as Record<string, unknown>);
    assert.deepEqual(
      commands.map(({ type }) => type),
      [
        "new_session",
        "set_session_name",
        "get_state",
        "prompt",
        "get_messages",
        "get_last_assistant_text",
      ],
    );
    assert.equal(commands[0]?.parentSession, parentSession);
    assert.match(String(commands[3]?.message), /annotation-1/);
    assert.ok(notifications.some((message) => message.includes("child completed")));
  } finally {
    await shutdownHandler?.();
    if (previousPiBin === undefined) delete process.env.PI_BIN;
    else process.env.PI_BIN = previousPiBin;
    if (previousLog === undefined) delete process.env.TEST_RPC_LOG;
    else process.env.TEST_RPC_LOG = previousLog;
    await rm(directory, { recursive: true, force: true });
  }
});

test("cancelled child creation does not prompt the initial session", async () => {
  const directory = await mkdtemp(join(tmpdir(), "agentation-cancel-"));
  const fakePi = await createFakePi(directory);
  process.env.TEST_RPC_LOG = join(directory, "rpc.jsonl");
  process.env.TEST_RPC_MODE = "cancel";
  try {
    await assert.rejects(
      runChildSession({
        piBin: fakePi,
        cwd: process.cwd(),
        parentSession: "/tmp/parent.jsonl",
        name: "cancelled",
        prompt: "must not run",
      }),
      /creation was cancelled/,
    );
    const log = await readFile(process.env.TEST_RPC_LOG, "utf8");
    assert.deepEqual(
      log
        .trim()
        .split("\n")
        .map((line) => JSON.parse(line).type),
      ["new_session"],
    );
  } finally {
    delete process.env.TEST_RPC_MODE;
    delete process.env.TEST_RPC_LOG;
    await rm(directory, { recursive: true, force: true });
  }
});

test("rejected prompt does not wait for the settled timeout", async () => {
  const directory = await mkdtemp(join(tmpdir(), "agentation-reject-"));
  const fakePi = await createFakePi(directory);
  process.env.TEST_RPC_LOG = join(directory, "rpc.jsonl");
  process.env.TEST_RPC_MODE = "reject";
  try {
    const startedAt = Date.now();
    await assert.rejects(
      runChildSession({
        piBin: fakePi,
        cwd: process.cwd(),
        parentSession: "/tmp/parent.jsonl",
        name: "rejected",
        prompt: "reject",
      }),
      /prompt rejected/,
    );
    assert.ok(Date.now() - startedAt < 5_000);
  } finally {
    delete process.env.TEST_RPC_MODE;
    delete process.env.TEST_RPC_LOG;
    await rm(directory, { recursive: true, force: true });
  }
});

test("child exit rejects without waiting for the settled timeout", async () => {
  const directory = await mkdtemp(join(tmpdir(), "agentation-exit-"));
  const fakePi = await createFakePi(directory);
  process.env.TEST_RPC_LOG = join(directory, "rpc.jsonl");
  process.env.TEST_RPC_MODE = "exit";
  try {
    const startedAt = Date.now();
    await assert.rejects(
      runChildSession({
        piBin: fakePi,
        cwd: process.cwd(),
        parentSession: "/tmp/parent.jsonl",
        name: "early exit",
        prompt: "exit",
      }),
      /pi rpc exited before completion/,
    );
    assert.ok(Date.now() - startedAt < 5_000);
  } finally {
    delete process.env.TEST_RPC_MODE;
    delete process.env.TEST_RPC_LOG;
    await rm(directory, { recursive: true, force: true });
  }
});
