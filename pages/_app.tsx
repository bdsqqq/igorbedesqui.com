const globalStyles = globalCss({
  "@font-face": {
    fontFamily: "Mplus",
    fontStyle: "normal",
    fontWeight: "300 400 700",
    fontDisplay: "optional",
    src: 'url(/fonts/Mplus.woff2) format("woff2")',
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,U+FEFF, U+FFFD",
  },

  "&::selection": {
    backgroundColor: "mauveDark5",
    color: "mauveDark12",
  },

  "*": {
    padding: 0,
    margin: 0,
    boxSizing: "border-box",

    outlineRing: "$mauveDark8",
  },

  "html, body": {
    backgroundColor: "$mauve1",
  },

  html: {
    minWidth: "360px",
    scrollBehavior: "smooth",
    fontSmooth: "auto",
  },

  /* Remove Safari input shadow on mobile */
  'input[type="text"]': {
    appearance: "none",
  },
  'input[type="email"]': {
    appearance: "none",
  },
});
function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <div className="bg-mauve-mauve1">
      <HistoryProvider>
        <div className="fadeIn">
          <Component {...pageProps} />
        </div>
      </HistoryProvider>
    </div>
  );
}

export default MyApp;

import "../styles/index.css";
import type { AppProps } from "next/app";
import { HistoryProvider } from "@/contexts/History";
import { globalCss } from "stitches.config";
