import { test, expect } from "@playwright/test";
import { ensureTestProduct } from "./helpers/testProduct";

test("user can delete a listing", async ({ page }) => {
  await ensureTestProduct(page, "Playwright Delete Test");

  await page.goto("/myListings");

  const listing = page
    .getByRole("heading", {
      name: "Playwright Delete Test",
      exact: true,
    })
    .locator("../..")
    .locator("..");

  await page.once("dialog", async (dialog) => {
    await dialog.accept();
  });

  await listing.getByRole("button", { name: "Delete" }).click();

  await expect(
    page.getByRole("heading", {
      name: "Playwright Delete Test",
      exact: true,
    })
  ).toHaveCount(0);
});