import { test, expect } from "@playwright/test";

test("user can edit a listing", async ({ page }) => {
const productTitle = `Playwright Edit Test ${Date.now()}`;
const updatedTitle = `${productTitle} Updated`;

await page.goto("/sell");

await page.locator('input[name="title"]').fill(productTitle);

await page.locator("select").selectOption({ label: "Electronics" });

await page.locator('input[name="price"]').fill("999");

await page
.locator('textarea[name="description"]')
.fill("Original Playwright test description.");

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
  message: "Created product was not found",
}

)
.toBe(true);
await page.goto("/myListings");

const listing = page
.getByText(productTitle, { exact: true })
.locator("../../..");

await expect(listing).toBeVisible({
timeout: 15_000,
});

await listing.getByRole("link", { name: "Edit" }).click();

await expect(page).toHaveURL(/\/edit/);

const titleInput = page.locator('input[name="title"]');

await expect(titleInput).toHaveValue(productTitle);

await titleInput.fill(updatedTitle);

await page
.getByRole("button", { name: /update|save|edit/i })
.click();

await expect(page).toHaveURL(/myListings|products/);

await expect(
page.getByText(updatedTitle, { exact: true })
).toBeVisible({
timeout: 15_000,
});

await expect(
page.getByText(productTitle, { exact: true })
).not.toBeVisible();
});
