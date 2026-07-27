import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { sanityFetch } from "@/services/sanity/client";
import { HOME_QUERY } from "@/services/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";
import type { SectionData } from "@/shared/types";

type PageDoc = { title: string; seo?: SeoData; sections?: SectionData[] } | null;

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<PageDoc>({ query: HOME_QUERY, tags: ["page", "page:home"] });
  return buildMetadata({ seo: page?.seo, title: page?.title ?? "OmniChat", path: "/" });
}

export default async function HomePage() {
  const page = await sanityFetch<PageDoc>({ query: HOME_QUERY, tags: ["page", "page:home"] });
  if (!page) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-24">
        <h1 className="oc-h1">OmniChat</h1>
        <p className="oc-body mt-4 text-oc-neutral-dark">
          Conteúdo ainda não publicado no CMS. Configure o Sanity e publique a página &quot;home&quot;.
        </p>
      </main>
    );
  }
  return (
    <main>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
