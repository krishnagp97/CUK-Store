import { test, expect } from "@playwright/test";
import { ensureTestProduct } from "./helpers/testProduct";

test("product status changes correctly", async ({ page }) => {
  const productTitle = "Playwright Sold Test";

  await ensureTestProduct(page, productTitle);

  await page.goto("/myListings");

  const listing = page
    .getByRole("heading", {
      name: productTitle,
      exact: true,
    })
    .locator("../..")
    .locator("..");

  // Mark as sold
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toBe("Mark this product as sold?");
    await dialog.accept();
  });

  await listing.getByRole("button", { name: "Mark as Sold" }).click();

  await expect(
    listing.getByText("Sold", { exact: true }),
  ).toBeVisible();

  // Mark as available
  page.once("dialog", async (dialog) => {
    expect(dialog.type()).toBe("confirm");
    expect(dialog.message()).toBe("Mark this product as available?");
    await dialog.accept();
  });

  await listing
    .getByRole("button", { name: "Mark as Available" })
    .click();

  await expect(
    listing.getByText("Available", { exact: true }),
  ).toBeVisible();
});