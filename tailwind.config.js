const { fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");
const { mauve, mauveDark } = require("@radix-ui/colors");

module.exports = {
  mode: "jit",
  purge: ["./components/**/*.{js,ts,jsx,tsx}", "./pages/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      white: colors.white,
      black: colors.black,
      gray: colors.warmGray,
      red: colors.red,
      blue: colors.lightBlue,
      yellow: colors.yellow,
    },
    extend: {
      gridTemplateColumns: {
        "1fr12rem": "repeat(auto-fit, minmax(12rem, 1fr))",
      },
      stroke: {
        mauve: {
          ...mauve,
        },
        mauveDark: {
          ...mauveDark,
        },
      },
      colors: {
        oliver: {
          light: "#fffcf5",
          500: "#29222E",
          700: "#403547",
        },
        igor: {
          light: "#fffcf5",
          500: "#2e2225",
          700: "#473539",
        },
        mauve: {
          ...mauve,
        },
        mauveDark: {
          ...mauveDark,
        },
      },
      fontFamily: {
        sans: ["Mplus", ...fontFamily.sans],
      },
      animation: {
        fadeIn: "fadeIn 0.6s linear",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
    },
  },
  variants: {},
};
