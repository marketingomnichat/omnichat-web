import { describe, expect, it } from "vitest";
import { schemaTypes } from "../sanity/schemas";

const names = schemaTypes.map((t: { name: string }) => t.name);

describe("sanity schema", () => {
  it("tem os documentos do modelo de conteúdo", () => {
    for (const doc of ["page", "post", "author", "category", "siteSettings", "redirect"]) {
      expect(names).toContain(doc);
    }
  });
  it("tem os 9 tipos de seção do page builder", () => {
    for (const s of ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats", "featureSplit"]) {
      expect(names).toContain(s);
    }
  });
  it("tem o objeto seo compartilhado", () => {
    expect(names).toContain("seo");
  });
  it("landingPage existe com page builder e seo", () => {
    const lp = schemaTypes.find((t) => t.name === "landingPage");
    expect(lp).toBeDefined();
    const fields = (lp as { fields: { name: string }[] }).fields.map((f) => f.name);
    expect(fields).toEqual(expect.arrayContaining(["title", "slug", "seo", "sections"]));
  });
  it("todo field de documento tem title definido (pt-BR)", () => {
    for (const t of schemaTypes) {
      for (const f of (t as { fields?: { name: string; title?: string }[] }).fields ?? []) {
        expect(f.title, `${t.name}.${f.name} sem title`).toBeTruthy();
      }
    }
  });
});
