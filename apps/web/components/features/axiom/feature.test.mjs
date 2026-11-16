import assert from "node:assert/strict";
import test from "node:test";
import {
  createReceiptIndex,
  emptyCollection,
  normalizeCollection,
  updateCollection,
} from "./model.ts";

const receipt = (label) => ({
  id: "shared",
  label,
  detail: label,
  source: label,
  kind: "review",
});
const beat = (label) => ({
  id: "beat",
  label,
  period: "now",
  receipts: [receipt(label)],
  story: { trigger: label, content: [], receiptIds: ["shared"] },
});

test("receipt maps, numbering and collection transitions isolate overlapping IDs", () => {
  const a = createReceiptIndex([beat("first")]);
  const b = createReceiptIndex([beat("second")]);
  assert.equal(a.receiptById.get("shared").label, "first");
  assert.equal(b.receiptById.get("shared").label, "second");
  a.receiptById.clear();
  assert.equal(b.receiptNumberById.get("shared"), 1);
  assert.equal(b.receiptById.size, 1);
  const first = updateCollection(emptyCollection(), {
    type: "preview",
    id: "shared",
  });
  assert.deepEqual(first.receiptOrder, []);
  assert.deepEqual(
    updateCollection(first, { type: "preview", id: "shared" }).receiptOrder,
    [],
  );
  const dismissed = updateCollection(first, { type: "dismiss", id: "shared" });
  assert.deepEqual(dismissed.receiptOrder, ["shared"]);
  assert.equal(dismissed.previewId, null);
  assert.equal(emptyCollection().previewId, null);
  assert.deepEqual(emptyCollection().receiptOrder, []);
});

test("empty beats stay empty and removed receipts cannot leak into current output", () => {
  const empty = createReceiptIndex([]);
  assert.deepEqual(empty.storyReceipts, []);
  assert.equal(empty.receiptById.size, 0);
  const state = {
    hoveredId: "shared",
    selectedId: "shared",
    previewId: "shared",
    receiptOrder: ["shared"],
  };
  assert.deepEqual(
    normalizeCollection(state, empty.receiptById),
    emptyCollection(),
  );
  assert.deepEqual(state.receiptOrder, ["shared"]);
});

test("selection, preview switching and reorder retain independent ownership", () => {
  const state = { ...emptyCollection(), receiptOrder: ["a", "b", "c"] };
  const selected = updateCollection(state, { type: "select", id: "a" });
  assert.equal(selected.selectedId, "a");
  const reordered = updateCollection(selected, {
    type: "reorder",
    id: "a",
    targetIndex: 2,
  });
  assert.deepEqual(reordered.receiptOrder, ["b", "c", "a"]);
  assert.deepEqual(state.receiptOrder, ["a", "b", "c"]);
  assert.equal(reordered.selectedId, "a");
  const preview = updateCollection(
    updateCollection(emptyCollection(), { type: "preview", id: "a" }),
    { type: "preview", id: "b" },
  );
  assert.deepEqual(preview.receiptOrder, ["a"]);
  assert.equal(preview.previewId, "b");
});
