import { sanityFetch } from "@/services/sanity/client";
import { POSTS_QUERY } from "@/services/sanity/queries";
import { PostCard, type PostListItem } from "@/components/site/post-card";

export async function LatestPosts({
  title,
  limit = 4,
}: {
  title?: string;
  limit?: number;
}) {
  const posts = (await sanityFetch<PostListItem[]>({ query: POSTS_QUERY, tags: ["post"] })) ?? [];
  const visible = posts.slice(0, limit);

  return (
    <section className="bg-oc-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        {title && (
          <h2 className="oc-h2 mb-12 text-center">{title}</h2>
        )}
        {visible.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visible.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        ) : (
          <p className="oc-body-sm text-center text-oc-neutral-dark">Nenhum post publicado ainda.</p>
        )}
      </div>
    </section>
  );
}
