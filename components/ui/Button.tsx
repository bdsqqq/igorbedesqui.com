const buttonCss = {
  // mini reset
  cursor: "pointer",
  userSelect: "none",
  appearance: "none",

  display: "inline-flex",
  alignItems: "center",
  gap: "0.5rem",

  borderStyle: "solid",
  borderWidth: "1px",
  borderColor: "transparent",
  borderRadius: "$sm",

  fontSize: "$lg",
  lineHeight: "$lg",
  letterSpacing: "$normal",

  py: "0.25rem",
  px: "0.5rem",
  verticalAlign: "middle",

  "@motionOk": {
    transitionDuration: "150ms",
    transitionTimingFunction: "cubic-bezier(0.4, 0.14, 0.3, 1)",
  },

  "&:hover, &:focus-within": {
    outline: "none",
  },

  variants: {
    size: {
      sm: {
        fontSize: "$sm",
        lineHeight: "$sm",
      },
      md: {
        fontSize: "$md",
        lineHeight: "$md",
      },
      lg: {
        fontSize: "$lg",
        lineHeight: "$lg",
      },
    },
    color: {
      mauve: {
        color: "$mauve12",
        backgroundColor: "$mauve3",
        borderColor: "$mauve7",

        "&:hover, &:focus-within": {
          backgroundColor: "$mauve5",
          borderColor: "$mauve9",
        },

        "&:active": {
          backgroundColor: "$mauve7",
          borderColor: "$mauve10",
        },
      },
      crimson: {
        color: "$crimson12",
        backgroundColor: "$crimson3",
        borderColor: "$crimson7",

        "&:hover, &:focus-within": {
          backgroundColor: "$crimson4",
          borderColor: "$crimson9",
        },
        "&:active": {
          backgroundColor: "$crimson6",
          borderColor: "$crimson10",
        },
      },
    },
  },

  defaultVariants: {
    color: "mauve",
    size: "lg",
  },
};

const Button = styled("button", buttonCss);
const LinkButton = styled(UnstyledLink, buttonCss);

export { Button, LinkButton };

import { styled } from "stitches.config";
import { UnstyledLink } from "./primitives";
