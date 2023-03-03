import { cx } from "class-variance-authority";
import { HTMLProps } from "react";

export const Blur = ({
  tabIndex,
  className,
  focusable = true,
  ...rest
}: { focusable?: boolean } & HTMLProps<HTMLSpanElement>) => (
  <span
    tabIndex={tabIndex ?? (focusable ? 0 : -1)}
    className={cx(
      className,
      "text-gray-3 hover:text-gray-11 focus-within:text-gray-11 filter blur-sm  hover:blur-none focus:blur-none focus:text-gray-11 focus-within:blur-none duration-moderate-02 transition-all ease-productive-standard group/blur"
    )}
    {...rest}
  />
);
