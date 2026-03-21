import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { FontaineTransform } from "fontaine";
import { nitro } from "nitro/vite";

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
          sizes: [
            144, 288, 310, 500, 540, 620, 640, 685, 750, 828, 960, 1000, 1080,
            1200, 1280, 1370, 1440, 1505, 1668, 1920, 2048, 2400, 2560, 2880,
            3010, 3840,
          ],
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
    tanstackStart({
      srcDirectory: "src",
    }),
    viteReact(),
    nitro(),
  ],
});
