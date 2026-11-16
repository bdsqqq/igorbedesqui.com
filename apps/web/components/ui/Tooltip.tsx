"use client";

import * as React from "react";
import * as Ariakit from "@ariakit/react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/styling";
import type { AsChildProps, OpenStateProps } from "./ownership";

type TooltipOptions = VariantProps<typeof tooltipVariants> & {
  side?: "bottom" | "left" | "right" | "top";
};

type TooltipRootProps = Omit<
  Ariakit.TooltipProviderProps,
  "open" | "defaultOpen" | "setOpen" | "store"
> &
  OpenStateProps;

export function TooltipRoot({
  open,
  defaultOpen,
  onOpenChange,
  ...props
}: TooltipRootProps) {
  if (open !== undefined && (defaultOpen !== undefined || !onOpenChange)) {
    throw new Error(
      "TooltipRoot requires onOpenChange with open and forbids defaultOpen with open",
    );
  }
  return (
    <Ariakit.TooltipProvider
      showTimeout={200}
      {...props}
      open={open}
      defaultOpen={defaultOpen}
      setOpen={onOpenChange}
    />
  );
}

export function TooltipTrigger({
  asChild,
  children,
  ...props
}: AsChildProps<React.ComponentPropsWithRef<typeof Ariakit.TooltipAnchor>>) {
  if (asChild && props.render !== undefined)
    throw new Error("TooltipTrigger accepts either asChild or render");
  return (
    <Ariakit.TooltipAnchor
      {...props}
      render={
        asChild
          ? (React.Children.only(children) as React.ReactElement)
          : props.render
      }
    >
      {asChild ? null : children}
    </Ariakit.TooltipAnchor>
  );
}

export function TooltipArrow(
  props: React.ComponentPropsWithRef<typeof Ariakit.TooltipArrow>,
) {
  return (
    <Ariakit.TooltipArrow
      {...props}
      className={cn("stroke-(--ak-edge) drop-shadow-sm", props.className)}
    />
  );
}

type TooltipContentProps = React.ComponentPropsWithRef<
  typeof Ariakit.Tooltip
> & {
  options?: VariantProps<typeof tooltipVariants>;
  arrow?: React.ReactNode;
};

export function TooltipContent({
  options,
  className,
  children,
  arrow = <TooltipArrow />,
  ...props
}: TooltipContentProps) {
  const context = Ariakit.useTooltipContext();
  const store = props.store ?? context;
  const placement = Ariakit.useStoreState(store, "currentPlacement");
  return (
    <Ariakit.Tooltip
      portal
      gutter={0}
      data-side={placement?.split("-")[0]}
      {...props}
      className={cn(tooltipVariants(options), className)}
    >
      {children}
      {arrow}
    </Ariakit.Tooltip>
  );
}

type TooltipProps = OpenStateProps & {
  children: React.ReactElement;
  content: React.ReactNode;
  options?: TooltipOptions;
  triggerProps?: Omit<
    React.ComponentPropsWithRef<typeof Ariakit.TooltipAnchor>,
    "children" | "render"
  >;
  contentProps?: Omit<TooltipContentProps, "children" | "options">;
};

export default function Tooltip({
  children,
  content,
  options,
  triggerProps,
  contentProps,
  ...state
}: TooltipProps) {
  return (
    <TooltipRoot {...state} placement={options?.side ?? "top"}>
      <TooltipTrigger {...triggerProps} render={children} />
      <TooltipContent {...contentProps} options={options}>
        {content}
      </TooltipContent>
    </TooltipRoot>
  );
}

const tooltipVariants = cva(
  [
    "surface-tooltip ak-layer ak-frame ak-frame-field ak-frame-border ak-edge-20 shadow-sm",
  ],
  {
    variants: {
      bg: { standard: "ak-layer-lighten-6", subtle: "ak-layer-canvas" },
      size: {
        sm: "text-sm ak-frame-p-0.5 px-1",
        md: "text-base ak-frame-p-1 px-2",
      },
      maxW: { full: "max-w-full", md: "max-w-[16rem]" },
    },
    defaultVariants: { bg: "standard", size: "md", maxW: "md" },
  },
);
