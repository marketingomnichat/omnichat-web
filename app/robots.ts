import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";
// Política de IA aberta: o objetivo GEO/AEO é ser citado por answer engines.
const AI_BOTS = ["GPTBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended", "cohere-ai", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" as const, disallow: ["/studio", "/api/"] })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
