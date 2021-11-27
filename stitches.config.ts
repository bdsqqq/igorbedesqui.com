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
    fontSizes: {
      xs: "0.75rem", // 12px
      sm: "0.875", // 14px
      base: "1rem", // 16px
      lg: "1.25rem", // 20px
      xl: "1.5rem", // 24px
      "2xl": "2rem", // 32px
      "3xl": "3rem", // 48px
      "4xl": "4rem", // 64px
      "5xl": "4.5rem", // 72px
    },
    lineHeights: {
      xs: "1.125rem", // 18px
      sm: "1.3125rem", // 21px
      base: "1.5rem", // 24px
      lg: "1.875rem", // 30px
      xl: "2.25rem", // 36px
      "2xl": "3rem", // 48px
      "3xl": "4.5rem", // 72px
      "4xl": "6rem", // 96px
      "5xl": "6.75rem", // 108px
    },
    letterSpacings: {
      tighter: "-0.05em",
      tight: "-0.025em",
      normal: "0em",
      wide: "0.025em",
      wider: "0.05em",
      widest: "0.1em",
    },
  },
  media: {
    sm: "(min-width: 480px)",
    md: "(min-width: 768px)",
    motion: "(prefers-reduced-motion: no-preference)",
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
