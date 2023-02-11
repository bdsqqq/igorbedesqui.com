const variants = {
  base: "cursor-pointer select-none appearance-none inline-flex items-center gap-2 border  rounded-sm tracking-normal py-1 px-2 align-middle motion-safe:duration-moderate-01 motion-safe:ease-productive-standard outline-none focus-within:outline-none",
  size: {
    sm: "text-sm",
    md: "text-base",
    lg: "text-xl",
  },
  color: {
    gray: "text-gray-11 bg-gray-1 border-gray-7 hover:text-gray-12 hover:bg-gray-2 hover:border-gray-9 focus-within:text-gray-12 focus-within:bg-gray-2 focus-within:border-gray-9 active:bg-gray-3 active:border-gray-10",
  },
};

type variants = { size?: "sm" | "md" | "lg"; color?: "crimson" | "gray" };

const Button: React.FC<React.PropsWithChildren<ButtonProps & variants>> = ({
  size = "lg",
  color = "gray",
  children,
  className,
  ...rest
}) => (
  <button
    className={cx(
      variants.base,
      variants.size[size],
      variants.color[color],
      className
    )}
    {...rest}
  >
    {children}
  </button>
);
// I don't know what type should go here and I'm tired, htmlhtml works
const LinkButton: React.FC<HtmlHTMLAttributes<{}> & LinkProps & variants> = ({
  size = "lg",
  color = "gray",
  children,
  className,
  ...rest
}) => (
  <UnstyledLink
    className={cx(
      variants.base,
      variants.size[size],
      variants.color[color],
      className
    )}
    {...rest}
  >
    {children}
  </UnstyledLink>
);

export { Button, LinkButton };

import { UnstyledLink } from "./primitives";
import type { LinkProps } from "next/link";
import { cx } from "class-variance-authority";
import { ButtonProps } from "ariakit";
import React, { HtmlHTMLAttributes } from "react";
