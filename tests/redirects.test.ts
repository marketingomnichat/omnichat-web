import { describe, expect, it } from "vitest";
import { matchRedirect } from "../lib/redirects";

const redirects = [
  { from: "/blog/antigo", to: "/blog/novo", permanent: true },
  { from: "/precos/", to: "/precos", permanent: true },
];

describe("matchRedirect", () => {
  it("match exato", () => {
    expect(matchRedirect("/blog/antigo", redirects)).toEqual({ to: "/blog/novo", permanent: true });
  });
  it("normaliza trailing slash do from", () => {
    expect(matchRedirect("/precos", redirects)).toEqual({ to: "/precos", permanent: true });
  });
  it("sem match retorna null", () => {
    expect(matchRedirect("/qualquer", redirects)).toBeNull();
  });
  it("não redireciona para si mesmo", () => {
    expect(matchRedirect("/precos", [{ from: "/precos", to: "/precos", permanent: true }])).toBeNull();
  });
});
