import path from "node:path";
import { fileURLToPath } from "node:url";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig, type Plugin } from "vite";
import viteReact from "@vitejs/plugin-react";
import rsc from "@vitejs/plugin-rsc";
import tailwindcss from "@tailwindcss/vite";
import { FontaineTransform } from "fontaine";
import { imagetools } from "vite-imagetools";
import { nitro } from "nitro/vite";

import { vercelNitroImageSizes } from "./vercelNitroImageSizes";

const appsWebRoot = path.dirname(fileURLToPath(import.meta.url));

/**
 * Nitro writes Vite service entries as `.mjs`, while plugin-rsc currently emits
 * a hard-coded `.js` import for the RSC service.
 */
function fixNitroRscLoadModuleExtension(): Plugin {
  return {
    name: "fix:nitro-rsc-load-module-extension",
    apply: "build",
    applyToEnvironment: (environment) => environment.name === "ssr",
    renderChunk(code) {
      const fixed = code.replaceAll("../rsc/index.js", "../rsc/index.mjs");
      return fixed === code ? null : { code: fixed, map: null };
    },
  };
}

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
      rsc: {
        enabled: true,
      },
    }),
    rsc(),
    fixNitroRscLoadModuleExtension(),
    viteReact(),
    nitro(),
  ],
});
