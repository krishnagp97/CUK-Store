import { test, expect } from "@playwright/test";
import { ensureTestProduct } from "./helpers/testProduct";

test("user can see their listing", async ({ page }) => {
  await ensureTestProduct(page, "Playwright Listing Test");

  await page.goto("/myListings");

  await expect(
    page.getByRole("heading", {
      name: "Playwright Listing Test",
      exact: true,
    })
  ).toBeVisible();
});