import assert from "node:assert/strict";
import { chmod, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { createServer } from "node:net";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createAgentationServer } from "./server.js";

async function availablePort() {
  const server = createServer();
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", () => resolve()));
  const address = server.address();
  await new Promise<void>((resolve) => server.close(() => resolve()));
  if (!address || typeof address === "string") throw new Error("could not allocate test port");
  return address.port;
}

async function collectSseUntil(
  response: Response,
  until: (event: Record<string, unknown>) => boolean,
): Promise<Array<Record<string, unknown>>> {
  const body = response.body;
  assert.ok(body);
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const events: Array<Record<string, unknown>> = [];
  let buffer = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) return events;
    buffer += decoder.decode(value, { stream: true });
    const records = buffer.split("\n\n");
    buffer = records.pop() ?? "";
    for (const record of records) {
      const data = record
        .split("\n")
        .find((line) => line.startsWith("data: "))
        ?.slice(6);
      if (!data) continue;
      const event = JSON.parse(data) as Record<string, unknown>;
      events.push(event);
      if (until(event)) {
        await reader.cancel();
        return events;
      }
    }
  }
}

async function createFakePi(directory: string): Promise<string> {
  const fakePi = join(directory, "fake-pi.mjs");
  await writeFile(
    fakePi,
    `#!/usr/bin/env node
import { appendFileSync } from "node:fs";
let buffer = "";
let childMode = false;
process.stdin.on("data", chunk => {
  buffer += chunk.toString("utf8");
  while (buffer.includes("\\n")) {
    const newline = buffer.indexOf("\\n");
    const line = buffer.slice(0, newline);
    buffer = buffer.slice(newline + 1);
    if (!line) continue;
    const command = JSON.parse(line);
    if (command.type === "new_session") childMode = true;
    appendFileSync(process.env.TEST_RPC_LOG, JSON.stringify({ ...command, childMode }) + "\\n");
    let data;
    if (command.type === "new_session") data = { cancelled: false };
    if (command.type === "get_state") data = childMode
      ? { sessionFile: process.env.TEST_CHILD_SESSION, sessionId: "child-id" }
      : { sessionFile: process.env.TEST_PARENT_SESSION, sessionId: "parent-id" };
    if (command.type === "get_messages") data = { messages: [{ role: "assistant", stopReason: "stop" }] };
    if (command.type === "get_last_assistant_text") data = { text: "done" };
    process.stdout.write(JSON.stringify({ id: command.id, type: "response", command: command.type, success: true, data }) + "\\n");
    if (command.type === "prompt") {
      process.stdout.write(JSON.stringify({ type: "tool_execution_start", toolName: "edit" }) + "\\n");
      process.stdout.write(JSON.stringify({ type: "message_update", assistantMessageEvent: { type: "text_delta", delta: "working" } }) + "\\n");
      process.stdout.write(JSON.stringify({ type: "agent_settled" }) + "\\n");
    }
  }
});
`,
  );
  await chmod(fakePi, 0o755);
  return fakePi;
}

