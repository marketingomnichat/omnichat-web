import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, hasSanityConfig, projectId } from "./env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl: "/studio" },
});

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T | null> {
  // Sem credenciais (dev local/CI), degrada sem crash de build.
  if (!hasSanityConfig) return null;
  return client.fetch<T>(query, params, { next: { tags } });
}
