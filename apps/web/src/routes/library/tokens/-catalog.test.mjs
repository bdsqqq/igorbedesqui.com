import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";
import { extractOffsets, extractTokens } from "./-catalog.ts";

const require = createRequire(import.meta.url);

test("CSS syntax, resets, and additions drive the inventory without a token registry", () => {
  const defaults = {
    file: "defaults.css",
    css: "@theme { --color-red-50: red; --color-white: white; --radius-lg: .5rem; }",
  };
  const site = {
    file: "site.css",
    css: `/* --fake: red; */
    @theme { --color-*: initial; --color-white: #fff; --color-canvas: var(--gray-00); }
    :root { --gray-00: #111; --custom-added: color(display-p3 1 0 0); }
    .component { --local: var(--gray-00); }
    @keyframes move { to { --not-a-theme-token: 1; } }
  `,
  };
  const catalog = extractTokens([defaults, site]);
  assert.deepEqual(
    catalog.tokens.map((token) => token.name),
    [
      "--radius-lg",
      "--color-white",
      "--color-canvas",
      "--gray-00",
      "--custom-added",
      "--local",
    ],
  );
  assert.equal(catalog.resets[0].name, "--color-*");
  assert.equal(catalog.tokens.at(-1).definitions[0].scope, "component");
  assert.match(catalog.previewCss, /--custom-added: color\(display-p3 1 0 0\)/);
  assert.doesNotMatch(
    catalog.previewCss,
    /--color-red-50|--local|--fake|--not-a-theme-token/,
  );
  assert.notDeepEqual(
    extractTokens([defaults]).tokens.map((token) => token.name),
    catalog.tokens.map((token) => token.name),
  );
});

test("local theme previews retain source ordering, gamut/support conditions, aliases, and provenance", () => {
  const catalog = extractTokens([
    {
      file: "site.css",
      css: `@theme { --color-canvas: var(--gray-00); }
:root { --gray-00: #111; }
@media (prefers-color-scheme: light) {
  :root, .light { --gray-00: #fff; }
  @supports (color: color(display-p3 1 1 1)) {
    @media (color-gamut: p3) { :root { --gray-00: color(display-p3 1 1 1); } }
  }
}`,
    },
  ]);
  const gray = catalog.tokens.find((token) => token.name === "--gray-00");
  assert.equal(gray.definitions.length, 3);
  assert.equal(gray.definitions[2].file, "site.css");
  assert.equal(gray.definitions[2].line, 6);
  assert.ok(gray.definitions[2].context.includes("@media (color-gamut: p3)"));
  assert.match(
    catalog.previewCss,
    /\[data-token-theme="light"\]\{--gray-00: #fff\}/,
  );
  assert.match(
    catalog.previewCss,
    /@supports \(color: color\(display-p3 1 1 1\)\)/,
  );
  assert.match(catalog.previewCss, /@media \(color-gamut: p3\)/);
  assert.match(
    catalog.previewCss,
    /\[data-token-reference\]\{--color-canvas: var\(--gray-00\)\}/,
  );
  assert.doesNotMatch(catalog.previewCss, /:root|prefers-color-scheme|\.light/);
});

test("literal modifiers are discovered, deduplicated, and tied to source; dynamic templates are not invented", () => {
  const offsets = extractOffsets([
    {
      file: "rows.tsx",
      text: `
    const classes = "hover:ak-state-4 focus-visible:ak-state-4 ak-layer-darken-3";
    const arbitrary = "ak-state-(--offset)";
    const dynamic = \`ak-state-\${value}\`;
    // "ak-state-99" in a comment is not a caller.
  `,
    },
  ]);
  assert.deepEqual(offsets.map((offset) => offset.utility).sort(), [
    "ak-layer-darken-3",
    "ak-state-4",
  ]);
  const state = offsets.find((offset) => offset.kind === "state");
  assert.equal(state.amount, 4);
  assert.equal(state.direction, "auto");
  assert.deepEqual(state.references, [{ file: "rows.tsx", line: 2 }]);
});

test("installed definitions expose semantic pigments without a legacy ramp or default rainbow", async () => {
  const files = [
    ["tailwindcss/theme.css", require.resolve("tailwindcss/theme.css")],
    ["@ariakit/tailwind", require.resolve("@ariakit/tailwind")],
    ["src/routes/-main.css", new URL("../../-main.css", import.meta.url)],
  ];
  const catalog = extractTokens(
    await Promise.all(
      files.map(async ([file, path]) => ({
        file,
        css: await readFile(path, "utf8"),
      })),
    ),
  );
  assert.deepEqual(
    catalog.tokens
      .filter((token) => token.name.startsWith("--color-"))
      .map((token) => token.name)
      .sort(),
    ["--color-canvas", "--color-danger", "--color-primary"],
  );
  assert.ok(
    !catalog.tokens.some((token) =>
      /^--(?:gray-|blue-|color-gray-)/.test(token.name),
    ),
  );
  assert.equal(
    catalog.tokens
      .find((token) => token.name === "--color-canvas")
      .definitions.filter(
        (definition) => definition.file === "src/routes/-main.css",
      ).length,
    2,
  );
  assert.ok(catalog.tokens.some((token) => token.name === "--hue-blue"));
  assert.ok(catalog.tokens.some((token) => token.name === "--radius-card"));
  assert.ok(
    !catalog.tokens.some((token) => token.name.startsWith("--color-red-")),
  );
});
