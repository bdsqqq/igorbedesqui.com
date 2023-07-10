"use client";

import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";

import { cn } from "@/lib/styling";
import { VariantProps, cva } from "class-variance-authority";
import { Border } from "./Border";

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.PropsWithoutRef<
    PopoverPrimitive.PopoverContentProps & {
      options?: VariantProps<typeof tooltipVariants>;
    }
  >
>(({ className, align = "end", sideOffset = 4, options, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <Border>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn(tooltipVariants(options), className)}
        {...props}
      />
    </Border>
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export { Popover, PopoverTrigger, PopoverContent };

const tooltipVariants = cva(
  [
    "w-72 rounded shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 duration-fast-02 data-[state=closed]:ease-productive-exit data-[state=open]:ease-productive-enter data-[state=closed]:opacity-0 data-[state=open]:opacity-100 transition-opacity",
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
