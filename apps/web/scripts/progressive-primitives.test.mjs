import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import test from "node:test";
import { createElement as h } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import ts from "typescript";

const root = fileURLToPath(new URL("../", import.meta.url));
// Transpile-only loader: no compiler program, typecheck, browser, or build.
async function fixture(run, overrides = {}) {
  const directory = await mkdtemp(
    path.join(tmpdir(), "progressive-primitives-"),
  );
  const modules = new Map();
  async function compile(filename) {
    if (modules.has(filename)) return modules.get(filename);
    const output = path.join(directory, `${modules.size}.mjs`);
    modules.set(filename, output);
    const source =
      overrides[path.relative(root, filename)] ??
      (await readFile(filename, "utf8"));
    let code = ts.transpileModule(source, {
      fileName: filename,
      compilerOptions: {
        jsx: ts.JsxEmit.ReactJSX,
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    const imports = [...code.matchAll(/(from\s+)(["'])([^"']+)\2/g)];
    for (const match of imports) {
      const specifier = match[3];
      let url;
      if (
        specifier.startsWith("~/") ||
        specifier.startsWith("@/") ||
        specifier.startsWith(".")
      ) {
        const base = specifier.startsWith("~/")
          ? path.join(root, "src", specifier.slice(2))
          : specifier.startsWith("@/")
            ? path.join(root, specifier.slice(2))
            : path.resolve(path.dirname(filename), specifier);
        let resolved;
        for (const suffix of [".tsx", ".ts", "/index.tsx", "/index.ts"]) {
          try {
            if ((await stat(base + suffix)).isFile()) {
              resolved = base + suffix;
              break;
            }
          } catch {}
        }
        assert.ok(resolved, `resolve ${specifier}`);
        url = pathToFileURL(await compile(resolved)).href;
      } else url = import.meta.resolve(specifier);
      code = code.replace(match[0], match[1] + JSON.stringify(url));
    }
    await writeFile(output, code);
    return output;
  }
  try {
    await run(
      async (filename) =>
        import(pathToFileURL(await compile(path.join(root, filename))).href),
    );
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test("clipboard capability resolves its adapter per invocation and returns expected failures", async () =>
  fixture(async (load) => {
    const { copyText } = await load("lib/clipboard.ts");
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
    const writes = [];
    try {
      Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: { clipboard: { writeText: async (text) => writes.push(text) } },
      });
      assert.deepEqual(await copyText(""), { status: "success" });
      Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: {
          clipboard: { writeText: async (text) => writes.push(`next:${text}`) },
        },
      });
      await copyText("value");
      assert.deepEqual(writes, ["", "next:value"]);
      const denied = new Error("denied");
      assert.deepEqual(
        await copyText("no", {
          writeText: async () => {
            throw denied;
          },
        }),
        { status: "error", reason: "write-failed", error: denied },
      );
      await assert.rejects(
        copyText("bug", {
          writeText: () => {
            throw denied;
          },
        }),
        (error) => error === denied,
      );
      Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: {},
      });
      const unavailable = await copyText("no");
      assert.equal(unavailable.status, "error");
      assert.equal(unavailable.reason, "unavailable");
      assert.match(unavailable.error.message, /Clipboard is unavailable/);
    } finally {
      if (descriptor)
        Object.defineProperty(globalThis, "navigator", descriptor);
      else delete globalThis.navigator;
    }
  }));

test("portal registries are independent and stale cleanup cannot delete a newer registration", async () =>
  fixture(async (load) => {
    const { createPortalStore, InPortal } = await load(
      "src/routes/library/portals/-portal.tsx",
    );
    const first = createPortalStore();
    const second = createPortalStore();
    const old = { name: "same", intendedOut: "out" };
    const current = { name: "same", intendedOut: "new-out" };
    first.getState().addInPortal(old);
    first.getState().addInPortal(current);
    first.getState().removeInPortal("same", old);
    assert.equal(first.getState().inPortals.get("same"), current);
    assert.equal(second.getState().inPortals.size, 0);
    first.getState().removeInPortal("same", current);
    assert.equal(first.getState().inPortals.size, 0);
    const oldOut = { name: "out", ref: { current: null } };
    const nextOut = { name: "out", ref: { current: null } };
    first.getState().addOutPortal(oldOut);
    first.getState().addOutPortal(nextOut);
    first.getState().removeOutPortal("out", oldOut);
    assert.equal(first.getState().outPortals.get("out"), nextOut);
    assert.throws(
      () =>
        renderToStaticMarkup(
          h(InPortal, { name: "missing", outPortalName: "out" }),
        ),
      /Missing PortalStoreProvider/,
    );
  }));

test("runtime owner conflicts fail clearly, including false open", async () =>
  fixture(async (load) => {
    for (const [file, name] of [
      ["Dialog", "Dialog"],
      ["Popover", "Popover"],
      ["Tooltip", "TooltipRoot"],
    ]) {
      const components = await load(`components/ui/${file}.tsx`);
      assert.throws(
        () => renderToStaticMarkup(h(components[name], { open: false })),
        /requires onOpenChange/,
      );
      assert.throws(
        () =>
          renderToStaticMarkup(
            h(components[name], {
              open: false,
              defaultOpen: false,
              onOpenChange() {},
            }),
          ),
        /forbids defaultOpen/,
      );
    }
    const { Dialog, DialogTrigger } = await load("components/ui/Dialog.tsx");
    assert.throws(
      () =>
        renderToStaticMarkup(
          h(
            Dialog,
            null,
            h(
              DialogTrigger,
              { asChild: true, render: h("button") },
              h("button"),
            ),
          ),
        ),
      /either asChild or render/,
    );
  }));

test("copy feedback preserves caller icon slots, including zero and no icon", async () =>
  fixture(async (load) => {
    const { CopyButton } = await load("components/ui/CopyButton.tsx");
    for (const icon of [
      0,
      null,
      false,
      { right: h("svg", { "data-caller-icon": "right" }) },
      { left: 0, right: h("svg", { "data-caller-icon": "right" }) },
    ]) {
      const markup = renderToStaticMarkup(
        h(CopyButton, { contentToCopy: "", icon }, "copy"),
      );
      assert.match(markup, /class="copy-feedback"/);
      assert.match(markup, /data-visible="false"/);
      if (icon === 0 || icon?.left === 0)
        assert.match(markup, /data-visible="true">0<\/span>/);
      if (typeof icon === "object" && icon?.right)
        assert.match(markup, /data-caller-icon="right"/);
    }
  }));

test("copy forwards native render props; its own handler respects cancellation and lazy reads", async () =>
  fixture(async (load) => {
    const { CopyButton } = await load("components/ui/CopyButton.tsx");
    const writes = [];
    let reads = 0;
    let endpoint;
    const callbacks = [];
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, "navigator");
    try {
      Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: { clipboard: { writeText: async (text) => writes.push(text) } },
      });
      let handler;
      const copied = [];
      const failed = [];
      function Capture(props) {
        const tree = CopyButton(props);
        handler = tree.props.children.props.onClick;
        return tree;
      }
      const markup = renderToStaticMarkup(
        h(Capture, {
          contentToCopy: () => {
            reads++;
            return "lazy";
          },
          title: "custom",
          onCopied: (text) => copied.push(text),
          onCopyError: (error) => failed.push(error),
          ref: () => {},
          onClick: (event) => callbacks.push(event.defaultPrevented),
          render: (props) => {
            endpoint = props;
            return h("button", props);
          },
        }),
      );
      assert.match(markup, /title="custom"/);
      assert.equal(typeof endpoint.ref, "function");
      assert.equal(reads, 0);
      handler({ defaultPrevented: true });
      await Promise.resolve();
      assert.equal(reads, 0);
      handler({ defaultPrevented: false });
      await new Promise(setImmediate);
      assert.deepEqual(writes, ["lazy"]);
      assert.deepEqual(callbacks, [true, false]);
      assert.deepEqual(copied, ["lazy"]);
      const denied = new Error("write denied");
      Object.defineProperty(globalThis, "navigator", {
        configurable: true,
        value: {
          clipboard: {
            writeText: async () => {
              throw denied;
            },
          },
        },
      });
      handler({ defaultPrevented: false });
      await new Promise(setImmediate);
      assert.deepEqual(copied, ["lazy"]);
      assert.deepEqual(failed, [denied]);
    } finally {
      if (descriptor)
        Object.defineProperty(globalThis, "navigator", descriptor);
      else delete globalThis.navigator;
    }
  }));

