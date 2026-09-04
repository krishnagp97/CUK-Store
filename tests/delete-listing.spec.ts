import { test, expect } from '@playwright/test';

test('Delete listing', async ({ page }) => {
  await page.goto('/myListings');

  const title = 'Playwright Edit Test 1788539709933 Updated';

  page.once('dialog', async dialog => {
    expect(dialog.type()).toBe('confirm');
    await dialog.accept();
  });

  const listing = page
    .getByRole('heading', { name: title })
    .locator('../..')
    .locator('..');

  await listing.getByRole('button', { name: 'Delete' }).click();

  await expect(
    page.getByRole('heading', { name: title })
  ).toHaveCount(0);
});