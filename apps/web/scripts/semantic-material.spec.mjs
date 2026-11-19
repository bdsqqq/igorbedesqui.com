import { test, expect } from "@playwright/test";

// Composite actual inherited solid paints: comparing transparent resting CSS
// strings alone would let an imperceptible hover pass.
async function paint(locator) {
  return locator.evaluate((element) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const ctx = canvas.getContext("2d");
    const ancestors = [];
    for (let current = element; current; current = current.parentElement)
      ancestors.unshift(current);
    for (const ancestor of ancestors) {
      ctx.fillStyle = getComputedStyle(ancestor).backgroundColor;
      ctx.fillRect(0, 0, 1, 1);
    }
    const background = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    ctx.fillStyle = getComputedStyle(element).color;
    ctx.fillRect(0, 0, 1, 1);
    const foreground = [...ctx.getImageData(0, 0, 1, 1).data].slice(0, 3);
    return { background, foreground };
  });
}

const linear = (channel) =>
  (channel /= 255) <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4;
function lightness(rgb) {
  const [r, g, b] = rgb.map(linear);
  return (
    0.2104542553 *
      Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b) +
    0.793617785 *
      Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b) -
    0.0040720468 *
      Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b)
  );
}
function contrast({ background, foreground }) {
  const luminance = (rgb) =>
    rgb
      .map(linear)
      .reduce((sum, value, i) => sum + value * [0.2126, 0.7152, 0.0722][i], 0);
  const values = [luminance(background), luminance(foreground)].sort(
    (a, b) => a - b,
  );
  return (values[1] + 0.05) / (values[0] + 0.05);
}

function roundedMedia(element) {
  const rect = element.getBoundingClientRect();
  return {
    radius: parseFloat(getComputedStyle(element).borderTopLeftRadius),
    inViewport:
      rect.x >= 0 &&
      rect.y >= 0 &&
      rect.right <= innerWidth + 1 &&
      rect.bottom <= innerHeight + 1,
    clipped: !element.contains(
      document.elementFromPoint(rect.x + 2, rect.y + 2),
    ),
  };
}

test("rounded-media verifier rejects square media over a rounded surface", async ({
  page,
}) => {
  await page.setContent(
    "<div id=\"surface\" style=\"border-radius:12px;width:100px;height:100px\"><img width=\"100\" height=\"100\" alt=\"\" src=\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect width='100' height='100' fill='red'/%3E%3C/svg%3E\"></div>",
  );
  const surface = page.locator("#surface");
  expect((await surface.evaluate(roundedMedia)).clipped).toBe(false);
  await surface.evaluate((element) => (element.style.overflow = "hidden"));
  expect((await surface.evaluate(roundedMedia)).clipped).toBe(true);
});

