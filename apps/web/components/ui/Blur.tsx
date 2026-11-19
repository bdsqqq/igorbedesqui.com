import { cn } from "@/lib/styling";
import { HTMLProps } from "react";

/** Optional asides are deliberately obscured before interaction; opacity-based paint
 * avoids turning that hidden state into normal readable ink via the contrast floor. */
export const Blur = ({
  tabIndex,
  className,
  focusable = true,
  ...rest
}: { focusable?: boolean } & HTMLProps<HTMLSpanElement>) => (
  <span
    tabIndex={tabIndex ?? (focusable ? 0 : -1)}
    className={cn(
      "group/blur [:where(&)]:[color:color-mix(in_oklab,var(--ak-text)_15%,transparent)] blur-sm filter transition-[filter,color] duration-moderate-02 ease-productive-standard focus-within:ak-ink-60 dark:focus-within:ak-ink-70 focus-within:blur-none hover:ak-ink-60 dark:hover:ak-ink-70 hover:blur-none focus:ak-ink-60 dark:focus:ak-ink-70 focus:blur-none",
      className,
    )}
    {...rest}
  />
);
