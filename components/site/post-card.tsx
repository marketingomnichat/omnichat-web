import Link from "next/link";
import { Card } from "@/components/ui/card";

export type PostListItem = {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  categories?: { title: string; slug: string }[];
};

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <Card elevation="border">
      {post.categories?.[0] && <p className="oc-overline text-oc-yellow-ink">{post.categories[0].title}</p>}
      <h2 className="oc-h4 mt-2">
        <Link href={`/blog/${post.slug}`} className="hover:text-oc-yellow-ink">
          {post.title}
        </Link>
      </h2>
      {post.excerpt && <p className="oc-body-sm mt-2 text-oc-neutral-dark">{post.excerpt}</p>}
      {post.publishedAt && (
        <p className="oc-caption mt-4 text-oc-neutral-dark">
          {new Date(post.publishedAt).toLocaleDateString("pt-BR", { dateStyle: "long" })}
        </p>
      )}
    </Card>
  );
}