// Pre-migration prose/emphasis colors from 450e03d^:apps/web/src/routes/-main.css.
// These are test references, not another authored palette.
for (const colorScheme of ["dark", "light"]) {
  const references =
    colorScheme === "dark"
      ? [
          [181, 179, 173],
          [238, 238, 236],
        ]
      : [
          [99, 99, 94],
          [33, 32, 28],
        ];
  test(`editorial prose keeps its original quiet ground and contrast islands: ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/work/the-manual");
    await expect(
      page.getByRole("button", { name: "inspect portals", exact: true }),
    ).toBeAttached();
    const prose = await paint(page.locator("#why p").first());
    const emphasis = await paint(
      page.locator("#why p:last-child span").first(),
    );
    for (const [actual, reference] of [
      [prose.foreground, references[0]],
      [emphasis.foreground, references[1]],
    ])
      expect(
        Math.max(
          ...actual.map((channel, i) => Math.abs(channel - reference[i])),
        ),
      ).toBeLessThanOrEqual(12);
    expect(contrast(emphasis)).toBeGreaterThan(contrast(prose) + 1);
    const caption = await paint(page.locator("#visual figcaption").first());
    expect(contrast(caption)).toBeLessThan(contrast(prose));
    expect(contrast(caption)).toBeGreaterThanOrEqual(4.5);
  });

  test(`inline links and revealed asides retain the prose hierarchy: ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/");
    await expect(
      page.getByRole("button", { name: "inspect portals", exact: true }),
    ).toBeAttached();
    const contact = page
      .locator("main p")
      .filter({ hasText: "Get in touch via" });
    const base = await paint(contact);
    for (const action of [
      contact.getByRole("link", { name: "Twitter" }),
      contact.getByRole("button", { name: /email/ }),
    ]) {
      const rest = await paint(action);
      expect(rest.foreground).toEqual(base.foreground);
      await action.focus();
      expect(contrast(await paint(action))).toBeGreaterThan(contrast(base));
      await action.blur();
    }
    const aside = page
      .locator("main span")
      .filter({ hasText: /^Trying my hardest/ })
      .first();
    await aside.focus();
    await expect(aside).toHaveCSS("filter", /^(?:none|blur\(0px\))$/);
    await expect
      .poll(async () => (await paint(aside)).foreground)
      .toEqual(base.foreground);
    await expect(aside.locator("strong").first()).toHaveCSS(
      "color",
      await page
        .locator("main h1")
        .evaluate((element) => getComputedStyle(element).color),
    );
  });

  test(`writing preserves authored emphasis without brightening its ground: ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/writing/not-just-the-basics");
    await expect(
      page.getByRole("button", { name: "inspect portals", exact: true }),
    ).toBeAttached();
    const writing = await paint(page.locator("main p").nth(1));
    const writingEmphasis = await paint(page.locator("main p span").first());
    for (const [actual, reference] of [
      [writing.foreground, references[0]],
      [writingEmphasis.foreground, references[1]],
    ])
      expect(
        Math.max(
          ...actual.map((channel, i) => Math.abs(channel - reference[i])),
        ),
      ).toBeLessThanOrEqual(12);
  });

  for (const width of [390, 1280]) {
    test(`manual figures own gaps and kindle respects the rounded surface: ${width} ${colorScheme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme });
      await page.goto("/work/the-manual");
      await expect(
        page.getByRole("button", { name: "inspect portals", exact: true }),
      ).toBeAttached();
      const figures = await page
        .locator("#visual figure")
        .evaluateAll((elements) =>
          elements.map((figure) => {
            const boxes = [...figure.querySelectorAll("img")].map((image) =>
              image.parentElement.getBoundingClientRect(),
            );
            const caption = figure
              .querySelector("figcaption")
              .getBoundingClientRect();
            return {
              gap: caption.top - boxes.at(-1).bottom,
              pair: boxes.length > 1 ? boxes[1].top - boxes[0].bottom : null,
            };
          }),
        );
      expect(figures).toHaveLength(4);
      for (const figure of figures) {
        expect(figure.gap).toBeGreaterThanOrEqual(8);
        expect(figure.gap).toBeLessThanOrEqual(16);
        if (figure.pair !== null) expect(figure.pair).toBeGreaterThanOrEqual(8);
      }
      const trigger = page.getByRole("button", { name: /ran on my kindle/ });
      await trigger.click();
      const popup = page.getByRole("dialog");
      await expect(popup).toHaveCSS("opacity", "1");
      const clipping = await popup.evaluate(roundedMedia);
      expect(clipping.inViewport).toBe(true);
      expect(clipping.radius).toBeGreaterThan(0);
      expect(clipping.clipped).toBe(true);
      await expect(
        popup.getByRole("link", { name: "More pics on Twitter" }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(popup).toHaveCount(0);
      await expect(trigger).toBeFocused();
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  }
}

