import Document, { Html, Head, Main, NextScript } from "next/document";
// import { M_PLUS_1 } from "@next/font/google";

// const mPlus = M_PLUS_1({
//   weight: "400",
//   subsets: ["latin"],
// });

class MyDocument extends Document {
  render() {
    return (
      //className={mPlus.className}
      <Html>
        <Head>
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/favicon/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon/favicon-16x16.png"
          />
          <link rel="manifest" href="favicon/site.webmanifest" />
          <link
            rel="mask-icon"
            href="/favicon/safari-pinned-tab.svg"
            color="#0A0A0A"
          />
          <meta name="msapplication-TileColor" content="#0A0A0A" />
          <meta name="theme-color" content="#0A0A0A" />

          <script
            async
            defer
            data-website-id="a0b7ea4d-eb6c-4e04-8450-00228ac796fb"
            src="https://analytics.igorbedesqui.com/umami.js"
          ></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
