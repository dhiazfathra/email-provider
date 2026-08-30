import { expect, test } from "@playwright/test";

test("the landing page renders its product name", async ({ page }) => {
  const response = await page.goto("/");
  expect(response?.status()).toBe(200);
  await expect(page.getByText("Plume").first()).toBeVisible();
});