for (const colorScheme of ["dark", "light"]) {
  for (const width of [390, 1280]) {
    test(`contextual rows have visible pointer/keyboard states and readable ink: ${width} ${colorScheme}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      await page.emulateMedia({ colorScheme });
      await page.goto("/");
      await expect(
        page.getByRole("button", { name: "toggle grid overlay", exact: true }),
      ).toBeAttached();
      const row = page.locator('main a[href="/work/axiom"]').first();
      const title = row.locator("h3");
      await page.mouse.move(0, 0);
      const resting = await paint(title);
      expect(contrast(resting)).toBeGreaterThanOrEqual(4.5);
      await row.hover();
      await expect
        .poll(async () =>
          Math.abs(
            lightness((await paint(title)).background) -
              lightness(resting.background),
          ),
        )
        .toBeGreaterThan(0.065);
      const hovered = await paint(title);
      expect(contrast(hovered)).toBeGreaterThanOrEqual(4.5);
      const sibling = page.locator('main a[href="/work/ibm"] h3').first();
      expect(contrast(await paint(sibling))).toBeLessThan(contrast(resting));
      await page.mouse.move(0, 0);
      await row.focus();
      await expect(row).toBeFocused();
      await expect
        .poll(async () => (await paint(title)).background)
        .toEqual(hovered.background);
      await row.hover();
      await page.mouse.down();
      try {
        await expect
          .poll(async () => lightness((await paint(title)).background))
          .toBeLessThan(lightness(hovered.background) - 0.01);
      } finally {
        await page.mouse.move(0, 0);
        await page.mouse.up();
      }
      await expect(page).toHaveURL(/\/$/);
      const grid = page.getByRole("button", {
        name: "toggle grid overlay",
        exact: true,
      });
      await grid.click();
      await expect(grid).toHaveAttribute("aria-pressed", "true");
      await grid.click();
      await expect(grid).toHaveAttribute("aria-pressed", "false");
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    });
  }

  test(`production buttons and syntax ink follow a changed host material: ${colorScheme}`, async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme });
    await page.goto("/library/button");
    await expect(
      page.getByRole("button", { name: "inspect portals", exact: true }),
    ).toBeAttached();
    const button = page
      .getByRole("button", { name: "Hej", exact: true })
      .first();
    const baseline = (await paint(button)).background;
    const host = button.locator("..");
    const original = await host.getAttribute("class");
    try {
      // Synthetic host input, not an application state or a visual acceptance capture.
      await host.evaluate((element) =>
        element.classList.add(
          "ak-layer",
          "ak-layer-primary",
          "ak-layer-mix-15",
        ),
      );
      await expect
        .poll(async () => (await paint(button)).background)
        .not.toEqual(baseline);
      expect(contrast(await paint(button))).toBeGreaterThanOrEqual(4.5);
      await button.focus();
      await expect(button).toBeFocused();
      expect(
        await button.evaluate(
          (element) => getComputedStyle(element).outlineStyle,
        ),
      ).toBe("solid");
    } finally {
      await host.evaluate(
        (element, value) =>
          value === null
            ? element.removeAttribute("class")
            : element.setAttribute("class", value),
        original,
      );
    }

    const comment = page.locator(".syntax-code .sh__token--comment").first();
    await expect(comment).toBeAttached();
    expect(contrast(await paint(comment))).toBeGreaterThanOrEqual(4.5);
    const code = comment.locator("xpath=ancestor::code");
    await code.evaluate((element) =>
      element.classList.add("ak-layer", "ak-layer-primary"),
    );
    expect(contrast(await paint(comment))).toBeGreaterThanOrEqual(4.5);
    const comparison = await comment.evaluate((element) => {
      const native = document.createElement("span");
      native.className = "ak-ink-60";
      element.parentElement.append(native);
      const result = [
        getComputedStyle(element).color,
        getComputedStyle(native).color,
        getComputedStyle(element).getPropertyValue("--sh-comment"),
      ];
      native.remove();
      return result;
    });
    expect(comparison[0]).toBe(comparison[1]);
    expect(comparison[2]).not.toBe("");
  });
}
