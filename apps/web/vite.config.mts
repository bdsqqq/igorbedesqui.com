import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import { defineConfig } from "vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { FontaineTransform } from "fontaine";
import { imagetools } from "vite-imagetools";
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
          // Every `w` in `/_vercel/image` must be listed. @unpic/core: DEFAULT_RESOLUTIONS + `getBreakpoints` (constrained) from each asset width, plus LQIP 24.
          sizes: [
            24, 144, 288, 310, 500, 540, 620, 640, 685, 700, 750, 756, 828, 960, 1000, 1080,
            1200, 1280, 1370, 1400, 1440, 1487, 1505, 1512, 1668, 1920, 1984, 2048, 2400, 2560,
            2880, 2974, 3010, 3200, 3600, 3840, 3968, 4313, 4480, 5120, 6016, 7200, 8626,
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
    imagetools(),
    tanstackStart({
      srcDirectory: "src",
    }),
    viteReact(),
    nitro(),
  ],
});
