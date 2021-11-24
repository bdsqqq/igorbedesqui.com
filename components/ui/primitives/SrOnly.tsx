/**
 * On focus, the sr-only styles will be ovewritten and this will render.
 * To make this aways sr-only use the `alwaysSrOnly` variant
 */
const Span = styled("span", {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: "0",
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: "0",

  "&:focus": {
    position: "static",
    width: "auto",
    height: "auto",
    padding: 0,
    margin: 0,
    overflow: "visible",
    clip: "auto",
    whiteSpace: "normal",
  },

  variants: {
    alwaysSrOnly: {
      true: {
        "&:focus": {
          position: "absolute",
          width: "1px",
          height: "1px",
          padding: "0",
          margin: "-1px",
          overflow: "hidden",
          clip: "rect(0, 0, 0, 0)",
          whiteSpace: "nowrap",
          borderWidth: "0",
        },
      },
    },
  },
});

export default Span;

import { styled } from "stitches.config";
