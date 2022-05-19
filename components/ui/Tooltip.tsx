interface Tooltip {
  content: React.ReactNode;
  options?: {
    dark?: boolean;
    softBg?: boolean;
    side?: "bottom" | "left" | "right" | "top" | undefined;
    padding?: "none" | "sm" | "md" | undefined;
    noMaxWidth?: boolean;
  };
}

const Tooltip: React.FC<Tooltip> = ({ children, content, options }) => {
  return (
    <RadixTooltip.Provider>
      <RadixTooltip.Root delayDuration={150}>
        <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
        <TooltipContent
          className={options?.dark ? darkTheme : ""}
          padding={options?.padding}
          noMaxWidth={options?.noMaxWidth}
          softBg={options?.softBg}
          side={options?.side || "top"}
        >
          {content}
          <TooltipArrow />
        </TooltipContent>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  );
};

const TooltipContent = styled(RadixTooltip.Content, {
  position: "relative",

  maxWidth: "16rem",

  background: "$mauve3",
  color: "$mauve12",

  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "$mauve7",
  borderRadius: "2px",

  "&:focus-within": {
    outline: "none",
  },

  '&[data-side="top"]': { animationName: `${scaleIn()}, ${slideUp()}` },
  '&[data-side="bottom"]': { animationName: `${scaleIn()}, ${slideDown()}` },

  '&[data-state="closed"]': {
    animationName: scaleOut(),
    animationDuration: "0.15s",
    animationTimingFunction: "cubic-bezier(0.2, 0, 1, 0.9)",
  },

  '&[data-state="delayed-open"]': {
    animationDuration: "0.15s",
  },

  '&[data-state="instant-open"]': {
    animationDuration: "0.15s",
  },

  animationTimingFunction: "cubic-bezier(0, 0, 0.38, 0.9)",

  transformOrigin: "var(--radix-tooltip-content-transform-origin)",

  variants: {
    padding: {
      none: { padding: "0", borderWidth: "0px" },
      sm: { padding: "0.25rem" },
      md: { padding: "0.5rem" },
    },
    noMaxWidth: {
      true: {
        maxWidth: "100%",
      },
    },
    softBg: {
      true: {
        background: "$mauve1",
      },
    },
  },

  defaultVariants: {
    padding: "md",
    noMaxWidth: false,
    softBg: false,
  },
});

const TooltipArrow = styled(RadixTooltip.Arrow, {
  fill: "$mauve3",

  strokeWidth: "1px",
  stroke: "$mauve7",

  filter:
    "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06))",
});

import { styled, darkTheme } from "stitches.config";
import { scaleIn, scaleOut, slideDown, slideUp } from "@/animations";

export default Tooltip;

import * as RadixTooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
