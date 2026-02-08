import { Popover, PopoverContent, PopoverTrigger } from "@/ui/Popover";
import React, { Children, cloneElement, isValidElement } from "react";

/**
 * @see: https://github.com/radix-ui/primitives/pull/2234#issuecomment-1613000587
 */
export function Lock({
  children,
  locked,
  lockedFeedback,
  ref,
  ...rest
}: React.PropsWithChildren<{
  locked: boolean;
  lockedFeedback: React.ReactNode;
  ref?: React.Ref<HTMLButtonElement>;
}>) {
  const child = Children.only(children);
  if (!locked) return <>{child}</>;

  // Not too happy about this bit, but it makes sure cloneElement gets a valid element (not a string and other misc types allowed by ReactNode)
  const isValid = isValidElement<HTMLButtonElement & { onClick?: () => void }>(
    child
  );
  if (!isValid)
    throw new Error(`Lock's child must be a valid react element, see: `);

  return (
    <Popover>
      <PopoverTrigger asChild {...rest} ref={ref}>
        {cloneElement(child, { onClick: () => {} })}
      </PopoverTrigger>
      <PopoverContent align="end">{lockedFeedback}</PopoverContent>
    </Popover>
  );
}
