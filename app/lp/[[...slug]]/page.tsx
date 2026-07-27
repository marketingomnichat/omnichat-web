import { notFound } from "next/navigation";
import { Content, fetchOneEntry } from "@builder.io/sdk-react";
import { builderComponents } from "@/components/sections/builder-registry";
import { BUILDER_API_KEY, BUILDER_MODEL, hasBuilderConfig } from "@/lib/builder";

export default async function LandingPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (!hasBuilderConfig) notFound();
  const urlPath = `/${(slug ?? []).join("/")}`;
  const content = await fetchOneEntry({
    model: BUILDER_MODEL,
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath },
  });
  if (!content) notFound();
  return (
    <main>
      <Content model={BUILDER_MODEL} apiKey={BUILDER_API_KEY} content={content} customComponents={builderComponents} />
    </main>
  );
}
