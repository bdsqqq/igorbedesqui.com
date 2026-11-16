"use client";

import * as React from "react";
import * as Ariakit from "@ariakit/react";
import { cn } from "@/lib/styling";
import { type VariantProps, cva } from "class-variance-authority";

const PopoverModalContext = React.createContext(false);

function Popover({
  children,
  open,
  defaultOpen,
  onOpenChange,
  modal = false,
}: React.PropsWithChildren<{
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  modal?: boolean;
}>) {
  return (
    <Ariakit.PopoverProvider
      open={open}
      defaultOpen={defaultOpen}
      setOpen={onOpenChange}
    >
      <PopoverModalContext value={modal}>{children}</PopoverModalContext>
    </Ariakit.PopoverProvider>
  );
}

function PopoverTrigger({
  asChild,
  children,
  ...props
}: Ariakit.PopoverDisclosureProps & { asChild?: boolean }) {
  const store = Ariakit.usePopoverContext();
  const open = Ariakit.useStoreState(store, "open");
  return (
    <Ariakit.PopoverDisclosure
      data-state={open ? "open" : "closed"}
      {...props}
      render={
        asChild
          ? (React.Children.only(children) as React.ReactElement)
          : props.render
      }
    >
      {asChild ? undefined : children}
    </Ariakit.PopoverDisclosure>
  );
}

function StyledPopoverTrigger({
  className,
  ...props
}: React.ComponentProps<typeof PopoverTrigger>) {
  return (
    <PopoverTrigger
      className={cn(
        "ak-ink-80 inline-flex items-center gap-1 underline underline-offset-2 hover:ak-ink-100 focus-visible:ak-ink-100 data-[state=open]:ak-ink-100",
        className,
      )}
      {...props}
    />
  );
}

function PopoverContent({
  className,
  align = "center",
  side = "top",
  sideOffset = 4,
  alignOffset = 0,
  avoidCollisions = true,
  collisionPadding = 0,
  options,
  ...props
}: Ariakit.PopoverProps & {
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionPadding?: number;
  options?: VariantProps<typeof tooltipVariants>;
}) {
  const store = Ariakit.usePopoverContext();
  const modal = React.useContext(PopoverModalContext);
  const open = Ariakit.useStoreState(store, "open");
  const currentPlacement = Ariakit.useStoreState(store, "currentPlacement");
  const placement = align === "center" ? side : (`${side}-${align}` as const);
  // Placement belongs to the store so disclosure and collision handling agree.
  React.useLayoutEffect(() => {
    store?.setState("placement", placement);
  }, [store, placement]);
  return (
    <Ariakit.Popover
      portal
      unmountOnHide
      modal={modal}
      backdrop={false}
      gutter={sideOffset}
      shift={align === "center" ? 0 : alignOffset}
      flip={avoidCollisions}
      slide={avoidCollisions}
      overflowPadding={collisionPadding}
      data-state={open ? "open" : "closed"}
      data-side={currentPlacement?.split("-")[0] ?? side}
      className={cn(tooltipVariants(options), className)}
      {...props}
    />
  );
}

export { Popover, PopoverTrigger, PopoverContent, StyledPopoverTrigger };

const tooltipVariants = cva(
  "surface-popover ak-layer ak-frame ak-frame-card ak-frame-border ak-edge-15 shadow-md outline-none z-10",
  {
    variants: {
      bg: { standard: "ak-layer-lighten-6", subtle: "ak-layer-canvas" },
      padding: {
        none: "ak-frame-p-0",
        sm: "ak-frame-p-0.5 px-1",
        md: "ak-frame-p-1 px-2",
        lg: "ak-frame-p-card",
      },
      maxW: { full: "max-w-full", md: "max-w-[16rem]" },
    },
    defaultVariants: { bg: "standard", maxW: "md", padding: "lg" },
  },
);
