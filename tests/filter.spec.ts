import { test, expect } from "@playwright/test";

test("user can filter products by category", async ({ page }) => {
  await page.goto("/");

  const categoryButton = page.getByRole("button", {
    name: "Electronics",
    exact: true,
  });

  await expect(categoryButton).toBeVisible();

  await categoryButton.click();

  await expect(page).toHaveURL(/category=electronics/i);
});

test("user can remove the category filter", async ({ page }) => {
  await page.goto("/?category=electronics");

  const categoryButton = page.getByRole("button", {
    name: "Electronics",
    exact: true,
  });

  await expect(categoryButton).toBeVisible();

  await categoryButton.click();

  await expect(page).toHaveURL(/\/$/);

  const url = new URL(page.url());
  expect(url.searchParams.has("category")).toBe(false);
});