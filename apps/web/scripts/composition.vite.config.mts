import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const app = fileURLToPath(new URL("../", import.meta.url));
export default defineConfig({
  root: path.join(app, "scripts/composition-fixture"),
  publicDir: false,
  plugins: [react(), tailwindcss()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      "@/components": path.join(app, "components"),
      "@/ui": path.join(app, "components/ui"),
      "@/lib": path.join(app, "lib"),
      "@/providers": path.join(app, "src/providers"),
      "~": path.join(app, "src"),
    },
  },
  build: {
    outDir: path.join(app, "node_modules/.cache/composition-fixture"),
    emptyOutDir: true,
  },
  preview: { port: 3116, strictPort: true },
});
