import { cn } from "@/lib/styling";
import {
  HTMLProps,
  PropsWithChildren,
  ReactNode,
  cloneElement,
  useEffect,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { Children } from "react";

export const shadowBorderStyles =
  "relative after:pointer-events-none after:absolute after:inset-0 after:block after:rounded-inherit after:shadow-[0px_0px_0px_1px_inset_--tw-shadow-color] after:shadow-gray-A5 overflow-hidden";

export const Border = ({
  children,
  asChild = true,
  className,
  ...rest
}: { children: JSX.Element } & (
  | { className?: string; asChild?: false }
  | { className: never; asChild: true }
)) => {
  if (!asChild)
    return (
      <div className={cn(shadowBorderStyles, className)} {...rest}>
        {children}
      </div>
    );

  if (!children) return <>Border component must have children</>;
  const childrenArray = Children.toArray(children);
  // TODO: wrap this in try
  if (childrenArray.length === 0) {
    console.error("Border component must have children");
    return <>Border component must have children</>;
  }
  if (childrenArray.length > 1) {
    console.error("Border component must have only one child");
    return <>Border component must have only one child</>;
  }

  const safeOnlyChild = childrenArray[0];
  const ChildrenWithBorderStyles = cloneElement(safeOnlyChild, {
    className: cn(safeOnlyChild.props.className, shadowBorderStyles),
  });

  return <Slot>{ChildrenWithBorderStyles}</Slot>;
};
