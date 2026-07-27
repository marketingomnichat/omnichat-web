import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity";
import { Faq } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import type { PostCoverImage } from "@/components/site/post-card";
import { sanityFetch } from "@/services/sanity/client";
import { urlFor } from "@/services/sanity/image";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/services/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

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
  coverImage?: PostCoverImage;
} | null;

/** Extract intrinsic dimensions encoded in a Sanity asset ref (image-<id>-<WxH>-<fmt>). */
function refDimensions(ref: string): { width: number; height: number } | null {
  const match = ref.match(/-(\d+)x(\d+)-/);
  return match ? { width: Number(match[1]), height: Number(match[2]) } : null;
}

type BodyImageValue = { asset?: { _ref?: string }; alt?: string; caption?: string };

const ptComponents: PortableTextComponents = {
  types: {
    image: ({ value }: { value: BodyImageValue }) => {
      const ref = value.asset?._ref;
      if (!ref) return null;
      const dims = refDimensions(ref) ?? { width: 720, height: 405 };
      return (
        <figure className="my-2">
          <Image
            src={urlFor(value as { asset: { _ref: string } }).width(1440).url()}
            alt={value.alt ?? ""}
            width={dims.width}
            height={dims.height}
            sizes="(max-width: 768px) 100vw, 720px"
            className="rounded-oc-card h-auto w-full"
          />
          {value.caption && (
            <figcaption className="oc-caption mt-2 text-oc-neutral-dark">{value.caption}</figcaption>
          )}
        </figure>
      );
    },
  },
};

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
        <JsonLd
          data={{
            "@type": "Article",
            headline: post.title,
            datePublished: post.publishedAt,
            author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
            publisher: { "@type": "Organization", name: "OmniChat" },
          }}
        />
        <JsonLd
          data={{
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Blog", item: `${SITE_URL}/blog` },
              { "@type": "ListItem", position: 2, name: post.title },
            ],
          }}
        />
        {post.faq && post.faq.length > 0 && (
          <JsonLd
            data={{
              "@type": "FAQPage",
              mainEntity: post.faq.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            }}
          />
        )}
        {post.categories?.[0] && <p className="oc-overline text-oc-yellow-ink">{post.categories[0].title}</p>}
        <h1 className="oc-h1 mt-2">{post.title}</h1>
        <p className="oc-caption mt-4 text-oc-neutral-dark">
          {post.author?.name}
          {post.publishedAt &&
            ` · ${new Date(post.publishedAt).toLocaleDateString("pt-BR", { dateStyle: "long" })}`}
        </p>
        {post.coverImage?.url && (
          <Image
            src={post.coverImage.url}
            alt={post.coverImage.alt || post.title}
            width={post.coverImage.width ?? 1440}
            height={post.coverImage.height ?? 810}
            sizes="(max-width: 768px) 100vw, 720px"
            className="rounded-oc-card mt-8 h-auto w-full"
            priority
          />
        )}
        <div className="oc-body mt-8 flex flex-col gap-4 [&_h2]:oc-h2 [&_h3]:oc-h3 [&_a]:underline">
          {post.body && <PortableText value={post.body} components={ptComponents} />}
        </div>
      </article>
      {post.faq && post.faq.length > 0 && <Faq items={post.faq} />}
    </main>
  );
}
