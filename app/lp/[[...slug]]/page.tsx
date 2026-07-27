import { notFound } from "next/navigation";
import { Content, fetchOneEntry, isPreviewing } from "@builder.io/sdk-react";
import { builderComponents } from "@/components/sections/builder-registry";
import { BUILDER_API_KEY, BUILDER_MODEL, hasBuilderConfig } from "@/lib/builder";

export default async function LandingPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug?: string[] }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const [{ slug }, search] = await Promise.all([params, searchParams]);
  if (!hasBuilderConfig) notFound();
  const urlPath = `/${(slug ?? []).join("/")}`;
  const content = await fetchOneEntry({
    model: BUILDER_MODEL,
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath },
  });
  // No servidor, isPreviewing exige os search params (tipo Search = QueryObject
  // sem undefined) — filtra chaves sem valor antes de passar.
  const query = Object.fromEntries(
    Object.entries(search).filter((entry): entry is [string, string | string[]] => entry[1] !== undefined),
  );
  // Sem conteúdo publicado, ainda renderiza no preview do Visual Editor.
  if (!content && !isPreviewing(query)) notFound();
  return (
    <main>
      <Content model={BUILDER_MODEL} apiKey={BUILDER_API_KEY} content={content} customComponents={builderComponents} />
    </main>
  );
}
