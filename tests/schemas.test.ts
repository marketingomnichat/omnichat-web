import { describe, expect, it } from "vitest";
import { schemaTypes } from "../sanity/schemas";

const names = schemaTypes.map((t: { name: string }) => t.name);

describe("sanity schema", () => {
  it("tem os documentos do modelo de conteúdo", () => {
    for (const doc of ["page", "post", "author", "category", "siteSettings", "redirect"]) {
      expect(names).toContain(doc);
    }
  });
  it("tem os 14 tipos de seção do page builder", () => {
    for (const s of ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats", "featureSplit", "featureCarousel", "pricingTable", "ctaForm", "latestPosts", "mediaBlock"]) {
      expect(names).toContain(s);
    }
  });
  it("tem o objeto seo compartilhado", () => {
    expect(names).toContain("seo");
  });
  it("siteSettings permite subitens na navegação", () => {
    const settings = schemaTypes.find((t) => t.name === "siteSettings") as {
      fields: { name: string; of?: { fields: { name: string; title?: string; of?: unknown[] }[] }[] }[];
    };
    const navFields = settings.fields.find((field) => field.name === "nav")?.of?.[0]?.fields ?? [];
    const children = navFields.find((field) => field.name === "children");

    expect(children?.title).toBe("Subitens");
    expect(children?.of).toBeDefined();
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
  it("featureGrid expõe image opcional no membro features", () => {
    const featureGrid = schemaTypes.find((t) => t.name === "featureGrid") as {
      fields: { name: string; of?: { fields: { name: string; fields?: { name: string }[] }[] }[] }[];
    };
    const featureFields =
      featureGrid.fields.find((f) => f.name === "features")?.of?.[0]?.fields ?? [];
    const image = featureFields.find((f) => f.name === "image");
    expect(image).toBeDefined();
    expect(image?.fields?.map((f) => f.name)).toEqual(expect.arrayContaining(["imageUrl", "alt"]));
  });
  it("stats e testimonials expõem campos de fidelidade home", () => {
    const stats = schemaTypes.find((t) => t.name === "stats");
    const statsFields = (stats as { fields: { name: string }[] }).fields.map((f) => f.name);
    expect(statsFields).toContain("title");

    const testimonials = schemaTypes.find((t) => t.name === "testimonials") as {
      fields: { name: string; initialValue?: string; options?: { list?: string[] }; of?: { fields: { name: string }[] }[] }[];
    };
    const variant = testimonials.fields.find((f) => f.name === "variant");
    expect(variant).toMatchObject({
      initialValue: "grid",
      options: { list: ["grid", "carousel"] },
    });

    const itemFields = testimonials.fields
      .find((f) => f.name === "items")
      ?.of?.[0]?.fields.map((f) => f.name);
    expect(itemFields).toEqual(expect.arrayContaining(["logoUrl", "logoAlt", "href"]));
  });
  it("hero expõe destaque Whizz e prompt de agente", () => {
    const hero = schemaTypes.find((t) => t.name === "hero") as {
      fields: {
        name: string;
        title?: string;
        fields?: { name: string; title?: string }[];
      }[];
    };
    const fields = hero.fields.map((field) => field.name);

    expect(fields).toEqual(expect.arrayContaining(["highlightPhrase", "agentPrompt"]));
    expect(hero.fields.find((field) => field.name === "highlightPhrase")?.title).toBe("Trecho em destaque (Whizz)");

    const promptFields = hero.fields.find((field) => field.name === "agentPrompt")?.fields ?? [];
    expect(promptFields.map((field) => field.name)).toEqual(expect.arrayContaining(["prefix", "phrases"]));
    expect(promptFields.every((field) => field.title)).toBe(true);
  });
});
