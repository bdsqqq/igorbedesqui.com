"use client";

import {
  Button,
  isIconObject,
  type ButtonProps,
} from "~/routes/library/button/-button";
import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import Tooltip from "@/components/ui/Tooltip";
import {
  useCopyText,
  type CopyContent,
  type CopyFeedback,
} from "./use-copy-text";
import { useState, type ReactNode } from "react";

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
  const copied = status === "success";
  const [animate, setAnimate] = useState(false);
  // Both layers stay mounted so rapid copies can reverse from the current frame.
  const swap = (source: ReactNode, success: ReactNode = <CheckIcon />) => (
    <span className="copy-feedback" data-animate={animate} aria-hidden="true">
      <span data-visible={!copied}>{source}</span>
      <span data-visible={copied}>{success}</span>
    </span>
  );
  let feedbackIcon: ButtonProps["icon"];
  if (isIconObject(icon)) {
    const checkOnRight = icon.left == null && icon.right != null;
    feedbackIcon = {
      left:
        icon.left === undefined && checkOnRight
          ? undefined
          : swap(icon.left, checkOnRight ? null : <CheckIcon />),
      right:
        icon.right === undefined
          ? undefined
          : swap(icon.right, checkOnRight ? <CheckIcon /> : null),
    };
  } else {
    feedbackIcon = swap(icon === undefined ? <ClipboardCopyIcon /> : icon);
  }
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
        icon={feedbackIcon}
        aria-label={copied ? "Copied to clipboard" : failed ? feedback : label}
        onClick={(event) => {
          onClick?.(event);
          if (!event.defaultPrevented) {
            setAnimate(event.detail > 0);
            void copy(contentToCopy);
          }
        }}
      />
    </Tooltip>
  );
}
