import { test, expect } from "@playwright/test";

test("Delete listing", async ({ page }) => {
  await page.goto("/myListings");

  const listing = page
    .locator("h2")
    .filter({ hasText: "Playwright" })
    .first()
    .locator("../..")
    .locator("..");

  await expect(listing).toBeVisible();

  const title = await listing.locator("h2").innerText();

  page.once("dialog", async dialog => {
    expect(dialog.type()).toBe("confirm");
    await dialog.accept();
  });

  await listing.getByRole("button", { name: "Delete" }).click();

  await expect(
    page.getByRole("heading", { name: title, exact: true })
  ).toHaveCount(0);
});