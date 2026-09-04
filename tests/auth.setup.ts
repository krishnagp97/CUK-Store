import { test as setup, expect } from "@playwright/test";

setup("authenticate", async ({ page }) => {
  await page.goto("/sign-in");

  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  if (!email || !password) {
    throw new Error("TEST_EMAIL or TEST_PASSWORD is missing");
  }

  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);

  const responsePromise = page.waitForResponse(
    (response) =>
      response.url().includes("/api/auth/sign-in/email") &&
      response.request().method() === "POST"
  );

  await page.getByRole("button", { name: /sign in/i }).click();

  const response = await responsePromise;

  console.log("LOGIN STATUS:", response.status());

  if (!response.ok()) {
    throw new Error(`Better Auth login failed: ${response.status()}`);
  }

  // Wait for navigation/session to settle
  await page.waitForTimeout(1000);

  // Verify session using the SAME browser context
  const sessionResponse = await page.request.get("/api/auth/get-session");

  const session = await sessionResponse.json();


  expect(sessionResponse.ok()).toBeTruthy();

  // Better Auth normally returns { user, session }
  expect(session.user).toBeTruthy();
  expect(session.session).toBeTruthy();

  // Save authenticated browser state
  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });

  console.log("AUTH STATE SAVED");
});