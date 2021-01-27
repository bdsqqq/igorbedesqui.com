const { spacing, fontFamily } = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
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
      },
      fontFamily: {
        sans: ["Mplus", ...fontFamily.sans],
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            color: theme("colors.gray.700"),
            a: {
              color: theme("colors.blue.500"),
              "&:hover": {
                color: theme("colors.blue.700"),
              },
              code: { color: theme("colors.blue.400") },
            },
            "h2,h3,h4": {
              "scroll-margin-top": spacing[32],
            },
            code: { color: theme("colors.pink.500") },
            "blockquote p:first-of-type::before": false,
            "blockquote p:last-of-type::after": false,
          },
        },
      }),
    },
  },
  variants: {},
  plugins: [require("@tailwindcss/typography")],
};
