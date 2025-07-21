"use client";
// Base UI separator component

import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui-components/react/separator";
import { cn } from "@/lib/styling";

const Separator = React.forwardRef<
  React.ElementRef<typeof BaseSeparator>,
  React.ComponentPropsWithoutRef<typeof BaseSeparator>
>(
  (
    { className, orientation = "horizontal", ...props },
    ref,
  ) => (
    <BaseSeparator
      ref={ref}
      orientation={orientation}
      className={cn(
        "bg-gray-04",
        orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
        className,
      )}
      {...props}
    />
  ),
);
Separator.displayName = BaseSeparator.displayName;

export { Separator };
