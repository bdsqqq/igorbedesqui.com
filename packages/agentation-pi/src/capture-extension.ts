import { lstat, open, realpath, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, isAbsolute, relative, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_FILE_BYTES = 1024 * 1024;
const MAX_FILES = 50;
const MAX_TASK_BYTES = 32 * 1024 * 1024;
const MANIFEST_PATH = process.env.AGENTATION_CAPTURE_MANIFEST;

type ToolEvent = {
  toolName: string;
  toolCallId: string;
  input: { path?: unknown };
};
type ExtensionApi = {
  on: (
    name: "tool_call" | "tool_result",
    handler: (event: ToolEvent, context: { cwd: string }) => Promise<unknown>,
  ) => void;
};
type CapturedFile = {
  path: string;
  before: string;
  after: string;
  beforeExists: boolean;
  afterExists: boolean;
  beforeMode?: number;
};

function isInside(root: string, candidate: string): boolean {
  const path = relative(root, candidate);
  return path === "" || (path !== ".." && !path.startsWith(`..${sep}`) && !isAbsolute(path));
}

export function normalizeToolPath(cwd: string, requestedPath: string): string | undefined {
  let normalized = requestedPath.startsWith("@") ? requestedPath.slice(1) : requestedPath;
  if (!normalized || normalized.includes("\0")) return undefined;

  if (normalized === "~") normalized = homedir();
  else if (normalized.startsWith(`~${sep}`) || normalized.startsWith("~/")) {
    normalized = resolve(homedir(), normalized.slice(2));
  } else if (!isAbsolute(normalized) && /^[a-z][a-z0-9+.-]*:/i.test(normalized)) {
    try {
      const url = new URL(normalized);
      if (url.protocol !== "file:") return undefined;
      normalized = fileURLToPath(url);
    } catch {
      return undefined;
    }
  }

  return resolve(cwd, normalized);
}

async function captureTarget(
  realCwd: string,
  absolutePath: string,
): Promise<{ absolutePath: string; path: string; exists: boolean } | undefined> {
  let candidate = absolutePath;
  let exists = true;

  while (true) {
    try {
      const canonicalAncestor = await realpath(candidate);
      const canonicalPath = exists
        ? canonicalAncestor
        : resolve(canonicalAncestor, relative(candidate, absolutePath));
      if (!isInside(realCwd, canonicalPath)) return undefined;
      const path = relative(realCwd, canonicalPath);
      if (!path) return undefined;
      return { absolutePath: canonicalPath, path, exists };
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") return undefined;
      try {
        await lstat(candidate);
        return undefined;
      } catch (lstatError) {
        if ((lstatError as NodeJS.ErrnoException).code !== "ENOENT") return undefined;
      }
      const parent = dirname(candidate);
      if (parent === candidate) return undefined;
      candidate = parent;
      exists = false;
    }
  }
}

async function readText(
  realCwd: string,
  absolutePath: string,
): Promise<{ path: string; text: string; exists: boolean; mode?: number } | undefined> {
  const target = await captureTarget(realCwd, absolutePath);
  if (!target) return undefined;
  if (!target.exists) return { path: target.path, text: "", exists: false };

  try {
    const file = await open(target.absolutePath, "r");
    try {
      const metadata = await file.stat();
      if (!metadata.isFile() || metadata.size > MAX_FILE_BYTES) return undefined;
      const contents = await file.readFile();
      if (contents.length > MAX_FILE_BYTES) return undefined;
      const text = new TextDecoder("utf-8", { fatal: true }).decode(contents);
      return text.includes("\0")
        ? undefined
        : { path: target.path, text, exists: true, mode: metadata.mode & 0o7777 };
    } finally {
      await file.close();
    }
  } catch (error) {
    return (error as NodeJS.ErrnoException).code === "ENOENT"
      ? { path: target.path, text: "", exists: false }
      : undefined;
  }
}

export default function captureExtension(pi: ExtensionApi) {
  if (!MANIFEST_PATH) throw new Error("AGENTATION_CAPTURE_MANIFEST is required");

  const files = new Map<string, CapturedFile>();
  const seenPaths = new Set<string>();
  const toolPaths = new Map<string, { path: string; requestedPath: string }>();
  let taskBytes = 0;
  let queue: Promise<void> = Promise.resolve();

  const serialized = <T>(operation: () => Promise<T>): Promise<T> => {
    const result = queue.then(operation, operation);
    queue = result.then(
      () => undefined,
      () => undefined,
    );
    return result;
  };
  const save = () =>
    writeFile(MANIFEST_PATH, JSON.stringify({ files: [...files.values()] }), {
      encoding: "utf8",
      mode: 0o600,
    });

  pi.on("tool_call", (event, context) =>
    serialized(async () => {
      if (event.toolName !== "edit" && event.toolName !== "write") return undefined;
      const requestedPath = event.input.path;
      if (typeof requestedPath !== "string") return undefined;
      const absolutePath = normalizeToolPath(context.cwd, requestedPath);
      if (!absolutePath) return { block: true, reason: "Unsupported file path" };
      const realCwd = await realpath(context.cwd);
      const target = await captureTarget(realCwd, absolutePath);
      if (!target) return { block: true, reason: "Path must remain inside the working directory" };
      event.input.path = target.absolutePath;

      const retained = files.get(target.path);
      if (retained) {
        toolPaths.set(event.toolCallId, {
          path: target.path,
          requestedPath: target.absolutePath,
        });
        return undefined;
      }
      if (seenPaths.has(target.path)) return undefined;
      seenPaths.add(target.path);
      if (files.size >= MAX_FILES) return undefined;

      const before = await readText(realCwd, target.absolutePath);
      if (!before) return undefined;
      const beforeBytes = Buffer.byteLength(before.text, "utf8");
      if (taskBytes + beforeBytes * 2 > MAX_TASK_BYTES) return undefined;
      files.set(before.path, {
        path: before.path,
        before: before.text,
        after: before.text,
        beforeExists: before.exists,
        afterExists: before.exists,
        ...(before.mode === undefined ? {} : { beforeMode: before.mode }),
      });
      taskBytes += beforeBytes * 2;
      toolPaths.set(event.toolCallId, {
        path: before.path,
        requestedPath: target.absolutePath,
      });
      await save();
      return undefined;
    }),
  );

  pi.on("tool_result", (event, context) =>
    serialized(async () => {
      if (event.toolName !== "edit" && event.toolName !== "write") return undefined;
      const tracked = toolPaths.get(event.toolCallId);
      toolPaths.delete(event.toolCallId);
      if (!tracked) return undefined;
      const retained = files.get(tracked.path);
      if (!retained) return undefined;

      const realCwd = await realpath(context.cwd);
      const after = await readText(realCwd, tracked.requestedPath);
      const previousAfterBytes = Buffer.byteLength(retained.after, "utf8");
      if (!after || after.path !== tracked.path) {
        taskBytes -= Buffer.byteLength(retained.before, "utf8") + previousAfterBytes;
        files.delete(tracked.path);
      } else {
        const afterBytes = Buffer.byteLength(after.text, "utf8");
        const nextBytes = taskBytes - previousAfterBytes + afterBytes;
        if (nextBytes > MAX_TASK_BYTES) {
          taskBytes -= Buffer.byteLength(retained.before, "utf8") + previousAfterBytes;
          files.delete(tracked.path);
        } else {
          retained.after = after.text;
          retained.afterExists = after.exists;
          taskBytes = nextBytes;
        }
      }
      await save();
      return undefined;
    }),
  );
}
