const buttonCss: Stitches.CSS<typeof config> = {
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

  variants: {
    color: {
      mauve: {
        color: "$mauve12",
        backgroundColor: "$mauve3",
        borderColor: "$mauve7",

        "&:hover, &:focus-within": {
          backgroundColor: "$mauve5",
          borderColor: "$mauve8",
        },

        "&:active": {
          backgroundColor: "$mauve6",
        },
      },
      crimson: {
        color: "$crimson12",
        backgroundColor: "$crimson3",
        borderColor: "$crimson7",

        "&:hover, &:focus-within": {
          backgroundColor: "$crimson4",
          borderColor: "$crimson8",
        },
        "&:active": {
          backgroundColor: "$crimson5",
        },
      },
    },
  },

  defaultVariants: {
    color: "mauve",
  },
};

const Button = styled("button", buttonCss);

const LinkButton = styled(UnstyledLink, buttonCss);

export { Button, LinkButton };

import { styled, config } from "stitches.config";
import { UnstyledLink } from "./primitives";
import type * as Stitches from "@stitches/react";
