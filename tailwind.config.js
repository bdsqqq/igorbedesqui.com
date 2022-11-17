const { mauveDark, crimsonDark } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
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
    },
    extend: {
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
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
    },
  },
  plugins: [require("tailwindcss-radix")()],
};
