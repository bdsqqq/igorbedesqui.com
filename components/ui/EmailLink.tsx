"use client";

// Having email links in the UI is a bit of a pain, I never know what is the expected behavior.
// - The label should be "arbitraty" or the email address itself?
// - Should I assume the user wants to copy the email address or open it in an email client?
// This component should allow the user to choose the behavior.

// I want this component to:
// ✓ render inline so I can use it anywhere.
// - onClick, open a popover with:
// ✓ - The email address as text
// ✓ - A button to copy the email address
// ✓ - - Provide feedback
// ✓ - A button to open the email in an email client
// - - - custom subject and sample body to allow i18n (better UX for PT users)
// - - - - ? Does this mean I should expose props so I can use specific subjects/sample messages?

const EmailLink = ({
  email = "igorbedesqui@gmail.com",
  children,
}: {
  email?: string;
  children: React.ReactNode;
}) => {
  return (
    <PopoverProvider>
      <PopoverTrigger className="inline-flex items-center gap-1 underline hover:text-gray-12 focus:text-gray-12">
        {children} <EnvelopeClosedIcon />
      </PopoverTrigger>
      <PopoverContent
        className="overflow-visible"
        gutter={0}
        options={{
          padding: "none",
          maxW: "full",
          bg: "standard",
        }}
      >
        <EmailPopoverContent email={email} />
      </PopoverContent>
    </Popover>
  );
};

const EmailPopoverContent = ({ email }: { email: string }) => {
  const [success, setSuccess] = useState(0);
  const incrementSuccess = () => {
    setSuccess((s) => s + 1);
  };

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
    <div className="flex">
      <Tooltip
        content={
          <span className="text-sm italic tracking-[0.2px] text-gray-11">
            Copy to clipboard
          </span>
        }
        options={{ size: "sm" }}
      >
        <Button
          className="-my-[1px] -ml-[1px] rounded-l-sm rounded-r-none"
          onClick={() => {
            if (!navigator.clipboard) {
              console.log(
                "no clipboard! This api requires https on chrome so if you're on localhost I'm sorry",
              );
              return;
            }
            navigator.clipboard.writeText(email).then(incrementSuccess);
          }}
        >
          {success ? <CheckIcon /> : <ClipboardCopyIcon />}
        </Button>
      </Tooltip>
      <span className="p-1 ">{email}</span>
      <Tooltip
        content={
          <span className="text-sm italic tracking-[0.2px] text-gray-11">
            Send an email
          </span>
        }
        options={{ size: "sm" }}
      >
        <LinkButton
          className="-my-[1px] -mr-[1px] rounded-l-none rounded-r-sm"
          href={`mailto:${email}`}
        >
          <PaperPlaneIcon />
        </LinkButton>
      </Tooltip>
    </div>
  );
};

export default EmailLink;

import {
  CheckIcon,
  ClipboardCopyIcon,
  EnvelopeClosedIcon,
  PaperPlaneIcon,
} from "@radix-ui/react-icons";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Button, LinkButton } from "@/components/ui/Button";
import Tooltip from "@/components/ui/Tooltip";

import { useEffect, useState } from "react";