test("border forwards native props and keeps zero/false wrapper values", async () =>
  fixture(async (load) => {
    const { Border } = await load("components/ui/Border.tsx");
    assert.match(
      renderToStaticMarkup(h(Border, { asWrapper: true, title: "wrapper" }, 0)),
      /title="wrapper"[^>]*>0<\/span>/,
    );
    assert.match(
      renderToStaticMarkup(h(Border, { asWrapper: true }, false)),
      /<span[^>]*><\/span>/,
    );
    const markup = renderToStaticMarkup(
      h(
        Border,
        { title: "outer", className: "custom" },
        h("div", { "data-child": "kept" }),
      ),
    );
    assert.match(markup, /title="outer"/);
    assert.match(markup, /data-child="kept"/);
    assert.equal((markup.match(/<div/g) ?? []).length, 1);
  }));

test("the owner guard check detects a deliberately broken isolated fixture", async () => {
  const filename = "components/ui/Dialog.tsx";
  const source = await readFile(path.join(root, filename), "utf8");
  const broken = source.replace(
    "open !== undefined && (defaultOpen !== undefined || !onOpenChange)",
    "false",
  );
  assert.notEqual(broken, source);
  await assert.rejects(
    fixture(
      async (load) => {
        const { Dialog } = await load(filename);
        assert.throws(
          () => renderToStaticMarkup(h(Dialog, { open: false })),
          /requires onOpenChange/,
        );
      },
      { [filename]: broken },
    ),
    /Missing expected exception/,
  );
});
