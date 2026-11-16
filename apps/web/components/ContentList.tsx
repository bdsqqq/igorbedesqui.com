import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/styling";

/** One shared material; semantic rows inherit its concentric frame geometry. */
export function ContentList({
  className,
  ...props
}: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className={cn(
        "ak-layer ak-layer-lighten-3 ak-frame ak-frame-card/0.5 ak-frame-ring ak-edge-10 pointer-events-none flex flex-col focus-within:ak-ink-70 hover:ak-ink-70 [&>li]:ak-frame [&>li]:ak-frame-field/0",
        className,
      )}
      {...props}
    />
  );
}

export const contentListRow =
  "ak-layer ak-layer-transparent ak-frame ak-frame-field/2 group pointer-events-auto block w-full py-4 transition-colors duration-fast-02 ease-productive-standard hover:ak-state-4 hover:ak-ink-100 focus-within:ak-state-4 focus-within:ak-ink-100 active:ak-state-darken-3";
