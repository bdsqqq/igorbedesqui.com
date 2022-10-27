import * as PopoverPrimitive from "@radix-ui/react-popover";
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";
interface PopOver {
  content: React.ReactNode;
  questionMark?: boolean;
  icon?: React.ReactNode;
  options?: {
    dark?: boolean;
    softBg?: boolean;
    side?: "bottom" | "left" | "right" | "top" | undefined;
    padding?: "none" | "sm" | "md" | undefined;
    noMaxWidth?: boolean;
  };
}

const PopOver: React.FC<PopOver> = ({
  children,
  content,
  questionMark = true,
  icon,
  options,
}) => (
  <PopoverPrimitive.Root>
    <PopOverTrigger>
      {children} {icon ? icon : questionMark && <QuestionMarkCircledIcon />}
    </PopOverTrigger>
    <PopOverContent
      padding={options?.padding}
      noMaxWidth={options?.noMaxWidth}
      softBg={options?.softBg}
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

  display: "inline",
  userSelect: "text",

  fontWeight: "bold",

  "@motionOk": {
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",

    "& > svg": {
      transitionDuration: "150ms",
      transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",
    },
  },

  "&:hover, &:focus-within": {
    color: "$crimson11",

    "& > svg": {
      color: "$crimson11",
    },
  },

  "& > svg": {
    display: "inline",
    color: "$mauve11",
  },

  '&[data-state="open"]': {
    color: "$crimson11",

    "& > svg": {
      color: "$crimson11",
    },
  },
});

const PopOverContent = styled(PopoverPrimitive.Content, {
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

  '&[data-side="top"]': { animationName: `${scaleIn}, ${slideUp}` },
  '&[data-side="bottom"]': { animationName: `${scaleIn}, ${slideDown}` },

  '&[data-state="closed"]': {
    animationName: scaleOut,
    animationTimingFunction: "cubic-bezier(0.2, 0, 1, 0.9)",
  },

  animationDuration: "0.15s",
  animationTimingFunction: "cubic-bezier(0, 0, 0.38, 0.9)",

  transformOrigin: "var(--radix-hover-card-content-transform-origin)",

  variants: {
    padding: {
      none: { padding: "0", borderWidth: "0px" },
      sm: { padding: "0.5rem" },
      md: { padding: "1rem" },
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

const PopOverArrow = styled(PopoverPrimitive.Arrow, {
  fill: "$mauve3",

  strokeWidth: "1px",
  stroke: "$mauve7",

  filter:
    "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1)) drop-shadow(0 1px 1px rgba(0, 0, 0, 0.06))",
});

import { styled } from "stitches.config";
import { scaleIn, scaleOut, slideDown, slideUp } from "@/animations";
