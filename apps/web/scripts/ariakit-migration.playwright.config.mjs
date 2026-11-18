import os from "node:os";
import path from "node:path";
import { defineConfig } from "@playwright/test";

if (!process.env.MIGRATION_BASE_URL)
  throw new Error(
    "set MIGRATION_BASE_URL to the already running server; this suite never starts one",
  );

export default defineConfig({
  testDir: ".",
  testMatch: [
    "ariakit-migration.spec.mjs",
    "ariakit-followup.spec.mjs",
    "copy-feedback.spec.mjs",
    "page-catalog.spec.mjs",
    "design-tokens.spec.mjs",
    "semantic-material.spec.mjs",
  ],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 60_000,
  globalTimeout: 600_000,
  expect: { timeout: 10_000 },
  reporter: "list",
  outputDir:
    process.env.MIGRATION_TEST_OUTPUT ??
    path.join(os.tmpdir(), "ariakit-migration-results"),
  use: {
    baseURL: process.env.MIGRATION_BASE_URL,
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
