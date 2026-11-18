import { test, expect } from "@playwright/test";

async function observeSwap(button) {
  await button.evaluate((element) => {
    window.copyFrames = [];
    const root = element.querySelector(".copy-feedback");
    const sample = () =>
      [...root.children].map((layer) => {
        const style = getComputedStyle(layer);
        const box = layer.getBoundingClientRect();
        return {
          opacity: Number(style.opacity),
          scale: new DOMMatrixReadOnly(
            style.transform === "none" ? undefined : style.transform,
          ).a,
          blur: parseFloat(style.filter.match(/blur\(([^)]+)px\)/)?.[1] ?? "0"),
          center: [box.x + box.width / 2, box.y + box.height / 2],
        };
      });
    new MutationObserver(() => {
      // Force style resolution before inspecting the browser's actual transitions.
      sample();
      const animations = root.getAnimations({ subtree: true });
      const saved = animations.map((animation) => [
        animation,
        animation.currentTime,
        animation.playState,
      ]);
      const record = {
        success: root.children[1].dataset.visible === "true",
        effects: animations.map((animation) => ({
          duration: animation.effect.getTiming().duration,
          keyframes: animation.effect.getKeyframes(),
        })),
        samples: [],
      };
      for (const animation of animations) animation.pause();
      // Seeking exactly to the end can retire a native CSS transition.
      for (const progress of [0, 0.5, 0.999]) {
        for (const animation of animations) {
          animation.currentTime =
            Number(animation.effect.getTiming().duration) * progress;
        }
        record.samples.push(sample());
      }
      for (const [animation, time, state] of saved) {
        animation.currentTime = time;
        if (state === "running") animation.play();
      }
      window.copyFrames.push(record);
    }).observe(root, {
      subtree: true,
      attributes: true,
      attributeFilter: ["data-visible"],
    });
  });
}

function assertMorph(record) {
  expect(record.effects).toHaveLength(6);
  for (const effect of record.effects) expect(effect.duration).toBe(180);
  const [start, middle, end] = record.samples;
  for (let index = 0; index < 2; index++) {
    expect(middle[index].opacity).toBeGreaterThan(0);
    expect(middle[index].opacity).toBeLessThan(1);
    expect(middle[index].scale).toBeGreaterThan(0.9);
    expect(middle[index].scale).toBeLessThan(1);
    expect(middle[index].blur).toBeGreaterThan(0);
    expect(middle[index].blur).toBeLessThan(2);
    expect(end[index].opacity).not.toBe(start[index].opacity);
  }
  expect(middle[0].center[0]).toBeCloseTo(middle[1].center[0], 2);
  expect(middle[0].center[1]).toBeCloseTo(middle[1].center[1], 2);
}

async function copyButton(page, route, name) {
  const response = await page.goto(route);
  expect(response.ok()).toBe(true);
  await expect(
    page.getByRole("button", { name: "inspect portals", exact: true }),
  ).toBeAttached();
  if (route === "/")
    await page
      .getByRole("button", { name: "email", exact: true })
      .first()
      .click();
  await expect(
    page.getByRole("button", { name, exact: true }).first(),
  ).toBeVisible();
  return page.locator("button:has(.copy-feedback)").first();
}

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.denyCopy = false;
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async () => {
          if (window.denyCopy) throw new Error("denied");
        },
      },
    });
  });
});

