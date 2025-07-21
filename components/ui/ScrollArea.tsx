"use client";

import * as React from "react";
import { ScrollArea as BaseScrollArea } from "@base-ui-components/react/scroll-area";

import { cn } from "@/lib/styling";

const ScrollArea = React.forwardRef<
  React.ElementRef<typeof BaseScrollArea.Root>,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Root>
>(({ className, children, ...props }, ref) => (
  <BaseScrollArea.Root
    ref={ref}
    className={cn("relative overflow-hidden", className)}
    {...props}
  >
    <BaseScrollArea.Viewport className="h-full w-full rounded-[inherit]">
      {children}
    </BaseScrollArea.Viewport>
    <ScrollBar />
    <BaseScrollArea.Corner />
  </BaseScrollArea.Root>
));
ScrollArea.displayName = BaseScrollArea.Root.displayName;

const ScrollBar = React.forwardRef<
  React.ElementRef<typeof BaseScrollArea.Scrollbar>,
  React.ComponentPropsWithoutRef<typeof BaseScrollArea.Scrollbar>
>(({ className, orientation = "vertical", ...props }, ref) => (
  <BaseScrollArea.Scrollbar
    ref={ref}
    orientation={orientation}
    className={cn(
      "flex touch-none select-none transition-colors",
      orientation === "vertical" &&
        "h-full w-2.5 border-l border-l-transparent p-[1px]",
      orientation === "horizontal" &&
        "h-2.5 flex-col border-t border-t-transparent p-[1px]",
      className,
    )}
    {...props}
  >
    <BaseScrollArea.Thumb className="bg-gray-09 relative flex-1 rounded-full" />
  </BaseScrollArea.Scrollbar>
));
ScrollBar.displayName = BaseScrollArea.Scrollbar.displayName;

const ScrollAreaCorner = BaseScrollArea.Corner;

export { ScrollArea, ScrollBar, ScrollAreaCorner };
