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
