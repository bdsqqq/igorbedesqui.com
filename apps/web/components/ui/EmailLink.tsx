"use client";

import { EnvelopeClosedIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover";
import { Button } from "~/routes/library/button/-button";
import { CopyButton, type CopyButtonProps } from "./CopyButton";
import type { UnstyledLinkProps } from "./primitives/UnstyledLink";
import Tooltip from "@/components/ui/Tooltip";
import { UnstyledLink } from "@/components/ui/primitives";
import { cn } from "@/lib/styling";
import type { ComponentProps, ReactNode } from "react";
import type { OpenStateProps } from "./ownership";

export type EmailContentProps = Omit<ComponentProps<"div">, "children"> & {
  email: string;
  copyButtonProps?: Omit<CopyButtonProps, "contentToCopy">;
  sendLinkProps?: Omit<UnstyledLinkProps, "href" | "children">;
};

/** Portable content: the surrounding page or interactive overlay owns dismissal. */
export function EmailPopoverContent({
  email,
  className,
  copyButtonProps,
  sendLinkProps,
  ...props
}: EmailContentProps) {
  const {
    className: copyClassName,
    size = "md",
    "aria-label": label = "Copy email address",
    ...copyProps
  } = copyButtonProps ?? {};
  return (
    <div
      {...props}
      className={cn("ak-frame ak-frame-field/0 ak-frame-row flex", className)}
    >
      <CopyButton
        {...copyProps}
        contentToCopy={email}
        size={size}
        className={cn("ak-frame-cover ak-frame-start", copyClassName)}
        aria-label={label}
      />
      <span className="self-center px-2 py-1">{email}</span>
      <Tooltip
        content={
          <span className="text-sm italic tracking-[0.2px] ak-ink-70">
            Send an email
          </span>
        }
        options={{ size: "sm" }}
      >
        <Button
          className="ak-frame-cover ak-frame-end"
          aria-label="Send an email"
          icon={<PaperPlaneIcon />}
          render={<UnstyledLink {...sendLinkProps} href={`mailto:${email}`} />}
        />
      </Tooltip>
    </div>
  );
}

export type EmailLinkProps = OpenStateProps & {
  email?: string;
  children: ReactNode;
  triggerProps?: Omit<
    ComponentProps<typeof PopoverTrigger>,
    "asChild" | "children"
  >;
  contentProps?: Omit<ComponentProps<typeof PopoverContent>, "children">;
  bodyProps?: Omit<EmailContentProps, "email">;
};

export default function EmailLink({
  email = "igorbedesqui@gmail.com",
  children,
  triggerProps,
  contentProps,
  bodyProps,
  ...state
}: EmailLinkProps) {
  return (
    <Popover {...state}>
      <PopoverTrigger
        {...triggerProps}
        className={cn(
          "inline-flex items-center gap-1 underline underline-offset-2 ak-ink-80 hover:ak-ink-100 focus-visible:ak-ink-100 data-[state=open]:ak-ink-100 aria-expanded:ak-ink-100 focus-visible:ak-outline focus-visible:ak-outline-primary focus-visible:outline-2 focus-visible:outline-offset-2",
          triggerProps?.className,
        )}
      >
        {children} <EnvelopeClosedIcon />
      </PopoverTrigger>
      <PopoverContent
        sideOffset={0}
        options={{ padding: "none", maxW: "full", bg: "standard" }}
        {...contentProps}
        className={cn("overflow-visible", contentProps?.className)}
      >
        <EmailPopoverContent {...bodyProps} email={email} />
      </PopoverContent>
    </Popover>
  );
}
