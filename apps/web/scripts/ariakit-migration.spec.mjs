import { test, expect } from "@playwright/test";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  readMigrationSources,
  staticPageRoutes,
} from "./check-ariakit-migration.mjs";

async function gotoReady(page, route) {
  const response = await page.goto(route, { waitUntil: "load" });
  expect(response?.ok()).toBe(true);
  // This root-shell portal also exists on full-bleed demos without a page grid.
  await expect(
    page.getByRole("button", { name: "inspect portals", exact: true }),
  ).toBeAttached({ timeout: 10_000 });
}

test.beforeEach(async ({ page }) => {
  // Exercise the real click/feedback path without depending on OS clipboard permissions.
  await page.addInitScript(() => {
    window.__migrationClipboard = [];
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: {
        writeText: async (text) => {
          window.__migrationClipboard.push(text);
        },
      },
    });
  });
});

test("tooltip responds to hover, keyboard focus and Escape without moving focus", async ({
  page,
}) => {
  await gotoReady(page, "/writing/macos-rice");
  const button = page
    .getByRole("button", { name: "Copy to clipboard", exact: true })
    .first();
  await button.hover();
  // Ariakit waits for pointer intent after scrolling an anchor into view.
  const bounds = await button.boundingBox();
  expect(bounds).not.toBeNull();
  await page.mouse.move(
    bounds.x + bounds.width / 2 + 2,
    bounds.y + bounds.height / 2,
  );
  const tooltip = page
    .getByRole("tooltip")
    .filter({ hasText: "Copy to clipboard" });
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();
  await page.mouse.move(1, 1);
  await button.focus();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Shift+Tab");
  await expect(button).toBeFocused();
  await expect(tooltip).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(tooltip).toBeHidden();
  await expect(button).toBeFocused();
});

const publicRoutes = staticPageRoutes(await readMigrationSources());
test("all source-derived public pages hydrate without uncaught exceptions", async ({
  page,
}, testInfo) => {
  test.setTimeout(150_000);
  expect(publicRoutes.length).toBeGreaterThan(0);
  const failures = [];
  const visited = [];
  for (const route of publicRoutes) {
    const errors = [];
    const onError = (error) => errors.push(error.message);
    page.on("pageerror", onError);
    try {
      await gotoReady(page, route);
      await expect(page.locator("body")).not.toContainText(
        "Something went wrong",
      );
      // Browser work after hydration gets one animation frame to surface queued render errors.
      await page.evaluate(
        () => new Promise((resolve) => requestAnimationFrame(() => resolve())),
      );
      if (errors.length) failures.push({ route, errors });
      visited.push(route);
    } catch (error) {
      failures.push({ route, errors: [...errors, error.message] });
    } finally {
      page.off("pageerror", onError);
    }
  }
  const fingerprint = createHash("sha256")
    .update(JSON.stringify([...(await readMigrationSources())]))
    .digest("hex");
  await testInfo.attach("hydration-route-inventory", {
    body: JSON.stringify(
      {
        baseURL: process.env.MIGRATION_BASE_URL,
        sourceFingerprint: fingerprint,
        visited,
        failures,
      },
      null,
      2,
    ),
    contentType: "application/json",
  });
  expect(failures, JSON.stringify(failures, null, 2)).toEqual([]);
});

test("internal navigation and back preserve real link semantics", async ({
  page,
}) => {
  await gotoReady(page, "/");
  const moreWork = page.getByRole("link", { name: "More work", exact: true });
  await expect(moreWork).toHaveAttribute("href", "/work");
  await moreWork.click();
  await expect(page).toHaveURL(/\/work\/?$/);
  const back = page.getByRole("navigation").getByRole("link").first();
  await expect(back).toHaveAttribute("href", "/");
  await back.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/$/);
  await expect(moreWork).toBeVisible();
});

