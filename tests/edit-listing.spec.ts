import { test, expect } from "@playwright/test";
import { ensureTestProduct } from "./helpers/testProduct";

test("user can edit a listing", async ({ page }) => {
  await ensureTestProduct(page, "Playwright Edit Test");

  await page.goto("/myListings");

  const listing = page
    .getByRole("heading", {
      name: "Playwright Edit Test",
      exact: true,
    })
    .locator("../..")
    .locator("..");

  await listing.getByRole("button", { name: "Edit" }).click();

  await page.locator('input[name="title"]').fill("Playwright Edit Test Updated");

  await page.getByRole("button", { name: /update|save|edit/i }).click();

  await expect(
    page.getByText("Playwright Edit Test Updated", { exact: true })
  ).toBeVisible();
});