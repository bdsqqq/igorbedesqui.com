"use client";

import * as React from "react";
import * as Ariakit from "@ariakit/react";
import { cn } from "@/lib/styling";
import { VariantProps, cva } from "class-variance-authority";

const PopoverProvider = ({
  placement = "top",
  ...props
}: React.ComponentProps<typeof Ariakit.PopoverProvider> & {
  placement?: string;
}) => <Ariakit.PopoverProvider placement={placement} {...props} />;

const PopoverTrigger = Ariakit.PopoverDisclosure;
const StyledPopoverTrigger = ({
  className,
  ...rest
}: React.ComponentProps<typeof Ariakit.PopoverDisclosure>) => (
  <Ariakit.PopoverDisclosure
    className={cn(
      `inline-flex items-center gap-1 underline underline-offset-2 hover:text-gray-12 focus-visible:text-gray-12 data-[open="true"]:text-gray-12`,
      className,
    )}
    {...rest}
  />
);
StyledPopoverTrigger.displayName = "PopoverTrigger";

const empty = "" as const;
const PopoverContent = ({
  className,
  gutter = 4,
  options,
  ...props
}: React.ComponentProps<typeof Ariakit.Popover> & {
  options?: VariantProps<typeof tooltipVariants>;
}) => {
  return (
    <Ariakit.Portal>
      <Ariakit.Popover
        gutter={gutter}
        className={cn(tooltipVariants(options), className)}
        {...props}
      />
    </Ariakit.Portal>
  );
};
PopoverContent.displayName = "PopoverContent";

export {
  PopoverProvider,
  PopoverTrigger,
  PopoverContent,
  StyledPopoverTrigger,
};

const tooltipVariants = cva(
  [
    `
    rounded-sm shadow-md outline-none
    border border-gray-A04
    data-[open="true"]:animate-in data-[open="false"]:animate-out
    data-[open="false"]:ease-productive-exit data-[open="true"]:ease-productive-enter data-[open="true"]:duration-fast-01 data-[open="false"]:duration-fast-01 data-[open="true"]:zoom-in-95 data-[open="false"]:fade-out-0 data-[open="false"]:zoom-out-95 origin-[--popover-transform-origin]
    `,
    // `
    // data-[side=bottom]:slide-in-from-top-1 data-[side=left]:slide-in-from-right-1 data-[side=right]:slide-in-from-left-1 data-[side=top]:slide-in-from-bottom-1 data-[side=bottom]:slide-out-to-top-1 data-[side=left]:slide-out-to-right-1 data-[side=right]:slide-out-to-left-1 data-[side=top]:slide-out-to-bottom-1
    // `
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
