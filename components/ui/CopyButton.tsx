"use client";

import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/styling";
import { HTMLProps, useEffect, useState } from "react";

import { CheckIcon, ClipboardCopyIcon } from "@radix-ui/react-icons";
import Tooltip from "@/components/ui/Tooltip";

export const CopyButton = ({
  className,
  contentToCopy,
  ...props
}: { contentToCopy: string } & HTMLProps<HTMLDivElement>) => {
  const [success, setSuccess] = useState(0);
  const incrementSuccess = () => {
    setSuccess((s) => s + 1);
  };

  // could refactor this into making a timeout in the onClick, setting it to a ref and cleaning the timeout based on the ref on unmount.
  useEffect(() => {
    if (!success) return;

    const timeout = setTimeout(() => {
      setSuccess(0);
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [success]);

  return (
    // Can extract tooltip to a parent so it isn't dependent on success state to prevent a rerender. Micro optimization so not doing it rn. Also, could want to update the tooltip depending on success, but would need to announce it to screen readers.
    <Tooltip
      content={
        <span className="text-sm italic tracking-[0.2px] text-gray-11">
          Copy to clipboard
        </span>
      }
      options={{ size: "sm" }}
    >
      <Button
        onClick={() => {
          if (!navigator.clipboard) {
            console.log(
              "no clipboard! This api requires https on chrome so if you're on localhost I'm sorry",
            );
            return;
          }
          navigator.clipboard.writeText(contentToCopy).then(incrementSuccess);
        }}
        size="sm"
        className={className}
      >
        {success ? <CheckIcon /> : <ClipboardCopyIcon />}
      </Button>
    </Tooltip>
  );
};
