const { mauveDark, crimsonDark } = require("@radix-ui/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ...mauveDark,
        ...crimsonDark,
      },
    },
  },
  plugins: [],
};
