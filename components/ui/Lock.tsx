import Popover from "@/ui/Popover";
import React from "react";

/**
 * @see: https://github.com/radix-ui/primitives/pull/2234#issuecomment-1613000587
 */
export const Lock = React.forwardRef<
  HTMLButtonElement,
  React.PropsWithChildren<{
    locked: boolean;
    lockedFeedback: React.ReactNode;
  }>
>(({ children, locked, lockedFeedback, ...rest }, ref) => {
  const child = React.Children.only(children);
  if (!locked) return <>{child}</>;

  // Not too happy about this bit, but it makes sure cloneElement gets a valid element (not a string and other misc types allowed by ReactNode)
  const isValid = React.isValidElement<
    HTMLButtonElement & { onClick?: () => void }
  >(child);
  if (!isValid)
    throw new Error(
      `LockWithoutSlot's child must be a valid react element, see: `
    );

  return (
    <Popover
      content={lockedFeedback}
      Icon={React.Fragment}
      // TODO: react fragment can't receive className, so I can't really have this with NO icon. Make it optional somehow.
    >
      {React.cloneElement(child, { onClick: () => {} })}
    </Popover>
  );
});
Lock.displayName = "LockWithoutSlot";
