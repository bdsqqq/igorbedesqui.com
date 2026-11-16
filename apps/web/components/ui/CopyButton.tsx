"use client";

import { Button, type ButtonProps } from "@/components/ui/Button";
import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import Tooltip from "@/components/ui/Tooltip";
import {
  useCopyText,
  type CopyContent,
  type CopyFeedback,
} from "./use-copy-text";
import type { ReactNode } from "react";

export type CopyButtonProps = ButtonProps &
  CopyFeedback & {
    /** Evaluated on activation so changing data needn't subscribe just to copy. */
    contentToCopy: CopyContent;
    tooltipContent?: ReactNode;
  };

export function CopyButton({
  contentToCopy,
  onCopied,
  onCopyError,
  onClick,
  tooltipContent,
  icon,
  "aria-label": label = "Copy to clipboard",
  size = "sm",
  ...props
}: CopyButtonProps) {
  const { status, copy } = useCopyText({ onCopied, onCopyError });
  const failed = status === "error";
  const feedback = failed ? "Could not copy to clipboard" : "Copy to clipboard";

  return (
    <Tooltip
      content={
        tooltipContent !== undefined && !failed ? (
          tooltipContent
        ) : (
          <span className="text-sm italic tracking-[0.2px] ak-ink-70">
            {feedback}
          </span>
        )
      }
      options={{ size: "sm" }}
    >
      <Button
        {...props}
        size={size}
        icon={
          status === "success" ? (
            <CheckIcon />
          ) : icon !== undefined ? (
            icon
          ) : (
            <ClipboardCopyIcon />
          )
        }
        aria-label={
          status === "success"
            ? "Copied to clipboard"
            : failed
              ? feedback
              : label
        }
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) void copy(contentToCopy);
        }}
      />
    </Tooltip>
  );
}
