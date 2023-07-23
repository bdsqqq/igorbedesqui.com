import { Popover } from "@/ui/Popover";
import React, {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
} from "react";

/**
 * @see: https://github.com/radix-ui/primitives/pull/2234#issuecomment-1613000587
 */
export const Lock = forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    locked: boolean;
    lockedFeedback: React.ReactNode;
  }>
>(({ children, locked, lockedFeedback, ...rest }, ref) => {
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
      <Popover.Trigger asChild {...rest} ref={ref}>
        {cloneElement(child, { onClick: () => {} })}
      </Popover.Trigger>
      <Popover.Content align="end">{lockedFeedback}</Popover.Content>
    </Popover>
  );
});
Lock.displayName = "Lock";
