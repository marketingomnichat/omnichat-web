import type { Metadata } from "next";
import { PostCard, type PostListItem } from "@/components/site/post-card";
import { sanityFetch } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: null,
  title: "Blog OmniChat — vendas e IA no WhatsApp",
  path: "/blog",
});

export default async function BlogIndex() {
  const posts = (await sanityFetch<PostListItem[]>({ query: POSTS_QUERY, tags: ["post"] })) ?? [];
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-14">
      <h1 className="oc-h1">Blog</h1>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </main>
  );
}
