import type { ReactElement } from "react";

/** Ownership is fixed at mount; remount to switch controlled/uncontrolled mode. */
export type OpenStateProps =
  | {
      open: boolean;
      onOpenChange: (open: boolean) => void;
      defaultOpen?: never;
    }
  | {
      open?: never;
      defaultOpen?: boolean;
      onOpenChange?: (open: boolean) => void;
    };

/** Ariakit owns merging; asChild is only shorthand for its element render slot. */
export type AsChildProps<
  Props extends { children?: unknown; render?: unknown },
> = Omit<Props, "children" | "render"> &
  (
    | { asChild: true; children: ReactElement; render?: never }
    | {
        asChild?: false;
        children?: Props["children"];
        render?: Props["render"];
      }
  );
