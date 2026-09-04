import { test, expect } from '@playwright/test';

test('Mobile navigation works', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });

  await page.goto('/');

  // Bottom navigation should be visible
  await expect(page.getByRole('link', { name: 'Wishlist' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Sell' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Messages' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Listings' })).toBeVisible();

  // Test navigation
  await page.getByRole('link', { name: 'Wishlist' }).click();
  await expect(page).toHaveURL(/\/wishList/);

  await page.getByRole('link', { name: 'Sell' }).click();
  await expect(page).toHaveURL(/\/sell/);

  await page.getByRole('link', { name: 'Messages' }).click();
  await expect(page).toHaveURL(/\/message/);

  await page.getByRole('link', { name: 'Listings' }).click();
  await expect(page).toHaveURL(/\/myListings/);
});