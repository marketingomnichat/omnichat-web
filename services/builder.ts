import { fetchOneEntry, type BuilderContent } from "@builder.io/sdk-react";

export const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY ?? "";
export const BUILDER_MODEL = "landing-page";
export const hasBuilderConfig = BUILDER_API_KEY.length > 0;

// Falha do Builder (chave inválida, indisponibilidade) degrada para "sem
// conteúdo" — a rota responde 404, nunca 500.
export async function fetchLandingPage(urlPath: string): Promise<BuilderContent | null> {
  try {
    return await fetchOneEntry({
      model: BUILDER_MODEL,
      apiKey: BUILDER_API_KEY,
      userAttributes: { urlPath },
    });
  } catch (error) {
    console.error(`[builder] fetch failed for ${urlPath}:`, error);
    return null;
  }
}
