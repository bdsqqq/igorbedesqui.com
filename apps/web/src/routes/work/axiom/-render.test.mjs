import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { createRequire, registerHooks } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";

// A bounded TSX loader lets these real-component output checks run without a server/build.
const require = createRequire(import.meta.url);
const ts = require("typescript");
const web = fileURLToPath(new URL("../../../../", import.meta.url));
registerHooks({
  resolve(specifier, context, next) {
    const local = specifier.startsWith("~/")
      ? path.join(web, "src", specifier.slice(2))
      : specifier.startsWith("@/")
        ? path.join(web, specifier.slice(2))
        : specifier.startsWith(".") && context.parentURL?.startsWith("file:")
          ? path.resolve(
              path.dirname(fileURLToPath(context.parentURL)),
              specifier,
            )
          : null;
    if (local) {
      const found = [
        local + ".tsx",
        local + ".ts",
        path.join(local, "index.tsx"),
        path.join(local, "index.ts"),
      ].find(existsSync);
      if (found) return next(pathToFileURL(found).href, context);
    }
    return next(specifier, context);
  },
  load(url, context, next) {
    if (url.startsWith("file:") && /\.tsx?$/.test(url)) {
      return {
        format: "module",
        shortCircuit: true,
        source: ts.transpileModule(readFileSync(fileURLToPath(url), "utf8"), {
          fileName: fileURLToPath(url),
          compilerOptions: {
            jsx: ts.JsxEmit.ReactJSX,
            module: ts.ModuleKind.ESNext,
            target: ts.ScriptTarget.ES2022,
          },
        }).outputText,
      };
    }
    return next(url, context);
  },
});
const { createElement: h } = await import("react");
const { renderToStaticMarkup: render } = await import("react-dom/server");
const { AxiomStory, AxiomCollection, AxiomTimeline } =
  await import("./-story.tsx");
const { Scales, ScalesResults, ScalesInputs } =
  await import("../../writing/scales/-scales.tsx");
const { OgPreview, OgTextEditor, OgGeneratedUrl } =
  await import("../../play/og-preview/-preview.tsx");

const beat = (label) => ({
  id: "same-beat",
  label,
  period: label,
  receipts: [
    { id: "same-receipt", label, detail: label, source: label, kind: "review" },
  ],
  story: { trigger: label, content: [], receiptIds: ["same-receipt"] },
});
const collected = {
  hoveredId: null,
  selectedId: "same-receipt",
  previewId: null,
  receiptOrder: ["same-receipt"],
};

test("two real story roots scope DOM IDs, receipt output and selection", () => {
  const markup = render(
    h(
      "div",
      null,
      h(AxiomStory, { beats: [beat("alpha")], defaultValue: collected }),
      h(
        AxiomStory,
        { beats: [beat("beta")] },
        h(AxiomTimeline),
        h(AxiomCollection),
      ),
    ),
  );
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(ids.length > 2);
  assert.equal(ids.length, new Set(ids).size);
  assert.equal(
    (markup.match(/data-receipt-id="same-receipt"/g) ?? []).length,
    1,
  );
  assert.match(markup, /aria-pressed="true"/);
  assert.match(markup, /attachments 1\/1/);
  assert.doesNotMatch(
    render(h(AxiomStory, { beats: [] })),
    /alpha|beta|attachment 1|Lorem/,
  );
});

test("real scales parts keep supplied drafts and output separate, with empty presets", () => {
  const markup = render(
    h(
      "div",
      null,
      h(
        Scales,
        {
          presets: [],
          defaultValues: { ratio: "", scaleLength: "2", f0: "0" },
        },
        h(ScalesInputs),
        h(ScalesResults),
      ),
      h(
        Scales,
        {
          presets: [],
          values: { ratio: "3", scaleLength: "3", f0: "2" },
          onValuesChange() {},
        },
        h(ScalesInputs),
        h(ScalesResults),
      ),
    ),
  );
  assert.match(markup, /value=""/);
  assert.match(markup, /Ratio is not a valid number/);
  assert.match(markup, /value="3"/);
  assert.match(markup, /value="0"/);
  assert.doesNotMatch(markup, /Minor Second|Major Second/);
  const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, new Set(ids).size);
});

test("scales input widths use the supplied draft before refs mount", () => {
  for (const [values, expected] of [
    [{ ratio: "1.250", f0: "0.125", scaleLength: "14" }, [5, 5, 2]],
    [{ ratio: "", f0: "", scaleLength: "" }, [1, 1, 2]],
  ]) {
    const markup = render(
      h(Scales, { values, onValuesChange() {}, presets: [] }, h(ScalesInputs)),
    );
    const widths = [
      ...markup.matchAll(/width:calc\((\d+)ch \+ 0\.5rem\)/g),
    ].map((match) => Number(match[1]));
    assert.deepEqual(widths, expected);
  }
});

test("supplied og data renders editor/url parts without generating or requesting images", () => {
  const originalFetch = globalThis.fetch;
  const originalImage = globalThis.Image;
  globalThis.fetch = () => {
    throw new Error("unexpected fetch");
  };
  globalThis.Image = function () {
    throw new Error("unexpected image load during static output");
  };
  try {
    const markup = render(
      h(
        "div",
        null,
        h(
          OgPreview,
          {
            defaultText: "",
            preview: { url: "/caller.png", displayUrl: "caller-url" },
          },
          h(OgTextEditor),
          h(OgGeneratedUrl),
        ),
        h(
          OgPreview,
          {
            text: "draft kept",
            onTextChange() {},
            generatePreviewUrl: (text) => `/custom/${text}`,
          },
          h(OgTextEditor),
          h(OgGeneratedUrl),
        ),
      ),
    );
    assert.match(markup, /caller-url/);
    assert.match(markup, /draft kept/);
    assert.match(markup, /\/custom\/draft kept/);
    assert.doesNotMatch(markup, />hello,|api\/og/);
    assert.match(markup, /name="text"><\/textarea>/);
    const ids = [...markup.matchAll(/\sid="([^"]+)"/g)].map(
      (match) => match[1],
    );
    assert.equal(ids.length, new Set(ids).size);
  } finally {
    globalThis.fetch = originalFetch;
    globalThis.Image = originalImage;
  }
});
