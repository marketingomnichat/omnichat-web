import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { Faq } from "@/components/sections/faq";
import { sanityFetch } from "@/lib/sanity/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/lib/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";

type PostDoc = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  publishedAt?: string;
  seo?: SeoData;
  author?: { name: string; role?: string };
  categories?: { title: string; slug: string }[];
  faq?: { question: string; answer: string }[];
} | null;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: POST_SLUGS_QUERY, tags: ["post"] });
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<PostDoc>({ query: POST_QUERY, params: { slug }, tags: ["post", `post:${slug}`] });
  if (!post) return {};
  return buildMetadata({ seo: post.seo, title: post.title, path: `/blog/${slug}` });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<PostDoc>({ query: POST_QUERY, params: { slug }, tags: ["post", `post:${slug}`] });
  if (!post) notFound();
  return (
    <main className="mx-auto max-w-[720px] px-6 py-14">
      <article>
        {post.categories?.[0] && <p className="oc-overline text-oc-yellow-ink">{post.categories[0].title}</p>}
        <h1 className="oc-h1 mt-2">{post.title}</h1>
        <p className="oc-caption mt-4 text-oc-neutral-dark">
          {post.author?.name}
          {post.publishedAt &&
            ` · ${new Date(post.publishedAt).toLocaleDateString("pt-BR", { dateStyle: "long" })}`}
        </p>
        <div className="oc-body mt-8 flex flex-col gap-4 [&_h2]:oc-h2 [&_h3]:oc-h3 [&_a]:underline">
          {post.body && <PortableText value={post.body} />}
        </div>
      </article>
      {post.faq && post.faq.length > 0 && <Faq items={post.faq} />}
    </main>
  );
}
