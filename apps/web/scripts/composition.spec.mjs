import { test, expect } from "@playwright/test";

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="160" height="80"><rect width="160" height="80" fill="#357"/></svg>';
const errors = new WeakMap();
test.beforeEach(async ({ page }) => {
  const caught = [];
  errors.set(page, caught);
  page.on("pageerror", (error) => caught.push(error.message));
  await page.route("**/fixture-image.svg*", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: svg }),
  );
  await page.route("**/_vercel/image?*", (route) =>
    route.fulfill({ contentType: "image/svg+xml", body: svg }),
  );
  await page.addInitScript(() => {
    window.clipboardEvidence = { writes: [], reject: false };
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.clipboardEvidence.writes.push(text);
          if (window.clipboardEvidence.reject)
            throw new Error("fixture denied clipboard");
        },
      },
    });
  });
});
test.afterEach(async ({ page }) => {
  expect(errors.get(page), "uncaught production runtime errors").toEqual([]);
});
async function openCase(page, name, host = "page", suffix = "") {
  await page.goto(`/?case=${name}&host=${host}${suffix}`);
  await page.waitForFunction(() => !!window.composition?.host);
  if (host !== "page") {
    await expect(page.getByTestId("scenario")).toHaveCount(0);
    await page.getByRole("button", { name: "open host", exact: true }).click();
  }
  // An explicitly empty story has no painted box; attachment is the expected state.
  if (name === "axiom")
    await expect(page.getByTestId("scenario")).toBeAttached();
  else await expect(page.getByTestId("scenario")).toBeVisible();
}
async function controlledHostEvidence(page, host) {
  if (host === "page") return;
  const bounded = page.getByTestId("bounded-host");
  const box = await bounded.boundingBox();
  expect(box).not.toBeNull();
  expect(box.height).toBeLessThanOrEqual(341);
  expect(box.width).toBeLessThanOrEqual(561);
  expect(box.x).toBeGreaterThanOrEqual(0);
  expect(box.y).toBeGreaterThanOrEqual(0);
  expect(box.x + box.width).toBeLessThanOrEqual(1281);
  expect(await page.evaluate(() => window.composition.host.inspect())).toEqual({
    open: true,
    triggerRef: true,
    contentRef: true,
  });
  const scroll = await bounded.evaluate((element) => {
    element.scrollTop = element.scrollHeight;
    return {
      top: element.scrollTop,
      overflows: element.scrollHeight > element.clientHeight,
    };
  });
  if (scroll.overflows) expect(scroll.top).toBeGreaterThan(0);
  await page.evaluate(() => window.composition.host.setOpen(false));
  await expect(bounded).toHaveCount(0);
  await page.evaluate(() => window.composition.host.setOpen(true));
  await expect(bounded).toBeVisible();
  await expect
    .poll(() =>
      bounded.evaluate((element) => element.contains(document.activeElement)),
    )
    .toBe(true);
  await page.keyboard.press("Escape");
  await expect(bounded).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "open host", exact: true }),
  ).toBeFocused();
}
async function assertReplacement(page) {
  expect(
    await page.evaluate(() => window.composition.copy.inspect().ref),
    "replacement must forward the actual button ref",
  ).toBe(true);
  const before = await page.evaluate(
    () => window.composition.copy.inspect().clicks,
  );
  await page.getByTestId("copy-getter").click();
  await expect
    .poll(() => page.evaluate(() => window.composition.copy.inspect().clicks), {
      timeout: 1000,
      message: "replacement must forward the native onClick",
    })
    .toBe(before + 1);
}
for (const host of ["page", "dialog", "popover"]) {
  test(`copy native replacement, empty/default/getter, cancellation and error in ${host}`, async ({
    page,
  }) => {
    await openCase(page, "primitives", host);
    await expect(page.getByTestId("tip")).toBeHidden();
    await page.getByTestId("copy-empty").click();
    await expect
      .poll(() => page.evaluate(() => window.clipboardEvidence.writes))
      .toEqual([""]);
    await page.getByTestId("copy-default").click();
    await expect
      .poll(() => page.evaluate(() => window.clipboardEvidence.writes))
      .toEqual(["", "default path"]);
    await page.evaluate(() =>
      window.composition.copy.setText("latest caller state"),
    );
    await expect(page.getByTestId("copy-getter")).toHaveAttribute(
      "title",
      "caller title",
    );
    await expect(page.getByTestId("copy-getter")).toHaveCSS(
      "min-width",
      "120px",
    );
    await assertReplacement(page);
    await expect
      .poll(() => page.evaluate(() => window.composition.copy.inspect().copied))
      .toEqual(["latest caller state"]);
    await page.evaluate(() => window.composition.copy.cancel(true));
    const writes = await page.evaluate(
      () => window.clipboardEvidence.writes.length,
    );
    await page.getByTestId("copy-getter").click();
    expect(
      await page.evaluate(() => window.clipboardEvidence.writes.length),
    ).toBe(writes);
    await page.evaluate(() => {
      window.composition.copy.cancel(false);
      window.clipboardEvidence.reject = true;
    });
    await page.getByTestId("copy-getter").click();
    await expect
      .poll(() => page.evaluate(() => window.composition.copy.inspect().errors))
      .toBe(1);
    await expect(page.getByTestId("copy-getter")).toHaveAttribute(
      "aria-label",
      "Could not copy to clipboard",
    );
    expect(
      await page.evaluate(() => window.composition.copy.inspect().copied),
    ).toEqual(["latest caller state"]);
    await page.evaluate(() => {
      window.clipboardEvidence.reject = false;
      window.composition.copy.setText("retry caller text");
    });
    await page.getByTestId("copy-getter").click();
    await expect
      .poll(() => page.evaluate(() => window.composition.copy.inspect().copied))
      .toEqual(["latest caller state", "retry caller text"]);
    await expect(
      page.getByTestId("email").getByRole("link", { name: "Send an email" }),
    ).toHaveAttribute("href", "mailto:");
    await page.evaluate(() => window.composition.copy.setTip(true));
    await expect(page.getByTestId("tip")).toBeVisible();
    await expect(page.getByTestId("tip")).toHaveText("0");
    await expect(page.getByTestId("tip").locator("svg")).toHaveCount(0);
    await page.evaluate(() => window.composition.copy.setTip(false));
    await expect(page.getByTestId("tip")).toBeHidden();
    await controlledHostEvidence(page, host);
  });
  test(`image and lightbox refs, nested focus and dismissal in ${host}`, async ({
    page,
  }) => {
    await openCase(page, "images", host);
    await expect
      .poll(() => page.evaluate(() => window.composition.images.inspect().refs))
      .toEqual([true, true]);
    await expect(page.getByTestId("image")).toHaveCSS("border-radius", "3px");
    await expect
      .poll(() =>
        page
          .getByTestId("image")
          .evaluate((image) => image.complete && image.naturalWidth > 0),
      )
      .toBe(true);
    const enlarge = page.getByRole("button", { name: "enlarge image" });
    await enlarge.click();
    const lightbox = page.getByRole("dialog", {
      name: "lightbox image",
      exact: true,
    });
    await expect(lightbox).toBeVisible();
    await expect
      .poll(() => page.evaluate(() => window.composition.images.inspect().open))
      .toBe(true);
    await page.keyboard.press("Escape");
    await expect(lightbox).toHaveCount(0);
    await expect(enlarge).toBeFocused();
    await page.evaluate(() => window.composition.images.setOpen(true));
    await expect(lightbox).toBeVisible();
    await page.getByRole("button", { name: "close image preview" }).click();
    await expect(lightbox).toHaveCount(0);
    await controlledHostEvidence(page, host);
  });
  test(`scales controlled/uncontrolled drafts and parts in ${host}`, async ({
    page,
  }) => {
    const api = [];
    page.on("request", (request) => {
      if (
        request.resourceType() === "fetch" ||
        request.resourceType() === "xhr"
      )
        api.push(request.url());
    });
    await openCase(page, "scales", host);
    const a = page.getByTestId("scales-a"),
      b = page.getByTestId("scales-b");
    for (const root of [a, b]) {
      await expect(root.getByRole("combobox", { name: "Ratio" })).toHaveValue(
        "",
      );
      await expect(
        root.getByText("Ratio is not a valid number.", { exact: false }),
      ).toBeVisible();
      await expect(root.locator("sub")).toHaveCount(16);
    }
    await a.getByRole("combobox", { name: "Ratio" }).fill("garbage");
    await expect(a.getByRole("combobox", { name: "Ratio" })).toHaveValue(
      "garbage",
    );
    await expect(
      a.getByText("Ratio is not a valid number.", { exact: false }),
    ).toBeVisible();
    await expect(b.getByRole("combobox", { name: "Ratio" })).toHaveValue("");
    await a.getByRole("combobox", { name: "Ratio" }).fill("");
    await a.getByRole("combobox", { name: "Ratio" }).press("ArrowDown");
    await expect(page.getByRole("option")).toHaveCount(0);
    await page.evaluate(() =>
      window.composition.scales.setValues({
        ratio: "1",
        scaleLength: "2",
        f0: "0",
      }),
    );
    await expect(
      a.getByRole("textbox", {
        name: "Fundamental frequency (f0)",
        exact: true,
      }),
    ).toHaveValue("0");
    await expect(a.locator("sub")).toHaveCount(4);
    expect(await a.locator("sub").allTextContents()).toEqual([
      "0",
      "0",
      "0",
      "0",
    ]);
    const beforeCustom = await b.locator("sub").allTextContents();
    await b.getByTestId("custom-ratio").fill("1.25");
    await expect
      .poll(() => b.locator("sub").allTextContents())
      .not.toEqual(beforeCustom);
    await expect(a.getByRole("combobox", { name: "Ratio" })).toHaveValue("1");
    await page.evaluate(() => window.composition.scales.defaults());
    const defaults = page
      .getByTestId("scales-default")
      .getByRole("combobox", { name: "Ratio" });
    await defaults.fill("");
    await defaults.press("ArrowDown");
    await expect(
      page.getByRole("option", { name: /Minor Second/ }),
    ).toBeVisible();
    await page.getByRole("option", { name: /Minor Second/ }).click();
    await expect(defaults).toHaveValue("1.067");
    expect(api).toEqual([]);
    await controlledHostEvidence(page, host);
  });
  test(`supplied OG data bypasses generation while default and custom paths load in ${host}`, async ({
    page,
  }) => {
    const imageRequests = [],
      apis = [];
    page.on("request", (request) => {
      const url = new URL(request.url());
      if (
        ["/fixture-image.svg", "/custom-image", "/api/og"].includes(
          url.pathname,
        )
      )
        imageRequests.push(url.pathname + url.search);
      if (url.pathname.startsWith("/api/")) apis.push(url.pathname);
    });
    await page.route("**/api/og?*", (route) =>
      route.fulfill({ contentType: "image/svg+xml", body: svg }),
    );
    await page.route("**/custom-image?*", (route) =>
      route.fulfill({ contentType: "image/svg+xml", body: svg }),
    );
    await openCase(page, "og", host);
    await expect(page.getByRole("textbox")).toHaveValue("");
    await expect(
      page.getByRole("img", { name: "caller supplied preview" }),
    ).toBeVisible();
    await page.getByRole("textbox").fill("independent supplied draft");
    await expect
      .poll(() => page.evaluate(() => window.composition.og.inspect()))
      .toBe("independent supplied draft");
    expect(apis).toEqual([]);
    expect(
      imageRequests.every((url) => url === "/fixture-image.svg?source=one"),
    ).toBe(true);
    await expect(page.locator("code")).toHaveText("caller supplied display");
    await page.evaluate(() => {
      window.composition.og.mode("url");
      window.composition.og.url("/fixture-image.svg?source=two");
    });
    await expect(page.getByRole("img")).toHaveAttribute(
      "src",
      "/fixture-image.svg?source=two",
    );
    await expect(page.getByRole("textbox")).toHaveValue(
      "independent supplied draft",
    );
    expect(apis).toEqual([]);
    await page.evaluate(() => {
      window.composition.og.mode("default");
      window.composition.og.text("");
    });
    await expect(page.getByRole("img")).toHaveAttribute("src", "/api/og?text=");
    expect(apis.length).toBeGreaterThan(0);
    await page.evaluate(() => window.composition.og.mode("custom"));
    await page.getByRole("textbox").fill("caller custom");
    await expect(page.getByRole("img")).toHaveAttribute(
      "src",
      "/custom-image?text=caller%20custom",
    );
    await expect(page.getByRole("textbox")).toHaveValue("caller custom");
    await controlledHostEvidence(page, host);
  });
}
for (const fault of ["ref", "click"]) {
  test(`replacement verifier detects a caller dropping ${fault}`, async ({
    page,
  }) => {
    await openCase(page, "primitives", "page", `&fault=${fault}`);
    await expect(assertReplacement(page)).rejects.toThrow(
      fault === "ref"
        ? /forward the actual button ref/
        : /forward the native onClick/,
    );
  });
}

