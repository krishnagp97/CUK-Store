import { test, expect } from '@playwright/test';

test('product details page displays product information', async ({ page }) => {
  await page.goto('/');

  // Get the first product
  const firstProduct = page.locator('a[href^="/products/"]').first();

  await expect(firstProduct).toBeVisible();

  // Get product URL
  const productUrl = await firstProduct.getAttribute('href');

  expect(productUrl).toMatch(/^\/products\/.+/);

  // Open product
  await firstProduct.click();

  // Verify URL
  await expect(page).toHaveURL(/\/products\/.+/);

  // Verify product details page
  await expect(
    page.getByRole('heading', { name: 'Description' })
  ).toBeVisible();

  await expect(
    page.getByText('Seller', { exact: true })
  ).toBeVisible();

  await expect(
    page.getByRole('heading', { name: 'Similar Products' })
  ).toBeVisible();
});