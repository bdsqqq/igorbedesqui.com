"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/styling";
import { VariantProps, cva } from "class-variance-authority";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.PropsWithoutRef<
    PopoverPrimitive.PopoverContentProps & {
      options?: VariantProps<typeof tooltipVariants>;
    }
  >
>(
  (
    {
      className,
      align = "center",
      side = "top",
      sideOffset = 4,
      options,
      ...props
    },
    ref
    // not using PopoverPrimitive.Portal to wrap everything because it fucks up the exit animation
  ) => (
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      side={side}
      className={cn(tooltipVariants(options), className)}
      {...props}
    />
  )
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };

const tooltipVariants = cva(
  [
    `
    rounded-sm shadow-md outline-none
    border border-gray-A4
    data-[state=open]:animate-in data-[state=closed]:animate-out
    data-[state=closed]:ease-productive-exit data-[state=open]:ease-productive-enter data-[state=open]:duration-fast-01 data-[state=closed]:duration-fast-01 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95  origin-radix-popover data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-out-to-top-1 data-[side=left]:slide-out-to-right-1 data-[side=right]:slide-out-to-left-1 data-[side=top]:slide-out-to-bottom-1
    `,
  ],
  {
    variants: {
      bg: {
        standard: "bg-gray-1",
        subtle: "bg-gray-0",
      },
      padding: {
        none: "p-0",
        sm: "py-0.5 px-1",
        md: "py-1 px-2",
        lg: "p-4",
      },
      maxW: {
        full: "max-w-full",
        md: "max-w-[16rem]",
      },
    },
    defaultVariants: {
      bg: "standard",
      maxW: "md",
      padding: "lg",
    },
  }
);
