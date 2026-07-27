import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { sanityFetch } from "@/lib/sanity/client";
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from "@/lib/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";
import type { SectionData } from "@/components/sections/types";

type PageDoc = { title: string; slug: string; seo?: SeoData; sections?: SectionData[] } | null;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: PAGE_SLUGS_QUERY, tags: ["page"] });
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  if (slug === "home") notFound();
  const page = await sanityFetch<PageDoc>({ query: PAGE_QUERY, params: { slug }, tags: ["page", `page:${slug}`] });
  if (!page) return {};
  return buildMetadata({ seo: page.seo, title: page.title, path: `/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (slug === "home") notFound();
  const page = await sanityFetch<PageDoc>({ query: PAGE_QUERY, params: { slug }, tags: ["page", `page:${slug}`] });
  if (!page) notFound();
  return (
    <main>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
