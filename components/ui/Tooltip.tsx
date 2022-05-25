interface TooltipProps {
  children: React.ReactElement;
  content: React.ReactNode;
  options?: {
    dark?: boolean;
    softBg?: boolean;
    side?: "bottom" | "left" | "right" | "top" | undefined;
    padding?: "none" | "sm" | "md" | undefined;
    noMaxWidth?: boolean;
  };
}

const Tooltip = ({ children, content, options }: TooltipProps) => {
  const tooltipState = useTooltipState();

  return (
    <>
      <TooltipAnchor
        {...tooltipState}
        {...children?.props}
        state={tooltipState}
      >
        {(referenceProps: any) => cloneElement(children, referenceProps)}
      </TooltipAnchor>
      <TooltipContent
        state={tooltipState}
        className={options?.dark ? darkTheme : ""}
        padding={options?.padding}
        noMaxWidth={options?.noMaxWidth}
        softBg={options?.softBg}
        dir={options?.side || "top"}
      >
        {content}
        <TooltipArrow />
      </TooltipContent>
    </>
  );
};

const TooltipContent = styled(AriaKitTooltip, {
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

const TooltipArrow = styled(AriaKitTooltipArrow, {
  fill: "$mauve3",

  strokeWidth: "1px",
  stroke: "$mauve7",

  filter:
    "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06))",
});

import { styled, darkTheme } from "stitches.config";
import { scaleIn, scaleOut, slideDown, slideUp } from "@/animations";

export default Tooltip;

import { cloneElement } from "react";
import {
  Tooltip as AriaKitTooltip,
  TooltipAnchor,
  useTooltipState,
  TooltipArrow as AriaKitTooltipArrow,
} from "ariakit/tooltip";
