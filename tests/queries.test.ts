import { describe, expect, it } from "vitest";
import {
  HOME_QUERY,
  PAGE_QUERY,
  POSTS_QUERY,
  POST_QUERY,
  REDIRECTS_QUERY,
  SETTINGS_QUERY,
} from "../services/sanity/queries";

describe("GROQ queries", () => {
  it("busca page por slug com sections", () => {
    expect(PAGE_QUERY).toContain('_type == "page"');
    expect(PAGE_QUERY).toContain("$slug");
    expect(PAGE_QUERY).toContain("sections");
  });
  it("home é a page de slug 'home'", () => {
    expect(HOME_QUERY).toContain('"home"');
  });
  it("post traz seo e faq", () => {
    expect(POST_QUERY).toContain('_type == "post"');
    expect(POST_QUERY).toContain("seo");
    expect(POST_QUERY).toContain("faq");
  });
  it("posts ordenados por data desc", () => {
    expect(POSTS_QUERY).toContain("order(publishedAt desc)");
  });
  it("settings é singleton", () => {
    expect(SETTINGS_QUERY).toContain('_type == "siteSettings"');
    expect(SETTINGS_QUERY).toContain("[0]");
  });
  it("settings projeta subitens da navegação", () => {
    expect(SETTINGS_QUERY).toContain(
      "nav[]{label, href, children[]{label, href, iconUrl, iconAlt}}"
    );
  });
  it("settings projeta footerBadges", () => {
    expect(SETTINGS_QUERY).toContain("footerBadges[]{imageUrl, alt, href}");
  });
  it("redirects trazem from/to/permanent", () => {
    for (const f of ["from", "to", "permanent"]) {
      expect(REDIRECTS_QUERY).toContain(f);
    }
  });
});
