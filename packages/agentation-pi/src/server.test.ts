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
import { appendFileSync, realpathSync, writeFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
appendFileSync(process.env.TEST_RPC_LOG, JSON.stringify({ startupArgs: process.argv.slice(2), captureManifest: process.env.AGENTATION_CAPTURE_MANIFEST }) + "\\n");
const handlers = {};
const extensionIndex = process.argv.indexOf("--extension");
if (extensionIndex !== -1) {
  const extension = await import(pathToFileURL(process.argv[extensionIndex + 1]).href);
  await extension.default({ on(type, handler) { handlers[type] = handler; } });
}
let buffer = "";
let childMode = false;
process.stdin.on("data", async chunk => {
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
      const outsideFile = { toolCallId: "outside-file", toolName: "write", input: { path: pathToFileURL(process.env.AGENTATION_CAPTURE_MANIFEST).href } };
      const outsideFileGate = await handlers.tool_call?.(outsideFile, { cwd: process.cwd() });
      if (!outsideFileGate?.block) throw new Error("outside file URL was not blocked");
      const outsideTilde = { toolCallId: "outside-tilde", toolName: "write", input: { path: "~/.agentation-outside" } };
      const outsideTildeGate = await handlers.tool_call?.(outsideTilde, { cwd: process.cwd() });
      if (!outsideTildeGate?.block) throw new Error("outside tilde path was not blocked");
      const unsupportedUrl = { toolCallId: "unsupported-url", toolName: "write", input: { path: "https://example.com/file.ts" } };
      const unsupportedUrlGate = await handlers.tool_call?.(unsupportedUrl, { cwd: process.cwd() });
      if (!unsupportedUrlGate?.block) throw new Error("unsupported URL was not blocked");
      const firstEdit = { toolCallId: "edit-1", toolName: "edit", input: { path: pathToFileURL(process.env.TEST_SOURCE_FILE).href } };
      process.stdout.write(JSON.stringify({ type: "tool_execution_start", ...firstEdit, args: firstEdit.input }) + "\\n");
      const firstGate = await handlers.tool_call?.(firstEdit, { cwd: process.cwd() });
      if (firstGate?.block) throw new Error(firstGate.reason);
      if (firstEdit.input.path !== realpathSync(process.env.TEST_SOURCE_FILE)) throw new Error("file URL was not normalized");
      writeFileSync(firstEdit.input.path, "middle\\n", "utf8");
      await handlers.tool_result?.(firstEdit, { cwd: process.cwd() });
      process.stdout.write(JSON.stringify({ type: "tool_execution_end", toolCallId: firstEdit.toolCallId, toolName: "edit", isError: false }) + "\\n");
      const secondEdit = { toolCallId: "edit-2", toolName: "edit", input: { path: "source.ts" } };
      process.stdout.write(JSON.stringify({ type: "tool_execution_start", ...secondEdit, args: secondEdit.input }) + "\\n");
      const secondGate = await handlers.tool_call?.(secondEdit, { cwd: process.cwd() });
      if (secondGate?.block) throw new Error(secondGate.reason);
      if (secondEdit.input.path !== realpathSync(process.env.TEST_SOURCE_FILE)) throw new Error("relative path was not normalized");
      writeFileSync(secondEdit.input.path, "after\\n", "utf8");
      await handlers.tool_result?.(secondEdit, { cwd: process.cwd() });
      process.stdout.write(JSON.stringify({ type: "tool_execution_end", toolCallId: secondEdit.toolCallId, toolName: "edit", isError: false }) + "\\n");
      const createdWrite = { toolCallId: "write-created", toolName: "write", input: { path: "created.ts" } };
      const createdGate = await handlers.tool_call?.(createdWrite, { cwd: process.cwd() });
      if (createdGate?.block) throw new Error(createdGate.reason);
      writeFileSync(createdWrite.input.path, "new\\n", "utf8");
      await handlers.tool_result?.(createdWrite, { cwd: process.cwd() });
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
  const sourceFile = join(directory, "source.ts");
  const createdFile = join(directory, "created.ts");
  await writeFile(sourceFile, "before\n", "utf8");
  const port = await availablePort();
  const previous = {
    TEST_RPC_LOG: process.env.TEST_RPC_LOG,
    TEST_PARENT_SESSION: process.env.TEST_PARENT_SESSION,
    TEST_CHILD_SESSION: process.env.TEST_CHILD_SESSION,
    TEST_SOURCE_FILE: process.env.TEST_SOURCE_FILE,
  };
  process.env.TEST_RPC_LOG = rpcLog;
  process.env.TEST_PARENT_SESSION = parentSession;
  process.env.TEST_CHILD_SESSION = childSession;
  process.env.TEST_SOURCE_FILE = sourceFile;

  const messages: string[] = [];
  let coordinator;
  try {
    coordinator = await createAgentationServer({
      cwd: directory,
      piBin,
      port,
      maxProjectionContentBytes: 20,
      retainedTaskLimit: 1,
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
    assert.equal(response.status, 200, messages.join("\n"));

    const commands = (await readFile(rpcLog, "utf8"))
      .trim()
      .split("\n")
      .map((line) => JSON.parse(line));
    const newSession = commands.find(({ type }) => type === "new_session");
    assert.equal(newSession.parentSession, parentSession);
    const startups = commands.filter(({ startupArgs }) => startupArgs);
    assert.equal(startups.length, 2);
    assert.ok(!startups[0].startupArgs.includes("--extension"));
    assert.ok(startups[1].startupArgs.includes("read,grep,find,ls,edit,write"));
    assert.ok(startups[1].startupArgs.includes("--no-extensions"));
    assert.ok(startups[1].startupArgs.includes("--extension"));
    await assert.rejects(readFile(startups[1].captureManifest, "utf8"), { code: "ENOENT" });
    await eventsDone;
    const projectionEvents = await projectionDone;
    assert.ok(events.some(({ type, delta }) => type === "assistant.delta" && delta === "working"));
    assert.ok(events.some(({ type }) => type === "child.completed"));
    const reset = projectionEvents[0];
    assert.equal(reset?.type, "projection.reset");
    assert.equal(typeof reset?.generation, "string");
    const generation = reset.generation as string;
    assert.ok(projectionEvents.slice(1).every(({ type }) => type === "task.snapshot"));

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
    assert.deepEqual(completedProjection?.changes, [
      { path: "source.ts" },
      { path: "created.ts" },
    ]);

    const contentUrl = coordinator.url.replace("/agentation", "/projection-content");
    const contentQuery = `generation=${generation}&taskId=${taskId}&path=source.ts`;
    const before = await fetch(`${contentUrl}?${contentQuery}&side=before`);
    assert.equal(before.status, 200);
    assert.equal(before.headers.get("content-type"), "text/plain; charset=utf-8");
    assert.equal(await before.text(), "before\n");
    const after = await fetch(`${contentUrl}?${contentQuery}&side=after`);
    assert.equal(after.status, 200);
    assert.equal(await after.text(), "after\n");
    assert.equal(
      (await fetch(`${contentUrl}?${contentQuery}&side=after`, {
        headers: { Origin: "http://localhost:3000" },
      })).status,
      403,
    );
    assert.equal(
      (await fetch(`${contentUrl}?generation=stale&taskId=${taskId}&path=source.ts&side=after`))
        .status,
      410,
    );
    assert.equal((await fetch(`${contentUrl}?taskId=${taskId}&path=source.ts&side=after`)).status, 410);
    assert.equal(
      (await fetch(`${contentUrl}?generation=${generation}&taskId=unknown&path=source.ts&side=after`))
        .status,
      404,
    );
    assert.equal((await fetch(`${contentUrl}?${contentQuery}&side=unknown`)).status, 400);
    assert.equal(
      (await fetch(`${contentUrl}?generation=${generation}&taskId=${taskId}&path=unknown.ts&side=after`))
        .status,
      404,
    );

    const prepareUrl = coordinator.url.replace(
      "/agentation",
      "/projection-rejections/prepare",
    );
    const ackUrl = coordinator.url.replace("/agentation", "/projection-rejections/ack");
    const prepareBody = JSON.stringify({
      generation,
      taskId,
      path: "source.ts",
      requestId: "reject-source",
    });
    assert.equal(
      (await fetch(prepareUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
        body: prepareBody,
      })).status,
      403,
    );
    assert.equal((await fetch(prepareUrl, { method: "POST", body: "{}" })).status, 400);
    assert.equal(
      (await fetch(prepareUrl, {
        method: "POST",
        body: JSON.stringify({
          generation: "stale",
          taskId,
          path: "source.ts",
          requestId: "stale",
        }),
      })).status,
      410,
    );
    assert.equal(
      (await fetch(prepareUrl, {
        method: "POST",
        body: JSON.stringify({
          generation,
          taskId: "unknown",
          path: "source.ts",
          requestId: "unknown-task",
        }),
      })).status,
      404,
    );
    assert.equal(
      (await fetch(prepareUrl, {
        method: "POST",
        body: JSON.stringify({
          generation,
          taskId,
          path: "unknown.ts",
          requestId: "unknown-path",
        }),
      })).status,
      404,
    );

    const prepareResponse = await fetch(prepareUrl, { method: "POST", body: prepareBody });
    assert.equal(prepareResponse.status, 200);
    const prepared = (await prepareResponse.json()) as {
      operationId: string;
      beforeExists: boolean;
      afterExists: boolean;
    };
    assert.equal(typeof prepared.operationId, "string");
    assert.equal(prepared.beforeExists, true);
    assert.equal(prepared.afterExists, true);
    assert.equal(await readFile(sourceFile, "utf8"), "after\n");
    assert.deepEqual(
      await (await fetch(prepareUrl, { method: "POST", body: prepareBody })).json(),
      prepared,
    );
    assert.equal(
      (await fetch(prepareUrl, {
        method: "POST",
        body: JSON.stringify({
          generation,
          taskId,
          path: "created.ts",
          requestId: "reject-source",
        }),
      })).status,
      409,
    );
    const preparedReplay = await collectSseUntil(
      await fetch(projectionUrl),
      ({ status }) => status === "completed",
    );
    assert.deepEqual(preparedReplay[1]?.changes, completedProjection?.changes);
    assert.equal((await fetch(`${contentUrl}?${contentQuery}&side=after`)).status, 200);

    const ackBody = JSON.stringify({ generation, operationId: prepared.operationId });
    assert.equal((await fetch(ackUrl, { method: "POST", body: "{}" })).status, 400);
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        headers: { Origin: "http://localhost:3000" },
        body: ackBody,
      })).status,
      403,
    );
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        body: JSON.stringify({ generation: "stale", operationId: prepared.operationId }),
      })).status,
      410,
    );
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        body: JSON.stringify({ generation, operationId: "unknown" }),
      })).status,
      404,
    );

    await writeFile(sourceFile, "before\n", "utf8");
    const rejectionEvents = collectSseUntil(
      await fetch(projectionUrl),
      ({ status, changes }) =>
        status === "completed" &&
        Array.isArray(changes) &&
        !changes.some((change) => change.path === "source.ts"),
    );
    assert.equal((await fetch(ackUrl, { method: "POST", body: ackBody })).status, 200);
    assert.equal((await fetch(ackUrl, { method: "POST", body: ackBody })).status, 200);
    assert.equal(await readFile(sourceFile, "utf8"), "before\n");
    assert.equal((await fetch(`${contentUrl}?${contentQuery}&side=after`)).status, 404);
    const rejectedProjection = (await rejectionEvents).at(-1);
    assert.deepEqual(rejectedProjection?.changes, [{ path: "created.ts" }]);
    assert.deepEqual(
      await (await fetch(prepareUrl, { method: "POST", body: prepareBody })).json(),
      prepared,
    );

    const createdPrepareResponse = await fetch(prepareUrl, {
      method: "POST",
      body: JSON.stringify({
        generation,
        taskId,
        path: "created.ts",
        requestId: "reject-created",
      }),
    });
    assert.equal(createdPrepareResponse.status, 200);
    const createdPrepared = (await createdPrepareResponse.json()) as {
      operationId: string;
      beforeExists: boolean;
      afterExists: boolean;
    };
    assert.equal(createdPrepared.beforeExists, false);
    assert.equal(createdPrepared.afterExists, true);
    assert.equal(await readFile(createdFile, "utf8"), "new\n");
    const projectionReplay = await collectSseUntil(
      await fetch(projectionUrl),
      ({ status }) => status === "completed",
    );
    assert.deepEqual(projectionReplay[1], rejectedProjection);

    await rm(createdFile);
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        body: JSON.stringify({ generation, operationId: createdPrepared.operationId }),
      })).status,
      200,
    );
    const fullyRejectedReplay = await collectSseUntil(
      await fetch(projectionUrl),
      ({ status }) => status === "completed",
    );
    assert.equal(fullyRejectedReplay[1]?.changes, undefined);

    await writeFile(sourceFile, "before\n", "utf8");
    const evictionEvents = collectSseUntil(
      await fetch(projectionUrl),
      ({ taskId: eventTaskId, status }) => status === "completed" && eventTaskId !== taskId,
    );
    const secondResponse = await fetch(submissionUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json", Origin: "http://localhost:3000" },
      body: JSON.stringify({
        event: "submit",
        timestamp: 43,
        output: "## Feedback\nmake the button green",
        annotations: [{ id: "annotation-2", comment: "make it green" }],
      }),
    });
    assert.equal(secondResponse.status, 200, messages.join("\n"));
    const evictionProjectionEvents = await evictionEvents;
    const secondProjection = evictionProjectionEvents.at(-1);
    const secondTaskId = secondProjection?.taskId;
    assert.equal(secondProjection?.status, "completed");
    assert.equal(typeof secondTaskId, "string");
    const firstTaskUpdates = evictionProjectionEvents.filter(
      ({ taskId: eventTaskId, status }) => eventTaskId === taskId && status === "completed",
    );
    assert.equal(firstTaskUpdates[0]?.changes, undefined);
    assert.equal(firstTaskUpdates.at(-1)?.changes, undefined);
    assert.ok(
      evictionProjectionEvents.some(
        ({ type, taskId: removedTaskId }) => type === "task.remove" && removedTaskId === taskId,
      ),
    );
    assert.equal((await fetch(`${contentUrl}?${contentQuery}&side=after`)).status, 404);
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        body: JSON.stringify({ generation, operationId: prepared.operationId }),
      })).status,
      404,
    );
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        body: JSON.stringify({ generation, operationId: createdPrepared.operationId }),
      })).status,
      404,
    );

    const retainedReplay = await collectSseUntil(
      await fetch(projectionUrl),
      ({ taskId: eventTaskId, status }) => eventTaskId === secondTaskId && status === "completed",
    );
    assert.deepEqual(retainedReplay[0], reset);
    assert.deepEqual(
      retainedReplay.slice(1).map(({ taskId: eventTaskId }) => eventTaskId),
      [secondTaskId],
    );

    const bulkSourceOperations: string[] = [];
    for (let index = 0; index < 200; index += 1) {
      const response = await fetch(prepareUrl, {
        method: "POST",
        body: JSON.stringify({
          generation,
          taskId: secondTaskId,
          path: "source.ts",
          requestId: `bulk-source-${index}`,
        }),
      });
      assert.equal(response.status, 200);
      bulkSourceOperations.push(((await response.json()) as { operationId: string }).operationId);
    }
    assert.equal(
      (await fetch(prepareUrl, {
        method: "POST",
        body: JSON.stringify({
          generation,
          taskId: secondTaskId,
          path: "source.ts",
          requestId: "pending-overflow",
        }),
      })).status,
      429,
    );
    for (const operationId of bulkSourceOperations) {
      assert.equal(
        (await fetch(ackUrl, {
          method: "POST",
          body: JSON.stringify({ generation, operationId }),
        })).status,
        200,
      );
    }

    const recentOperations: string[] = [];
    for (let index = 0; index < 10; index += 1) {
      const response = await fetch(prepareUrl, {
        method: "POST",
        body: JSON.stringify({
          generation,
          taskId: secondTaskId,
          path: "created.ts",
          requestId: `bulk-created-${index}`,
        }),
      });
      assert.equal(response.status, 200);
      recentOperations.push(((await response.json()) as { operationId: string }).operationId);
    }
    for (const operationId of recentOperations) {
      assert.equal(
        (await fetch(ackUrl, {
          method: "POST",
          body: JSON.stringify({ generation, operationId }),
        })).status,
        200,
      );
    }
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        body: JSON.stringify({ generation, operationId: bulkSourceOperations[0] }),
      })).status,
      404,
    );
    assert.equal(
      (await fetch(ackUrl, {
        method: "POST",
        body: JSON.stringify({ generation, operationId: recentOperations.at(-1) }),
      })).status,
      200,
    );

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
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
