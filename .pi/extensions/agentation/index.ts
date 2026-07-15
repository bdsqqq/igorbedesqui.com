import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { createServer, type IncomingMessage, type Server } from "node:http";
import { basename } from "node:path";
import { StringDecoder } from "node:string_decoder";
import type { ChildProcess } from "node:child_process";
import { runChildSession } from "./protocol.js";

const AGENTATION_HOST = "127.0.0.1";
const WEBHOOK_PORT = 4748;
const MAX_REQUEST_BYTES = 1_000_000;
const MAX_QUEUED_ACTIONS = 5;
const RECENT_ACTION_LIMIT = 100;

type SubmittedAnnotation = {
  id?: string;
  comment?: string;
};

type Submission = {
  event: "submit";
  timestamp?: number;
  url?: string;
  output: string;
  annotations: SubmittedAnnotation[];
};

type Coordinator = {
  server: Server;
  childProcesses: Set<ChildProcess>;
  closing: boolean;
  queued: number;
  active: number;
  queue: Promise<void>;
};

function readSubmission(req: IncomingMessage): Promise<Submission> {
  return new Promise((resolve, reject) => {
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
          !Array.isArray(value.annotations)
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

function childPrompt(submission: Submission): string {
  const ids = submission.annotations.map(({ id }) => id).filter(Boolean);
  return [
    "address this submitted Agentation feedback in the current project.",
    "treat the annotations as one batch, make the requested code changes, and verify the result.",
    ids.length > 0 ? `annotation ids: ${ids.join(", ")}` : undefined,
    submission.url ? `submitted from: ${submission.url}` : undefined,
    "",
    submission.output,
  ]
    .filter((line): line is string => line !== undefined)
    .join("\n");
}

function isAllowedOrigin(origin: string | undefined): origin is string {
  if (!origin) return false;
  try {
    const { hostname, protocol } = new URL(origin);
    return (
      (protocol === "http:" || protocol === "https:") &&
      (hostname === "localhost" || hostname === AGENTATION_HOST)
    );
  } catch {
    return false;
  }
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

async function closeCoordinator(coordinator: Coordinator): Promise<void> {
  if (coordinator.closing) return;
  coordinator.closing = true;
  const serverClosed = new Promise<void>((resolve) => coordinator.server.close(() => resolve()));
  coordinator.server.closeAllConnections();
  await Promise.all([serverClosed, ...[...coordinator.childProcesses].map(stopProcess)]);
  coordinator.childProcesses.clear();
}

export default function agentationExtension(pi: ExtensionAPI): void {
  if (process.env.AGENTATION_CHILD === "1") return;

  let coordinator: Coordinator | undefined;
  const recentActions = new Set<string>();

  pi.registerCommand("agentation-start", {
    description: "Route Agentation submissions into child sessions of this session",
    handler: async (_args, ctx) => {
      if (coordinator && !coordinator.closing) {
        ctx.ui.notify("Agentation is already listening", "info");
        return;
      }

      const parentSession = ctx.sessionManager.getSessionFile();
      const piBin = process.env.PI_BIN;
      if (!parentSession) {
        ctx.ui.notify("Agentation needs a persisted parent session", "error");
        return;
      }
      if (!piBin) {
        ctx.ui.notify("PI_BIN is unavailable; activate the configured pi wrapper", "error");
        return;
      }

      if (!existsSync(parentSession)) {
        ctx.ui.notify("Send one normal prompt before starting Agentation", "error");
        return;
      }
      pi.appendEntry("agentation-parent", {
        startedAt: new Date().toISOString(),
        webhook: `http://${AGENTATION_HOST}:${WEBHOOK_PORT}/agentation`,
      });

      ctx.ui.setStatus("agentation", "agentation: starting");

      try {
        const server = createServer();
        server.requestTimeout = 5_000;
        server.headersTimeout = 5_000;
        coordinator = {
          server,
          childProcesses: new Set(),
          closing: false,
          queued: 0,
          active: 0,
          queue: Promise.resolve(),
        };
        const current = coordinator;

        server.on("request", async (req, res) => {
          if (current.closing) {
            res.writeHead(503).end();
            return;
          }
          const origin = req.headers.origin;
          if (!isAllowedOrigin(origin)) {
            res.writeHead(403).end();
            return;
          }
          res.setHeader("Access-Control-Allow-Origin", origin);
          res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
          res.setHeader("Access-Control-Allow-Headers", "Content-Type");
          res.setHeader("Vary", "Origin");

          if (req.method === "OPTIONS") {
            res.writeHead(204).end();
            return;
          }
          if (req.method !== "POST" || req.url !== "/agentation") {
            res.writeHead(404).end();
            return;
          }

          let reserved = false;
          try {
            if (current.queued + current.active >= MAX_QUEUED_ACTIONS) {
              res.writeHead(429).end();
              return;
            }
            current.queued += 1;
            reserved = true;
            const submission = await readSubmission(req);
            if (current.closing) {
              current.queued -= 1;
              reserved = false;
              res.writeHead(503).end();
              return;
            }
            const key = actionKey(submission);
            if (recentActions.has(key)) {
              current.queued -= 1;
              reserved = false;
              res.writeHead(202).end();
              return;
            }
            recentActions.add(key);
            if (recentActions.size > RECENT_ACTION_LIMIT) {
              recentActions.delete(recentActions.values().next().value!);
            }

            ctx.ui.setStatus("agentation", `agentation: ${current.queued} queued`);
            current.queue = current.queue
              .then(async () => {
                if (current.closing) return;
                current.queued -= 1;
                current.active += 1;
                ctx.ui.setStatus("agentation", "agentation: awaiting approval");
                try {
                  const approved = await ctx.ui.confirm(
                    "Run Agentation feedback?",
                    `${submission.annotations.length} annotation(s) from ${submission.url ?? "the local dev server"}`,
                  );
                  if (!approved || current.closing) return;
                  ctx.ui.setStatus("agentation", "agentation: child running");
                  const result = await runChildSession({
                    piBin,
                    cwd: ctx.cwd,
                    parentSession,
                    name: childName(submission),
                    prompt: childPrompt(submission),
                    onSpawn: (child) => {
                      current.childProcesses.add(child);
                      child.once("exit", () => current.childProcesses.delete(child));
                    },
                  });
                  if (!current.closing) {
                    ctx.ui.notify(
                      `Agentation child completed${result.sessionFile ? `: ${basename(result.sessionFile)}` : ""}`,
                      "info",
                    );
                  }
                } catch (error) {
                  if (!current.closing) {
                    ctx.ui.notify(
                      `Agentation child failed: ${error instanceof Error ? error.message : String(error)}`,
                      "error",
                    );
                  }
                } finally {
                  current.active -= 1;
                  if (!current.closing) {
                    ctx.ui.setStatus(
                      "agentation",
                      current.queued > 0
                        ? `agentation: ${current.queued} queued`
                        : "agentation: listening",
                    );
                  }
                }
              })
              .catch(() => undefined);

            res.writeHead(202, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ accepted: true }));
          } catch (error) {
            if (reserved) current.queued -= 1;
            res.writeHead(400, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ error: error instanceof Error ? error.message : "invalid submission" }),
            );
          }
        });

        await new Promise<void>((resolve, reject) => {
          server.once("error", reject);
          server.listen(WEBHOOK_PORT, AGENTATION_HOST, () => {
            server.off("error", reject);
            resolve();
          });
        });

        if (!pi.getSessionName()) {
          pi.setSessionName(`agentation: ${basename(ctx.cwd)}`);
        }
        ctx.ui.setStatus("agentation", "agentation: listening");
        ctx.ui.notify(
          `Agentation is listening on http://${AGENTATION_HOST}:${WEBHOOK_PORT}/agentation`,
          "info",
        );
      } catch (error) {
        if (coordinator) await closeCoordinator(coordinator);
        coordinator = undefined;
        ctx.ui.setStatus("agentation", undefined);
        ctx.ui.notify(
          `Could not start Agentation: ${error instanceof Error ? error.message : String(error)}`,
          "error",
        );
      }
    },
  });

  pi.on("session_shutdown", async () => {
    if (!coordinator) return;
    await closeCoordinator(coordinator);
    coordinator = undefined;
  });
}

export { actionKey, childName, childPrompt, isAllowedOrigin, readSubmission };
