import { describe, expect, it } from "vitest";
import { safeHref } from "../lib/safe-href";

describe("safeHref", () => {
  it("aceita https, http, mailto, tel, path relativo e âncora", () => {
    for (const ok of ["https://omni.chat/x", "http://a.b", "mailto:a@b.c", "tel:+5541", "/planos", "#form"]) {
      expect(safeHref(ok)).toBe(ok);
    }
  });

  it("neutraliza esquemas executáveis e protocol-relative", () => {
    for (const bad of ["javascript:alert(1)", "data:text/html,x", "vbscript:x", "//evil.com/x", "JaVaScRiPt:x"]) {
      expect(safeHref(bad)).toBe("#");
    }
  });

  it("trata vazio/undefined", () => {
    expect(safeHref(undefined)).toBe("#");
    expect(safeHref("")).toBe("#");
  });
});
