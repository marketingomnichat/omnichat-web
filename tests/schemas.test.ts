import { describe, expect, it } from "vitest";
import { schemaTypes } from "../sanity/schemas";

const names = schemaTypes.map((t: { name: string }) => t.name);

describe("sanity schema", () => {
  it("tem os documentos do modelo de conteúdo", () => {
    for (const doc of ["page", "post", "author", "category", "siteSettings", "redirect"]) {
      expect(names).toContain(doc);
    }
  });
  it("tem os 8 tipos de seção do page builder", () => {
    for (const s of ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats"]) {
      expect(names).toContain(s);
    }
  });
  it("tem o objeto seo compartilhado", () => {
    expect(names).toContain("seo");
  });
});
