import { mauve, mauveDark, crimson, crimsonDark } from "@radix-ui/colors";
import { createStitches } from "@stitches/react";
import type * as Stitches from "@stitches/react";

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
      ...mauve,
      ...crimson,
    },
  },
  media: {
    sm: "(min-width: 480px)",
    md: "(min-width: 768px)",
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
        outlineColor: value || "$mauve8",
        outlineStyle: "solid",
        outlineWidth: "2px",
      },
    }),
  },
});

export const darkTheme = createTheme({
  colors: {
    ...mauveDark,
    ...crimsonDark,
  },
});
