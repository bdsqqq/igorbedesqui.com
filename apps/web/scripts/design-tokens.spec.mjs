import { test, expect } from "@playwright/test";

async function ready(page) {
  const response = await page.goto("/library/tokens");
  expect(response.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Tokens", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-resolved="--color-canvas"]').first(),
  ).not.toContainText("…");
}

const swatch = (page, theme, name) =>
  page.locator(`[data-token-theme="${theme}"][data-swatch="${name}"]`);

async function rgba(locator, property) {
  return locator.evaluate((element, property) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d");
    context.fillStyle = property
      ? getComputedStyle(element).getPropertyValue(property)
      : getComputedStyle(element).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data];
  }, property);
}

test("token page uses the site bands without cards, subtitles, or disclosures", async ({
  page,
}) => {
  await page.goto("/library/tokens");
  await expect(
    page.getByRole("button", { name: "inspect portals", exact: true }),
  ).toBeAttached();
  await expect(page.locator("main details, main summary")).toHaveCount(0);
  await expect(page.locator("main .ak-frame-card")).toHaveCount(0);
  await expect(page.locator("#tokens p:not([role=status])")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Tokens", exact: true }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: /01.*Colors/ })).toBeVisible();
  await expect(
    page
      .locator("#colors [data-palette] > li")
      .first()
      .locator("[data-swatch]"),
  ).toHaveCount(2);
  const sizes = await page.evaluate(() => [
    getComputedStyle(document.querySelector("main h1")).fontSize,
    getComputedStyle(document.body).fontSize,
  ]);
  expect(sizes[0]).toBe(sizes[1]);
});

test("type specimens keep their complete line boxes", async ({ page }) => {
  await ready(page);
  await page.getByRole("checkbox", { name: "Defaults", exact: true }).check();
  await page.getByRole("searchbox").fill("--text-");
  const metrics = await page
    .locator('[data-definition^="--text-"] [aria-hidden]')
    .evaluateAll((elements) =>
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        const range = document.createRange();
        range.selectNodeContents(element);
        const text = range.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
          name: element.closest("[data-definition]").dataset.definition,
          height: box.height,
          client: element.clientHeight,
          scroll: element.scrollHeight,
          max: style.maxHeight,
          overflow: style.overflowY,
          top: box.top,
          bottom: box.bottom,
          textTop: text.top,
          textBottom: text.bottom,
        };
      }),
    );
  expect(metrics.length).toBeGreaterThan(0);
  for (const metric of metrics) {
    expect(metric.max, metric.name).toBe("none");
    expect(metric.overflow, metric.name).toBe("visible");
    expect(metric.scroll, metric.name).toBeLessThanOrEqual(metric.client + 1);
    expect(metric.textTop, metric.name).toBeGreaterThanOrEqual(metric.top - 1);
    expect(metric.textBottom, metric.name).toBeLessThanOrEqual(
      metric.bottom + 1,
    );
  }
});

test("palette grids stay compact and expose sources by pointer, tap, and keyboard", async ({
  page,
}) => {
  for (const width of [320, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await ready(page);
    const palette = page.locator("[data-palette]");
    const size = await palette.evaluate((element) => ({
      height: element.getBoundingClientRect().height,
      columns: getComputedStyle(element).gridTemplateColumns.split(" ").length,
    }));
    expect(size.columns).toBe(width < 640 ? 2 : 3);
    expect(size.height).toBeLessThan(width < 640 ? 1500 : 700);
    expect(
      (await page.locator("[data-layer-palette]").boundingBox()).height,
    ).toBeLessThan(width < 640 ? 1200 : 600);
    const first = page.locator('[data-palette-token="--color-canvas"]');
    await first.focus();
    await first.press("Enter");
    await expect(
      page.getByRole("region", { name: "Color definitions", exact: true }),
    ).toBeFocused();
    await first.focus();
    await first.press("Tab");
    await expect(
      page.locator('[data-palette-token="--color-primary"]'),
    ).toBeFocused();
    await expect(
      page.locator('[data-definition="--color-primary"]'),
    ).toBeVisible();
    const last = page.locator('[data-palette-token="--color-primary"]');
    await last.click();
    await expect(last).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator('[data-definition="--color-primary"]'),
    ).toBeVisible();
    await first.hover();
    await expect(
      page.locator('[data-definition="--color-canvas"]'),
    ).toBeVisible();
  }
});

