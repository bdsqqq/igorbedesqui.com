import * as PopoverPrimitive from "@radix-ui/react-popover";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
interface PopOver {
  content: React.ReactNode;
  dark?: boolean;
  questionMark?: boolean;
  icon?: React.ReactNode;
  options?: {
    side?: "bottom" | "left" | "right" | "top" | undefined;
    condensed?: boolean;
    noMaxWidth?: boolean;
  };
}

const PopOver: React.FC<PopOver> = ({
  children,
  content,
  dark,
  questionMark = true,
  icon,
  options,
}) => (
  <PopoverPrimitive.Root>
    <PopOverTrigger>
      {children}
      {icon ? icon : questionMark && <QuestionMarkCircledIcon />}
    </PopOverTrigger>
    <PopOverContent
      className={dark ? darkTheme : ""}
      condensed={options?.condensed}
      noMaxWidth={options?.noMaxWidth}
      side={options?.side || "top"}
    >
      {content}
      <PopOverArrow />
    </PopOverContent>
  </PopoverPrimitive.Root>
);

export default PopOver;

const PopOverTrigger = styled(PopoverPrimitive.Trigger, {
  all: "unset",
  cursor: "pointer",

  display: "inline-flex",
  userSelect: "text",

  fontWeight: "bold",

  transitionDuration: "150ms",
  transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

  "&:hover, &:focus-within": {
    color: "$crimson11",
  },

  '&[data-state="open"]': {
    color: "$crimson11",
  },
});

const PopOverContent = styled(PopoverPrimitive.Content, {
  position: "relative",

  padding: "1rem",
  maxWidth: "16rem",

  background: "$mauve3",
  color: "$mauve12",

  boxShadow:
    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",

  borderWidth: "1px",
  borderStyle: "solid",
  borderColor: "$mauve7",
  borderRadius: "2px",

  '&[data-side="top"]': { animationName: `${slideUp}, ${scaleIn}` },
  '&[data-side="bottom"]': { animationName: `${slideDown}, ${scaleIn}` },

  '&[data-state="closed"]': {
    animationName: scaleOut,
    animationTimingFunction: "cubic-bezier(0.2, 0, 1, 0.9)",
  },

  animationDuration: "0.15s",
  animationTimingFunction: "cubic-bezier(0, 0, 0.38, 0.9)",

  transformOrigin: "var(--radix-hover-card-content-transform-origin)",

  variants: {
    condensed: {
      true: {
        padding: "0.5rem",
      },
    },
    noMaxWidth: {
      true: {
        maxWidth: "none",
      },
    },
  },
});

const PopOverArrow = styled(PopoverPrimitive.Arrow, {
  fill: "$mauve3",

  strokeWidth: "1px",
  stroke: "$mauve7",

  filter:
    "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06))",
});

import { styled, darkTheme } from "stitches.config";
import { scaleIn, scaleOut, slideDown, slideUp } from "@/animations";
