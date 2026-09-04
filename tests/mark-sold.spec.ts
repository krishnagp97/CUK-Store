import { test, expect } from '@playwright/test';

test('Mark listing as Sold', async ({ page }) => {
  await page.goto('/myListings');

  const title = 'Playwright Edit Test 1788539557920';

  const listing = page
    .getByRole('heading', { name: title })
    .locator('../..')
    .locator('..');

  page.once('dialog', dialog => dialog.accept());

  await listing.getByRole('button', { name: 'Mark as Sold' }).click();

  await expect(
    listing.getByText('Sold', { exact: true })
  ).toBeVisible();
});