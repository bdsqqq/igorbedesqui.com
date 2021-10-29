import { sand, sandDark } from "@radix-ui/colors";
import { createStitches } from "@stitches/react";
import type * as Stitches from "@stitches/react";

const sandDarkWithNames = {
  sandDark1: sandDark.sand1,
  sandDark2: sandDark.sand2,
  sandDark3: sandDark.sand3,
  sandDark4: sandDark.sand4,
  sandDark5: sandDark.sand5,
  sandDark6: sandDark.sand6,
  sandDark7: sandDark.sand7,
  sandDark8: sandDark.sand8,
  sandDark9: sandDark.sand9,
  sandDark10: sandDark.sand10,
  sandDark11: sandDark.sand11,
  sandDark12: sandDark.sand12,
};

export const {
  styled,
  css,
  globalCss,
  keyframes,
  getCssText,
  theme,
  createTheme,
  config,
} = createStitches({
  theme: {
    colors: {
      ...sand,
      ...sandDarkWithNames,
    },
  },
  media: {
    bp1: "(min-width: 480px)",
  },
  utils: {
    marginX: (value: Stitches.PropertyValue<"margin">) => ({
      marginLeft: value,
      marginRight: value,
    }),
    marginY: (value: Stitches.PropertyValue<"margin">) => ({
      marginTop: value,
      marginBottom: value,
    }),
    px: (value: Stitches.PropertyValue<"padding">) => ({
      paddingLeft: value,
      paddingRight: value,
    }),
    py: (value: Stitches.PropertyValue<"padding">) => ({
      paddingTop: value,
      paddingBottom: value,
    }),
    inset: (value: Stitches.PropertyValue<"top">) => ({
      top: value,
      left: value,
      right: value,
      bottom: value,
    }),
    outlineRing: (value: Stitches.PropertyValue<"color">) => ({
      "&:focus": {
        outline: "none",
        borderColor: "transparent",
      },
      "&:focus-visible": {
        outlineColor: value || "$sand8",
        outlineStyle: "solid",
        outlineWidth: "2px",
      },
    }),
  },
});
