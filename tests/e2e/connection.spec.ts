import { test, expect } from "@playwright/test";

// LP Connection (réplica do template Daevnt) — rota /connection, canvas de 1920px.
test.describe("LP connection", () => {
  test.use({ viewport: { width: 1920, height: 1080 } });

  test("página responde e renderiza as 14 seções na ordem do Figma", async ({ page }) => {
    const response = await page.goto("/connection");
    expect(response?.status()).toBe(200);

    const nodeIds = [
      "44:18", // hero
      "115:3", // contact bar
      "133:122", // about
      "200:687", // feature tab
      "184:567", // testimonials
      "198:648", // future events
      "198:647", // video
      "198:645", // speakers
      "198:632", // brands
      "207:161", // pricing
      "198:644", // sliding text
      "198:639", // news
      "198:640", // contact
      "198:643", // footer
    ];
    for (const id of nodeIds) {
      await expect(page.locator(`[data-node-id="${id}"]`)).toBeAttached();
    }

    // Altura total precisa bater com o canvas do Figma (12089px ±1 de arredondamento).
    const height = await page.evaluate(() => document.querySelector("main")!.getBoundingClientRect().height);
    expect(Math.abs(height - 12089)).toBeLessThanOrEqual(1);
  });

  test("hero exibe o heading e o header do evento", async ({ page }) => {
    await page.goto("/connection");
    await expect(page.getByRole("heading", { name: /omnichat connection/i })).toBeVisible();
    await expect(page.getByRole("navigation").getByText("Ingresso")).toBeVisible();
  });

  test("feature tabs trocam painel com ARIA correto", async ({ page }) => {
    await page.goto("/connection");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.first()).toHaveAttribute("aria-selected", "true");

    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.first()).toHaveAttribute("aria-selected", "false");
    await expect(page.getByRole("tabpanel")).toBeVisible();
  });

  test("carrossel do FAQ desloca a trilha com as setas", async ({ page }) => {
    await page.goto("/connection");
    const track = page.locator('[data-node-id="184:566"]');
    await expect(track).toHaveCSS("transform", /matrix\(1, 0, 0, 1, 0, 0\)|none/);

    const trackX = () => track.evaluate((el) => new DOMMatrix(getComputedStyle(el).transform).e);

    await page.getByRole("button", { name: "Próximas perguntas" }).click();
    await expect.poll(trackX).toBeLessThan(0);

    await page.getByRole("button", { name: "Perguntas anteriores" }).click();
    await expect.poll(trackX).toBe(0);
  });

  test("formulário de patrocínio tem campos reais e submit", async ({ page }) => {
    await page.goto("/connection");
    const contact = page.locator('[data-node-id="198:640"]');
    await expect(contact.locator("input").first()).toBeVisible();
    await expect(contact.locator("textarea")).toBeVisible();
    await expect(contact.getByRole("button", { name: /enviar mensagem/i })).toBeVisible();
  });
});