for (const host of ["page", "dialog", "popover"]) {
  test(`game external/owned timer lifetime and controls replacement in ${host}`, async ({
    page,
  }) => {
    await openCase(page, "game", host);
    await expect(
      page.getByTestId("empty-game").getByRole("button"),
    ).toHaveCount(0);
    await expect(
      page.getByTestId("external-board").getByRole("button"),
    ).toHaveCount(9);
    const external = page.getByTestId("external-game"),
      owned = page.getByTestId("owned-game");
    expect(
      await page.evaluate(() => {
        const s = window.composition.game.inspect();
        return [s.boardRef, s.cellRef];
      }),
    ).toEqual([true, true]);
    await page.getByTestId("custom-cell").click();
    await expect(page.getByTestId("custom-cell")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    await external.getByRole("button", { name: "Cell 5", exact: true }).click();
    await expect(
      external.getByRole("button", { name: "Cell 5", exact: true }),
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      owned.getByRole("button", { name: "Cell 5", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
    await external
      .getByRole("button", { name: "Copy current game state" })
      .click();
    await expect
      .poll(() => page.evaluate(() => window.clipboardEvidence.writes.at(-1)))
      .toBe("000010000");
    await external
      .getByRole("button", { name: "Calculate next state" })
      .click();
    await expect(
      external.getByRole("button", { name: "Cell 5", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
    await external.getByRole("button", { name: "Cell 1", exact: true }).click();
    await external.getByRole("button", { name: "Clear current state" }).click();
    await expect(
      external.getByRole("button", { name: "Cell 1", exact: true }),
    ).toHaveAttribute("aria-pressed", "false");
    await external.getByRole("button", { name: "Run simulation" }).click();
    await owned.getByRole("button", { name: "Run simulation" }).click();
    await expect
      .poll(() =>
        page.evaluate(() => window.composition.game.inspect().external.ticks),
      )
      .toBeGreaterThan(2);
    await page.evaluate(() => window.composition.game.controls("custom"));
    await expect(
      external.getByRole("button", { name: "custom playback" }),
    ).toBeVisible();
    const beforeReplacement = await page.evaluate(
      () => window.composition.game.inspect().external.ticks,
    );
    await expect
      .poll(() =>
        page.evaluate(() => window.composition.game.inspect().external.ticks),
      )
      .toBeGreaterThan(beforeReplacement + 1);
    await external.getByRole("button", { name: "custom playback" }).click();
    expect(
      await page.evaluate(
        () => window.composition.game.inspect().external.playing,
      ),
    ).toBe(false);
    await external.getByRole("button", { name: "custom playback" }).click();
    await page.evaluate(() => window.composition.game.controls("none"));
    const beforeRemoval = await page.evaluate(
      () => window.composition.game.inspect().external.ticks,
    );
    await expect
      .poll(() =>
        page.evaluate(() => window.composition.game.inspect().external.ticks),
      )
      .toBeGreaterThan(beforeRemoval + 1);
    await page.evaluate(() => window.composition.game.unmount());
    await expect(external).toHaveCount(0);
    const after = await page.evaluate(() => window.composition.game.inspect());
    expect(after.external.playing).toBe(true);
    expect(after.owned.playing).toBe(false);
    // Wait on the external timer as an actual clock; owned update count must stay fixed.
    await expect
      .poll(() =>
        page.evaluate(() => window.composition.game.inspect().external.ticks),
      )
      .toBeGreaterThan(after.external.ticks + 2);
    expect(
      await page.evaluate(() => window.composition.game.inspect().owned.ticks),
    ).toBe(after.owned.ticks);
  });
}

for (const host of ["page", "dialog", "popover"]) {
  test(`axiom overlapping IDs keep reveals, ARIA, preview, selection and order independent in ${host}`, async ({
    page,
  }) => {
    const api = [];
    page.on("request", (request) => {
      if (["fetch", "xhr"].includes(request.resourceType()))
        api.push(request.url());
    });
    await openCase(page, "axiom", host);
    await expect(page.getByTestId("scenario").getByRole("button")).toHaveCount(
      0,
    );
    await expect(page.getByTestId("scenario").locator("li")).toHaveCount(0);
    expect(api).toEqual([]);
    await page.evaluate(() => window.composition.axiom.setBeats(true));
    const a = page.getByTestId("story-a"),
      b = page.getByTestId("story-b");
    const revealA = a.getByRole("button", {
      name: "reveal details",
      exact: true,
    });
    const revealB = b.getByRole("button", {
      name: "reveal details",
      exact: true,
    });
    const contentA = await revealA.getAttribute("aria-controls"),
      contentB = await revealB.getAttribute("aria-controls");
    expect(contentA).not.toBe(contentB);
    await revealA.click();
    await expect(revealA).toHaveAttribute("aria-expanded", "true");
    await expect(revealB).toHaveAttribute("aria-expanded", "false");
    await expect(
      a.getByText("caller reveal content", { exact: true }),
    ).toBeVisible();
    await expect(
      b.getByText("caller reveal content", { exact: true }),
    ).toHaveCount(0);
    const referenceA = a
      .locator("ol")
      .getByRole("button", { name: "attachment 1: receipt one", exact: true })
      .first();
    const referenceB = b
      .locator("ol")
      .getByRole("button", { name: "attachment 1: receipt one", exact: true })
      .first();
    expect(await referenceA.getAttribute("aria-controls")).not.toBe(
      await referenceB.getAttribute("aria-controls"),
    );
    await referenceA.focus();
    await expect(referenceA).toHaveAttribute("aria-expanded", "true");
    await expect(referenceB).toHaveAttribute("aria-expanded", "false");
    const tooltipId = await referenceA.getAttribute("aria-controls");
    const preview = page.getByRole("tooltip");
    await expect(preview).toHaveAttribute("id", tooltipId);
    await expect(preview).toContainText("caller detail one");
    const box = await preview.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(15);
    expect(box.x + box.width).toBeLessThanOrEqual(1265);
    if (host === "page") await referenceA.press("Escape");
    else await revealA.focus();
    await expect(preview).toHaveCount(0);
    await a
      .getByRole("button", { name: "attachment 2: receipt two", exact: true })
      .first()
      .focus();
    await revealA.focus();
    const groupA = a.getByRole("group"),
      groupB = b.getByRole("group");
    await expect(groupA.getByRole("button")).toHaveCount(2);
    await expect(groupB).toHaveCount(0);
    await referenceB.focus();
    await expect(referenceB).toHaveAttribute("aria-expanded", "true");
    await expect(referenceA).toHaveAttribute("aria-expanded", "false");
    await revealB.focus();
    await b
      .locator("ol")
      .getByRole("button", { name: "attachment 2: receipt two", exact: true })
      .focus();
    await revealB.focus();
    await expect(groupB.getByRole("button")).toHaveCount(2);
    const card = groupA.getByRole("button", {
      name: "attachment 1: receipt one",
      exact: true,
    });
    await card.focus();
    await card.press("Enter");
    await expect(card).toHaveAttribute("aria-pressed", "true");
    await card.press("ArrowRight");
    await expect
      .poll(() =>
        page.evaluate(() => window.composition.axiom.inspect()[0].receiptOrder),
      )
      .toEqual(["two", "one"]);
    expect(
      await groupA
        .locator("[data-receipt-id]")
        .evaluateAll((nodes) => nodes.map((node) => node.dataset.receiptId)),
    ).toEqual(["two", "one"]);
    expect(
      await page.evaluate(() => window.composition.axiom.inspect()[1]),
    ).toEqual({
      hoveredId: null,
      previewId: null,
      selectedId: null,
      receiptOrder: ["one", "two"],
    });
    await expect(
      groupB.getByRole("button", {
        name: "attachment 1: receipt one",
        exact: true,
      }),
    ).toHaveAttribute("aria-pressed", "false");
    expect(
      await groupB
        .locator("[data-receipt-id]")
        .evaluateAll((nodes) => nodes.map((node) => node.dataset.receiptId)),
    ).toEqual(["one", "two"]);
    await a.getByRole("button", { name: "clear caller selection" }).click();
    await expect(card).toHaveAttribute("aria-pressed", "false");
    await page.evaluate(() =>
      window.composition.axiom.setFirst({
        hoveredId: null,
        previewId: null,
        selectedId: null,
        receiptOrder: [],
      }),
    );
    await expect(groupA).toHaveCount(0);
    expect(api).toEqual([]);
    await controlledHostEvidence(page, host);
  });
}

test("OG delayed old success cannot overwrite switched failed preview or dirty text; retry loads current URL", async ({
  page,
}) => {
  let releaseOld;
  const oldHeld = new Promise((resolve) => {
    releaseOld = resolve;
  });
  let oldSeen = false,
    currentAttempts = 0,
    allowCurrent = false;
  await page.route("**/fixture-image.svg?source=one", async (route) => {
    oldSeen = true;
    await oldHeld;
    await route.fulfill({ contentType: "image/svg+xml", body: svg });
  });
  await page.route("**/fixture-image.svg?source=current", (route) => {
    currentAttempts++;
    return allowCurrent
      ? route.fulfill({ contentType: "image/svg+xml", body: svg })
      : route.abort("failed");
  });
  await openCase(page, "og", "dialog");
  await expect.poll(() => oldSeen).toBe(true);
  await page.getByRole("textbox").fill("dirty while pending");
  await page.evaluate(() =>
    window.composition.og.url("/fixture-image.svg?source=current"),
  );
  await expect(page.getByRole("alert")).toContainText("unable to load preview");
  const oldResponse = page.waitForResponse((response) =>
    response.url().endsWith("/fixture-image.svg?source=one"),
  );
  releaseOld();
  await (await oldResponse).finished();
  // Observe after browser load callbacks have had rendering turns to commit.
  await page.evaluate(
    () =>
      new Promise((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(resolve)),
      ),
  );
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByRole("img")).toHaveCount(0);
  await expect(page.getByRole("textbox")).toHaveValue("dirty while pending");
  const failedAttempts = currentAttempts;
  allowCurrent = true;
  await page.getByRole("button", { name: "retry", exact: true }).click();
  await expect(page.getByRole("alert")).toHaveCount(0);
  await expect(page.getByRole("img")).toHaveAttribute(
    "src",
    "/fixture-image.svg?source=current",
  );
  expect(currentAttempts).toBeGreaterThan(failedAttempts);
  await expect(page.getByRole("textbox")).toHaveValue("dirty while pending");
  await expect(page.locator('[aria-busy="true"]')).toHaveCount(0);
});

for (const host of ["page", "dialog", "popover"]) {
  test(`synced and bouncy external/owned roots, bounded pointer coordinates and static dex zero in ${host}`, async ({
    page,
  }) => {
    const api = [];
    page.on("request", (request) => {
      if (
        ["fetch", "xhr"].includes(request.resourceType()) ||
        new URL(request.url()).pathname.startsWith("/api/")
      )
        api.push(request.url());
    });
    await openCase(page, "motion", host);
    expect(
      await page.evaluate(() => window.composition.motion.inspect().refs),
    ).toEqual([true, true, true]);
    await expect(page.getByTestId("pokemon")).toHaveCSS("opacity", "0.8");
    await expect(page.getByTestId("pokemon")).toHaveCSS("width", "40px");
    const surface = page.getByTestId("surface-a"),
      bounds = await surface.boundingBox();
    await page.mouse.move(bounds.x + 35, bounds.y + 20);
    await expect
      .poll(() =>
        page.evaluate(() => window.composition.motion.inspect().cursor.x),
      )
      .toBeCloseTo(35, 0);
    for (const id of ["cross-a", "cross-b"])
      await expect(page.getByTestId(id)).toHaveCSS("transform", /35/);
    await expect(page.getByTestId("cross-owned")).toHaveCSS(
      "transform",
      /none|matrix\(1, 0, 0, 1, 0, 0\)/,
    );
    // Pointer-opened popovers autofocus the first trigger without keyboard intent.
    // Use actual keyboard navigation, including when that trigger already has focus.
    await page.getByTestId("bouncy-trigger-b").focus();
    await page.keyboard.press("Shift+Tab");
    await expect(page.getByTestId("bouncy-trigger-a")).toBeFocused();
    await expect(page.getByTestId("bouncy-a")).toBeVisible();
    await page.mouse.move(bounds.x + 35, bounds.y + 20);
    await page.evaluate(
      () =>
        new Promise((resolve) =>
          requestAnimationFrame(() => requestAnimationFrame(resolve)),
        ),
    );
    await expect(page.getByTestId("bouncy-a")).toBeVisible();
    await expect(page.getByTestId("bouncy-b")).toHaveCount(0);
    const triggerBox = await page.getByTestId("bouncy-trigger-a").boundingBox();
    const position = await page.evaluate(
      () => window.composition.motion.inspect().bouncy,
    );
    expect(position.x).toBeCloseTo(triggerBox.x + triggerBox.width, 0);
    expect(position.y).toBeCloseTo(triggerBox.y, 0);
    await page.keyboard.press("Tab");
    await expect(page.getByTestId("bouncy-trigger-b")).toBeFocused();
    await expect(page.getByTestId("bouncy-b")).toBeVisible();
    await expect(page.getByTestId("bouncy-a")).toHaveCount(0);
    const before = await page.evaluate(() =>
      window.composition.motion.inspect(),
    );
    await page.evaluate(() => window.composition.motion.unmount());
    const after = await page.evaluate(() =>
      window.composition.motion.inspect(),
    );
    expect(after.cursor).toEqual(before.cursor);
    expect(after.bouncy).toEqual(before.bouncy);
    expect(api).toEqual([]);
  });
}

test("layouts honor empty supplied inputs then populated rows, refs, native slots and option overrides without router", async ({
  page,
}) => {
  await openCase(page, "layouts");
  expect(
    await page.evaluate(() => window.composition.layouts.inspect().refs),
  ).toEqual(Array(8).fill(true));
  await expect(
    page.getByRole("list", { name: "caller projects" }).locator("li"),
  ).toHaveCount(0);
  await expect(
    page.locator("#caller-hero img, #caller-hero video"),
  ).toHaveCount(0);
  await expect(page.locator("#caller-band")).toHaveCSS("max-width", "444px");
  await expect(page.getByTestId("container")).toHaveCSS("max-width", "600px");
  await expect(page.locator('h1[title="caller heading"]')).toHaveCSS(
    "font-size",
    "22px",
  );
  await expect(page.getByTestId("headline-slot")).toHaveCSS(
    "font-size",
    "13px",
  );
  const back = page.getByTestId("caller-back");
  await expect(back).toHaveAttribute("href", "/");
  await expect(back).toHaveAccessibleName("Back");
  await back.click();
  expect(
    await page.evaluate(() => window.composition.layouts.inspect().clicks),
  ).toBe(1);
  await page.evaluate(() => window.composition.layouts.populate());
  const row = page.getByRole("link", { name: "caller project", exact: true });
  await expect(row).toHaveAttribute("href", "/work/caller");
  await expect(row).toHaveAttribute("title", "caller row");
  const options = await page
    .locator("#caller-project-band")
    .evaluate((element) => ({
      padding: getComputedStyle(element).paddingLeft,
      columns: getComputedStyle(
        element.firstElementChild,
      ).gridTemplateColumns.split(" ").length,
    }));
  expect(parseFloat(options.padding)).toBeGreaterThan(0);
  expect(options.columns).toBe(8);
  await expect(page.getByRole("contentinfo")).toHaveCount(0);
});
