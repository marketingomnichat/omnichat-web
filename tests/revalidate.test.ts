import { describe, expect, it } from "vitest";
import { tagsFor } from "../lib/revalidate";

describe("tagsFor", () => {
  it("page revalida a tag geral e a específica", () => {
    expect(tagsFor("page", "precos")).toEqual(["page", "page:precos"]);
  });
  it("post idem", () => {
    expect(tagsFor("post", "meu-post")).toEqual(["post", "post:meu-post"]);
  });
  it("siteSettings e redirect revalidam só a geral", () => {
    expect(tagsFor("siteSettings")).toEqual(["siteSettings"]);
    expect(tagsFor("redirect")).toEqual(["redirect"]);
  });
  it("tipo desconhecido não revalida nada", () => {
    expect(tagsFor("author")).toEqual([]);
  });
});
