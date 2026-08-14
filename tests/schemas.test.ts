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
    expect(names).toContain("homeComposition");
  });
  it("homeComposition expõe toda a narrativa comercial editável", () => {
    const home = schemaTypes.find((type) => type.name === "homeComposition") as {
      fields: { name: string; fields?: { name: string }[] }[];
    };
    expect(home.fields.map((field) => field.name)).toEqual(
      expect.arrayContaining(["hero", "logos", "journey", "whizz", "stories", "proof", "integrations", "finalCta"]),
    );
    const heroFields = home.fields.find((field) => field.name === "hero")?.fields?.map((field) => field.name);
    expect(heroFields).toEqual(expect.arrayContaining(["title", "description", "cta", "proof", "tabs"]));
  });
  it("siteSettings permite subitens na navegação", () => {
    type Field = { name: string; title?: string; of?: { fields: Field[] }[] };
    const settings = schemaTypes.find((t) => t.name === "siteSettings") as {
      fields: Field[];
    };
    const navFields = settings.fields.find((field) => field.name === "nav")?.of?.[0]?.fields ?? [];
    const children = navFields.find((field) => field.name === "children");

    expect(children?.title).toBe("Subitens");
    expect(children?.of).toBeDefined();
    const childFields = children?.of?.[0]?.fields.map((field) => field.name);
    expect(childFields).toEqual(expect.arrayContaining(["label", "href", "iconUrl", "iconAlt"]));
  });
  it("siteSettings expõe footerBadges (lojas e ISO)", () => {
    type Field = { name: string; of?: { fields: { name: string }[] }[] };
    const settings = schemaTypes.find((t) => t.name === "siteSettings") as { fields: Field[] };
    const footerBadges = settings.fields.find((field) => field.name === "footerBadges");
    expect(footerBadges?.of).toBeDefined();
    const badgeFields = footerBadges?.of?.[0]?.fields.map((field) => field.name);
    expect(badgeFields).toEqual(expect.arrayContaining(["imageUrl", "alt", "href", "kind", "width", "height"]));
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
  it("hero expõe backgroundMedia opcional (vídeo ou imagem)", () => {
    const hero = schemaTypes.find((t) => t.name === "hero") as {
      fields: { name: string; fields?: { name: string }[] }[];
    };
    const backgroundMedia = hero.fields.find((field) => field.name === "backgroundMedia");
    expect(backgroundMedia).toBeDefined();
    expect(backgroundMedia?.fields?.map((field) => field.name)).toEqual(
      expect.arrayContaining(["type", "url", "poster"]),
    );
  });
  it("ctaBanner expõe image opcional lateral", () => {
    const ctaBanner = schemaTypes.find((t) => t.name === "ctaBanner") as {
      fields: { name: string; fields?: { name: string }[] }[];
    };
    const image = ctaBanner.fields.find((f) => f.name === "image");
    expect(image).toBeDefined();
    expect(image?.fields?.map((f) => f.name)).toEqual(expect.arrayContaining(["imageUrl", "alt"]));
  });
  it("ctaForm expõe asideImage opcional lateral", () => {
    const ctaForm = schemaTypes.find((t) => t.name === "ctaForm") as {
      fields: { name: string; fields?: { name: string }[] }[];
    };
    const asideImage = ctaForm.fields.find((f) => f.name === "asideImage");
    expect(asideImage).toBeDefined();
    expect(asideImage?.fields?.map((f) => f.name)).toEqual(expect.arrayContaining(["imageUrl", "alt"]));
  });
});
