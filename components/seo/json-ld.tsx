import { serializeJsonLd } from "@/lib/seo";

export function JsonLd({ data }: { data: Record<string, unknown> }) {
  // serializeJsonLd escapa "<" (unicode escape) — impede breakout da tag script (XSS).
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />;
}
