import { resolve } from "node:path";
import { createAgentationServer } from "./server.js";

const cwd = resolve(process.argv[2] ?? process.cwd());
const port = Number(process.env.AGENTATION_WEBHOOK_PORT ?? 4748);
const coordinator = await createAgentationServer({ cwd, port });

console.log(`[agentation] listening at ${coordinator.url}`);
console.log(`[agentation] parent session: ${coordinator.parentSession}`);

let shuttingDown = false;
async function shutdown() {
  if (shuttingDown) return;
  shuttingDown = true;
  await coordinator.close();
  process.exitCode = 0;
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
