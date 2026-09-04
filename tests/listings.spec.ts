import { test, expect } from "@playwright/test";

test("published product appears in My Listings", async ({ page }) => {
  const productTitle = `Playwright Listing Test ${Date.now()}`;

  await page.goto("/sell");

  await page.locator('input[name="title"]').fill(productTitle);

  await page.locator("select").selectOption({ label: "Electronics" });

  await page.locator('input[name="price"]').fill("999");

  await page
    .locator('textarea[name="description"]')
    .fill("Automated Playwright listing test.");

  await page
    .locator('input[type="file"]')
    .setInputFiles("tests/fixtures/test-product.jpeg");

  await page.getByRole("button", { name: "Publish Product" }).click();

  await expect
    .poll(
      async () => {
        const response = await page.request.get("/api/products");

        if (!response.ok()) return false;

        const data = await response.json();

        return data.products?.some(
          (product: { title: string }) =>
            product.title === productTitle
        );
      },
      {
        timeout: 15_000,
        message: "Published product was not found in the products API",
      }
    )
    .toBe(true);

  await page.goto("/myListings");

  await expect(
    page.getByRole("heading", { name: "My Listings" })
  ).toBeVisible();

  const listing = page .getByText(productTitle, { exact: true }) .locator("../../..");

  await expect(listing).toBeVisible();

  await expect(listing).toContainText("₹999");
  await expect(listing).toContainText("Available");
  await expect(listing).toContainText("electronics");
});