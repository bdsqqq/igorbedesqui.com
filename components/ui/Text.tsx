/**
 * @description This is a component that provides a set of predetermined text variants and allows for finer control through the `css` prop
 */
const Text = styled("span", {
  // Reset
  fontVariantNumeric: "tabular-nums",

  variants: {
    bold: {
      true: {
        fontWeight: "bold",
      },
    },

    presetStyle: {
      heading: {
        fontSize: "$3xl",
        lineHeight: "$2xl",
      },

      semiHeading: {
        fontSize: "$lg",
        lineHeight: "$lg",
        fontWeight: "bold",
      },

      paragraph: {
        fontSize: "$base",
        lineHeight: "$base",
      },

      lgParagraph: {
        fontSize: "$lg",

        "@md": {
          fontSize: "$xl",
        },
      },

      caption: {
        fontSize: "$sm",
        lineHeight: "$sm",
        fontStyle: "italic",
        letterSpacing: "0.2px",
        color: "$mauve11",
      },
    },
  },
});

export default Text;

import { styled } from "stitches.config";
