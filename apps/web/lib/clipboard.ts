/** The browser adapter is resolved per invocation, never during import or render. */
export type ClipboardWriter = Pick<Clipboard, "writeText">;

export async function copyText(
  text: string,
  clipboard: ClipboardWriter | undefined = globalThis.navigator?.clipboard,
): Promise<void> {
  if (!clipboard)
    throw new Error("Clipboard is unavailable in this browser context");
  await clipboard.writeText(text);
}
