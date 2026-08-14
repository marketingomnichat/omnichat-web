import type { Metadata } from "next";
import { ClickupCompositionHome } from "@/components/home/clickup-composition";
import { sanityFetch } from "@/services/sanity/client";
import { HOME_QUERY } from "@/services/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";
import type { HomePageData } from "@/shared/types";

type PageDoc = { title: string; seo?: SeoData } | null;

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<PageDoc>({ query: HOME_QUERY, tags: ["page", "page:home"] });
  return buildMetadata({
    seo: page?.seo ?? {
      metaTitle: "OmniChat – Marketing e Vendas no WhatsApp com IA Conversacional",
      metaDescription:
        "A OmniChat conecta marketing, vendas e relacionamento no WhatsApp com uma IA Conversacional que garante experiências encantadoras, produtividade e conversas que vendem.",
    },
    title: page?.title ?? "OmniChat",
    path: "/",
  });
}

/** Home comercial editável no Sanity, com conteúdo padrão durante a migração. */
export default async function HomePage() {
  const page = await sanityFetch<HomePageData>({ query: HOME_QUERY, tags: ["page", "page:home"] });
  return <ClickupCompositionHome content={page?.home} />;
}
