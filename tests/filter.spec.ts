import { test, expect } from "@playwright/test";

test("user can filter products by category", async ({ page }) => {
  await page.goto("/");

  const categoryButton = page.getByRole("button", {
    name: "Electronics",
    exact: true,
  });

  await expect(categoryButton).toBeVisible();

  await categoryButton.click();

  await expect(
    page.getByText("Electronics", { exact: true }).first()
  ).toBeVisible();
});