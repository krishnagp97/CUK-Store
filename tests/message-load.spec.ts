import { test, expect } from '@playwright/test';

test('Messages page loads', async ({ page }) => {
  await page.goto('/message');

  await expect(page).toHaveURL(/\/message/);

  await expect(
    page.getByRole('heading', { name: /messages/i })
  ).toBeVisible();
});