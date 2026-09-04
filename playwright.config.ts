import { defineConfig, devices } from "@playwright/test";
import dotenv from "dotenv";

dotenv.config();

export default defineConfig({
  testDir: "./tests",

  fullyParallel: false,

  forbidOnly: !!process.env.CI,

  retries: process.env.CI ? 2 : 0,

  workers: 1,

  reporter: "html",

  use: {
    baseURL: "https://cuk-store.vercel.app",

    trace: "on-first-retry",

    extraHTTPHeaders: {
      Origin: "https://cuk-store.vercel.app",
    },
  },

  projects: [
    {
      name: "setup",
      testMatch: /auth\.setup\.ts/,
    },

    {
      name: "chromium",

      use: {
        ...devices["Desktop Chrome"],
        storageState: "playwright/.auth/user.json",
      },

      dependencies: ["setup"],
    },
  ],
});