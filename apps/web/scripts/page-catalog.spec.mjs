import { test, expect } from "@playwright/test";
import {
  readMigrationSources,
  staticPageRoutes,
} from "./check-ariakit-migration.mjs";

const pages = staticPageRoutes(await readMigrationSources());
const normalize = (path) => path.replace(/\/$/, "") || "/";

for (const section of ["play", "library", "work", "writing"]) {
  test(`${section} index lists every available child page`, async ({
    page,
  }) => {
    const response = await page.goto(`/${section}`);
    expect(response.ok()).toBe(true);
    await expect(
      page.getByRole("button", { name: "inspect portals", exact: true }),
    ).toBeAttached();
    const expected = pages
      .filter((path) => path.startsWith(`/${section}/`))
      .sort();
    expect(expected.length).toBeGreaterThan(0);
    const links = page.locator(`main a[href^="/${section}/"]`);
    const listed = [
      ...new Set(
        (
          await links.evaluateAll((elements) =>
            elements.map((element) => element.getAttribute("href")),
          )
        ).map(normalize),
      ),
    ].sort();
    expect(listed).toEqual(expected);
    for (const link of await links.all()) {
      expect((await link.innerText()).trim()).not.toBe("");
    }
    expect(
      await page
        .locator("body")
        .evaluate((element) => element.scrollWidth <= innerWidth),
    ).toBe(true);
  });
}

test("work and writing listings agree with each page's document title", async ({
  page,
}) => {
  for (const section of ["work", "writing"]) {
    await page.goto(`/${section}`);
    await expect(
      page.getByRole("button", { name: "inspect portals", exact: true }),
    ).toBeAttached();
    const entries = await page
      .locator(`main a[href^="/${section}/"]`)
      .evaluateAll((links) =>
        links.map((link) => ({
          href: link.getAttribute("href"),
          title: link.querySelector("h2,h3")?.textContent?.trim(),
          description: link.querySelector("p")?.textContent?.trim(),
        })),
      );
    expect(entries.length).toBeGreaterThan(0);
    for (const entry of entries) {
      expect(entry.title).toBeTruthy();
      expect(entry.description).toBeTruthy();
      const response = await page.goto(entry.href);
      expect(response.ok()).toBe(true);
      expect((await page.title()).toLowerCase()).toContain(
        entry.title.toLowerCase(),
      );
      await expect(page.locator('meta[name="description"]')).toHaveAttribute(
        "content",
        entry.description,
      );
    }
  }
});

test("section indexes fit a narrow viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  for (const section of ["play", "library", "work", "writing"]) {
    await page.goto(`/${section}`);
    await expect(
      page.getByRole("button", { name: "inspect portals", exact: true }),
    ).toBeAttached();
    expect(
      await page
        .locator("body")
        .evaluate((element) => element.scrollWidth <= innerWidth),
    ).toBe(true);
  }
});
