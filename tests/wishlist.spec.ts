import { test, expect } from "@playwright/test";

test("wishlisted product appears on wishlist page", async ({ page }) => {
  await page.goto("/");

  const firstProduct = page.locator('a[href^="/products/"]').first();

  await expect(firstProduct).toBeVisible();

  const productTitle = (
    await firstProduct.locator("h2, h3").first().textContent()
  )?.trim();

  expect(productTitle).toBeTruthy();

  const wishlistButton = firstProduct.getByRole("button", { name: /wishlist/i });

const isWishlisted =
  (await wishlistButton.getAttribute("aria-label")) ===
  "Remove from wishlist";

if (!isWishlisted) {
  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("wishlist") &&
      ["POST", "PATCH", "PUT"].includes(response.request().method())
  );

  await wishlistButton.click();

  const response = await responsePromise;

  console.log("WISHLIST API:", response.status());
  console.log("WISHLIST URL:", response.url());
  console.log("WISHLIST BODY:", await response.text());
}

await expect(
  firstProduct.getByRole("button", { name: "Remove from wishlist" })
).toBeVisible();
  await page.goto("/wishList");

  console.log("BROWSER COOKIES:", await page.context().cookies());


  console.log("URL:", page.url());
  console.log("TITLE:", await page.title());
  console.log("BODY:", await page.locator("body").innerText());

  await expect(
    page.getByRole("heading", { name: "My Wishlist" }),
  ).toBeVisible();

  await expect(page.getByText(productTitle!, { exact: true })).toBeVisible();
});
