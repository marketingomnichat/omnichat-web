import type { MetadataRoute } from "next";
import { sanityFetch } from "@/services/sanity/client";
import { PAGE_SLUGS_QUERY, POSTS_QUERY } from "@/services/sanity/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageSlugs = (await sanityFetch<string[]>({ query: PAGE_SLUGS_QUERY, tags: ["page"] })) ?? [];
  const posts =
    (await sanityFetch<{ slug: string; publishedAt?: string }[]>({ query: POSTS_QUERY, tags: ["post"] })) ?? [];
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...pageSlugs.map((slug) => ({ url: `${SITE_URL}/${slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
