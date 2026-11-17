/** The browser adapter is resolved per invocation, never during import or render. */
export type ClipboardWriter = Pick<Clipboard, "writeText">;
export type CopyResult =
  | { status: "success" }
  | { status: "error"; reason: "unavailable" | "write-failed"; error: unknown };

/** Expected adapter rejection is data; a synchronous adapter bug still rejects. */
export async function copyText(
  text: string,
  clipboard: ClipboardWriter | undefined = globalThis.navigator?.clipboard,
): Promise<CopyResult> {
  if (!clipboard)
    return {
      status: "error",
      reason: "unavailable",
      error: new Error("Clipboard is unavailable in this browser context"),
    };
  const pending = clipboard.writeText(text);
  try {
    await pending;
    return { status: "success" };
  } catch (error) {
    return { status: "error", reason: "write-failed", error };
  }
}
