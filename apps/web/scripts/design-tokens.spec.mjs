import { test, expect } from "@playwright/test";

async function ready(page) {
  const response = await page.goto("/library/tokens");
  expect(response.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Color, without guesswork." }),
  ).toBeVisible();
  await expect(
    page.locator('[data-resolved="--gray-00"]').first(),
  ).not.toHaveText("resolving…");
}

test("dev token inventory never imports the inspected source modules", async ({
  page,
}) => {
  test.skip(!process.env.TOKEN_CHECK_DEV, "requires the Vite dev server");
  await ready(page);
  const response = await page.request.get("/@id/__x00__virtual:design-tokens");
  expect(response.ok()).toBe(true);
  const imports = /^\s*import\s/m;
  // Negative control: Vite's old addWatchFile output must be rejected.
  expect(imports.test('import "/site/components";\nexport default {};')).toBe(
    true,
  );
  expect(await response.text()).not.toMatch(imports);
});

async function rgba(locator) {
  return locator.evaluate((element) => {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    const context = canvas.getContext("2d");
    context.fillStyle = getComputedStyle(element).backgroundColor;
    context.fillRect(0, 0, 1, 1);
    return [...context.getImageData(0, 0, 1, 1).data];
  });
}

for (const width of [390, 1280]) {
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
        const palette = page.getByRole("region", {
          name: `${theme} palette`,
          exact: true,
        });
        await expect(
          palette.locator(
            '[data-swatch^="--gray-"]:not([data-swatch^="--gray-A"])',
          ),
        ).toHaveCount(13);
        await expect(palette.locator('[data-swatch^="--gray-A"]')).toHaveCount(
          12,
        );
        expect(
          await rgba(palette.locator('[data-color-token="--gray-00"]')),
        ).toEqual(color);
        expect(
          await rgba(palette.locator('[data-color-token="--color-canvas"]')),
        ).toEqual(color);
        const swatch = palette.locator('[data-swatch="--gray-01"]');
        await swatch.locator("summary").click();
        await expect(swatch).toContainText("src/routes/-main.css:");
        await expect(swatch).toContainText("@media (color-gamut: p3)");
        await expect(swatch).toContainText("color(display-p3");
      }
      expect(await rgba(page.locator("body"))).toEqual(
        colorScheme === "dark" ? [10, 10, 10, 255] : [255, 255, 255, 255],
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      expect(errors).toEqual([]);
    });
  }
}

test("Display P3 previews use the actual conditional definitions and update their readouts", async ({
  page,
}) => {
  await ready(page);
  const session = await page.context().newCDPSession(page);
  await session.send("Emulation.setEmulatedMedia", {
    features: [
      { name: "prefers-color-scheme", value: "dark" },
      { name: "color-gamut", value: "p3" },
    ],
  });
  for (const theme of ["dark", "light"]) {
    const scope = page.getByRole("region", {
      name: `${theme} palette`,
      exact: true,
    });
    const swatch = scope.locator('[data-color-token="--gray-01"]');
    await expect(swatch).toHaveCSS("background-color", /color\(display-p3/);
    await expect(scope.locator('[data-resolved="--gray-01"]')).toContainText(
      "color(display-p3",
    );
  }
  await session.detach();
});

test("token search includes inherited tokens, aliases, provenance, and empty results", async ({
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
  await expect(
    page.getByText("No matching color swatches.", { exact: true }),
  ).toBeVisible();
  await search.fill("primary");
  await expect(
    page.locator('[data-definition="--color-primary"]'),
  ).toBeVisible();
  await expect(page.locator('[data-swatch="--color-primary"]')).toHaveCount(2);
  await search.fill("no-such-token-please");
  await expect(
    page.getByText("No matching definitions.", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("[data-definition]")).toHaveCount(0);
  await search.fill("");
  await expect(
    page.getByRole("status", { name: "Token results" }),
  ).toContainText("source-derived offsets");
});

test("source-derived state samples match the real row and the keyboard-adjustable exploration stays local", async ({
  page,
}) => {
  await ready(page);
  for (const theme of ["dark", "light"]) {
    const scope = page.getByRole("region", {
      name: `${theme} interactions`,
      exact: true,
    });
    const row = scope.getByRole("button", { name: /^Hover or focus this row/ });
    const label = await row.locator("span").textContent();
    const utility = label.replace("hover:", "");
    const sample = scope.locator(`[data-offset="${utility}"]`);
    await row.hover();
    await expect.poll(() => rgba(row)).toEqual(await rgba(sample));
    const slider = scope.getByRole("slider");
    await slider.focus();
    await slider.press("End");
    await expect(scope.locator("output")).toHaveText("24");
    const experiment = scope.getByRole("button", {
      name: "Hover / focus · 24 lightness points",
      exact: true,
    });
    await experiment.focus();
    await expect(experiment).toBeFocused();
    await expect.poll(() => rgba(experiment)).not.toEqual(await rgba(sample));
  }
});
