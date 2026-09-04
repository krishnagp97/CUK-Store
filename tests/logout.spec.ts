import { test, expect } from "@playwright/test";

test("Logout", async ({ page }) => {
  // Remove the shared auth session so this test creates its own session
  await page.context().clearCookies();

  await page.goto("/sign-in");

  await page.getByLabel("Email").fill(process.env.TEST_EMAIL!);
  await page.getByLabel("Password").fill(process.env.TEST_PASSWORD!);

  await page.getByRole("button", { name: /sign in/i }).click();

  await expect(
    page.locator('[data-slot="dropdown-menu-trigger"]')
  ).toBeVisible();

  await page.locator('[data-slot="dropdown-menu-trigger"]').click();
  await page.getByText("Logout", { exact: true }).click();

  await expect(
    page.locator('[data-slot="dropdown-menu-trigger"]')
  ).toHaveCount(0);

  await expect(page).toHaveURL(/\/sign-in/);
});