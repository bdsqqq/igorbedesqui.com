import assert from "node:assert/strict";
import test from "node:test";
import {
  filterScalePresets,
  getScaleFrequency,
  initialScalesValues,
  resolveScales,
  scalePresets,
} from "./-model.ts";

test("default calculation and original invalid-input fallbacks retain the text draft", () => {
  assert.deepEqual(resolveScales(initialScalesValues), {
    ratio: 1,
    scaleLength: 14,
    f0: 1,
    invalid: { ratio: false, scaleLength: false, f0: false },
  });
  const draft = { ratio: "", scaleLength: "-", f0: "oops" };
  assert.deepEqual(resolveScales(draft), {
    ratio: 2,
    scaleLength: 14,
    f0: 1,
    invalid: { ratio: true, scaleLength: true, f0: true },
  });
  assert.deepEqual(draft, { ratio: "", scaleLength: "-", f0: "oops" });
  assert.equal(getScaleFrequency(0, 2, 14, 1), 1);
  assert.equal(getScaleFrequency(14, 2, 14, 1), 20);
});

test("caller presets, [] and numeric zero are data; calculations do not share output", () => {
  assert.deepEqual(filterScalePresets([], ""), []);
  assert.deepEqual(filterScalePresets([{ name: "caller", value: "7" }], "7"), [
    { name: "caller", value: "7" },
  ]);
  assert.equal(filterScalePresets(scalePresets, "1,067")[0].value, "1.067");
  const a = resolveScales({ ratio: "1,25", scaleLength: "4.9", f0: "0" });
  const b = resolveScales(initialScalesValues);
  assert.equal(a.ratio, 1.25);
  assert.equal(a.scaleLength, 4);
  assert.equal(a.f0, 0);
  assert.equal(b.f0, 1);
  assert.equal(b.scaleLength, 14);
});
