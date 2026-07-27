import { describe, expect, it } from "vitest";
import { isSafeRelativePath, matchRedirect } from "../lib/redirects";

const redirects = [
  { from: "/blog/antigo", to: "/blog/novo", permanent: true },
  { from: "/precos/", to: "/precos", permanent: true },
];

describe("matchRedirect", () => {
  it("match exato", () => {
    expect(matchRedirect("/blog/antigo", redirects)).toEqual({ to: "/blog/novo", permanent: true });
  });
  it("destino igual ao path atual nunca redireciona (evita loop)", () => {
    // A regra {from:"/precos/", to:"/precos"} casa com "/precos" após
    // normalização, mas o destino é o próprio path atual — redirecionar
    // aqui geraria loop infinito. Deve retornar null.
    expect(matchRedirect("/precos", redirects)).toBeNull();
  });
  it("sem match retorna null", () => {
    expect(matchRedirect("/qualquer", redirects)).toBeNull();
  });
  it("não redireciona para si mesmo", () => {
    expect(matchRedirect("/precos", [{ from: "/precos", to: "/precos", permanent: true }])).toBeNull();
  });
});

describe("isSafeRelativePath", () => {
  it("aceita caminho relativo simples", () => {
    expect(isSafeRelativePath("/x")).toBe(true);
    expect(isSafeRelativePath("/blog/novo?a=1")).toBe(true);
  });
  it("rejeita protocol-relative", () => {
    expect(isSafeRelativePath("//evil.com")).toBe(false);
  });
  it("rejeita URL absoluta", () => {
    expect(isSafeRelativePath("https://evil.com")).toBe(false);
  });
  it("rejeita backslash após a barra", () => {
    expect(isSafeRelativePath("/\\evil.com")).toBe(false);
  });
});
