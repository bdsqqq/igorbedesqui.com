export const buttonVariants = cva(
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

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants> & { asChild?: boolean }
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, intent, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ intent, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export type LinkButtonProps = UnstyledLinkProps & VariantProps<typeof buttonVariants>
export const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, intent, size, ...props }, ref) => {
    return (
      <UnstyledLink
        className={cn(buttonVariants({ intent, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
LinkButton.displayName = "LinkButton"

import React, { HtmlHTMLAttributes } from "react";
import { UnstyledLink, UnstyledLinkProps } from "@/ui/primitives/UnstyledLink";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styling";
import { Slot } from "@radix-ui/react-slot";
