import { readFile, readdir } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import type { Plugin } from "vite";
import { extractOffsets, extractTokens } from "./-catalog";

const id = "virtual:design-tokens";
const resolved = `\0${id}`;

/** Only the resulting inventory reaches the route chunk; parsers and source files stay in the build. */
export function designTokens(root: string): Plugin {
  const require = createRequire(path.join(root, "package.json"));
  const files = [
    {
      file: "tailwindcss/theme.css",
      absolute: require.resolve("tailwindcss/theme.css"),
    },
    {
      file: "@ariakit/tailwind",
      absolute: require.resolve("@ariakit/tailwind"),
    },
    {
      file: "src/routes/-main.css",
      absolute: path.join(root, "src/routes/-main.css"),
    },
  ];
  let development = false;
  return {
    name: "design-token-inventory",
    configResolved(config) {
      development = config.command === "serve";
    },
    configureServer(server) {
      const refresh = (absolute: string) => {
        const file = path.relative(root, absolute).split(path.sep).join("/");
        if (
          !files.some((source) => source.absolute === absolute) &&
          !(
            /^(?:components|src|lib)\/.*\.tsx?$/.test(file) &&
            !file.startsWith("src/routes/library/tokens")
          )
        )
          return;
        for (const environment of Object.values(server.environments)) {
          const module = environment.moduleGraph.getModuleById(resolved);
          if (module) {
            environment.moduleGraph.invalidateModule(module);
            environment.hot.send({ type: "full-reload" });
          }
        }
      };
      for (const event of ["add", "change", "unlink"] as const)
        server.watcher.on(event, refresh);
      server.httpServer?.once("close", () => {
        for (const event of ["add", "change", "unlink"] as const)
          server.watcher.off(event, refresh);
      });
    },
    resolveId(source) {
      if (source === id) return resolved;
    },
    async load(source) {
      if (source !== resolved) return;
      // Vite turns addWatchFile dependencies into dev imports. Watch via the server instead,
      // or the client would eagerly execute every page whose class literals we inspected.
      const watch = (absolute: string) => {
        if (!development) this.addWatchFile(absolute);
      };
      const css = await Promise.all(
        files.map(async ({ file, absolute }) => {
          watch(absolute);
          return { file, css: await readFile(absolute, "utf8") };
        }),
      );
      const classes: { file: string; text: string }[] = [];
      async function walk(directory: string) {
        const absolute = path.join(root, directory);
        for (const entry of (
          await readdir(absolute, { withFileTypes: true })
        ).sort((a, b) => a.name.localeCompare(b.name))) {
          const file = `${directory}/${entry.name}`;
          if (file.startsWith("src/routes/library/tokens")) continue;
          if (entry.isDirectory()) await walk(file);
          else if (/\.tsx?$/.test(file) && !/\.(test|types)\./.test(file)) {
            watch(path.join(root, file));
            classes.push({
              file,
              text: await readFile(path.join(root, file), "utf8"),
            });
          }
        }
      }
      for (const directory of ["components", "src", "lib"])
        await walk(directory);
      return `export default ${JSON.stringify({ ...extractTokens(css), offsets: extractOffsets(classes) })}`;
    },
  };
}
