import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { readMigrationSources } from "./check-ariakit-migration.mjs";
import {
  aligned,
  borderless,
  compensated,
  measure,
} from "./document-geometry.mjs";

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
    // A leave sample needs a settled entry, not a reversal from near-zero opacity.
    await expect(page.getByRole("listbox")).toHaveCSS("opacity", "1");
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

async function measured(locator) {
  return locator.evaluate(measure);
}

async function attachGeometry(testInfo, name, geometry) {
  await testInfo.attach(name, {
    body: JSON.stringify(geometry, null, 2),
    contentType: "application/json",
  });
}

for (const viewport of [
  { width: 1280, height: 900 },
  { width: 390, height: 844 },
]) {
  test(`homepage rows keep full hover padding and grid-aligned text: ${viewport.width}`, async ({
    page,
  }) => {
    await page.setViewportSize(viewport);
    await ready(page, "/");
    for (const [href, padding] of [
      ["/work/axiom", 16],
      ["/writing/macos-rice", 8],
    ]) {
      const list = page
        .locator("ul")
        .filter({ has: page.locator(`a[href="${href}"]`) })
        .first();
      const rows = list.locator(":scope > li > a");
      const count = await rows.count();
      expect(count).toBeGreaterThan(2);
      const host = await measured(list.locator(".."));
      for (const index of [0, Math.floor(count / 2), count - 1]) {
        const row = rows.nth(index);
        const box = await measured(row);
        expect(box.padding[0]).toBe(padding);
        expect(box.padding[2]).toBe(padding);
        aligned(
          box.textLeft,
          host.contentLeft,
          "list text, not hover edge, follows the grid",
        );
        aligned(
          box.left + box.padding[3],
          host.contentLeft,
          "hover surface outsets by its padding",
        );
        await page.mouse.move(0, 0);
        await row.blur();
        const resting = await row.evaluate(
          (element) => getComputedStyle(element).backgroundColor,
        );
        await row.hover({ position: { x: box.width / 2, y: padding / 2 } });
        await expect
          .poll(() =>
            row.evaluate(
              (element) => getComputedStyle(element).backgroundColor,
            ),
          )
          .not.toBe(resting);
        await page.mouse.move(0, 0);
        await row.focus();
        await expect(row).toBeFocused();
      }
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  });

  test(`document geometry: collections stay on the grid: ${viewport.width}`, async ({
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
      await page.mouse.move(0, 0);
      const row = page.locator(`ul a[href="${href}"]`).first();
      const list = row.locator("xpath=ancestor::ul[1]");
      const host = await measured(list.locator(".."));
      const boxes = await Promise.all([
        measured(list),
        measured(row.locator("..")),
        measured(row),
      ]);
      await attachGeometry(testInfo, `collection-${route}-${href}`, {
        host,
        boxes,
      });
      boxes.forEach(borderless);
      expect(boxes[2].width).toBeGreaterThan(0);
      // Catalog growth can move a card to another column. Derive its baseline
      // from the grid tracks, not from the card's possibly shifted position.
      const columnOffset = await row.evaluate((anchor) => {
        const item = anchor.parentElement;
        const list = item.parentElement;
        const style = getComputedStyle(list);
        if (style.display !== "grid") return 0;
        const tracks = style.gridTemplateColumns.split(/\s+/).map(parseFloat);
        const span = Number(
          getComputedStyle(item).gridColumnStart.match(/\d+/)?.[0] ?? 1,
        );
        const index = [...list.children].indexOf(item);
        const column = (index * span) % tracks.length;
        const gap = parseFloat(style.columnGap) || 0;
        return (
          tracks.slice(0, column).reduce((sum, width) => sum + width, 0) +
          column * gap
        );
      });
      aligned(
        boxes[2].textLeft,
        host.contentLeft + columnOffset,
        "row text vs grid content baseline",
      );
      await row.focus();
      await expect(row).toBeFocused();
      borderless(await measured(row));
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(await list.getAttribute("role")).not.toBe("listbox");
    }
  });

  test(`document geometry: timeline prose and inline triggers have no shells: ${viewport.width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await ready(page, "/work/axiom");
    const sections = page.locator("#timeline li section[aria-labelledby]");
    expect(await sections.count()).toBeGreaterThan(0);
    for (const section of await sections.all()) {
      // The grid cell reserves the rail (64px narrow, one grid column
      // otherwise), plus its computed gutter. It is the prose baseline.
      const host = await measured(section.locator(".."));
      const article = section.locator("article");
      const boxes = await Promise.all([measured(section), measured(article)]);
      boxes.forEach(borderless);
      const text = await Promise.all([
        measured(section.locator(":scope > p")),
        measured(article.locator("h2")),
        measured(article.locator(":scope > p")),
      ]);
      text.forEach((box) => {
        borderless(box);
        aligned(
          box.textLeft,
          host.contentLeft,
          "timeline text vs grid cell content",
        );
      });
      const triggers = article.getByRole("button");
      expect(await triggers.count()).toBeGreaterThan(0);
      for (const trigger of await triggers.all())
        borderless(await measured(trigger));
      await attachGeometry(testInfo, "timeline-document", {
        host,
        boxes,
        text,
      });
    }
  });

  test(`document geometry: retained media and code edges cancel their stroke: ${viewport.width}`, async ({
    page,
  }, testInfo) => {
    await page.setViewportSize(viewport);
    await ready(page, "/writing/macos-rice");
    const media = page
      .getByRole("button", { name: "enlarge image", exact: true })
      .first()
      .locator("..");
    const code = page.locator("main pre").first();
    for (const [name, frame] of [
      ["media", media],
      ["code", code],
    ]) {
      const host = await measured(frame.locator(".."));
      const box = await measured(frame);
      await attachGeometry(testInfo, `${name}-edge`, { host, box });
      // Article media/code deliberately extend through the 16px prose gutter.
      compensated(box, { baseline: host.contentLeft, gutter: 16 });
      aligned(
        box.right - box.border[1],
        host.contentRight + 16,
        `${name} right inner edge`,
      );
      aligned(
        box.margin[3] + box.border[3],
        -16,
        `${name} combined gutter/frame margin`,
      );
      aligned(
        box.margin[0] + box.border[0],
        name === "code" ? 8 : 0,
        `${name} top margin cancels stroke plus intentional spacing`,
      );
      if (name === "code") {
        const scroll = await measured(frame.locator('[tabindex="0"]'));
        borderless(scroll);
        const text = await measured(frame.locator("code"));
        aligned(
          text.textLeft,
          host.contentLeft - 16 + box.padding[3] + scroll.padding[3],
          "scrollable code text: prose baseline minus gutter plus frame/scroll padding",
        );
        await attachGeometry(testInfo, "scrollable-code-padding", {
          host,
          box,
          scroll,
          text,
        });
      } else {
        const image = await measured(frame.locator("img"));
        aligned(
          image.left,
          box.contentLeft,
          "image start vs compensated media content",
        );
      }
    }
    const inline = page.locator("main code");
    let inlineCount = 0;
    for (const code of await inline.all()) {
      if (await code.evaluate((element) => !!element.closest("pre"))) continue;
      inlineCount++;
      borderless(await measured(code));
    }
    expect(inlineCount).toBeGreaterThan(0);

    await ready(page, "/library/button");
    const pre = page.locator("section.prose > pre").first();
    const host = await measured(pre.locator(".."));
    const box = await measured(pre);
    await attachGeometry(testInfo, "mdx-code-document", { host, box });
    borderless(box);
    const codeText = await measured(pre.locator("code"));
    borderless(codeText);
    aligned(
      codeText.textLeft,
      host.contentLeft,
      "default MDX code text vs grid baseline",
    );

    // The first Stage in the permutation row has a natural flex-start
    // baseline; centred demo stages have a different placement contract.
    const stage = page.locator("main .ak-frame-p-card").first();
    const stageHost = await measured(stage.locator(".."));
    const stageBox = await measured(stage);
    await attachGeometry(testInfo, "stage-edge", {
      host: stageHost,
      box: stageBox,
    });
    compensated(stageBox, { baseline: stageHost.contentLeft });
    aligned(
      stageBox.margin[0] + stageBox.border[0],
      0,
      "Stage top margin cancels stroke",
    );
    // The final sibling closes the auto-width row; on narrow screens all
    // siblings stretch across the column. Both arrangements share this edge.
    const lastStage = await measured(
      stage.locator("..").locator(":scope > .ak-frame-p-card").last(),
    );
    await attachGeometry(testInfo, "stage-right-edge", {
      host: stageHost,
      box: lastStage,
    });
    aligned(
      lastStage.right - lastStage.border[1],
      stageHost.contentRight,
      "Stage row right inner edge",
    );
  });
}

test("document geometry: default controls and inline fields have no persistent edge", async ({
  page,
}) => {
  await ready(page, "/play/style-overhaul");
  const button = page.getByRole("button", { name: "Hej", exact: true }).first();
  borderless(await measured(button));
  await button.focus();
  borderless(await measured(button)); // Focus outline remains legitimate.
  await ready(page, "/writing/scales");
  const fields = page.locator('main input:not([type="hidden"])');
  expect(await fields.count()).toBeGreaterThan(0);
  for (const field of await fields.all()) borderless(await measured(field));
  await ready(page, "/");
  const email = page
    .getByRole("button", { name: "email", exact: true })
    .first();
  borderless(await measured(email));
  await email.click();
  const copy = page.getByRole("button", {
    name: "Copy email address",
    exact: true,
  });
  borderless(await measured(copy.locator("..")));
  borderless(await measured(copy));
  // The containing native popover is allowed a meaningful edge.
});

test("document geometry verifier rejects b1 without compensation in an isolated fixture", async ({
  page,
}) => {
  await page.setContent(`<style>
    body { margin: 0 } main { margin: 40px; padding: 16px }
    .b1 { border: 1px solid; padding: 16px }
  </style><main><div class="b1">uncompensated</div></main>`);
  const baseline = (await measured(page.locator("main"))).contentLeft;
  const bad = await measured(page.locator(".b1"));
  expect(() => compensated(bad, { baseline })).toThrow(
    /inner edge cancels stroke/,
  );
  // Only this isolated fixture changes; production DOM/CSS is never patched.
  await page.setContent(`<style>body { margin: 0 } main { margin: 40px; padding: 16px }
    .b1 { border: 1px solid; padding: 16px; margin: -1px }
    .gutter { margin-left: -17px; margin-right: -17px }
    </style><main><div class="b1">compensated</div><div class="b1 gutter">gutter plus stroke</div></main>`);
  const goodBaseline = (await measured(page.locator("main"))).contentLeft;
  compensated(await measured(page.locator(".b1").first()), {
    baseline: goodBaseline,
  });
  compensated(await measured(page.locator(".gutter")), {
    baseline: goodBaseline,
    gutter: 16,
  });
});

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
