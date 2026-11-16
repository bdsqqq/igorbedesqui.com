import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readMigrationSources } from "./check-ariakit-migration.mjs";

test.beforeEach(async ({}, testInfo) => {
  const sourceFingerprint = createHash("sha256")
    .update(JSON.stringify([...(await readMigrationSources())]))
    .digest("hex");
  await testInfo.attach("tested-source", {
    body: JSON.stringify({
      sourceFingerprint,
      baseURL: process.env.MIGRATION_BASE_URL,
    }),
    contentType: "application/json",
  });
});

async function ready(page, route) {
  const response = await page.goto(route, { waitUntil: "load" });
  expect(response?.ok()).toBe(true);
  // Full-bleed demos deliberately have no page grid/main landmark.
  await expect(
    page.getByRole("button", { name: "inspect portals", exact: true }),
  ).toBeAttached();
}

/** Observe native CSS/WAAPI effects without injecting animation styles or clocks.
 * Seeking and restoring happens in one browser turn: Ariakit's real unmount
 * timeout must keep running, so never hold a paused leave across tool calls.
 */
async function observe(page) {
  await page.evaluate(() => {
    window.__surfaceProbe?.stop();
    const selector =
      '[role="dialog"], [role="tooltip"], [data-backdrop], [role="listbox"], [role="menu"]';
    const seen = new WeakMap();
    const probe = (window.__surfaceProbe = {
      records: [],
      frames: [],
      images: [],
      reopen: false,
      stop: () => {
        cancelAnimationFrame(raf);
        observer.disconnect();
      },
    });
    const sample = (element) => {
      const style = getComputedStyle(element);
      const matrix = new DOMMatrixReadOnly(
        style.transform === "none" ? undefined : style.transform,
      );
      return {
        opacity: Number(style.opacity),
        scale: style.scale === "none" ? 1 : parseFloat(style.scale),
        // Individual scale and transform compose; observe the rendered scale,
        // not one CSS spelling of the effect.
        transformScale:
          matrix.a * (style.scale === "none" ? 1 : parseFloat(style.scale)),
      };
    };
    const sampleSurfaces = () => {
      for (const element of document.querySelectorAll(selector)) {
        if (getComputedStyle(element).display === "none") continue;
        const phase = element.hasAttribute("data-leave") ? "leave" : "enter";
        const kind = element.hasAttribute("data-backdrop")
          ? "backdrop"
          : element.getAttribute("role");
        if (probe.frames.length < 300)
          probe.frames.push({
            kind,
            phase,
            ...sample(element),
            count: element.getAnimations().length,
          });
        const image = element.querySelector("img");
        if (
          image &&
          element.getAttribute("role") === "dialog" &&
          probe.images.length < 300
        ) {
          const rect = image.getBoundingClientRect();
          probe.images.push({
            time: performance.now(),
            width: rect.width,
            height: rect.height,
            x: rect.x,
            y: rect.y,
            complete: image.complete,
            naturalWidth: image.naturalWidth,
          });
        }
        const animations = element
          .getAnimations()
          .filter(
            (animation) => Number(animation.effect?.getTiming().duration) > 0,
          );
        // Placement can transition before data-enter without changing opacity.
        // Only the disclosure's real visibility effect is entry/leave evidence.
        if (
          !element.hasAttribute("data-enter") &&
          !element.hasAttribute("data-leave")
        )
          continue;
        if (
          !animations.some((animation) =>
            animation.effect.getKeyframes().some((frame) => "opacity" in frame),
          )
        )
          continue;
        if (
          !animations.length ||
          animations.every((animation) => seen.get(animation)?.has(phase))
        )
          continue;
        const states = animations.map((animation) => ({
          animation,
          time: animation.currentTime,
          state: animation.playState,
        }));
        for (const { animation } of states) {
          const phases = seen.get(animation) ?? new Set();
          phases.add(phase);
          seen.set(animation, phases);
          animation.pause();
        }
        const samples = [0, 0.5, 0.999].map((fraction) => {
          for (const { animation } of states)
            animation.currentTime =
              Number(animation.effect.getTiming().duration) * fraction;
          return sample(element);
        });
        probe.records.push({
          kind,
          phase,
          samples,
          animations: animations.map((animation) => ({
            type: animation.constructor.name,
            duration: animation.effect.getTiming().duration,
            keyframes: animation.effect.getKeyframes(),
          })),
        });
        for (const { animation, time, state } of states) {
          animation.currentTime = time;
          if (state === "running") animation.play();
        }
        if (phase === "leave" && probe.reopen) {
          probe.reopen = false;
          window.__surfaceTrigger.click();
        }
      }
    };
    // Observe the lifecycle edge synchronously: a busy frame or trace capture
    // can otherwise miss an entire short exit before Ariakit unmounts it.
    const observer = new MutationObserver(sampleSurfaces);
    observer.observe(document.body, {
      subtree: true,
      childList: true,
      attributes: true,
      // Motion projects shared layouts through inline transforms between RAF
      // subscribers; include those writes rather than sampling only our RAF.
      attributeFilter: ["data-enter", "data-leave", "style"],
    });
    const tick = () => {
      sampleSurfaces();
      raf = requestAnimationFrame(tick);
    };
    let raf = requestAnimationFrame(tick);
  });
}

