import assert from "node:assert/strict";
import { test } from "node:test";
import { pokemonSpriteGeometry } from "./-sprite.ts";

test("static sprite coordinates preserve original sheet math, including zero", () => {
  assert.deepEqual(pokemonSpriteGeometry(885), {
    left: 1080,
    top: 6570,
    width: 120,
    height: 90,
    sheetWidth: 1440,
    sheetHeight: 11970,
  });
  assert.equal(pokemonSpriteGeometry(0, 1).left, 0);
  assert.equal(pokemonSpriteGeometry(1595, 1).top, 3960);
  for (const number of [-1, 1.5, NaN, 1596])
    assert.throws(() => pokemonSpriteGeometry(number), /dexNumber/);
  for (const scale of [0, -1, Infinity, NaN])
    assert.throws(() => pokemonSpriteGeometry(0, scale), /scale/);
});
