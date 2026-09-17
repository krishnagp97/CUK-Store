import { expect, Page } from "@playwright/test";
import fs from "fs";
import path from "path";

type TestProduct = {
  id: string;
  title: string;
  status?: "AVAILABLE" | "SOLD";
};

export async function ensureTestProduct(
  page: Page,
  title: string,
): Promise<TestProduct> {
  // 1. Check the current user's listings
  await page.goto("/myListings");

  const listing = page.getByRole("heading", {
    name: title,
    exact: true,
  });

  // Wait for the listings page to render before deciding
  // whether the product needs to be created.
  try {
    await expect(listing).toBeVisible({ timeout: 3000 });

    console.log(`Reusing test product: ${title}`);

    const card = listing
      .locator("../..")
      .locator("..");

    // Get the real product ID from the user-visible View link
    const href = await card
      .getByRole("link", { name: "View" })
      .getAttribute("href");

    const id = href?.split("/").pop();

    if (!id) {
      throw new Error(
        `Could not determine product ID for "${title}"`,
      );
    }

    return {
      id,
      title,
    };
  } catch {
    // Product does not exist yet, so create it.
    console.log(`Creating test product: ${title}`);
  }

  // 2. Upload test image
  const imagePath = path.resolve(
    "tests/fixtures/test-product.jpeg",
  );

  const uploadResponse = await page.request.post("/api/upload", {
    multipart: {
      file: {
        name: "test-product.jpeg",
        mimeType: "image/jpeg",
        buffer: fs.readFileSync(imagePath),
      },
    },
  });

  expect(
    uploadResponse.ok(),
    `Failed to upload test image: ${
      uploadResponse.status()
    } ${await uploadResponse.text()}`,
  ).toBeTruthy();

  const uploadedImage = await uploadResponse.json();

  // 3. Create product
  const createResponse = await page.request.post("/api/products", {
    data: {
      title,
      description: `Automated Playwright test product: ${title}`,
      price: 999,
      category: "electronics",
      images: [
        {
          imageUrl: uploadedImage.secure_url,
          publicId: uploadedImage.public_id,
        },
      ],
    },
  });

  expect(
    createResponse.ok(),
    `Failed to create test product "${title}": ${
      createResponse.status()
    } ${await createResponse.text()}`,
  ).toBeTruthy();

  const created = await createResponse.json();

  console.log(`Created test product: ${title}`);

  return created.product;
}