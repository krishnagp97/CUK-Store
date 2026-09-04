import { test, expect } from "@playwright/test";

test("product details page displays product information", async ({ page }) => {
  await page.goto("/");

  const firstProduct = page.locator('a[href^="/products/"]').first();

  await expect(firstProduct).toBeVisible();

  const productUrl = await firstProduct.getAttribute("href");

  expect(productUrl).toMatch(/^\/products\/.+/);

  await firstProduct.click();

  await expect(page).toHaveURL(/\/products\/.+/);

  await expect(
    page.getByRole("heading", { name: "Description" })
  ).toBeVisible();

  await expect(
    page.getByText("Seller", { exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole("heading", { name: "Similar Products" })
  ).toBeVisible();
});