import { describe, expect, it } from "vitest";
import { sectionRegistry } from "../components/sections/registry";

describe("section registry", () => {
  it("cobre os 13 tipos de seção do schema", () => {
    for (const t of [
      "hero",
      "featureGrid",
      "testimonials",
      "logoCloud",
      "ctaBanner",
      "faq",
      "richText",
      "stats",
      "featureSplit",
      "pricingTable",
      "ctaForm",
      "latestPosts",
      "mediaBlock",
    ]) {
      expect(sectionRegistry[t], `faltando: ${t}`).toBeDefined();
    }
  });
});
