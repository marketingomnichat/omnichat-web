import { buildLlmsTxt } from "@/lib/llms";
import { sanityFetch } from "@/services/sanity/client";
import { LLMS_QUERY } from "@/services/sanity/queries";

export async function GET() {
  const data = await sanityFetch<{
    pages: { title: string; slug: string }[];
    posts: { title: string; slug: string; excerpt?: string }[];
  }>({ query: LLMS_QUERY, tags: ["page", "post"] });
  const body = buildLlmsTxt(data ?? { pages: [], posts: [] });
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
