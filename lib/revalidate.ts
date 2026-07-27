const SLUGGED = new Set(["page", "post", "landingPage"]);
const GLOBAL = new Set(["siteSettings", "redirect"]);

export function tagsFor(_type: string, slug?: string): string[] {
  if (SLUGGED.has(_type)) return slug ? [_type, `${_type}:${slug}`] : [_type];
  if (GLOBAL.has(_type)) return [_type];
  return [];
}
