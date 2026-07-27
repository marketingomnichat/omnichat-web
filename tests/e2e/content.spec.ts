import { test, expect } from "@playwright/test";

const PAGES = [
  { path: "/", h1: /Domine marketing e vendas no WhatsApp/i },
  { path: "/empresa", h1: /Criamos tecnologia para aproximar/i },
  { path: "/planos", h1: /Escolha o plano/i },
  { path: "/chat-commerce-report", h1: /retrato em dados da jornada/i },
  { path: "/lgpd", h1: /LGPD/i },
];

test.describe("conteúdo migrado", () => {
  for (const p of PAGES) {
    test(`${p.path} renderiza conteúdo migrado`, async ({ page }) => {
      await page.goto(p.path);
      await expect(page.locator("h1")).toContainText(p.h1);
    });
  }

  test("post migrado abre com corpo", async ({ page }) => {
    await page.goto("/blog/reduzir-custo-do-whatsapp");
    await expect(page.locator("h1")).toBeVisible();
    await expect(page.locator("article p").first()).toBeVisible();
  });
});
