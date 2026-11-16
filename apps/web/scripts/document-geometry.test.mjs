import assert from "node:assert/strict";
import test from "node:test";
import { aligned, borderless, compensated } from "./document-geometry.mjs";

const frame = (left, margin = 0, padding = 16) => ({
  tag: "DIV",
  left,
  border: [1, 1, 1, 1],
  padding: [padding, padding, padding, padding],
  margin: [margin, margin, margin, margin],
  contentLeft: left + 1 + padding,
});

test("uncompensated b1 fails; stroke compensation and combined gutters pass", () => {
  assert.throws(
    () => compensated(frame(100), { baseline: 100 }),
    /inner edge cancels stroke/,
  );
  compensated(frame(99, -1), { baseline: 100 });
  // A visual offset alone must not replace the negative-margin contract.
  assert.throws(
    () => compensated(frame(99), { baseline: 100 }),
    /negative start margin cancels stroke/,
  );
  compensated(frame(83, -17), { baseline: 100, gutter: 16 });
  // Removing only stroke compensation from a combined gutter is also caught.
  assert.throws(
    () => compensated(frame(84, -16), { baseline: 100, gutter: 16 }),
    /inner edge cancels stroke/,
  );
  assert.throws(() => aligned(101, 100), /document coordinate/);
});

test("inline edges reject borders and rings while allowing focus outlines", () => {
  const plain = {
    tag: "BUTTON",
    border: [0, 0, 0, 0],
    visibleShadow: false,
    outlineWidth: "2px",
  };
  borderless(plain);
  assert.throws(
    () => borderless({ ...plain, border: [1, 1, 1, 1] }),
    /persistent border/,
  );
  assert.throws(
    () =>
      borderless({
        ...plain,
        visibleShadow: true,
        shadow: "rgb(0, 0, 0) 0px 0px 0px 1px",
      }),
    /persistent ring/,
  );
});

test("computed shadow sampling rejects a real ring and ignores transparent placeholders", async () => {
  const { measure } = await import("./document-geometry.mjs");
  const original = new Map(
    ["getComputedStyle", "document", "NodeFilter"].map((key) => [
      key,
      Object.getOwnPropertyDescriptor(globalThis, key),
    ]),
  );
  try {
    globalThis.NodeFilter = { SHOW_TEXT: 4 };
    globalThis.document = {
      createTreeWalker: () => ({ nextNode: () => null }),
    };
    const element = {
      tagName: "SPAN",
      getBoundingClientRect: () => ({ left: 100, right: 200, width: 100 }),
    };
    for (const [shadow, visible] of [
      ["none", false],
      ["rgba(0, 0, 0, 0) 0px 0px 0px 1px, rgb(0, 0, 0) 0px 0px 0px 0px", false],
      [
        "rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgb(80, 80, 80) 0px 0px 0px 1px",
        true,
      ],
      ["rgba(0, 0, 0, 0.2) 0px 0px 0px 1px", true],
    ]) {
      globalThis.getComputedStyle = () =>
        new Proxy(
          { boxShadow: shadow },
          { get: (object, key) => object[key] ?? "0px" },
        );
      assert.equal(measure(element).visibleShadow, visible, shadow);
    }
  } finally {
    for (const [key, descriptor] of original) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
