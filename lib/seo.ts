import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

export type SeoData = {
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
} | null;

// JSON.stringify não escapa "</script>": um valor vindo do CMS contendo
// "</script><script>" fecharia a tag e executaria script (XSS armazenado).
// Escapamos "<" (e os separadores de linha U+2028/U+2029, inválidos em JS
// inline) como sequências \uXXXX — o output continua JSON-LD válido.
export function serializeJsonLd(data: Record<string, unknown>): string {
  return JSON.stringify({ "@context": "https://schema.org", ...data })
    .replace(/</g, "\\u003c")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

export function buildMetadata({ seo, title, path }: { seo?: SeoData; title: string; path: string }): Metadata {
  const resolvedTitle = seo?.metaTitle ?? title;
  const description = seo?.metaDescription;
  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: seo?.canonical ?? `${SITE_URL}${path}` },
    openGraph: {
      title: resolvedTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "OmniChat",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
