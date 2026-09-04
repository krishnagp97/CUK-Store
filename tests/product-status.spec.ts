import { test, expect } from '@playwright/test';

test('Sold listing shows Sold status', async ({ page }) => {
  await page.goto('/myListings');

  const title = 'Playwright Edit Test 1788539557920';

  const listing = page
    .getByRole('heading', { name: title })
    .locator('../..')
    .locator('..');

  await expect(
    listing.getByText('Sold', { exact: true })
  ).toBeVisible();
});