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

      paragraph: {
        fontSize: "$base",
        lineHeight: "$base",
      },
    },
  },
});

export default Text;

import { styled } from "stitches.config";
