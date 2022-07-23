interface Tooltip {
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

const Tooltip: React.FC<Tooltip> = ({ children, content, options }) => {
  const tooltipState = useTooltipState({
    animated: true,
    placement: options?.side ?? "top",
    gutter: 0,
    timeout: 200,
  });

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
        data-dir={options?.side || "top"}
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
  borderRadius: "$sm",

  "&:focus-within": {
    outline: "none",
  },

  "@motionOk": {
    opacity: 0,

    '&[data-dir="top"]': {
      transformOrigin: "bottom center",

      "&[data-enter]": {
        opacity: 1,
        animationDuration: duration.fast02,
        animationTimingFunction: timingFunction.productive.entrance,
        animationName: scaleInSlideUp,
      },

      "&[data-leave]": {
        animationDuration: duration.fast02,
        animationTimingFunction: timingFunction.productive.exit,
        animationName: scaleOutSlideDown,
      },
    },

    '&[data-dir="bottom"]': {
      transformOrigin: "top center",

      "&[data-enter]": {
        opacity: 1,
        animationDuration: duration.fast02,
        animationTimingFunction: timingFunction.productive.entrance,
        animationName: scaleInSlideDown,
      },

      "&[data-leave]": {
        animationDuration: duration.fast02,
        animationTimingFunction: timingFunction.productive.exit,
        animationName: scaleOutSlideUp,
      },
    },
  },

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
import {
  scaleInSlideDown,
  scaleInSlideUp,
  scaleOutSlideDown,
  scaleOutSlideUp,
  timingFunction,
  duration,
} from "@/animations";

export default Tooltip;

import { cloneElement } from "react";
import {
  Tooltip as AriaKitTooltip,
  TooltipAnchor,
  useTooltipState,
  TooltipArrow as AriaKitTooltipArrow,
} from "ariakit/tooltip";
