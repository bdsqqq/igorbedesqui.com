import { test, expect } from "@playwright/test";

async function ready(page) {
  const response = await page.goto("/library/tokens");
  expect(response.ok()).toBe(true);
  await expect(
    page.getByRole("heading", { name: "Tokens", exact: true }),
  ).toBeVisible();
  await expect(
    page.locator('[data-resolved="--gray-00"]').first(),
  ).not.toHaveText("…");
}

const swatch = (page, theme, name) =>
  page.locator(`[data-token-theme="${theme}"][data-swatch="${name}"]`);

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
    page.locator("#colors [data-definition]").first().locator("[data-swatch]"),
  ).toHaveCount(2);
  const sizes = await page.evaluate(() => [
    getComputedStyle(document.querySelector("main h1")).fontSize,
    getComputedStyle(document.body).fontSize,
  ]);
  expect(sizes[0]).toBe(sizes[1]);
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
        await expect(
          page.locator(
            `[data-token-theme="${theme}"][data-swatch^="--gray-"]:not([data-swatch^="--gray-A"])`,
          ),
        ).toHaveCount(13);
        await expect(
          page.locator(
            `[data-token-theme="${theme}"][data-swatch^="--gray-A"]`,
          ),
        ).toHaveCount(12);
        expect(
          await rgba(
            swatch(page, theme, "--gray-00").locator("[data-color-token]"),
          ),
        ).toEqual(color);
        expect(
          await rgba(
            swatch(page, theme, "--color-canvas").locator("[data-color-token]"),
          ),
        ).toEqual(color);
      }
      const definition = page.locator('[data-definition="--gray-01"]');
      await expect(definition).toContainText("src/routes/-main.css:");
      await expect(definition).toContainText("@media (color-gamut: p3)");
      await expect(definition).toContainText("color(display-p3");
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
    await expect(
      swatch(page, theme, "--gray-01").locator("[data-color-token]"),
    ).toHaveCSS("background-color", /color\(display-p3/);
    await expect(
      page.locator(
        `[data-resolved="--gray-01"][data-resolved-theme="${theme}"]`,
      ),
    ).toContainText("color(display-p3");
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
  await expect(page.locator("[data-swatch]")).toHaveCount(0);
  await search.fill("primary");
  await expect(
    page.locator('[data-definition="--color-primary"]'),
  ).toBeVisible();
  await expect(page.locator('[data-swatch="--color-primary"]')).toHaveCount(2);
  await search.fill("no-such-token-please");
  await expect(page.getByText("No matches.", { exact: true })).toBeVisible();
  await expect(page.locator("[data-definition]")).toHaveCount(0);
  await search.fill("");
  await expect(page.getByRole("status", { name: "Token results" })).toHaveText(
    /^\d+ \/ \d+$/,
  );
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
