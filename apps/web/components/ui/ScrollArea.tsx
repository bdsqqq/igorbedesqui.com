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
      className={cn(
        "relative overflow-auto [scrollbar-width:thin] focus-visible:ak-outline focus-visible:outline-2 focus-visible:outline-offset-2",
        className,
      )}
      style={{ scrollbarColor: "var(--ak-edge) transparent", ...style }}
      {...props}
    >
      {children}
    </div>
  );
}

export { ScrollArea };
