import { test, expect } from "@playwright/test";

test("user can search for a product", async ({ page }) => {
  await page.goto("/");

  const searchInput = page
    .getByRole("textbox", { name: "Search products..." })
    .first();

  await expect(searchInput).toBeVisible();

  await searchInput.fill("keyboard");

  await expect(
    page.locator('a[href^="/products/"]').first()
  ).toBeVisible();

  const bodyText = await page.locator("body").innerText();

  expect(bodyText.toLowerCase()).toContain("keyboard");
});