test("email popover copies the address, announces success, and retains mailto link semantics", async ({
  page,
}) => {
  await gotoReady(page, "/");
  const trigger = page
    .getByRole("button", { name: "email", exact: true })
    .first();
  await trigger.click();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  const copy = page.getByRole("button", {
    name: "Copy email address",
    exact: true,
  });
  await expect(copy).toBeVisible();
  await copy.click();
  await expect(
    page.getByRole("button", { name: "Copied to clipboard", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__migrationClipboard))
    .toEqual(["igorbedesqui@gmail.com"]);
  await expect(
    page.getByRole("link", { name: "Send an email", exact: true }),
  ).toHaveAttribute("href", "mailto:igorbedesqui@gmail.com");
  await page.keyboard.press("Escape");
  await expect(copy).toBeHidden();
  await expect(trigger).toBeFocused();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("composed popover trigger supports keyboard opening, Escape, and outside dismissal", async ({
  page,
}) => {
  await gotoReady(page, "/play/style-overhaul");
  const trigger = page
    .getByRole("button", { name: "Hej", exact: true })
    .first();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const content = page.getByText("Hej do", { exact: true });
  await expect(content).toBeVisible();
  await expect(trigger).toHaveAttribute("aria-expanded", "true");
  await expect(page.locator("button button")).toHaveCount(0);
  await page.keyboard.press("Escape");
  await expect(content).toBeHidden();
  await expect(trigger).toBeFocused();
  await trigger.click();
  await expect(content).toBeVisible();
  await page.mouse.click(20, 100);
  await expect(content).toBeHidden();
  await expect(trigger).toHaveAttribute("aria-expanded", "false");
});

test("lightbox makes background inert, closes with Escape, and restores disclosure focus", async ({
  page,
}) => {
  await gotoReady(page, "/writing/macos-rice");
  const trigger = page
    .getByRole("button", { name: "enlarge image", exact: true })
    .first();
  await trigger.scrollIntoViewIfNeeded();
  await trigger.focus();
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleName(
    /Screenshot of customized MacOS Desktop/,
  );
  const close = dialog.getByRole("button", {
    name: "close image preview",
    exact: true,
  });
  await expect(close.locator("svg")).toHaveCount(1);
  await expect(close).toBeFocused();
  await expect(dialog).toHaveCSS("background-color", "rgba(0, 0, 0, 0)");
  await expect(dialog).toHaveCSS("padding", "0px");
  await expect
    .poll(() =>
      page
        .getByRole("navigation", { includeHidden: true })
        .evaluate((element) => element.closest("[inert]") !== null),
    )
    .toBe(true);
  for (const key of ["Tab", "Tab", "Shift+Tab"]) {
    await page.keyboard.press(key);
    await expect
      .poll(() =>
        dialog.evaluate(
          (element) =>
            document.activeElement === document.body ||
            element.contains(document.activeElement),
        ),
      )
      .toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("lightbox close button and surrounding canvas both dismiss", async ({
  page,
}) => {
  await gotoReady(page, "/writing/macos-rice");
  const trigger = page
    .getByRole("button", { name: "enlarge image", exact: true })
    .first();
  await trigger.click();
  await page
    .getByRole("button", { name: "close image preview", exact: true })
    .click();
  await expect(page.getByRole("dialog")).toBeHidden();
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.mouse.click(10, 100);
  await expect(page.getByRole("dialog")).toBeHidden();
});

test("code CopyButton copies the displayed source and resets its feedback", async ({
  page,
}) => {
  await gotoReady(page, "/writing/macos-rice");
  const block = page
    .locator("pre")
    .filter({
      has: page.getByRole("button", { name: "Copy to clipboard", exact: true }),
    })
    .first();
  const expected = await block.locator("code").textContent();
  const copy = block.getByRole("button", {
    name: "Copy to clipboard",
    exact: true,
  });
  await copy.click();
  await expect(
    page.getByRole("button", { name: "Copied to clipboard", exact: true }),
  ).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.__migrationClipboard.at(-1)))
    .toBe(expected);
  await expect(copy).toBeVisible();
});

test("button library keeps link semantics and exclusive keyboard toggle selection", async ({
  page,
}) => {
  await gotoReady(page, "/library/button");
  await expect(
    page.getByRole("link", { name: "Navigate", exact: true }),
  ).toHaveAttribute("href", "#as-a-link");
  const group = page.getByRole("group", {
    name: "Text alignment",
    exact: true,
  });
  const left = group.getByRole("button", { name: "Align left", exact: true });
  const center = group.getByRole("button", {
    name: "Align center",
    exact: true,
  });
  await expect(left).toHaveAttribute("aria-pressed", "true");
  await left.focus();
  await page.keyboard.press("ArrowRight");
  await expect(center).toBeFocused();
  await page.keyboard.press("Space");
  await expect(center).toHaveAttribute("aria-pressed", "true");
  await expect(left).toHaveAttribute("aria-pressed", "false");
  await expect(page.locator("button button")).toHaveCount(0);
});

test("game cells toggle by pointer, Space and Enter without double toggling", async ({
  page,
}) => {
  await gotoReady(page, "/play/game-of-life");
  const cell = page.getByRole("button", { name: "Cell 1", exact: true });
  await expect(cell).toHaveAttribute("aria-pressed", "false");
  await cell.click();
  await expect(cell).toHaveAttribute("aria-pressed", "true");
  await cell.focus();
  await page.keyboard.press("Space");
  await expect(cell).toHaveAttribute("aria-pressed", "false");
  await page.keyboard.press("Enter");
  await expect(cell).toHaveAttribute("aria-pressed", "true");
  await cell.click();
  await expect(cell).toHaveAttribute("aria-pressed", "false");
});

test("game step, play/pause, reset, and copy operate on the same live board", async ({
  page,
}) => {
  await gotoReady(page, "/play/game-of-life");
  const cell = page.getByRole("button", { name: "Cell 1", exact: true });
  await cell.click();
  const copy = page.getByRole("button", { name: /Copy current game state/i });
  await copy.click();
  await expect
    .poll(() => page.evaluate(() => window.__migrationClipboard.at(-1)))
    .toMatch(/^10+$/);
  await page.getByRole("button", { name: /Calculate Next State/i }).click();
  await expect(cell).toHaveAttribute("aria-pressed", "false");
  await cell.click();
  const play = page.getByRole("button", {
    name: "Run simulation",
    exact: true,
  });
  await play.click();
  await expect(play).toHaveAttribute("aria-pressed", "true");
  await expect(cell).toHaveAttribute("aria-pressed", "false");
  await play.click();
  await expect(play).toHaveAttribute("aria-pressed", "false");
  await cell.click();
  await page.getByRole("button", { name: /Clear current state/i }).click();
  await expect(cell).toHaveAttribute("aria-pressed", "false");
  await copy.click();
  await expect
    .poll(() => page.evaluate(() => window.__migrationClipboard.at(-1)))
    .toMatch(/^0+$/);
});

test("grid overlay toggle exposes pressed state and changes the actual overlay", async ({
  page,
}) => {
  await gotoReady(page, "/");
  const toggle = page.getByRole("button", {
    name: "toggle grid overlay",
    exact: true,
  });
  const overlay = page
    .locator('[aria-hidden="true"]')
    .filter({ has: page.locator(".grid-cols-4") })
    .filter({ hasText: "16" })
    .first();
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await toggle.focus();
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-pressed", "true");
  await expect(overlay).toHaveCSS("opacity", "1");
  await page.keyboard.press("Space");
  await expect(toggle).toHaveAttribute("aria-pressed", "false");
  await expect(overlay).toHaveCSS("opacity", "0");
});

for (const state of [
  { name: "desktop-light", width: 1280, height: 900, colorScheme: "light" },
  { name: "desktop-dark", width: 1280, height: 900, colorScheme: "dark" },
  { name: "narrow-light", width: 390, height: 844, colorScheme: "light" },
  { name: "narrow-dark", width: 390, height: 844, colorScheme: "dark" },
]) {
  test(`frame geometry and visible ink: ${state.name}`, async ({ page }) => {
    await page.setViewportSize({ width: state.width, height: state.height });
    await page.emulateMedia({ colorScheme: state.colorScheme });
    await gotoReady(page, "/");
    await page
      .getByRole("button", { name: "email", exact: true })
      .first()
      .click();
    const copy = page.getByRole("button", {
      name: "Copy email address",
      exact: true,
    });
    await expect(copy).toBeVisible();
    const dialog = page.getByRole("dialog");
    await expect(dialog).toBeVisible();
    const geometry = await dialog.evaluate((element) => {
      const rect = element.getBoundingClientRect();
      const style = getComputedStyle(element);
      const button = element.querySelector("button");
      const buttonStyle = getComputedStyle(button);
      return {
        x: rect.x,
        right: rect.right,
        y: rect.y,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height,
        radius: style.borderTopLeftRadius,
        padding: style.paddingTop,
        buttonRadius: buttonStyle.borderTopLeftRadius,
        buttonPadding: buttonStyle.paddingLeft,
        color: buttonStyle.color,
        background: getComputedStyle(document.body).backgroundColor,
        colorScheme: getComputedStyle(document.documentElement).colorScheme,
        ink: [...element.querySelectorAll("span, button, a")]
          .filter((child) => child.textContent.trim())
          .map((child) => getComputedStyle(child).color),
      };
    });
    expect(geometry.x).toBeGreaterThanOrEqual(-1);
    expect(geometry.right).toBeLessThanOrEqual(state.width + 1);
    expect(geometry.y).toBeGreaterThanOrEqual(-1);
    expect(geometry.bottom).toBeLessThanOrEqual(state.height + 1);
    expect(parseFloat(geometry.radius)).toBeGreaterThan(0);
    expect(parseFloat(geometry.buttonRadius)).toBeGreaterThan(0);
    expect(parseFloat(geometry.buttonPadding)).toBeGreaterThan(0);
    expect(geometry.colorScheme).toContain(state.colorScheme);
    for (const color of [
      ...geometry.ink,
      geometry.color,
      geometry.background,
    ]) {
      expect(color).not.toBe("transparent");
      expect(color).not.toMatch(/(?:,\s*0|\/\s*0)\s*\)$/);
    }
    await expect
      .poll(() =>
        page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
      )
      .toBe(true);
    const directory =
      process.env.MIGRATION_EVIDENCE_DIR ??
      path.join(os.tmpdir(), "ariakit-migration-evidence");
    await mkdir(directory, { recursive: true });
    const sources = await readMigrationSources();
    const fingerprint = createHash("sha256")
      .update(JSON.stringify([...sources]))
      .digest("hex");
    await page.screenshot({ path: path.join(directory, `${state.name}.png`) });
    await writeFile(
      path.join(directory, `${state.name}.json`),
      JSON.stringify(
        {
          state,
          route: page.url(),
          capturedAt: new Date().toISOString(),
          sourceFingerprint: fingerprint,
          geometry,
        },
        null,
        2,
      ),
    );
  });
}
