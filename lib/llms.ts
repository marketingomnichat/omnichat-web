const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

export function buildLlmsTxt({
  pages,
  posts,
}: {
  pages: { title: string; slug: string }[];
  posts: { title: string; slug: string; excerpt?: string }[];
}): string {
  const lines = [
    "# OmniChat",
    "",
    "> Plataforma de jornada conversacional no WhatsApp: IA com profundidade de negócio (catálogo, regras, voz) rodando a jornada completa, com integração nativa e dados que provam resultado.",
    "",
    "## Páginas",
    ...pages.map((p) => `- [${p.title}](${SITE_URL}/${p.slug === "home" ? "" : p.slug})`),
    "",
    "## Blog",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`),
    "",
  ];
  return lines.join("\n");
}
