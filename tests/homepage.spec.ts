import { test, expect } from "@playwright/test";

test("homepage displays marketplace UI", async ({ page }) => {
  await page.goto("/");

  // Page title
  await expect(page).toHaveTitle(/Campus Marketplace|CUK Store/i);

  // Main heading
  await expect(
    page.getByRole("heading", { name: "Browse Products" }),
  ).toBeVisible();

  // Description
  await expect(
    page.getByText("Buy and sell items within your campus."),
  ).toBeVisible();

  // Filters sidebar
  await expect(
    page.getByRole("complementary").getByText("Filters", { exact: true }),
  ).toBeVisible();

  // Category
  await expect(
    page.getByRole("complementary").getByText("Category", { exact: true }),
  ).toBeVisible();

  // At least one product should be displayed
  await expect(
    page.locator('a[href^="/products/"]').first(),
  ).toBeVisible();
});

test("user can open a product details page", async ({ page }) => {
  await page.goto("/");

  // Find the first product
  const firstProduct = page.locator('a[href^="/products/"]').first();

  await expect(firstProduct).toBeVisible();

  // Save its URL
  const productUrl = await firstProduct.getAttribute("href");

  expect(productUrl).toMatch(/^\/products\/.+/);

  // Open product
  await firstProduct.click();

  // Verify navigation
  await expect(page).toHaveURL(/\/products\/.+/);
});