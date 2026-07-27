import { test, expect } from "@playwright/test";

const LP_HOST = process.env.NEXT_PUBLIC_LP_HOST ?? "lp.omni.chat";

test.describe("proxy multi-host", () => {
  test("/lp/* no host principal redireciona para fora do /lp", async ({ request }) => {
    const response = await request.get("/lp/qualquer-lp", { maxRedirects: 0 });
    expect(response.status()).toBe(301);
    expect(response.headers()["location"]).toBe("/qualquer-lp");
  });

  test("host de LP sem conteúdo publicado degrada em 404, nunca 500", async ({ request }) => {
    const response = await request.get("/lp-inexistente", {
      headers: { host: LP_HOST },
      maxRedirects: 0,
    });
    expect(response.status()).toBe(404);
  });

  test("raiz do host de LP não estoura 500", async ({ request }) => {
    const response = await request.get("/", { headers: { host: LP_HOST }, maxRedirects: 0 });
    expect(response.status()).toBeLessThan(500);
  });

  test("studio é bloqueado no host de LP", async ({ request }) => {
    const response = await request.get("/studio", { headers: { host: LP_HOST }, maxRedirects: 0 });
    expect(response.status()).toBe(404);
  });
});
