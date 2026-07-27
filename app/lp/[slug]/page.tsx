import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { sanityFetch } from "@/services/sanity/client";
import { LANDING_PAGE_QUERY, LANDING_PAGE_SLUGS_QUERY } from "@/services/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";
import type { SectionData } from "@/shared/types";

type LandingPageDoc = { title: string; slug: string; seo?: SeoData; sections?: SectionData[] } | null;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: LANDING_PAGE_SLUGS_QUERY, tags: ["landingPage"] });
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await sanityFetch<LandingPageDoc>({
    query: LANDING_PAGE_QUERY,
    params: { slug },
    tags: ["landingPage", `landingPage:${slug}`],
  });
  if (!page) return {};
  return buildMetadata({ seo: page.seo, title: page.title, path: `/lp/${slug}` });
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await sanityFetch<LandingPageDoc>({
    query: LANDING_PAGE_QUERY,
    params: { slug },
    tags: ["landingPage", `landingPage:${slug}`],
  });
  if (!page) return notFound();
  return (
    <main>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
