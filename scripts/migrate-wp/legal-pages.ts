/**
 * WP → Sanity migration: legal pages (LGPD, Termos de uso, Políticas de privacidade).
 *
 * Fetches each page via WP REST API, converts HTML content to Portable Text,
 * and upserts as a Sanity `page` document with a richText section.
 *
 * Idempotent: uses createOrReplace with stable _id `wp-page-{slug}`.
 */

import { writeClient } from "./sanity-write";
import { htmlToPortableText } from "./html-to-pt";

const WP_BASE = "https://omni.chat/wp-json/wp/v2";

interface WpPage {
  id: number;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  yoast_head_json?: {
    title?: string;
    description?: string;
  };
}

const LEGAL_SLUGS = ["lgpd", "termos-de-uso", "politicas-de-privacidade"];

/** Decode common HTML entities. */
function decodeEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–");
}

export async function migrateLegalPages(): Promise<void> {
  console.log("\n[migrate] Migrating legal pages…");

  for (const slug of LEGAL_SLUGS) {
    console.log(`[migrate] Fetching WP page: /${slug}`);

    const res = await fetch(
      `${WP_BASE}/pages?slug=${slug}&status=publish&_fields=id,slug,title,content,yoast_head_json`
    );
    if (!res.ok) {
      throw new Error(`[migrate] Failed to fetch page /${slug}: HTTP ${res.status}`);
    }

    const pages = (await res.json()) as WpPage[];
    if (!pages.length) {
      console.warn(`[migrate] Page /${slug} not found in WP — skipping.`);
      continue;
    }

    const page = pages[0];
    const title = decodeEntities(page.title.rendered);

    // Convert HTML body to Portable Text (no image uploads needed for legal pages)
    const content = await htmlToPortableText(page.content.rendered, {
      // Legal pages have no inline images to upload
      uploadImage: async () => "",
    });

    const yoast = page.yoast_head_json;
    const seo = {
      metaTitle: yoast?.title ?? title,
      metaDescription: yoast?.description ?? "",
    };

    const doc = {
      _id: `wp-page-${slug}`,
      _type: "page",
      title,
      slug: { _type: "slug", current: slug },
      seo,
      sections: [
        {
          _type: "richText",
          _key: "body",
          content,
        },
      ],
    };

    await writeClient.createOrReplace(
      doc as Parameters<typeof writeClient.createOrReplace>[0]
    );
    console.log(`[migrate] ✓ Upserted page wp-page-${slug} ("${title}")`);
  }

  console.log("[migrate] Legal pages migration complete.");
}
