import "../styles/globals.css";
import { Providers } from "./Providers";
import { Grain } from "./Grain";
import { Vignette } from "./Vignette";

import { IBM_Plex_Serif } from "next/font/google";
import Script from "next/script";

export { reportWebVitals } from "next-axiom";

const customFont = IBM_Plex_Serif({
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
});

const DocumentStuff = () => {
  return (
    <>
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

      <Script
        strategy="afterInteractive"
        src="https://analytics.qui.gg/script.js"
        data-website-id="a0b7ea4d-eb6c-4e04-8450-00228ac796fb"
      />
    </>
  );
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <DocumentStuff />
      </head>
      <body>
        <div className={`${customFont.className} relative`}>
          <Grain />
          <Vignette />
          <div className="relative mx-auto max-w-7xl">
            <Providers>{children}</Providers>
          </div>
          <div
            className="pointer-events-none absolute top-0 h-full w-full opacity-[3%] blur-[100px] saturate-150 filter"
            style={{
              backgroundImage:
                "radial-gradient(at 27% 37%,#3a8bfd 0,transparent 0),radial-gradient(at 97% 21%,#72fe7d 0,transparent 50%),radial-gradient(at 52% 99%,#fd3a4e 0,transparent 50%),radial-gradient(at 10% 29%,#855afc 0,transparent 50%),radial-gradient(at 97% 96%,#e4c795 0,transparent 50%),radial-gradient(at 33% 50%,#8ca8e8 0,transparent 50%),radial-gradient(at 79% 53%,#eea5ba 0,transparent 50%)",
            }}
          />
        </div>
      </body>
    </html>
  );
}
