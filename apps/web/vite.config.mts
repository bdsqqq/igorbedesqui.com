import path from "node:path";
import { fileURLToPath } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { FontaineTransform } from "fontaine";
import { imagetools } from "vite-imagetools";
import { nitro } from "nitro/vite";

import { vercelNitroImageSizes } from "./vercelNitroImageSizes";

const appsWebRoot = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  nitro: {
    vercel: {
      config: {
        version: 3,
        images: {
          sizes: vercelNitroImageSizes(appsWebRoot),
          domains: ["igorbedesqui.com"],
          minimumCacheTTL: 60,
          formats: ["image/avif", "image/webp"],
        },
      },
    },
  },
  plugins: [
    FontaineTransform.vite({
      fallbacks: {},
      resolvePath: (id) => {
        if (id.startsWith("@fontsource-variable/geist-mono/")) {
          return new URL(`./node_modules/${id}`, import.meta.url);
        }

        if (id.startsWith("@fontsource/ibm-plex-serif/")) {
          return new URL(`./node_modules/${id}`, import.meta.url);
        }

        return id;
      },
    }),
    tailwindcss(),
    imagetools(),
    tanstackStart({
      srcDirectory: "src",
    }),
    viteReact(),
    nitro(),
  ],
});
