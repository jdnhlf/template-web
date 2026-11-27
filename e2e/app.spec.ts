import { expect, test } from "@playwright/test";

test("home renders signed out", async ({ page }) => {
  const response = await page.goto("/");

  expect(response?.status()).toBe(200);
  await expect(page.getByText("Not signed in.")).toBeVisible();
});

test("dashboard redirects signed-out visitors to login", async ({ page }) => {
  await page.goto("/dashboard");

  await expect(page).toHaveURL("/login?next=%2Fdashboard");
  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("manifest is installable", async ({ request }) => {
  const response = await request.get("/manifest.webmanifest");

  expect(response.status()).toBe(200);
  expect(response.headers()["content-type"]).toContain(
    "application/manifest+json",
  );

  const manifest = await response.json();
  expect(manifest.display).toBe("standalone");
  expect(manifest.icons.map((icon: { sizes: string }) => icon.sizes)).toEqual(
    expect.arrayContaining(["192x192", "512x512"]),
  );
});

test("service worker is served uncached", async ({ request }) => {
  const response = await request.get("/sw.js");

  expect(response.status()).toBe(200);
  expect(response.headers()["cache-control"]).toContain("no-store");
});

test("service worker registers at the root scope", async ({ page }) => {
  await page.goto("/");

  const scope = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready;
    return new URL(registration.scope).pathname;
  });

  expect(scope).toBe("/");
});
