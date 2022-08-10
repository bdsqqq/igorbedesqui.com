import type { AppProps } from "next/app";
import { HistoryProvider } from "@/contexts/History";
import { Box } from "@/ui/primitives";
import { globalCss, styled } from "stitches.config";

const globalStyles = globalCss({
  "@font-face": {
    fontFamily: "Mplus",
    fontStyle: "normal",
    fontWeight: "300 400 700",
    fontDisplay: "swap",
    src: 'url(/fonts/Mplus.woff2) format("woff2")',
    unicodeRange:
      "U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA,U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215,U+FEFF, U+FFFD",
  },

  "*, *::before, *::after": {
    padding: 0,
    margin: 0,
    boxSizing: "border-box",

    outlineRing: "$mauve8",
  },

  "html, body": {
    backgroundColor: "$mauve1",
    height: "100%",

    fontFamily: "Mplus, Sans-serif",
  },

  html: {
    minWidth: "360px",
    fontSmooth: "auto",
    color: "$mauve12",
  },

  body: {
    scrollBehavior: "smooth",
    lineHeight: "1.5",
    fontSmooth: "always",
  },

  "img, picture, video, canvas, svg": {
    display: "block",
    maxWidth: "100%",
  },

  "::selection": {
    backgroundColor: "$mauve12",
    color: "$mauve1",
  },

  "input, button, textarea, select": {
    font: "inherit",
  },

  "p, h1, h2, h3, h4, h5, h6": {
    overflowWrap: "break-word",
  },

  "h1, h2, h3, h4, h5, h6": {
    fontSize: "inherit",
    fontWeight: "inherit",
  },

  a: {
    textDecoration: "none",
    color: "inherit",
  },

  "a:focus": {
    outline: "none",
  },

  "ol, ul": {
    listStyle: "none",
    margin: 0,
    padding: 0,
  },

  /* Remove Safari input shadow on mobile */
  'input[type="text"]': {
    appearance: "none",
  },
  'input[type="email"]': {
    appearance: "none",
  },
});

const Overlay = styled("div", {
  pointerEvents: "none",
  position: "absolute",
  left: "0%",
  top: "0%",
  right: "0%",
  bottom: "0%",
  zIndex: "2",
  width: "100%",
  height: "100%",
  backgroundImage: `url("/images/grain.png")`,
  backgroundPosition: "0px 0px",
  backgroundSize: "250px",
  opacity: 0.3,
});

function MyApp({ Component, pageProps }: AppProps) {
  globalStyles();
  return (
    <HistoryProvider>
      <Box css={{ position: "relative" }}>
        <Overlay />
        <Component {...pageProps} />
      </Box>
    </HistoryProvider>
  );
}

export default MyApp;
