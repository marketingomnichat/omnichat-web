import { test, expect } from "@playwright/test";

test.describe("superfícies de SEO/GEO", () => {
  test("robots.txt bloqueia studio e api", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("/studio");
    expect(body).toContain("/api");
  });

  test("sitemap.xml é um urlset válido", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    expect(await response.text()).toContain("<urlset");
  });

  test("llms.txt responde em texto", async ({ request }) => {
    const response = await request.get("/llms.txt");
    expect(response.status()).toBe(200);
    expect(response.headers()["content-type"]).toContain("text/plain");
  });

  test("home expõe JSON-LD de Organization", async ({ page }) => {
    await page.goto("/");
    const jsonLd = page.locator('script[type="application/ld+json"]').first();
    await expect(jsonLd).toBeAttached();
  });
});
