import { defineConfig } from "@playwright/test";
if (!process.env.COMPOSITION_BASE_URL)
  throw new Error(
    "set COMPOSITION_BASE_URL to the running isolated fixture preview",
  );
export default defineConfig({
  testDir: ".",
  testMatch: "composition.spec.mjs",
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 30_000,
  globalTimeout: 600_000,
  expect: { timeout: 5_000 },
  reporter: "list",
  outputDir: "/tmp/composition-playwright-results",
  use: {
    baseURL: process.env.COMPOSITION_BASE_URL,
    browserName: "chromium",
    headless: true,
    viewport: { width: 1280, height: 900 },
    reducedMotion: "reduce",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    launchOptions: process.env.MIGRATION_CHROMIUM_EXECUTABLE
      ? { executablePath: process.env.MIGRATION_CHROMIUM_EXECUTABLE }
      : {},
  },
});
