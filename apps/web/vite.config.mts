import { copyFile, mkdir } from "node:fs/promises";
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

function forceTslibEsmForSsr(): Plugin {
  return {
    name: "fix:tslib-esm-for-ssr",
    enforce: "pre",
    apply: "build",
    applyToEnvironment: (environment) => environment.name === "ssr",
    resolveId(source, importer, options) {
      if (source !== "tslib") return null;

      return this.resolve("tslib/tslib.es6.mjs", importer, {
        ...options,
        skipSelf: true,
      });
    },
  };
}

const vercelOgAssets = [
  "noto-sans-v27-latin-regular.ttf",
  "yoga.wasm",
  "resvg.wasm",
];

async function copyVercelOgAssetsForSsr(serverDir: string) {
  const targetDir = path.join(serverDir, "_ssr");
  await mkdir(targetDir, { recursive: true });
  await Promise.all(
    vercelOgAssets.map((fileName) =>
      copyFile(
        new URL(`./node_modules/@vercel/og/dist/${fileName}`, import.meta.url),
        path.join(targetDir, fileName),
      ),
    ),
  );
}

export default defineConfig({
  server: {
    port: 3000,
    strictPort: true,
  },
  resolve: {
    tsconfigPaths: true,
  },
  nitro: {
    modules: [
      {
        setup(nitro) {
          nitro.hooks.hook("compiled", () =>
            copyVercelOgAssetsForSsr(nitro.options.output.serverDir),
          );
        },
      },
    ],
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
    forceTslibEsmForSsr(),
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
