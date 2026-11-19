import type * as React from "react";
import { Role } from "@ariakit/react";
import { cn } from "@/lib/styling";

function Separator({
  className,
  orientation = "horizontal",
  decorative = true,
  asChild,
  children,
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
  decorative?: boolean;
  asChild?: boolean;
}) {
  return (
    <Role
      role={decorative ? "none" : "separator"}
      aria-orientation={decorative ? undefined : orientation}
      data-orientation={orientation}
      className={cn(
        "shrink-0 bg-(--ak-edge)",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
      render={asChild ? (children as React.ReactElement) : undefined}
    >
      {asChild ? undefined : children}
    </Role>
  );
}

export { Separator };
