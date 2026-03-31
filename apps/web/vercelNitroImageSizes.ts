import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";

import { imageSize } from "image-size";
import { DEFAULT_RESOLUTIONS, getBreakpoints } from "@unpic/core/base";

/**
 * @unpic/core uses this for `background="auto"` LQIP; not exported from the package.
 * If Unpic changes it, update here (see `transformBaseImageProps` in @unpic/core base).
 */
const UNPIC_LQIP_WIDTH = 24;

const importRe = /from\s+["']([^"']+\.(?:jpe?g|png|webp|gif|avif))\?as=img["']/g;

function walkTsFiles(dir: string, acc: string[] = []): string[] {
  let entries;
  try {
    entries = readdirSync(dir, { withFileTypes: true });
  } catch {
    return acc;
  }
  for (const ent of entries) {
    if (ent.name.startsWith(".") || ent.name === "node_modules") continue;
    const p = path.join(dir, ent.name);
    if (ent.isDirectory()) walkTsFiles(p, acc);
    else if (ent.isFile() && (ent.name.endsWith(".tsx") || ent.name.endsWith(".ts"))) {
      acc.push(p);
    }
  }
  return acc;
}

/**
 * Widths Vercel must allow for `/_vercel/image?w=` when using Unpic + `fallback="vercel"`
 * on bundled `?as=img` assets (constrained layout + production LQIP).
 */
export function vercelNitroImageSizes(appsWebRoot: string): number[] {
  const required = new Set<number>([UNPIC_LQIP_WIDTH, ...DEFAULT_RESOLUTIONS]);

  for (const root of [path.join(appsWebRoot, "src"), path.join(appsWebRoot, "components")]) {
    for (const file of walkTsFiles(root)) {
      const txt = readFileSync(file, "utf8");
      if (!txt.includes("?as=img")) continue;
      importRe.lastIndex = 0;
      let m;
      while ((m = importRe.exec(txt)) !== null) {
        const resolved = path.resolve(path.dirname(file), m[1]);
        if (!statSync(resolved).isFile()) {
          throw new Error(`vercelNitroImageSizes: missing ${resolved} (from ${file})`);
        }
        const dim = imageSize(new Uint8Array(readFileSync(resolved)));
        const w = dim.width;
        if (w == null) {
          throw new Error(`vercelNitroImageSizes: no width ${resolved}`);
        }
        for (const bp of getBreakpoints({ width: w, layout: "constrained" })) {
          required.add(bp);
        }
      }
    }
  }

  return [...required].sort((a, b) => a - b);
}
