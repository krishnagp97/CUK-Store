import { test, expect } from '@playwright/test';

test('Logout', async ({ page }) => {
  await page.goto('/');

  // Open UserMenu
  await page.locator('[data-slot="dropdown-menu-trigger"]').click();

  // Logout
  await page.getByText('Logout', { exact: true }).click();

  // User menu should disappear after logout
  await expect(
    page.locator('[data-slot="dropdown-menu-trigger"]')
  ).toHaveCount(0);

  // Sign-in page should be accessible
  await page.goto('/sign-in');
  await expect(page).toHaveURL(/\/sign-in/);
});