import { test, expect } from "@playwright/test";

test("Sold listing shows Sold status", async ({ page }) => {
  const productTitle = `Playwright Status Test ${Date.now()}`;

  await page.goto("/sell");

  await page.locator('input[name="title"]').fill(productTitle);

  await page
    .locator("select")
    .first()
    .selectOption({ label: "Electronics" });

  await page.locator('input[name="price"]').fill("999");

  await page
    .locator('textarea[name="description"]')
    .fill("Listing created for Playwright status test.");

  await page
    .locator('input[type="file"]')
    .setInputFiles("tests/fixtures/test-product.jpeg");

  await page.getByRole("button", { name: "Publish Product" }).click();

  await expect(
    page.getByText(productTitle, { exact: true })
  ).toBeVisible({ timeout: 15000 });

  try {
    await page.goto("/myListings");

    const listing = page
      .getByRole("heading", { level: 2 })
      .filter({ hasText: productTitle })
      .first()
      .locator("../..")
      .locator("..");

    await expect(listing).toBeVisible();

    // First mark it as sold
    page.once("dialog", async dialog => {
      await dialog.accept();
    });

    await listing
      .getByRole("button", { name: "Mark as Sold" })
      .click();

    // Verify sold state
    await expect(
      listing.getByText("Sold", { exact: true })
    ).toBeVisible();

    await expect(
      listing.getByRole("button", { name: "Mark as Available" })
    ).toBeVisible();
  } finally {
    // Cleanup
    await page.goto("/myListings");

    const listing = page
      .getByRole("heading", { level: 2 })
      .filter({ hasText: productTitle })
      .first()
      .locator("../..")
      .locator("..");

    if (await listing.count()) {
      page.once("dialog", async dialog => {
        await dialog.accept();
      });

      await listing.getByRole("button", { name: "Delete" }).click();

      await expect(
        page.getByRole("heading", {
          level: 2,
          name: productTitle,
          exact: true,
        })
      ).toHaveCount(0);
    }
  }
});