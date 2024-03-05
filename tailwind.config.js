const { mauveDark, crimsonDark } = require("@radix-ui/colors");

const vignetteZIndex = 10;

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./data/**/*.{mdx, md}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      // Stolen from rauno for now
      gray: {
        0: "hsl(0 0% 4%)",
        1: "hsl(0 0% 8.5%)",
        2: "hsl(0 0% 11.0%)",
        3: "hsl(0 0% 13.6%)",
        4: "hsl(0 0% 15.8%)",
        5: "hsl(0 0% 17.9%)",
        6: "hsl(0 0% 20.5%)",
        7: "hsl(0 0% 24.3%)",
        8: "hsl(0 0% 31.2%)",
        9: "hsl(0 0% 43.9%)",
        10: "hsl(0 0% 49.4%)",
        11: "hsl(0 0% 62.8%)",
        12: "hsl(0 0% 93.0%)",
        A1: "hsl(0 0% 100% / 0)",
        A2: "hsl(0 0% 100% / 0.026)",
        A3: "hsl(0 0% 100% / 0.056)",
        A4: "hsl(0 0% 100% / 0.077)",
        A5: "hsl(0 0% 100% / 0.103)",
        A6: "hsl(0 0% 100% / 0.129)",
        A7: "hsl(0 0% 100% / 0.172)",
        A8: "hsl(0 0% 100% / 0.249)",
        A9: "hsl(0 0% 100% / 0.386)",
        A10: "hsl(0 0% 100% / 0.446)",
        A11: "hsl(0 0% 100% / 0.592)",
        A12: "hsl(0 0% 100% / 0.923)",
      },
      white: "hsl(0 0% 100%)",
    },
    extend: {
      fontFamily: {
        serif: ["var(--font-ibm-plex-serif)"],
        sans: ["var(--font-ibm-plex-serif)"],
        mono: ["var(--font-geist-mono)"],
      },
      gridTemplateColumns: {
        13: "repeat(13, minmax(0, 1fr))",
        14: "repeat(14, minmax(0, 1fr))",
        15: "repeat(15, minmax(0, 1fr))",
        16: "repeat(16, minmax(0, 1fr))",
      },
      gridColumn: {
        "span-13": "span 13 / span 13",
        "span-14": "span 14 / span 14",
        "span-15": "span 15 / span 15",
        "span-16": "span 16 / span 16",
      },
      gridColumnStart: {
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
      },
      gridColumnEnd: {
        13: "13",
        14: "14",
        15: "15",
        16: "16",
        17: "17",
      },
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        fadeOut: {
          "0%": { opacity: "1" },
          "100%": { opacity: "0" },
        },

        scaleInSlideDown: {
          "0%": { opacity: "0", transform: "translateY(-5px) scale(0)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        scaleInSlideUp: {
          "0%": { opacity: "0", transform: "translateY(5px) scale(0)" },
          "100%": { opacity: "1", transform: "translateY(0) scale(1)" },
        },
        scaleOutSlideDown: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(-5px) scale(0)" },
        },
        scaleOutSlideUp: {
          "0%": { opacity: "1", transform: "translateY(0) scale(1)" },
          "100%": { opacity: "0", transform: "translateY(5px) scale(0)" },
        },
      },
      animation: {
        fade: "fade 550ms cubic-bezier(0, 0, 0.3, 1)",
        fadeOut: "fadeOut 550ms cubic-bezier(0, 0, 0.3, 1)",

        scaleInSlideDown:
          "scaleInSlideDown 110ms cubic-bezier(0, 0, 0.38, 0.9)",
        scaleInSlideUp: "scaleInSlideUp 110ms cubic-bezier(0, 0, 0.38, 0.9)",

        scaleOutSlideDown: "scaleOutSlideDown 110ms linear",
        scaleOutSlideUp: "scaleOutSlideUp 110ms cubic-bezier(0.2, 0, 1, 0.9)",
      },
      transitionTimingFunction: {
        /**
         * See: https://carbondesignsystem.com/guidelines/motion/overview/
         */
        "productive-standard": "cubic-bezier(0.2, 0, 0.38, 0.9)",
        "productive-entrance": "cubic-bezier(0, 0, 0.38, 0.9)",
        "productive-exit": "cubic-bezier(0.2, 0, 1, 0.9)",
        "expressive-standard": "cubic-bezier(0.4, 0.14, 0.3, 1)",
        "expressive-entrance": "cubic-bezier(0, 0, 0.3, 1)",
        "expressive-exit": "cubic-bezier(0.4, 0.14, 1, 1)",
      },

      transitionDuration: {
        /**
         * fast-01 - 70ms - Micro-interactions such as button and toggle
         *
         * fast-02 - 110ms - Micro-interactions such as fade
         *
         * moderate-01 - 150ms - Micro-interactions, small expansion, short distance movements
         *
         * moderate-02 - 240ms - Expansion, system communication, toast
         *
         * slow-01 - 400ms - Large expansion, important system notifications
         *
         * slow-02 - 700ms - Background dimming
         *
         * See: https://carbondesignsystem.com/guidelines/motion/overview/
         */
        "fast-01": "70ms",
        "fast-02": "110ms",
        "moderate-01": "150ms",
        "moderate-02": "240ms",
        "slow-01": "400ms",
        "slow-02": "700ms",
      },
      colors: {
        ...mauveDark,
        ...crimsonDark,
      },
      borderRadius: {
        inherit: "inherit",
      },
      dropShadow: {
        input: `
        0px 1px 0px -1px var(--tw-shadow-color),
        0px 1px 1px -1px var(--tw-shadow-color),
        0px 1px 2px -1px var(--tw-shadow-color),
        0px 2px 4px -2px var(--tw-shadow-color),
        0px 3px 6px -3px var(--tw-shadow-color)
      `,
        highlight: `
        inset 0px 0px 0px 1px var(--tw-shadow-color),
        inset 0px 1px 0px var(--tw-shadow-color)
      `,
        "faux-border": `
            inset 0px 0px 0px 1px var(--tw-shadow-color),
        `,
      },
      boxShadow: {
        input: `
            0px 1px 0px -1px var(--tw-shadow-color),
            0px 1px 1px -1px var(--tw-shadow-color),
            0px 1px 2px -1px var(--tw-shadow-color),
            0px 2px 4px -2px var(--tw-shadow-color),
            0px 3px 6px -3px var(--tw-shadow-color)
          `,
        highlight: `
            inset 0px 0px 0px 1px var(--tw-shadow-color),
            inset 0px 1px 0px var(--tw-shadow-color)
          `,
        "faux-border": `
            inset 0px 0px 0px 1px var(--tw-shadow-color),
        `,
      },
      zIndex: {
        vignette: `${vignetteZIndex}`,
        aboveVignette: `${vignetteZIndex + 1}`,
      },
    },
  },
  safelist: [
    {
      pattern: /grid-cols-(1|2|3|4|5|6|7|8|9|10|11|12|13|14|15|16)/,
      variants: ["lg", "md"],
    },
  ],
  plugins: [
    require("tailwindcss-radix")(),
    require("tailwindcss-animate"),
    function ({ addBase, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];
          const cssVariable =
            colorKey === "DEFAULT"
              ? `--color${colorGroup}`
              : `--color${colorGroup}-${colorKey}`;

          const newVars =
            typeof value === "string"
              ? { [cssVariable]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addBase({
        ":root": extractColorVars(theme("colors")),
      });
    },
  ],
};