test("touch selects a swatch without hover", async ({ browser }) => {
  const context = await browser.newContext({
    baseURL: process.env.MIGRATION_BASE_URL,
    hasTouch: true,
    viewport: { width: 320, height: 900 },
    reducedMotion: "reduce",
  });
  try {
    const page = await context.newPage();
    await ready(page);
    const choice = page.locator('[data-palette-token="--color-primary"]');
    await choice.tap();
    await expect(choice).toHaveAttribute("aria-pressed", "true");
    await expect(
      page.locator('[data-definition="--color-primary"]'),
    ).toBeVisible();
  } finally {
    await context.close();
  }
});

test("dev token inventory never imports the inspected source modules", async ({
  page,
}) => {
  test.skip(!process.env.TOKEN_CHECK_DEV, "requires the Vite dev server");
  await ready(page);
  const response = await page.request.get("/@id/__x00__virtual:design-tokens");
  expect(response.ok()).toBe(true);
  const imports = /^\s*import\s/m;
  expect(imports.test('import "/site/components";\nexport default {};')).toBe(
    true,
  );
  expect(await response.text()).not.toMatch(imports);
});

for (const width of [320, 1440]) {
  for (const colorScheme of ["dark", "light"]) {
    test(`source palettes preserve local schemes and page bounds: ${width} ${colorScheme}`, async ({
      page,
    }) => {
      const errors = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.setViewportSize({ width, height: 900 });
      await page.emulateMedia({ colorScheme });
      await ready(page);
      for (const [theme, color] of [
        ["dark", [10, 10, 10, 255]],
        ["light", [255, 255, 255, 255]],
      ]) {
        await expect(
          page.locator(
            `[data-token-theme="${theme}"][data-swatch^="--color-"]`,
          ),
        ).toHaveCount(3);
        expect(
          await rgba(
            swatch(page, theme, "--color-canvas").locator("[data-color-token]"),
          ),
        ).toEqual(color);
        expect(
          await rgba(swatch(page, theme, "--color-canvas"), "--color-canvas"),
        ).toEqual(color);
      }
      await page.locator('[data-palette-token="--color-canvas"]').focus();
      const definition = page.locator('[data-definition="--color-canvas"]');
      await expect(definition).toContainText("src/routes/-main.css:");
      await expect(definition).toContainText(
        "@media (prefers-color-scheme: light)",
      );
      await expect(
        page.locator(
          '[data-swatch^="--gray-"], [data-swatch^="--color-gray-"]',
        ),
      ).toHaveCount(0);
      expect(await rgba(page.locator("body"))).toEqual(
        colorScheme === "dark" ? [10, 10, 10, 255] : [255, 255, 255, 255],
      );
      const columns = await page
        .locator("#colors > div")
        .evaluate(
          (element) =>
            getComputedStyle(element).gridTemplateColumns.split(" ").length,
        );
      expect(columns).toBe(width < 768 ? 4 : 16);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}

test("semantic pigments and readouts remain consistent when the browser gamut changes", async ({
  page,
}) => {
  await ready(page);
  await page.locator('[data-palette-token="--color-primary"]').click();
  const session = await page.context().newCDPSession(page);
  try {
    for (const gamut of ["srgb", "p3"]) {
      await session.send("Emulation.setEmulatedMedia", {
        features: [{ name: "color-gamut", value: gamut }],
      });
      for (const theme of ["dark", "light"]) {
        expect(
          await rgba(
            swatch(page, theme, "--color-primary").locator(
              "[data-color-token]",
            ),
          ),
        ).toEqual([0, 144, 255, 255]);
        await expect(
          page.locator(
            `[data-resolved="--color-primary"][data-resolved-theme="${theme}"]`,
          ),
        ).toHaveText(`${theme} rgb(0, 144, 255)`);
      }
    }
  } finally {
    await session.detach();
  }
});

test("token search includes authored values, provenance, and empty results", async ({
  page,
}) => {
  await ready(page);
  const search = page.getByRole("searchbox");
  await search.fill("radius-field");
  await expect(
    page.locator('[data-definition="--radius-field"]'),
  ).toBeVisible();
  await expect(
    page.locator('[data-definition="--radius-field"] [aria-hidden]'),
  ).toHaveCSS("border-radius", "8px");
  await expect(page.locator("[data-swatch]")).toHaveCount(0);
  await search.fill("primary");
  await expect(
    page.locator('[data-definition="--color-primary"]'),
  ).toBeVisible();
  await expect(page.locator("[data-palette-token]")).toHaveCount(1);
  await expect(page.locator('[data-swatch="--color-primary"]')).toHaveCount(2);
  await search.fill("no-such-token-please");
  await expect(page.getByText("No matches.", { exact: true })).toBeVisible();
  await expect(page.locator("[data-definition]")).toHaveCount(0);
  await search.fill("");
  await expect(page.getByRole("status", { name: "Token results" })).toHaveText(
    /^\d+ \/ \d+$/,
  );
});

test("framework defaults are available without masquerading as authored configuration", async ({
  page,
}) => {
  await ready(page);
  const status = page.getByRole("status", { name: "Token results" });
  const authored = Number((await status.textContent()).split("/")[1]);
  expect(authored).toBeGreaterThan(0);
  const search = page.getByRole("searchbox");
  await search.fill("--text-9xl");
  await expect(page.getByText("No matches.", { exact: true })).toBeVisible();
  await page.getByRole("checkbox", { name: "Defaults", exact: true }).check();
  await expect(page.locator('[data-definition="--text-9xl"]')).toBeVisible();
  await search.fill("");
  expect(Number((await status.textContent()).split("/")[1])).toBeGreaterThan(
    authored,
  );
  await page.getByRole("checkbox", { name: "Defaults", exact: true }).uncheck();
  expect(Number((await status.textContent()).split("/")[1])).toBe(authored);
});

test("numeric layer samples match the literal site utilities", async ({
  page,
}) => {
  await ready(page);
  const colors = await page.locator("[data-offset]").evaluateAll((elements) =>
    elements
      .filter((element) => /^ak-layer-\d/.test(element.dataset.offset))
      .map((element) => {
        const native = document.createElement("span");
        native.className = `ak-layer ${element.dataset.offset}`;
        element.parentElement.append(native);
        const result = {
          utility: element.dataset.offset,
          theme: element.dataset.offsetTheme,
          sample: getComputedStyle(element).backgroundColor,
          native: getComputedStyle(native).backgroundColor,
        };
        native.remove();
        return result;
      }),
  );
  expect(colors.length).toBeGreaterThan(0);
  for (const color of colors)
    expect(color.sample, `${color.utility} ${color.theme}`).toBe(color.native);
});

test("source-derived state samples match the real row and keyboard adjustment stays local", async ({
  page,
}) => {
  await ready(page);
  for (const theme of ["dark", "light"]) {
    const scope = page.getByRole("region", {
      name: `${theme} interactions`,
      exact: true,
    });
    const row = scope.getByRole("button", { name: /^List row/ });
    const utility = (await row.locator("span").textContent()).replace(
      "hover:",
      "",
    );
    const sample = page.locator(
      `[data-offset="${utility}"][data-offset-theme="${theme}"]`,
    );
    await row.hover();
    await expect.poll(() => rgba(row)).toEqual(await rgba(sample));
    const slider = scope.getByRole("slider");
    await slider.focus();
    await slider.press("End");
    await expect(scope.locator("output")).toHaveText("24");
    const experiment = scope.getByRole("button", {
      name: "hover:ak-state-24",
      exact: true,
    });
    await experiment.focus();
    await expect(experiment).toBeFocused();
    await expect.poll(() => rgba(experiment)).not.toEqual(await rgba(sample));
  }
});
