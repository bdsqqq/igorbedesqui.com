import { cn } from "@/lib/styling";
import { HTMLProps } from "react";

export const Blur = ({
  tabIndex,
  className,
  focusable = true,
  ...rest
}: { focusable?: boolean } & HTMLProps<HTMLSpanElement>) => (
  <span
    tabIndex={tabIndex ?? (focusable ? 0 : -1)}
    className={cn(
      "group/blur text-gray-03 blur-sm filter transition-all  duration-moderate-02 ease-productive-standard focus-within:text-gray-11 focus-within:blur-none hover:text-gray-11 hover:blur-none focus:text-gray-11 focus:blur-none",
      className,
    )}
    {...rest}
  />
);