test("dev coordinator creates a parent and routes submissions to linked children", async () => {
  const directory = await mkdtemp(join(tmpdir(), "agentation-pi-"));
  const piBin = await createFakePi(directory);
  const rpcLog = join(directory, "rpc.jsonl");
  const parentSession = join(directory, "parent.jsonl");
  const childSession = join(directory, "child.jsonl");
  const port = await availablePort();
  const previous = {
    log: process.env.TEST_RPC_LOG,
    parent: process.env.TEST_PARENT_SESSION,
    child: process.env.TEST_CHILD_SESSION,
  };
  process.env.TEST_RPC_LOG = rpcLog;
  process.env.TEST_PARENT_SESSION = parentSession;
  process.env.TEST_CHILD_SESSION = childSession;

  const messages: string[] = [];
  let coordinator;
  try {
    coordinator = await createAgentationServer({
      cwd: directory,
      piBin,
      port,
      logger: {
        info: (message) => messages.push(message),
        error: (message) => messages.push(message),
      },
    });

    const header = JSON.parse((await readFile(parentSession, "utf8")).split("\n")[0]);
    assert.equal(header.id, "parent-id");
    assert.equal(header.cwd, directory);

    const blocked = await fetch(coordinator.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "https://example.com" },
      body: "{}",
    });
    assert.equal(blocked.status, 403);
    const wrongPort = await fetch(coordinator.url, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:5173" },
      body: "{}",
    });
    assert.equal(wrongPort.status, 403);
    const invalidAnnotation = await fetch(`${coordinator.url}?clientId=invalid`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify({ event: "submit", output: "feedback", annotations: [{}] }),
    });
    assert.equal(invalidAnnotation.status, 400);

    const projectionUrl = coordinator.url.replace("/agentation", "/projection-events");
    const blockedProjection = await fetch(projectionUrl, {
      headers: { Origin: "http://localhost:3000" },
    });
    assert.equal(blockedProjection.status, 403);
    const projectionResponse = await fetch(projectionUrl);
    assert.equal(projectionResponse.status, 200);
    const projectionDone = collectSseUntil(
      projectionResponse,
      ({ status }) => status === "completed",
    );

    const cappedStreams = await Promise.all(
      Array.from({ length: 3 }, () => fetch(projectionUrl)),
    );
    assert.ok(cappedStreams.every(({ status }) => status === 200));
    const cappedResponse = await fetch(projectionUrl);
    assert.equal(cappedResponse.status, 429);
    await Promise.all(cappedStreams.map(({ body }) => body?.cancel()));

    const clientId = "test-client";
    const eventsUrl = `${coordinator.url.replace("/agentation", "/events")}?clientId=${clientId}`;
    const submissionUrl = `${coordinator.url}?clientId=${clientId}`;
    const eventsResponse = await fetch(eventsUrl, {
      headers: { Origin: "http://localhost:3000" },
    });
    assert.equal(eventsResponse.status, 200);
    const events: Array<{ type: string; delta?: string }> = [];
    const eventsBody = eventsResponse.body;
    assert.ok(eventsBody);
    const eventsDone = (async () => {
      const reader = eventsBody.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) return;
        buffer += decoder.decode(value, { stream: true });
        const records = buffer.split("\n\n");
        buffer = records.pop() ?? "";
        for (const record of records) {
          const data = record
            .split("\n")
            .find((line) => line.startsWith("data: "))
            ?.slice(6);
          if (!data) continue;
          const event = JSON.parse(data);
          events.push(event);
          if (event.type === "child.completed") {
            await reader.cancel();
            return;
          }
        }
      }
    })();

    const response = await fetch(submissionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify({
        event: "submit",
        timestamp: 42,
        url: "http://localhost:3000/",
        output: "## Feedback\nmake the button blue",
        annotations: [
          {
            id: "annotation-1",
            comment: "make it blue",
            sourceFile: "src/Button.tsx:12",
          },
        ],
      }),
    });
    assert.equal(response.status, 200);

    const commands = (await readFile(rpcLog, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    const newSession = commands.find(({ type }) => type === "new_session");
    assert.equal(newSession.parentSession, parentSession);
    await eventsDone;
    const projectionEvents = await projectionDone;
    assert.ok(events.some(({ type, delta }) => type === "assistant.delta" && delta === "working"));
    assert.ok(events.some(({ type }) => type === "child.completed"));
    assert.ok(projectionEvents.every(({ type }) => type === "task.snapshot"));

    const queuedProjection = projectionEvents.find(({ status }) => status === "queued");
    assert.ok(queuedProjection);
    assert.equal(queuedProjection.cwd, directory);
    assert.equal(queuedProjection.url, "http://localhost:3000/");
    assert.deepEqual(queuedProjection.annotations, [
      {
        id: "annotation-1",
        comment: "make it blue",
        sourceFile: "src/Button.tsx:12",
      },
    ]);
    const taskId = queuedProjection.taskId;
    assert.equal(typeof taskId, "string");
    assert.ok(
      projectionEvents.some(
        ({ taskId: eventTaskId, status, detail }) =>
          eventTaskId === taskId && status === "running" && detail === "Working",
      ),
    );
    assert.ok(
      projectionEvents.some(
        ({ taskId: eventTaskId, status, detail }) =>
          eventTaskId === taskId && status === "running" && detail === "Running edit",
      ),
    );
    assert.ok(
      projectionEvents.some(
        ({ taskId: eventTaskId, status, detail, markdown }) =>
          eventTaskId === taskId &&
          status === "running" &&
          detail === "Responding" &&
          markdown === "working",
      ),
    );
    const completedProjection = projectionEvents.at(-1);
    assert.equal(completedProjection?.status, "completed");
    assert.equal(completedProjection?.taskId, taskId);
    assert.equal(completedProjection?.markdown, "done");
    assert.equal(completedProjection?.sessionFile, childSession);

    const projectionReplay = await collectSseUntil(
      await fetch(projectionUrl),
      ({ status }) => status === "completed",
    );
    assert.equal(projectionReplay.length, 1);
    assert.deepEqual(projectionReplay[0], completedProjection);

    const replayResponse = await fetch(eventsUrl, {
      headers: { Origin: "http://localhost:3000" },
    });
    assert.ok(replayResponse.body);
    const replayReader = replayResponse.body.getReader();
    const replay = new TextDecoder().decode((await replayReader.read()).value);
    await replayReader.cancel();
    assert.match(replay, /"type":"assistant.delta"/);
    assert.match(replay, /"type":"child.completed"/);
    assert.ok(messages.some((message) => message.includes("completed")));
  } finally {
    await coordinator?.close();
    for (const [key, value] of Object.entries(previous)) {
      const environmentKey = `TEST_${key === "log" ? "RPC_LOG" : `${key.toUpperCase()}_SESSION`}`;
      if (value === undefined) delete process.env[environmentKey];
      else process.env[environmentKey] = value;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
