import "../styles/globals.css";
import { Providers } from "./Providers";
import { Grain } from "./Grain";
import { Fade } from "./Vignette";

import { GeistMono } from "geist/font/mono";
import { IBM_Plex_Serif } from "next/font/google";

import Script from "next/script";
import { Toolbox } from "@/components/toolbox";
import { Viewport } from "next";
import { Fuck_you_safari_for_taking_my_fullscreen_overlays_I_guess_Im_stuck_rendering_solids_behind_your_liquid_ass } from "@/components/force-solid-backdrop-under-safari-liquid-glass-url-and-topbar";

const PlexSerif = IBM_Plex_Serif({
  display: "swap",
  subsets: ["latin"],
  weight: ["200", "400", "700"],
  variable: "--font-ibm-plex-serif",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
  themeColor: "var(--color-gray-01)",
};

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

      <Script
        strategy="afterInteractive"
        src="https://analytics.qui.gg/script.js"
        data-website-id="a0b7ea4d-eb6c-4e04-8450-00228ac796fb"
      />
    </>
  );
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="bg-gray-00 text-gray-11 min-h-lvh overflow-auto antialiased smooth-scroll"
    >
      <head>
        <DocumentStuff />
      </head>
      <Providers>
        <body
          className={`${PlexSerif.variable} ${GeistMono.variable} font-serif leading-normal relative`}
        >
          <Fuck_you_safari_for_taking_my_fullscreen_overlays_I_guess_Im_stuck_rendering_solids_behind_your_liquid_ass />
          <Fade
            to="top"
            className="top-0 h-1/6 backdrop-filter backdrop-blur-sm"
          />
          <Fade
            to="bottom"
            className="bottom-0 h-2/6 backdrop-filter backdrop-blur-sm"
          />
          <Grain />

          {children}
          <Toolbox />

          <div
            className="pointer-events-none absolute top-0 h-full w-full opacity-[2%] blur-[100px] saturate-150 filter"
            style={{
              backgroundImage:
                "radial-gradient(at 27% 37%,#3a8bfd 0,transparent 0),radial-gradient(at 97% 21%,#72fe7d 0,transparent 50%),radial-gradient(at 52% 99%,#fd3a4e 0,transparent 50%),radial-gradient(at 10% 29%,#855afc 0,transparent 50%),radial-gradient(at 97% 96%,#e4c795 0,transparent 50%),radial-gradient(at 33% 50%,#8ca8e8 0,transparent 50%),radial-gradient(at 79% 53%,#eea5ba 0,transparent 50%)",
            }}
          />
        </body>
      </Providers>
    </html>
  );
}
