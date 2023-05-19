const variants = cva(
  cn(
    "select-none appearance-none",
    "relative rounded-sm px-2 py-1 inline-flex items-center gap-2 align-middle outline-none focus-within:outline-none",
    "motion-safe:duration-fast-01 motion-safe:ease-expressive-standard transition-all",
    "border",
    "shadow-input ",
    "bg-gradient-to-tr",
    "active:scale-95",
    "before:absolute before:inset-0 before:rounded before:shadow-lg before:shadow-gray-0/50 before:transition-all before:motion-safe:duration-fast-02 before:motion-safe:ease-expressive-standard"
  ),
  {
    variants: {
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-xl",
      },
      intent: {
        primary: cn(
          "border-gray-A4",
          "shadow-gray-A3",
          "from-gray-A2 to-gray-A4",
          "hover:border-gray-A8",
          "focus-visible:border-gray-A8"
        ),
      },
    },
  }
);

type variants = VariantProps<typeof variants>;

const Button: React.FC<React.PropsWithChildren<ButtonProps & variants>> = ({
  size = "lg",
  intent = "primary",
  children,
  className,
  ...rest
}) => (
  <button
    className={cn(
      variants({
        size,
        intent,
      }),
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
  intent = "primary",
  children,
  className,
  ...rest
}) => (
  <UnstyledLink
    className={cn(
      variants({
        size,
        intent,
      }),
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
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styling";
import { ButtonProps } from "ariakit";
import React, { HtmlHTMLAttributes } from "react";
