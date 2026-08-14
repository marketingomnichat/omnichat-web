import { expect, test } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("CTA de demo abre formulário em modal com case OmniChat", async ({ page }) => {
  await page.goto("/");

  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("link", { name: "Agendar demo" }).first().click();

  const dialog = page.getByRole("dialog", {
    name: "Solicite sua demonstração",
  });
  await expect(dialog).toBeVisible();
  await expect(dialog.getByLabel("Nome completo")).toBeVisible();
  await expect(dialog.getByLabel("E-mail corporativo")).toBeVisible();
  await expect(dialog.getByLabel("Telefone")).toBeVisible();
  await expect(dialog.getByLabel("Cargo")).toBeVisible();
  await expect(dialog.getByLabel("Segmento")).toBeVisible();
  await expect(dialog.getByText("Case OmniChat")).toBeVisible();
  await expect(
    dialog.getByText("Resultado construído com conversas"),
  ).toBeVisible();

  const results = await new AxeBuilder({ page })
    .include('[role="dialog"]')
    .analyze();
  const serious = results.violations.filter(
    (violation) =>
      violation.impact === "critical" ||
      violation.impact === "serious",
  );
  expect(
    serious,
    serious.map((violation) => violation.id).join(", "),
  ).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
});

test("home não mantém formulário fixo no rodapé", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("main form")).toHaveCount(0);
});

test("formulário envia apenas campos válidos ao HubSpot", async ({ page }) => {
  let submittedPayload: {
    fields: Array<{ name: string; value: string }>;
  } | null = null;

  await page.route("https://api.hsforms.com/**", async (route) => {
    submittedPayload = route.request().postDataJSON();
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: "{}",
    });
  });

  await page.goto("/");
  await page.getByRole("link", { name: "Demo", exact: true }).click();

  const dialog = page.getByRole("dialog", {
    name: "Solicite sua demonstração",
  });
  await dialog.getByLabel("Nome completo").fill("Ana Silva");
  await dialog.getByLabel("E-mail corporativo").fill("ana@empresa.com");
  await dialog.getByLabel("Empresa").fill("Empresa Exemplo");
  await dialog.getByLabel("Telefone").fill("41999999999");
  await dialog.getByLabel("Cargo").selectOption("Gerente/Head");
  await dialog.getByLabel("Segmento").selectOption("Varejo");
  await dialog.getByText("Até 10", { exact: true }).click();
  await dialog.getByRole("button", {
    name: "Solicitar demonstração",
  }).click();

  await expect(
    page.getByRole("status").getByText("Recebemos seu contato"),
  ).toBeVisible();

  expect(submittedPayload).not.toBeNull();
  // o TS não enxerga a atribuição dentro do handler de page.route
  const fields: Array<{ name: string; value: string }> =
    (
      submittedPayload as {
        fields: Array<{ name: string; value: string }>;
      } | null
    )?.fields ?? [];
  expect(fields.map((field) => field.name)).toEqual([
    "firstname",
    "email",
    "company",
    "phone",
    "cargo",
    "segmentorevisado",
    "qual_o_nmero_de_atendentesvendedores_da_empesa",
  ]);
  expect(fields.find((field) => field.name === "phone")?.value).toBe(
    "+55 41999999999",
  );
  expect(
    fields.find((field) => field.name === "segmentorevisado")?.value,
  ).toBe("Varejo");
  expect(
    fields.find(
      (field) =>
        field.name === "qual_o_nmero_de_atendentesvendedores_da_empesa",
    )?.value,
  ).toBe("Até 10");
});