for (const [route, name] of [
  ["/", "Copy email address"],
  ["/writing/macos-rice", "Copy to clipboard"],
  ["/play/game-of-life", "Copy current game state"],
]) {
  test(`copy feedback overlaps, blends and resets: ${route}`, async ({
    page,
  }, testInfo) => {
    await page.emulateMedia({ reducedMotion: "no-preference" });
    const button = await copyButton(page, route, name);
    const before = await button.evaluate((element) => ({
      width: element.offsetWidth,
      height: element.offsetHeight,
    }));
    await observeSwap(button);
    await button.click();
    await expect(button).toHaveAttribute("aria-label", "Copied to clipboard");
    await expect
      .poll(() => page.evaluate(() => window.copyFrames.length))
      .toBeGreaterThan(0);
    const entered = await page.evaluate(() =>
      window.copyFrames.find((frame) => frame.success),
    );
    assertMorph(entered);
    const after = await button.evaluate((element) => ({
      width: element.offsetWidth,
      height: element.offsetHeight,
    }));
    expect(after.width).toBeCloseTo(before.width, 2);
    expect(after.height).toBeCloseTo(before.height, 2);
    await expect(button).toHaveAttribute("aria-label", name);
    await expect
      .poll(() =>
        page.evaluate(() => window.copyFrames.some((frame) => !frame.success)),
      )
      .toBe(true);
    const left = await page.evaluate(() =>
      window.copyFrames.find((frame) => !frame.success),
    );
    // Return interpolation is sampled on short pages; the long article can
    // retire effects between browser frames. Every consumer must reach rest.
    if (route !== "/writing/macos-rice") assertMorph(left);
    await expect(button.locator(".copy-feedback > span").nth(0)).toHaveCSS(
      "opacity",
      "1",
    );
    await expect(button.locator(".copy-feedback > span").nth(1)).toHaveCSS(
      "opacity",
      "0",
    );
    await testInfo.attach("copy-feedback-interpolation", {
      body: JSON.stringify({ entered, left }),
      contentType: "application/json",
    });
  });
}

for (const mode of ["reduced", "keyboard"]) {
  test(`copy feedback swaps without motion: ${mode}`, async ({ page }) => {
    await page.emulateMedia({
      reducedMotion: mode === "reduced" ? "reduce" : "no-preference",
    });
    const button = await copyButton(page, "/", "Copy email address");
    if (mode === "keyboard") {
      await button.focus();
      await button.press("Enter");
    } else await button.click();
    await expect(button).toHaveAttribute("aria-label", "Copied to clipboard");
    const layers = button.locator(".copy-feedback > span");
    await expect(layers.nth(0)).toHaveCSS("opacity", "0");
    await expect(layers.nth(1)).toHaveCSS("opacity", "1");
    expect(
      await button.evaluate(
        (element) =>
          element
            .querySelector(".copy-feedback")
            .getAnimations({ subtree: true }).length,
      ),
    ).toBe(0);
    if (mode === "reduced") {
      for (const layer of await layers.all()) {
        await expect(layer).toHaveCSS("filter", "none");
        await expect(layer).toHaveCSS("transform", "none");
      }
    }
  });
}

test("denied copy never shows a checkmark; retry still blends", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "no-preference" });
  const button = await copyButton(page, "/", "Copy email address");
  await page.evaluate(() => {
    window.denyCopy = true;
  });
  await button.click();
  await expect(button).toHaveAttribute(
    "aria-label",
    "Could not copy to clipboard",
  );
  await expect(button.locator(".copy-feedback > span").nth(1)).toHaveCSS(
    "opacity",
    "0",
  );
  await page.evaluate(() => {
    window.denyCopy = false;
  });
  await observeSwap(button);
  await button.click();
  await expect(button).toHaveAttribute("aria-label", "Copied to clipboard");
  await expect
    .poll(() =>
      page.evaluate(() => window.copyFrames.some((frame) => frame.success)),
    )
    .toBe(true);
  assertMorph(
    await page.evaluate(() => window.copyFrames.find((frame) => frame.success)),
  );
});

test("copy morph verifier rejects an isolated hard swap", async ({ page }) => {
  await page.setContent(
    `<style>.copy-feedback{display:inline-grid}.copy-feedback>span{grid-area:1/1;opacity:0}.copy-feedback>span[data-visible=true]{opacity:1}</style><button><span class="copy-feedback"><span data-visible="true">copy</span><span data-visible="false">check</span></span></button>`,
  );
  const button = page.getByRole("button");
  await observeSwap(button);
  await button.evaluate((element) => {
    const layers = element.querySelectorAll(".copy-feedback > span");
    layers[0].dataset.visible = "false";
    layers[1].dataset.visible = "true";
  });
  await expect
    .poll(() => page.evaluate(() => window.copyFrames.length))
    .toBe(1);
  const record = await page.evaluate(() => window.copyFrames[0]);
  expect(() => assertMorph(record)).toThrow();
});
