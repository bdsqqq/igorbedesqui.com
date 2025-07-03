"use client";

import * as React from "react";
import { Separator as BaseSeparator } from "@base-ui-components/react/separator";
import { cn } from "@/lib/styling";

const Separator = React.forwardRef<
  HTMLHRElement,
  React.ComponentPropsWithoutRef<typeof BaseSeparator> & {
    decorative?: boolean;
  }
>(
  (
    { className, orientation = "horizontal", decorative = true, ...props },
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
Separator.displayName = "Separator";

export { Separator };
