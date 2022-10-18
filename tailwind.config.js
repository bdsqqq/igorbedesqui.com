const { mauveDark, crimsonDark } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        fade: {
          "0%": { opacity: "0" },
          "100%": { opacity: "100%" },
        },
      },
      animation: {
        fade: "fade 550ms cubic-bezier(0, 0, 0.3, 1)",
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
