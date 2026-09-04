import { test, expect } from "@playwright/test";

test("Messages page loads", async ({ page }) => {
  await page.goto("/message");

  await expect(page).toHaveURL(/\/message/);

  // Verify the messages page loaded
  await expect(
    page.getByRole("link", { name: /messages/i })
      .or(page.getByRole("button", { name: /messages/i }))
      .or(page.getByText(/select a conversation|no conversations|messages/i))
      .first()
  ).toBeVisible();
});