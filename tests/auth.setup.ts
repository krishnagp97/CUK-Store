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
    console.log("LOGIN BODY:", await response.text());
    throw new Error(`Better Auth login failed: ${response.status()}`);
  }

  // Give Next.js/Better Auth time to finish navigation/session handling
  await page.waitForTimeout(500);

  const cookies = await page.context().cookies();


  const sessionResponse = await page.request.get("/api/auth/get-session");

  
  expect(response.ok()).toBeTruthy();
  expect(cookies.some((c) => c.name.includes("better-auth"))).toBeTruthy();

  const session = await sessionResponse.json();

  expect(session).toBeTruthy();

  await page.context().storageState({
    path: "playwright/.auth/user.json",
  });
});