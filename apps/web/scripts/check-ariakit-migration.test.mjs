import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { pathToFileURL } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";
import {
  auditMigrationSources,
  formatDiagnostics,
  readMigrationSources,
  staticPageRoutes,
} from "./check-ariakit-migration.mjs";

const audit = (source) =>
  auditMigrationSources(new Map([["src/routes/fixture.tsx", source]]), {
    boundaries: false,
  });
const rules = (source) => audit(source).map((diagnostic) => diagnostic.rule);

test("real DialogClose preserves icon-only and text children; the old undefined fallback is detected", async () => {
  const directory = await mkdtemp(
    path.join(os.tmpdir(), "ariakit-dialog-composition-"),
  );
  try {
    const stylingURL = pathToFileURL(path.join(directory, "styling.mjs")).href;
    const compile = (source) =>
      ts
        .transpileModule(source, {
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        })
        .outputText.replace(
          /(from\s+)(["'])([^"']+)\2/g,
          (_match, prefix, _quote, specifier) =>
            prefix +
            JSON.stringify(
              specifier === "@/lib/styling"
                ? stylingURL
                : import.meta.resolve(specifier),
            ),
        );
    await writeFile(
      new URL(stylingURL),
      compile(
        await readFile(new URL("../lib/styling.ts", import.meta.url), "utf8"),
      ),
    );
    const source = await readFile(
      new URL("../components/ui/Dialog.tsx", import.meta.url),
      "utf8",
    );
    const render = async (name, code, child) => {
      const filename = path.join(directory, `${name}.mjs`);
      await writeFile(filename, compile(code));
      const { Dialog, DialogClose } = await import(
        pathToFileURL(filename).href
      );
      return renderToStaticMarkup(
        createElement(
          Dialog,
          null,
          createElement(DialogClose, { asChild: true }, child),
        ),
      );
    };
    // An icon slot and children are separate consumer inputs, as in the site's Button.
    function IconSlotButton({ icon, children, ...props }) {
      return createElement("button", props, icon, children);
    }
    const icon = createElement(IconSlotButton, {
      "aria-label": "close preview",
      icon: createElement("svg", { "data-custom-icon": true }),
    });
    const iconMarkup = await render("icon", source, icon);
    assert.equal((iconMarkup.match(/<svg\b/g) ?? []).length, 1);
    const textMarkup = await render(
      "text",
      source,
      createElement("button", null, "custom close text"),
    );
    assert.match(textMarkup, />custom close text<\/button>/);
    assert.doesNotMatch(textMarkup, /<svg\b/);
    const badSource = source.replace(
      "{asChild ? null : children}",
      "{asChild ? undefined : children}",
    );
    assert.notEqual(
      badSource,
      source,
      "the isolated bad fixture must actually change DialogClose",
    );
    const badMarkup = await render("bad", badSource, icon);
    assert.notEqual(
      (badMarkup.match(/<svg\b/g) ?? []).length,
      1,
      "the old default-dismiss-icon regression must be caught",
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("public routes derive from real router calls, excluding dynamic/API/layout routes and prose", () => {
  const router =
    'import { createFileRoute as route } from "@tanstack/react-router";';
  const sources = new Map([
    [
      "src/routes/index.tsx",
      `${router} route("/")({}); const prose = 'route("/fake")';`,
    ],
    ["src/routes/new/route.tsx", `${router} route("/new/")({});`],
    ["src/routes/api/example.tsx", `${router} route("/api/example")({});`],
    ["src/routes/p/$slug.tsx", `${router} route("/p/$slug")({});`],
    ["src/routes/writing/route.tsx", `${router} route("/writing")({});`],
    ["src/routes/writing/index.tsx", `${router} route("/writing/")({});`],
    [
      "src/routes/near.tsx",
      'import { createFileRoute } from "other-router"; createFileRoute("/fake")({});',
    ],
    ["components/example.tsx", `${router} route("/not-a-route")({});`],
  ]);
  assert.deepEqual(staticPageRoutes(sources), ["/", "/new", "/writing"]);
  sources.delete("src/routes/writing/index.tsx");
  assert.deepEqual(staticPageRoutes(sources), ["/", "/new"]);
});

test("rejects behavior dependencies through every supported module syntax, with source locations", () => {
  const source = `import * as Dialog from "@radix-ui/react-dialog";
export { Popover } from "radix-ui";
const toggle = import("@radix-ui/react-toggle");
const slot = require("@radix-ui/react-slot");
import ScrollArea = require("@radix-ui/react-scroll-area");`;
  const result = audit(source);
  assert.equal(result.length, 5);
  assert.ok(result.every(({ rule }) => rule === "radix-behavior"));
  assert.deepEqual(
    result.map(({ line }) => line),
    [1, 2, 3, 4, 5],
  );
  assert.match(
    formatDiagnostics(result),
    /fixture\.tsx:1:\d+ \[radix-behavior\]/,
  );
});

test("allows icons, similarly named modules, prose, comments and code examples", () => {
  assert.deepEqual(
    audit(`import { PlusIcon } from "@radix-ui/react-icons";
import { icon } from "@radix-ui/react-icons/subpath";
import { x } from "my-radix-ui";
import { y } from "radix-ui-near-match";
// import "@radix-ui/react-dialog"; <button />
const documentation = '<button className="ak-frame-card/card">';
const Demo = () => <pre>{\`import "@radix-ui/react-popover"; <button />\`}</pre>;`),
    [],
  );
  assert.deepEqual(rules('import { x } from "@radix-ui/react-icons-fake";'), [
    "radix-behavior",
  ]);
});

test("native JSX and createElement buttons fail; Ariakit and shared wrappers pass", () => {
  assert.deepEqual(
    rules(`import { createElement as el } from "react";
const A = () => <><button /><button>run</button><Button /><buttonish /></>;
const B = React.createElement("button", {});
const C = el("button", {});`),
    Array(4).fill("native-button"),
  );
  assert.deepEqual(
    audit(`import { Button as Action } from "@ariakit/react";
import * as Ariakit from "@ariakit/react";
const A = () => <><Action /><Ariakit.Button /><Button /></>;`),
    [],
  );
});

test("native render targets are allowed only under imported Ariakit controls", () => {
  assert.deepEqual(
    audit(`const A = () => <><Check render={<button type="button" />} /><Ariakit.Button render={<button />} /></>;
import { Checkbox as Check } from "@ariakit/react"; import * as Ariakit from "@ariakit/react";`),
    [],
  );
  assert.deepEqual(rules(`const A = () => <Unknown render={<button />} />;`), [
    "native-button",
  ]);
});

test("real class compositions need frame activation; a string elsewhere cannot satisfy it", () => {
  assert.deepEqual(
    rules(
      `const decoy = "ak-frame"; const A = () => <div className="ak-frame-card/card" />;`,
    ),
    ["frame-base"],
  );
  assert.deepEqual(
    rules(`const A = () => <div className={cn("ak-frame", selected && "ak-frame-card/card")} />;
const variants = cva("ak-frame", { variants: { size: { small: "ak-frame-field/field" } } });`),
    [],
  );
  // Wrapper callers can add modifiers because the shared primitive supplies its base.
  assert.deepEqual(
    audit(
      `const A = () => <Button className="ak-frame-cover ak-frame-start" />;`,
    ),
    [],
  );
  assert.deepEqual(
    rules(
      `const A = () => <div className={cn("ak-frame-card/card", cn("flex"))} />;`,
    ),
    ["frame-base"],
  );
});

test("numeric layer bordering, erased surfaces and unaccounted silhouette borders fail", () => {
  assert.deepEqual(
    rules(
      `const A = () => <div className="ak-layer ak-layer-5 ak-frame ak-frame-card/card ak-frame-bordering" />;`,
    ),
    ["frame-bordering"],
  );
  assert.deepEqual(
    rules(`const A = () => <div className="ak-layer ak-text" />;`),
    ["text-erases-layer"],
  );
  assert.deepEqual(
    rules(
      `const A = () => <div className="ak-frame ak-frame-card/card border" />;`,
    ),
    ["frame-native-border"],
  );
  assert.deepEqual(
    audit(
      `const A = () => <><div className="ak-layer ak-layer-lighten-5 ak-frame ak-frame-card/card ak-frame-bordering" /><div className="ak-layer ak-layer-5 ak-frame ak-frame-card/card ak-frame-ring border-b" /><span className="ak-text ak-text-primary" /></>;`,
    ),
    [],
  );
});

test("variant parsing respects arbitrary selector colons and supports inherited bordering", () => {
  assert.deepEqual(
    rules(
      `const A = () => <div className="ak-layer ak-frame ak-frame-card/card [&:hover]:ak-frame-bordering" />;`,
    ),
    ["frame-bordering"],
  );
  assert.deepEqual(
    audit(
      `const A = () => <div className="ak-frame ak-frame-card/card ak-frame-bordering-inherit [background:url(https://example.com)]" />;`,
    ),
    [],
  );
});

test("feature ownership stays with the page even when another feature imports it", () => {
  const unit = "export const invoke = value => value;";
  const misplaced = new Map([["components/features/demo/model.ts", unit]]);
  assert.deepEqual(
    auditMigrationSources(misplaced, { boundaries: false }).map(
      (issue) => issue.rule,
    ),
    ["feature-colocation"],
  );
  const colocated = new Map([
    ["src/routes/play/demo/-model.ts", unit],
    [
      "src/routes/play/other/-model.ts",
      'import { invoke } from "~/routes/play/demo/-model"; export const reuse = invoke;',
    ],
  ]);
  assert.deepEqual(auditMigrationSources(colocated, { boundaries: false }), []);
});

function completeFixture() {
  const sources = new Map();
  for (const file of [
    "src/routes/library/button/-button.tsx",
    "components/ui/Popover.tsx",
    "components/ui/Dialog.tsx",
    "components/ui/Border.tsx",
  ])
    sources.set(
      file,
      'export const variants = cva("ak-layer ak-frame ak-frame-card/card ak-frame-border");',
    );
  sources.set(
    "src/routes/library/button/-client-button.tsx",
    'import { Button as Action } from "@ariakit/react"; export const Button = () => <Action />;',
  );
  sources.set(
    "src/routes/-main.css",
    `@import "@ariakit/tailwind";
@source "../../../node_modules/streamdown/dist/*.js";
@theme { ${["color-canvas", "color-primary", "radius-field", "spacing-field", "radius-card", "spacing-card", "radius-dialog", "spacing-dialog", "radius-badge", "spacing-badge", "spacing-px"].map((name) => `--${name}: 1px;`).join(" ")} }
body { @apply ak-layer ak-layer-canvas; }`,
  );
  return sources;
}

test("boundary fixture passes without any count snapshot", () => {
  const sources = completeFixture();
  sources.set(
    "src/routes/new-route.tsx",
    'export const Route = () => <main className="ak-ink-70">new content</main>;',
  );
  assert.deepEqual(auditMigrationSources(sources), []);
});

test("CSS comment stripping preserves quoted glob syntax and still removes actual comments", () => {
  const sources = completeFixture();
  sources.set(
    "src/routes/-main.css",
    sources.get("src/routes/-main.css") +
      '\n/* --color-transparent: transparent; */\n@source "another/*.js";\n/* final comment */',
  );
  assert.deepEqual(auditMigrationSources(sources), []);
  sources.set(
    "src/routes/-main.css",
    sources.get("src/routes/-main.css") +
      "\n@theme { --color-transparent: transparent; }",
  );
  assert.deepEqual(
    auditMigrationSources(sources).map(({ rule }) => rule),
    ["transparent-token"],
  );
});

test("unused imports, comment-only frames and a canvas on html cannot fake completion", () => {
  const sources = completeFixture();
  sources.set(
    "components/ui/Dialog.tsx",
    '// ak-frame ak-frame-dialog/dialog\nconst fake = "ak-frame ak-frame-dialog/dialog";',
  );
  sources.set(
    "src/routes/library/button/-client-button.tsx",
    'import { Button } from "@ariakit/react"; const A = () => <div />;',
  );
  sources.set(
    "src/routes/-main.css",
    sources.get("src/routes/-main.css").replace("body {", "html {") +
      "\n@theme { --color-transparent: transparent; }",
  );
  assert.deepEqual(
    auditMigrationSources(sources)
      .map(({ rule }) => rule)
      .sort(),
    [
      "button-boundary",
      "canvas-boundary",
      "migration-boundary",
      "transparent-token",
    ].sort(),
  );
});

test("root JSX can establish the canvas; missing primitives and theme tokens fail", () => {
  const sources = completeFixture();
  sources.set(
    "src/routes/-main.css",
    sources
      .get("src/routes/-main.css")
      .replace("body { @apply ak-layer ak-layer-canvas; }", ""),
  );
  sources.set(
    "src/routes/__root.tsx",
    'const Root = () => <body className="ak-layer ak-layer-canvas" />;',
  );
  assert.deepEqual(auditMigrationSources(sources), []);
  sources.delete("components/ui/Popover.tsx");
  sources.set(
    "src/routes/-main.css",
    sources.get("src/routes/-main.css").replace("--spacing-px: 1px;", ""),
  );
  assert.deepEqual(
    auditMigrationSources(sources).map(({ rule }) => rule),
    ["migration-boundary", "theme-boundary"],
  );
});

test("inventory includes new nested production files and excludes scripts, fixtures, dependencies and output", async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), "ariakit-audit-"));
  try {
    for (const directory of [
      "components",
      "src/routes/nested",
      "lib",
      "scripts",
      "node_modules",
      ".output",
    ])
      await mkdir(path.join(root, directory), { recursive: true });
    for (const file of [
      "src/routes/nested/new.tsx",
      "components/new.tsx",
      "lib/new.ts",
      "scripts/fixture.tsx",
      "node_modules/bad.tsx",
      ".output/bad.tsx",
    ])
      await writeFile(path.join(root, file), "const A = () => <button />;");
    await writeFile(
      path.join(root, "src/routes/nested/image.png"),
      "not source",
    );
    const sources = await readMigrationSources(root);
    assert.deepEqual(
      [...sources.keys()],
      ["components/new.tsx", "src/routes/nested/new.tsx", "lib/new.ts"],
    );
    assert.equal(
      auditMigrationSources(sources, { boundaries: false }).length,
      3,
    );
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
