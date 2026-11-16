"use client";

import { Popover, PopoverContent, PopoverTrigger } from "@/ui/Popover";
import { Role } from "@ariakit/react";
import React, { Children, cloneElement, isValidElement } from "react";

type LockProps = Omit<React.ComponentPropsWithRef<"button">, "children"> & {
  children: React.ReactElement<React.ComponentPropsWithRef<"button">>;
  locked: boolean;
  lockedFeedback: React.ReactNode;
};

/**
 * A locked child's action is intentionally withheld; other events/refs still
 * merge through Ariakit. Put feedback-trigger effects on Lock's onClick.
 */
export function Lock({
  children,
  locked,
  lockedFeedback,
  ...props
}: LockProps) {
  const child = Children.only(children);
  if (!isValidElement(child))
    throw new Error("Lock requires one button element");
  if (!locked) return <Role.button {...props} render={child} />;

  return (
    <Popover>
      <PopoverTrigger
        {...props}
        render={cloneElement(child, { onClick: undefined })}
      />
      <PopoverContent align="end">{lockedFeedback}</PopoverContent>
    </Popover>
  );
}
