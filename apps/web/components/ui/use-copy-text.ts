"use client";

import { useEffect, useRef, useState } from "react";
import { copyText, type CopyResult } from "@/lib/clipboard";

export type CopyContent = string | (() => string);
export type CopyFeedback = {
  onCopied?: (text: string) => void;
  onCopyError?: (error: unknown) => void;
};

/** Latest attempt owns feedback; unmount and retries invalidate stale completions. */
export function useCopyText({ onCopied, onCopyError }: CopyFeedback = {}) {
  const [status, setStatus] = useState<
    "idle" | "copying" | "success" | "error"
  >("idle");
  const [error, setError] = useState<unknown>();
  const attempt = useRef(0);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(
    () => () => {
      attempt.current++;
      clearTimeout(timeout.current);
    },
    [],
  );

  async function copy(content: CopyContent) {
    const current = ++attempt.current;
    clearTimeout(timeout.current);
    setError(undefined);
    setStatus("copying");
    const fail = (error: unknown) => {
      if (current !== attempt.current) return;
      setError(error);
      setStatus("error");
      onCopyError?.(error);
    };
    let text: string;
    let result: CopyResult;
    try {
      text = typeof content === "function" ? content() : content;
      result = await copyText(text);
    } catch (error) {
      fail(error);
      return;
    }
    if (current !== attempt.current) return;
    if (result.status === "error") {
      fail(result.error);
      return;
    }
    setStatus("success");
    timeout.current = setTimeout(() => setStatus("idle"), 1000);
    // Consumer effects are separate from clipboard failures.
    onCopied?.(text);
  }

  return { status, error, copy };
}
