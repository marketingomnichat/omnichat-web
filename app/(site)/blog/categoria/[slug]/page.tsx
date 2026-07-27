import type { Metadata } from "next";
import { PostCard, type PostListItem } from "@/components/site/post-card";
import { sanityFetch } from "@/services/sanity/client";
import { COVER_IMAGE_FIELDS } from "@/services/sanity/queries";
import { buildMetadata } from "@/lib/seo";

const CATEGORY_POSTS_QUERY = `*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc){
  title, "slug": slug.current, excerpt, publishedAt, ${COVER_IMAGE_FIELDS},
  "categories": categories[]->{title, "slug": slug.current}
}`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata({ seo: null, title: `Blog — ${slug}`, path: `/blog/categoria/${slug}` });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts =
    (await sanityFetch<PostListItem[]>({ query: CATEGORY_POSTS_QUERY, params: { slug }, tags: ["post"] })) ?? [];
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-14">
      <h1 className="oc-h1">{slug}</h1>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </main>
  );
}
