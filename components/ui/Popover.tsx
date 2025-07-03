"use client";

import * as React from "react";
import { Popover as BasePopover } from "@base-ui-components/react/popover";

import { cn } from "@/lib/styling";
import { VariantProps, cva } from "class-variance-authority";

const Popover = BasePopover.Root;

const PopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Trigger> & {
    asChild?: boolean;
    children?: React.ReactNode;
  }
>(({ asChild, children, ...props }, ref) => {
  if (asChild && React.isValidElement(children)) {
    return (
      <BasePopover.Trigger
        ref={ref}
        render={React.cloneElement(children as React.ReactElement<any>)}
        {...props}
      />
    );
  }
  
  return (
    <BasePopover.Trigger ref={ref} {...props}>
      {children}
    </BasePopover.Trigger>
  );
});
PopoverTrigger.displayName = "PopoverTrigger";
const StyledPopoverTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentPropsWithoutRef<typeof BasePopover.Trigger>
>(({ className, ...rest }, ref) => (
  <BasePopover.Trigger
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 underline underline-offset-2 hover:text-gray-12 focus-visible:text-gray-12 data-[state=open]:text-gray-12",
      className,
    )}
    {...rest}
  />
));
StyledPopoverTrigger.displayName = "StyledPopoverTrigger";

const PopoverContent = React.forwardRef<
  HTMLDivElement,
  Omit<React.ComponentPropsWithoutRef<typeof BasePopover.Popup>, 'render'> & {
    options?: VariantProps<typeof tooltipVariants>;
    side?: "top" | "right" | "bottom" | "left";
    sideOffset?: number;
    align?: "start" | "center" | "end";
    alignOffset?: number;
  }
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
    ref,
  ) => (
    <BasePopover.Portal>
      <BasePopover.Positioner sideOffset={sideOffset}>
        <BasePopover.Popup
          ref={ref}
          className={cn(tooltipVariants(options), className)}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  ),
);
PopoverContent.displayName = "PopoverContent";

export { Popover, PopoverTrigger, PopoverContent, StyledPopoverTrigger };

const tooltipVariants = cva(
  [
    `
    rounded-sm shadow-md outline-none
    border border-gray-A04
    data-[state=open]:animate-in data-[state=closed]:animate-out
    data-[state=closed]:ease-productive-exit data-[state=open]:ease-productive-enter data-[state=open]:duration-fast-01 data-[state=closed]:duration-fast-01 data-[state=open]:zoom-in-95 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95  origin-radix-popover data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-out-to-top-1 data-[side=left]:slide-out-to-right-1 data-[side=right]:slide-out-to-left-1 data-[side=top]:slide-out-to-bottom-1
    z-10
    `,
  ],
  {
    variants: {
      bg: {
        standard: "bg-gray-01",
        subtle: "bg-gray-00",
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
  },
);
