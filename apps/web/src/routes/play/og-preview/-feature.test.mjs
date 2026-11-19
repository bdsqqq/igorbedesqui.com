import assert from "node:assert/strict";
import test from "node:test";
import { createImageLoad, defaultOgText, generateOgUrl } from "./-model.ts";

function imageFixture() {
  let src;
  return {
    onload: null,
    onerror: null,
    set src(value) {
      assert.equal(typeof this.onload, "function");
      assert.equal(typeof this.onerror, "function");
      src = value;
    },
    get src() {
      return src;
    },
  };
}

test("default URL encoding, multiline input and empty supplied text remain compatible", () => {
  assert.equal(
    generateOgUrl(defaultOgText),
    "/api/og?text=hello%2C%20*world*%2Fnthis%20is%20a%20new%20line",
  );
  assert.equal(generateOgUrl(""), "/api/og?text=");
  assert.equal(generateOgUrl("a\nb"), "/api/og?text=a%2Fnb");
});

test("a rejected URL can retry; simultaneous loads own distinct image handlers", async () => {
  const first = imageFixture();
  const rejected = createImageLoad("/same.png", () => first);
  first.onerror();
  const failure = await rejected.promise;
  assert.equal(failure.status, "error");
  assert.match(failure.error.message, /Unable to load preview/);
  rejected.dispose();
  assert.equal(first.onload, null);
  const second = imageFixture();
  const retry = createImageLoad("/same.png", () => second);
  const third = imageFixture();
  const parallel = createImageLoad("/same.png", () => third);
  second.onload();
  third.onload();
  assert.deepEqual(await retry.promise, { status: "ready", src: "/same.png" });
  assert.deepEqual(await parallel.promise, {
    status: "ready",
    src: "/same.png",
  });
  retry.dispose();
  parallel.dispose();
  assert.equal(second.onerror, null);
  assert.equal(third.onload, null);
});
