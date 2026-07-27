import { test, expect } from "@playwright/test";

test.describe("site institucional", () => {
  test("home responde e declara pt-BR", async ({ page }) => {
    const response = await page.goto("/");
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  });

  test("styleguide renderiza o design system", async ({ page }) => {
    const response = await page.goto("/styleguide");
    expect(response?.status()).toBe(200);
    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("blog responde", async ({ page }) => {
    const response = await page.goto("/blog");
    expect(response?.status()).toBe(200);
  });

  test("rota inexistente responde 404", async ({ request }) => {
    const response = await request.get("/pagina-que-nao-existe", { maxRedirects: 0 });
    expect(response.status()).toBe(404);
  });
});
