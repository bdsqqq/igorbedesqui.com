import type * as React from "react";
import { cn } from "@/lib/styling";

function ScrollArea({
  className,
  children,
  style,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      tabIndex={0}
      className={cn("relative overflow-auto [scrollbar-width:thin]", className)}
      style={{ scrollbarColor: "var(--gray-09) transparent", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollArea };
