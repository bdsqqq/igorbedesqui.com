/// <reference types="vite/client" />
import {
  HeadContent,
  Scripts,
  createRootRoute,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import * as React from "react";
import globalsCssHref from "../../styles/globals.css?url";

const globalsCss = import.meta.env.DEV ? "/styles/globals.css" : globalsCssHref;
const rootShellCss = `
  :root {
    --gray-00: hsl(0 0% 4%);
    --gray-11: #b5b3ad;
    background-color: var(--gray-00);
    color: var(--gray-11);
    font-family: "IBM Plex Serif", Georgia, "Times New Roman", serif;
  }

  html {
    min-height: 100lvh;
    overflow: auto;
    scroll-behavior: smooth;
    background-color: var(--gray-00);
    color: var(--gray-11);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  body {
    position: relative;
    min-height: 100lvh;
    margin: 0;
    background-color: var(--gray-00);
    color: var(--gray-11);
    font-family: "IBM Plex Serif", Georgia, "Times New Roman", serif;
    line-height: 1.5;
  }

  @media (prefers-color-scheme: light) {
    :root {
      --gray-00: hsl(0 0% 100%);
      --gray-11: #63635e;
    }
  }
`;

import { Grain } from "../components/shell/Grain";
import { Fade } from "../components/shell/Vignette";
import { HistoryTracker } from "../providers/breadcrumbs";
import { Fuck_you_safari_for_taking_my_fullscreen_overlays_I_guess_Im_stuck_rendering_solids_behind_your_liquid_ass } from "../../components/force-solid-backdrop-under-safari-liquid-glass-url-and-topbar";
import { PortalStoreProvider } from "../../components/ui/Portal";
import { Toolbox } from "../../components/toolbox";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content:
          "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover",
      },
      {
        name: "theme-color",
        content: "var(--color-gray-01)",
      },
      { title: "Igor Bedesqui" },
      {
        name: "description",
        content:
          "Crafting web experiences with care. Exploring design, UX, and interactivity.",
      },
    ],
    links: [
      {
        rel: "apple-touch-icon",
        sizes: "180x180",
        href: "/favicon/apple-touch-icon.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        href: "/favicon/favicon-32x32.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        href: "/favicon/favicon-16x16.png",
      },
      { rel: "manifest", href: "/favicon/site.webmanifest" },
      {
        rel: "mask-icon",
        href: "/favicon/safari-pinned-tab.svg",
        color: "#0A0A0A",
      },
    ],
    styles: [
      {
        children: rootShellCss,
      },
    ],
    scripts: [
      {
        src: "https://analytics.qui.gg/script.js",
        defer: true,
        "data-website-id": "a0b7ea4d-eb6c-4e04-8450-00228ac796fb",
      },
    ],
  }),
  errorComponent: RootError,
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="bg-gray-00 text-gray-11 min-h-lvh overflow-auto antialiased smooth-scroll"
    >
      <head>
        <link rel="preload" href={globalsCss} as="style" />
        <link rel="stylesheet" href={globalsCss} />
        <HeadContent />
      </head>
      <body className="font-serif leading-normal relative">
        <PortalStoreProvider>
          <HistoryTracker />
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
        </PortalStoreProvider>
        <Scripts />
      </body>
    </html>
  );
}

export function RootError({ error }: ErrorComponentProps) {
  React.useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-lvh items-center justify-center p-8">
      <div className="max-w-md text-center">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-gray-09 mt-2">
          {error.message}
          <br />
          How did you get here...?
        </p>
      </div>
    </div>
  );
}
