import { expect, test } from "@playwright/test";

const ROUTES = [
  "/",
  "/docs",
  "/console",
  "/console/activity",
  "/console/templates",
  "/console/domains",
  "/console/keys",
  "/console/suppressions",
  "/console/audit",
];

for (const route of ROUTES) {
  test(`${route} has no dead links`, async ({ page }) => {
    await page.goto(route);
    const dead = await page.locator('a[href="#"], a[href=""]').count();
    expect(dead, `${route} renders a link that goes nowhere`).toBe(0);
  });
}

test("the range switcher changes what is rendered", async ({ page }) => {
  await page.goto("/console");
  const before = await page.locator("main").innerText();
  await page.getByRole("button", { name: "30d" }).click();
  await expect
    .poll(async () => page.locator("main").innerText())
    .not.toBe(before);
});

test("docs search filters the sections", async ({ page }) => {
  await page.goto("/docs");
  const before = await page.locator("nav").innerText();
  await page.getByLabel("Search the docs").fill("webhook");
  await expect
    .poll(async () => page.locator("nav").innerText())
    .not.toBe(before);
});

test("Cmd+K focuses the docs search field", async ({ page }) => {
  await page.goto("/docs");
  await page.bringToFront();
  await page.locator("body").click();
  await page.keyboard.press("ControlOrMeta+KeyK");
  await expect(page.getByLabel("Search the docs")).toBeFocused();
});

test("the landing email capture is a form", async ({ page }) => {
  await page.goto("/");
  const input = page.getByLabel("Work email");
  await expect(input).toBeVisible();
  const form = page.locator("form").filter({ has: input });
  await expect(form).toHaveCount(1);
});
