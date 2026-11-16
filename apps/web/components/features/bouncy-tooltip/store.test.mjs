import assert from "node:assert/strict";
import { test } from "node:test";
import { createBouncyTooltipStore } from "./store.ts";

test("tooltip hover and position isolate; reset restores a copied seed", () => {
  const seed = { x: 0, y: 0 };
  const a = createBouncyTooltipStore(seed);
  const b = createBouncyTooltipStore(seed);
  seed.x = 99;
  a.getState().updatePos(20, 30);
  a.getState().setIsHovering(true);
  assert.equal(b.getState().isHovering, false);
  assert.deepEqual(b.getState().pos, { x: 0, y: 0 });
  a.getState().reset();
  assert.equal(a.getState().isHovering, false);
  assert.deepEqual(a.getState().pos, { x: 0, y: 0 });
});
