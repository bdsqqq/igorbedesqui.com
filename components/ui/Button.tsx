const buttonVariants = cva(
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
    defaultVariants: {
      size: "md",
      intent: "primary",
    },
  }
);

type ButtonVariants = VariantProps<typeof buttonVariants>;

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variants?: ButtonVariants;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variants, asChild, ...rest }, ref) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({
            ...variants,
          }),
          className
        )}
        {...rest}
      />
    );
  }
);
Button.displayName = "Button";

// I don't know what type should go here and I'm tired, htmlhtml works
const LinkButton: React.FC<
  HtmlHTMLAttributes<{}> & LinkProps & { variants?: ButtonVariants }
> = ({ variants, ...rest }) => (
  <Button variants={variants} asChild>
    <UnstyledLink {...rest} />
  </Button>
);

export { Button, LinkButton };

import { UnstyledLink } from "./primitives";
import type { LinkProps } from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styling";
import React, { HtmlHTMLAttributes } from "react";
import { Slot } from "@radix-ui/react-slot";
