import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "../lib/llms";

describe("buildLlmsTxt", () => {
  const out = buildLlmsTxt({
    pages: [{ title: "Preços", slug: "precos" }],
    posts: [{ title: "Post A", slug: "post-a", excerpt: "Resumo A" }],
  });
  it("começa com heading da OmniChat", () => {
    expect(out.startsWith("# OmniChat")).toBe(true);
  });
  it("lista páginas e posts com URLs absolutas", () => {
    expect(out).toContain("https://omni.chat/precos");
    expect(out).toContain("https://omni.chat/blog/post-a");
    expect(out).toContain("Resumo A");
  });
});