async function motionRecord(page, kind, phase, testInfo) {
  await expect
    .poll(
      () =>
        page.evaluate(
          ({ kind, phase }) =>
            window.__surfaceProbe.records.filter(
              (record) => record.kind === kind && record.phase === phase,
            ),
          { kind, phase },
        ),
      {
        message: `${kind} needs a native ${phase} effect, not an opacity snap`,
        timeout: 10_000,
      },
    )
    .not.toEqual([]);
  const record = await page.evaluate(
    ({ kind, phase }) =>
      window.__surfaceProbe.records.find(
        (record) => record.kind === kind && record.phase === phase,
      ),
    { kind, phase },
  );
  await testInfo.attach(`${kind}-${phase}`, {
    body: JSON.stringify(record, null, 2),
    contentType: "application/json",
  });
  const [start, middle, end] = record.samples;
  expect(record.animations.length).toBeGreaterThan(0);
  if (phase === "enter") {
    expect(start.opacity).toBeLessThan(middle.opacity);
    expect(middle.opacity).toBeLessThan(end.opacity);
  } else {
    expect(start.opacity).toBeGreaterThan(middle.opacity);
    expect(middle.opacity).toBeGreaterThan(end.opacity);
  }
  return record;
}

test.describe("native overlay motion", () => {
  test.use({ reducedMotion: "no-preference" });
  test.afterEach(async ({ page }, testInfo) => {
    if (!page.isClosed()) {
      const evidence = await page
        .evaluate(() => {
          window.__surfaceProbe?.stop();
          return (
            window.__surfaceProbe && {
              records: window.__surfaceProbe.records,
              frames: window.__surfaceProbe.frames,
              images: window.__surfaceProbe.images,
            }
          );
        })
        .catch(() => null);
      await testInfo.attach("native-motion-observations", {
        body: JSON.stringify(evidence, null, 2),
        contentType: "application/json",
      });
    }
  });

  test("popover enters, leaves and reverses a rapid reopen before unmount", async ({
    page,
  }, testInfo) => {
    await ready(page, "/play/style-overhaul");
    const trigger = page
      .getByRole("button", { name: "Hej", exact: true })
      .first();
    await trigger.evaluate((element) => {
      window.__surfaceTrigger = element;
    });
    await observe(page);
    await trigger.click();
    const entry = await motionRecord(page, "dialog", "enter", testInfo);
    expect(entry.samples[0].transformScale).toBeLessThan(
      entry.samples[2].transformScale,
    );
    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveCSS("opacity", "1");
    expect(
      await dialog.evaluate(
        (element) =>
          element.closest("[inert]") === null &&
          !document.querySelector("main")?.contains(element),
      ),
    ).toBe(true);
    await page.evaluate(() => {
      window.__surfaceProbe.reopen = true;
    });
    await page.keyboard.press("Escape");
    await motionRecord(page, "dialog", "leave", testInfo);
    await expect(trigger).toHaveAttribute("aria-expanded", "true");
    // A stale leave timeout must not hide the reopened content.
    await page.waitForTimeout(400);
    await expect(dialog).toBeVisible();
    await expect(dialog).toHaveCSS("opacity", "1");
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(trigger).toBeFocused();
  });

  test("tooltip has genuine entry and leave interpolation", async ({
    page,
  }, testInfo) => {
    await ready(page, "/");
    await observe(page);
    await page
      .getByRole("button", { name: "email", exact: true })
      .first()
      .click();
    const trigger = page.getByRole("button", {
      name: "Copy email address",
      exact: true,
    });
    await trigger.hover();
    const bounds = await trigger.boundingBox();
    expect(bounds).not.toBeNull();
    await page.mouse.move(
      bounds.x + bounds.width / 2 + 2,
      bounds.y + bounds.height / 2,
    );
    const entry = await motionRecord(page, "tooltip", "enter", testInfo);
    expect(entry.samples[0].transformScale).toBeLessThan(
      entry.samples[2].transformScale,
    );
    const tooltip = page.getByRole("tooltip");
    await expect(tooltip).toHaveCSS("opacity", "1");
    await page.keyboard.press("Escape");
    await motionRecord(page, "tooltip", "leave", testInfo);
    await expect(tooltip).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("modal lightbox backdrop interpolates and retains its portal through leave", async ({
    page,
  }, testInfo) => {
    await ready(page, "/writing/macos-rice");
    const trigger = page
      .getByRole("button", { name: "enlarge image", exact: true })
      .first();
    await trigger.scrollIntoViewIfNeeded();
    await observe(page);
    await trigger.click();
    await motionRecord(page, "backdrop", "enter", testInfo);
    const dialog = page.getByRole("dialog");
    const backdrop = page.locator("[data-backdrop]");
    await expect(backdrop).toHaveCSS("opacity", "0.7");
    expect(
      await dialog.evaluate((element) => element.closest("[inert]") === null),
    ).toBe(true);
    await expect
      .poll(() =>
        page
          .getByRole("navigation", { includeHidden: true })
          .evaluate((element) => !!element.closest("[inert]")),
      )
      .toBe(true);
    await page.keyboard.press("Tab");
    expect(
      await dialog.evaluate(
        (element) =>
          document.activeElement === document.body ||
          element.contains(document.activeElement),
      ),
    ).toBe(true);
    // The image's shared-layout animation owns its coordinate space; the
    // full-screen dialog intentionally has no independent scale effect.
    await expect(dialog).toHaveCSS("scale", "none");
    const imageFrames = await page.evaluate(() => window.__surfaceProbe.images);
    expect(imageFrames.length).toBeGreaterThan(2);
    expect(
      new Set(imageFrames.map((frame) => Math.round(frame.width))).size,
      "shared image layout must traverse intermediate geometry",
    ).toBeGreaterThan(2);
    await page.keyboard.press("Escape");
    await motionRecord(page, "backdrop", "leave", testInfo);
    await expect(dialog).toHaveCount(0);
    await expect(backdrop).toHaveCount(0);
    await expect(trigger).toBeFocused();
    await trigger.click();
    await expect(dialog).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect.poll(() => page.locator("[inert]").count()).toBe(0);
  });

  test("actions menu enters and leaves through its native disclosure lifecycle", async ({
    page,
  }, testInfo) => {
    await ready(page, "/play/actions");
    await observe(page);
    const trigger = page.getByRole("button", { name: "Actions", exact: true });
    await trigger.click();
    await motionRecord(page, "menu", "enter", testInfo);
    await expect(page.getByRole("menu")).toHaveCSS("opacity", "1");
    await page.keyboard.press("Escape");
    await motionRecord(page, "menu", "leave", testInfo);
    await expect(page.getByRole("menu")).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test("scales preset popover uses the same native entry lifecycle", async ({
    page,
  }, testInfo) => {
    await ready(page, "/writing/scales");
    await observe(page);
    const ratio = page.getByRole("combobox", { name: "Ratio", exact: true });
    await ratio.fill("1.618");
    await motionRecord(page, "listbox", "enter", testInfo);
    await expect(
      page.getByRole("option", { name: "1.618 – Golden Ratio" }),
    ).toBeVisible();
    await page.keyboard.press("Escape");
    await motionRecord(page, "listbox", "leave", testInfo);
    await expect(page.getByRole("listbox")).toBeHidden();
  });
});

for (const route of ["/play/style-overhaul", "/writing/macos-rice"]) {
  test(`reduced motion settles and unmounts without effects: ${route}`, async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await ready(page, route);
    const trigger = route.includes("macos")
      ? page.getByRole("button", { name: "enlarge image", exact: true }).first()
      : page.getByRole("button", { name: "Hej", exact: true }).first();
    await trigger.click();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toHaveCSS("opacity", "1");
    expect(
      await dialog.evaluate(
        (element) =>
          element
            .getAnimations()
            .filter((animation) => animation.playState === "running").length,
      ),
    ).toBe(0);
    for (const backdrop of await page.locator("[data-backdrop]").all())
      expect(
        await backdrop.evaluate((element) => element.getAnimations().length),
      ).toBe(0);
    await page.keyboard.press("Escape");
    await expect(dialog).toHaveCount(0);
    await expect(page.locator("[data-backdrop]")).toHaveCount(0);
    await expect(trigger).toBeFocused();
    if (route.includes("macos")) {
      const copy = page
        .getByRole("button", { name: "Copy to clipboard", exact: true })
        .first();
      await copy.focus();
      await page.keyboard.press("Tab");
      await page.keyboard.press("Shift+Tab");
      const tooltip = page.getByRole("tooltip");
      await expect(tooltip).toHaveCSS("opacity", "1");
      expect(
        await tooltip.evaluate((element) => element.getAnimations().length),
      ).toBe(0);
      await page.keyboard.press("Escape");
      await expect(tooltip).toBeHidden();
      await expect(copy).toBeFocused();
    }
  });
}

async function geometry(child, parentSelector) {
  return child.evaluate((element, parentSelector) => {
    const parent = element.parentElement.closest(parentSelector);
    if (!parent) throw new Error(`missing containing shell: ${parentSelector}`);
    const outer = parent.getBoundingClientRect();
    const inner = element.getBoundingClientRect();
    const ps = getComputedStyle(parent);
    const cs = getComputedStyle(element);
    return {
      parentRadius: parseFloat(ps.borderTopLeftRadius),
      childRadius: parseFloat(cs.borderTopLeftRadius),
      inset: inner.left - outer.left,
      rightInset: outer.right - inner.right,
      padding: parseFloat(ps.paddingLeft),
      border: parseFloat(ps.borderLeftWidth),
      margin: parseFloat(cs.marginLeft),
      parentBackground: ps.backgroundColor,
      childBackground: cs.backgroundColor,
      width: inner.width,
    };
  }, parentSelector);
}

function concentric(box) {
  expect(box.parentRadius).toBeGreaterThan(0);
  expect(box.childRadius).toBeGreaterThan(0);
  expect(box.inset).toBeGreaterThan(0);
  expect(box.inset).toBeLessThanOrEqual(4);
  expect(box.width).toBeGreaterThan(0);
  // The real border boxes include frame padding, silhouette border and any
  // layout gap/margin. A thin inset should retain a common corner centre.
  expect(
    Math.abs(box.inset - box.padding - box.border - box.margin),
  ).toBeLessThanOrEqual(0.6);
  expect(
    Math.abs(box.childRadius - (box.parentRadius - box.inset)),
  ).toBeLessThanOrEqual(0.6);
}

for (const viewport of [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`collection rows inherit thin-inset concentric geometry: ${viewport.width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    for (const { route, href } of [
      { route: "/", href: "/work/ibm" },
      { route: "/", href: "/writing/macos-rice" },
      { route: "/work", href: "/work/ibm" },
      { route: "/library", href: "/library/button" },
    ]) {
      await ready(page, route);
      const row = page.locator(`ul a[href="${href}"]`).first();
      const box = await geometry(row, "ul");
      await testInfo.attach(
        `geometry-${route.replaceAll("/", "_")}-${href.replaceAll("/", "_")}`,
        { body: JSON.stringify(box, null, 2), contentType: "application/json" },
      );
      concentric(box);
      await row.focus();
      await expect(row).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(
        await row.evaluate((element) =>
          element.closest("ul").getAttribute("role"),
        ),
      ).not.toBe("listbox");
    }
  });

  test(`timeline entry/detail shells retain native corner geometry: ${viewport.width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await ready(page, "/work/axiom");
    const details = page.locator("#timeline li section > article");
    expect(await details.count()).toBeGreaterThan(0);
    for (const detail of await details.all()) {
      const box = await geometry(detail, "section");
      await testInfo.attach("timeline-shell", {
        body: JSON.stringify(box),
        contentType: "application/json",
      });
      expect(box.parentRadius).toBeGreaterThanOrEqual(12);
      expect(box.childRadius).toBeGreaterThan(0);
      expect(box.inset).toBeGreaterThan(0);
      expect(
        Math.abs(box.inset - box.padding - box.border - box.margin),
      ).toBeLessThanOrEqual(0.6);
      // Large insets may reach the child's declared radius. Thin insets must
      // stay concentric; do not assert every DOM wrapper is another material.
      if (box.inset <= 4) concentric(box);
      else if (box.inset < box.parentRadius - 2)
        expect(
          Math.abs(box.childRadius - (box.parentRadius - box.inset)),
        ).toBeLessThanOrEqual(0.6);
      else expect(box.childRadius).toBeLessThanOrEqual(box.parentRadius);
    }
  });
}

test("timeline previews collect, select and reorder attachments by keyboard and drag", async ({
  page,
}) => {
  await ready(page, "/work/axiom");
  const references = page
    .locator("#timeline ol")
    .first()
    .getByRole("button", { name: /^attachment / });
  for (const reference of [references.nth(0), references.nth(1)]) {
    await reference.focus();
    await expect(reference).toHaveAttribute("aria-expanded", "true");
    const previewId = await reference.getAttribute("aria-controls");
    await expect(page.locator(`[id="${previewId}"]`)).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(reference).toHaveAttribute("aria-expanded", "false");
    await expect(page.locator(`[id="${previewId}"]`)).toHaveCount(0);
  }
  const hand = page.getByRole("group", { name: /discovered attachments/ });
  const cards = hand.getByRole("button");
  await expect(cards).toHaveCount(2);
  const order = () =>
    hand
      .locator("[data-receipt-id]")
      .evaluateAll((elements) =>
        elements.map((element) => element.dataset.receiptId),
      );
  const original = await order();
  const movingName = await cards.last().getAttribute("aria-label");
  const moving = hand.getByRole("button", { name: movingName, exact: true });
  await moving.focus();
  await page.keyboard.press("ArrowLeft");
  await expect.poll(order).toEqual([...original].reverse());
  await expect(moving).toBeFocused();
  await page.keyboard.press("Space");
  await expect(moving).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Space");
  await expect(moving).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("ArrowRight");
  await expect.poll(order).toEqual(original);
  await moving.hover();
  const box = await moving.boundingBox();
  const bounds = await hand.boundingBox();
  expect(box).not.toBeNull();
  expect(bounds).not.toBeNull();
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(bounds.x - 80, box.y + box.height / 2, { steps: 8 });
  await page.mouse.up();
  await expect.poll(order).toEqual([...original].reverse());
  await expect(moving).toHaveAttribute("aria-pressed", "false");
});

test("motion verifier rejects a snap in an isolated fixture", async ({
  page,
}, testInfo) => {
  // No application CSS is replaced. This negative control must not be
  // mistaken for evidence that a production overlay interpolates.
  await page.setContent('<div role="dialog" data-enter>already visible</div>');
  await observe(page);
  await expect(motionRecord(page, "dialog", "enter", testInfo)).rejects.toThrow(
    /native enter effect/,
  );
  await page.evaluate(() => window.__surfaceProbe.stop());
});
