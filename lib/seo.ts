import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

export type SeoData = {
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
} | null;

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
