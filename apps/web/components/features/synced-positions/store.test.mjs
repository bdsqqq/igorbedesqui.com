import assert from "node:assert/strict";
import { test } from "node:test";
import { createCursorPositionStore } from "./store.ts";

test("cursor instances and reset seeds do not alias caller data or each other", () => {
  const input = { x: 0, y: 0 };
  const a = createCursorPositionStore(input);
  const b = createCursorPositionStore(input);
  input.x = 20;
  a.getState().updatePos(3, 4);
  assert.deepEqual(a.getState().pos, { x: 3, y: 4 });
  assert.deepEqual(b.getState().pos, { x: 0, y: 0 });
  a.getState().reset();
  assert.deepEqual(a.getState().pos, { x: 0, y: 0 });
});
