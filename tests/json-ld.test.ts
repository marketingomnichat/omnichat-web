import { describe, expect, it } from "vitest";
import { serializeJsonLd } from "../lib/seo";

describe("serializeJsonLd", () => {
  it("escapa </script> para impedir breakout da tag (XSS)", () => {
    const out = serializeJsonLd({
      "@type": "Organization",
      name: '</script><script>alert("xss")</script>',
    });
    expect(out).not.toContain("</script>");
    expect(out).not.toContain("<");
  });

  it("escapa separadores de linha U+2028/U+2029", () => {
    const out = serializeJsonLd({ "@type": "Article", headline: "a\u2028b\u2029c" });
    expect(out).not.toContain("\u2028");
    expect(out).not.toContain("\u2029");
  });

  it("JSON.parse do output reconstrói o dado com @context", () => {
    const data = { "@type": "Organization", name: '</script>"quote"', nested: { a: ["<", 1] } };
    const parsed = JSON.parse(serializeJsonLd(data));
    expect(parsed).toEqual({ "@context": "https://schema.org", ...data });
  });
});
