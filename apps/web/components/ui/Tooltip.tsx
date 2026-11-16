"use client";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import {
  Tooltip as AriaKitTooltip,
  TooltipAnchor,
  TooltipProvider,
  TooltipArrow,
  useTooltipStore,
  useStoreState,
} from "@ariakit/react";

interface Tooltip {
  children: React.ReactElement;
  content: React.ReactNode;
  options?: VariantProps<typeof tooltipVariants> & {
    side?: "bottom" | "left" | "right" | "top" | undefined;
  };
}

function Tooltip({ children, content, options }: Tooltip) {
  const store = useTooltipStore({
    placement: options?.side ?? "top",
    showTimeout: 200,
  });
  const placement = useStoreState(store, "currentPlacement");
  return (
    <TooltipProvider store={store}>
      <TooltipAnchor render={children} />
      <AriaKitTooltip
        portal
        gutter={0}
        className={tooltipVariants({
          bg: options?.bg,
          maxW: options?.maxW,
          size: options?.size,
        })}
        data-side={placement.split("-")[0]}
      >
        {content}
        <TooltipArrow className="stroke-(--ak-edge) drop-shadow-sm" />
      </AriaKitTooltip>
    </TooltipProvider>
  );
}

const tooltipVariants = cva(
  [
    "surface-tooltip ak-layer ak-frame ak-frame-field ak-frame-border ak-edge-20 shadow-sm",
  ],
  {
    variants: {
      bg: {
        standard: "ak-layer-lighten-6",
        subtle: "ak-layer-canvas",
      },
      size: {
        sm: "text-sm ak-frame-p-0.5 px-1",
        md: "text-base ak-frame-p-1 px-2",
      },
      maxW: {
        full: "max-w-full",
        md: "max-w-[16rem]",
      },
    },
    defaultVariants: {
      bg: "standard",
      size: "md",
      maxW: "md",
    },
  },
);

export default Tooltip;
