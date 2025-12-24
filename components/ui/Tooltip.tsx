"use client";

import type { VariantProps } from "class-variance-authority";
import { cva } from "class-variance-authority";

import {
  Tooltip as AriaKitTooltip,
  TooltipAnchor,
  TooltipProvider,
  TooltipArrow,
} from "@ariakit/react";

interface Tooltip {
  children: React.ReactElement;
  content: React.ReactNode;
  options?: VariantProps<typeof tooltipVariants> & {
    side?: "bottom" | "left" | "right" | "top" | undefined;
  };
}

const Tooltip: React.FC<Tooltip> = ({ children, content, options }) => {
  return (
    <TooltipProvider
      placement={options?.side ?? "top"}
      showTimeout={200}
    >
      <TooltipAnchor render={children} />
      <AriaKitTooltip
        gutter={0}
        className={tooltipVariants({
          bg: options?.bg,
          maxW: options?.maxW,
          size: options?.size,
        })}
        data-dir={options?.side || "top"}
      >
        {content}
        <TooltipArrow className=" stroke-gray-07 drop-shadow-sm filter" />
      </AriaKitTooltip>
    </TooltipProvider>
  );
};

const tooltipVariants = cva(
  [
    "shadow-sm border border-gray-07 rounded-sm transform motion-safe:transition-all duration-fast-02",
    "data-[dir=top]:origin-bottom",
    "data-[dir=bottom]:origin-top",
    "data-[enter]:opacity-100 data-[enter]:translate-y-0 data-[enter]:scale-100 data-[enter]:ease-productive-enter",
    "data-[leave]:opacity-0 data-[leave]:scale-0 data-[leave]:ease-productive-exit",
    "data-[dir=top]:data-[leave]:translate-y-1",
    "data-[dir=bottom]:data-[leave]:-translate-y-1",
  ],
  {
    variants: {
      bg: {
        standard: "bg-gray-01",
        subtle: "bg-gray-00",
      },
      size: {
        sm: ["text-sm", "py-0.5", "px-1"],
        md: ["text-base", "py-1", "px-2"],
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
