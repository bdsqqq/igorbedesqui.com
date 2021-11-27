/**
 * @description This is a component that provides a set of predetermined text variants and allows for finer control through the `css` prop
 */
const Text = styled("span", {
  // Reset
  fontVariantNumeric: "tabular-nums",

  variants: {
    presetStyle: {
      heading: {
        fontSize: "$3xl",
        lineHeight: "$2xl",
      },
    },
  },
});

export default Text;

import { styled } from "stitches.config";
