import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/styling";

/** Rows own their interaction states; the list stays on the document plane. */
export function ContentList({
  className,
  ...props
}: ComponentPropsWithoutRef<"ul">) {
  return (
    <ul
      className={cn(
        "pointer-events-none flex flex-col focus-within:ak-ink-70 hover:ak-ink-70",
        className,
      )}
      {...props}
    />
  );
}

export const contentListRow =
  "ak-layer ak-layer-transparent ak-frame ak-frame-field/2 group pointer-events-auto block w-full py-4 transition-colors duration-fast-02 ease-productive-standard hover:ak-state-4 hover:ak-ink-100 focus-within:ak-state-4 focus-within:ak-ink-100 active:ak-state-darken-3";
