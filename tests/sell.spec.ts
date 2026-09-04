import { test, expect } from "@playwright/test";

test("user can publish a product", async ({ page }) => {
  const productTitle = `Playwright Test Product ${Date.now()}`;

  const apiRequests: {
    method: string;
    status: number;
    url: string;
  }[] = [];

  page.on("response", (response) => {
    const method = response.request().method();

    if (["POST", "PUT", "PATCH", "DELETE"].includes(method)) {
      apiRequests.push({
        method,
        status: response.status(),
        url: response.url(),
      });

      console.log(
        "API:",
        method,
        response.status(),
        response.url()
      );
    }
  });

  await page.goto("/sell");

  // Product name
  await page.locator('input[name="title"]').fill(productTitle);

  // Category
  const categorySelect = page.locator("select").first();
  await expect(categorySelect).toBeVisible();
  await categorySelect.selectOption({ label: "Electronics" });

  // Price
  await page.locator('input[name="price"]').fill("999");

  // Description
  await page
    .locator('textarea[name="description"]')
    .fill("Automated Playwright production test product.");

  // Upload image
  await page
    .locator('input[type="file"]')
    .setInputFiles("tests/fixtures/test-product.jpeg");

  // Publish
  await page.getByRole("button", { name: "Publish Product" }).click();

  // Wait for the product creation request.
  await expect
    .poll(
      () =>
        apiRequests.some(
          (request) =>
            request.method === "POST" &&
            request.status >= 200 &&
            request.status < 300 &&
            !request.url.includes("/api/upload")
        ),
      {
        timeout: 15_000,
        message: "Product creation API request was not successful",
      }
    )
    .toBe(true);

  // Make sure the product title is visible somewhere after publishing.
  await expect(page.getByText(productTitle, { exact: true })).toBeVisible({
    timeout: 10_000,
  });
});