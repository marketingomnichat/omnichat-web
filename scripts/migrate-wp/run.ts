/**
 * WP → Sanity migration: categories, authors, media, posts.
 *
 * Usage:
 *   npm run migrate:wp
 *   MIGRATE_LIMIT=5 npm run migrate:wp   # test with first N posts
 *
 * Idempotent: uses createOrReplace with stable _id per WP id.
 * Rate-limit: backs off 10 s on HTTP 429.
 */

import { writeClient } from "./sanity-write";
import { wpFetchAll } from "./wp-client";
import { htmlToPortableText } from "./html-to-pt";
import { uploadImageFromUrl } from "./media";

// ── Types ──────────────────────────────────────────────────────────────────

interface WpCategory {
  id: number;
  name: string;
  slug: string;
}

interface WpUser {
  id: number;
  name: string;
  slug: string;
}

interface WpPost {
  id: number;
  date: string;
  slug: string;
  title: { rendered: string };
  content: { rendered: string };
  excerpt: { rendered: string };
  author: number;
  featured_media: number;
  categories: number[];
  yoast_head_json?: {
    title?: string;
    description?: string;
  };
}

interface WpMedia {
  id: number;
  source_url: string;
  alt_text?: string;
}

// ── Helpers ────────────────────────────────────────────────────────────────

const WP_BASE = "https://omni.chat/wp-json/wp/v2";
const BATCH = 20;

/** Decode common HTML entities (WordPress renders them in titles/excerpts). */
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
    .replace(/&ndash;/g, "–")
    .replace(/&laquo;/g, "«")
    .replace(/&raquo;/g, "»")
    .replace(/&#8220;/g, "“")
    .replace(/&#8221;/g, "”")
    .replace(/&#8216;/g, "‘")
    .replace(/&#8217;/g, "’")
    .replace(/&#8230;/g, "…");
}

/** Strip all HTML tags, returning plain text. */
function stripTags(html: string): string {
  return html
    .replace(/<[^>]*>/g, "")
    // Remove WP read-more shortcode artifact like [&hellip;] or [...]
    .replace(/\[&hellip;\]/g, "…")
    .replace(/\[…\]/g, "…")
    .trim();
}

/** Sleep for ms milliseconds. */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * createOrReplace with 429 backoff.
 * Retries once after 10 s on rate-limit.
 */
async function safeCreateOrReplace(doc: Record<string, unknown>): Promise<void> {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      await writeClient.createOrReplace(doc as Parameters<typeof writeClient.createOrReplace>[0]);
      return;
    } catch (err: unknown) {
      const status =
        (err as { statusCode?: number }).statusCode ??
        (err as { response?: { status?: number } }).response?.status;
      if (status === 429) {
        const delay = 10_000 * (attempt + 1);
        console.warn(`[migrate] 429 rate-limit — waiting ${delay / 1000}s…`);
        await sleep(delay);
        continue;
      }
      throw err;
    }
  }
}

// ── Step 0: Token check ────────────────────────────────────────────────────

async function checkToken(): Promise<void> {
  const TEST_ID = "migrate-wp.token-check";
  await writeClient.createOrReplace({ _id: TEST_ID, _type: "migrate.tokenCheck" });
  await writeClient.delete(TEST_ID);
  console.log("[migrate] Token OK — write access confirmed.");
}

// ── Step 1: Categories ─────────────────────────────────────────────────────

async function migrateCategories(): Promise<Map<number, string>> {
  console.log("\n[migrate] Fetching WP categories…");
  const cats = await wpFetchAll<WpCategory>(`${WP_BASE}/categories`);
  console.log(`[migrate] Found ${cats.length} categories.`);

  const idMap = new Map<number, string>();
  for (const cat of cats) {
    const _id = `wp-category-${cat.id}`;
    await safeCreateOrReplace({
      _id,
      _type: "category",
      title: decodeEntities(cat.name),
      slug: { _type: "slug", current: cat.slug },
    });
    idMap.set(cat.id, _id);
  }

  console.log(`[migrate] Upserted ${cats.length} categories.`);
  return idMap;
}

// ── Step 2: Authors ────────────────────────────────────────────────────────

/**
 * Collect unique author IDs from all published posts,
 * then try to fetch each user individually (WP /users endpoint is restricted;
 * individual /users/{id} may also be 401 — fall back to stub name).
 */
async function migrateAuthors(): Promise<Map<number, string>> {
  console.log("\n[migrate] Collecting author IDs from posts…");

  // Fetch just the author field from all posts to discover unique IDs
  const postSummaries = await wpFetchAll<{ author: number }>(
    `${WP_BASE}/posts?status=publish&_fields=author`
  );
  const authorIds = [...new Set(postSummaries.map((p) => p.author))];
  console.log(`[migrate] Found ${authorIds.length} unique author(s): ${authorIds.join(", ")}`);

  const idMap = new Map<number, string>();

  for (const userId of authorIds) {
    const _id = `wp-author-${userId}`;

    // Try individual user fetch (may be public on some WP configs)
    let name = `Author ${userId}`;
    try {
      const response = await fetch(`${WP_BASE}/users/${userId}`);
      if (response.ok) {
        const user = (await response.json()) as WpUser;
        if (user.name) name = decodeEntities(user.name);
      }
    } catch {
      // ignore — use stub name
    }

    await safeCreateOrReplace({
      _id,
      _type: "author",
      name,
    });
    idMap.set(userId, _id);
    console.log(`[migrate]   Author ${userId}: "${name}"`);
  }

  console.log(`[migrate] Upserted ${idMap.size} authors.`);
  return idMap;
}

// ── Step 3: Posts ──────────────────────────────────────────────────────────

async function migrateMedia(mediaId: number): Promise<{ assetId: string; alt: string }> {
  if (!mediaId) return { assetId: "", alt: "" };

  try {
    const [media] = await wpFetchAll<WpMedia>(`${WP_BASE}/media?include=${mediaId}&per_page=1`);
    if (!media?.source_url) return { assetId: "", alt: "" };
    const assetId = await uploadImageFromUrl(media.source_url, media.alt_text ?? "");
    return { assetId, alt: media.alt_text ?? "" };
  } catch {
    return { assetId: "", alt: "" };
  }
}

async function migratePosts(
  categoryMap: Map<number, string>,
  authorMap: Map<number, string>
): Promise<{ total: number; mediaUploaded: number; unmapped: Set<string> }> {
  console.log("\n[migrate] Fetching WP posts…");
  let posts = await wpFetchAll<WpPost>(`${WP_BASE}/posts?status=publish`);

  const limit = process.env.MIGRATE_LIMIT ? parseInt(process.env.MIGRATE_LIMIT, 10) : 0;
  if (limit > 0) {
    console.log(`[migrate] MIGRATE_LIMIT=${limit} — processing first ${limit} posts only.`);
    posts = posts.slice(0, limit);
  }

  console.log(`[migrate] Found ${posts.length} posts to migrate.`);

  let mediaUploaded = 0;
  const unmapped = new Set<string>();

  // Intercept unmapped tag warnings from html-to-pt
  const originalWarn = console.warn.bind(console);
  const patchWarn = (msg: string, ...args: unknown[]) => {
    if (typeof msg === "string" && msg.startsWith("[migrate] bloco não mapeado:")) {
      const tag = msg.replace("[migrate] bloco não mapeado: ", "").replace(/<|>/g, "");
      unmapped.add(tag);
    }
    originalWarn(msg, ...args);
  };
  console.warn = patchWarn;

  for (let i = 0; i < posts.length; i += BATCH) {
    const batch = posts.slice(i, i + BATCH);
    console.log(
      `\n[migrate] Posts ${i + 1}–${Math.min(i + BATCH, posts.length)} / ${posts.length}`
    );

    for (const post of batch) {
      const title = decodeEntities(post.title.rendered);
      const rawExcerpt = stripTags(post.excerpt.rendered);
      const excerpt = decodeEntities(rawExcerpt);

      // Upload cover image
      const { assetId: coverAssetId, alt: coverAlt } = await migrateMedia(post.featured_media);
      if (coverAssetId) mediaUploaded++;

      // Convert body HTML to Portable Text
      const body = await htmlToPortableText(post.content.rendered, {
        uploadImage: async (url, alt) => {
          const assetId = await uploadImageFromUrl(url, alt);
          if (assetId) mediaUploaded++;
          return assetId;
        },
      });

      // Build category refs
      const categories = post.categories
        .map((catId) => {
          const ref = categoryMap.get(catId);
          return ref ? { _type: "reference", _ref: ref, _key: `cat-${catId}` } : null;
        })
        .filter(Boolean);

      // Build author ref
      const authorRef = authorMap.get(post.author);

      // Build SEO
      const yoast = post.yoast_head_json;
      const seo = {
        metaTitle: yoast?.title ?? title,
        metaDescription: yoast?.description ?? excerpt,
      };

      // Build cover image object
      const coverImage = coverAssetId
        ? {
            _type: "image",
            asset: { _type: "reference", _ref: coverAssetId },
            alt: coverAlt,
          }
        : undefined;

      const doc: Record<string, unknown> = {
        _id: `wp-post-${post.id}`,
        _type: "post",
        title,
        slug: { _type: "slug", current: post.slug },
        excerpt,
        publishedAt: post.date,
        body,
        categories,
        seo,
      };

      if (authorRef) {
        doc.author = { _type: "reference", _ref: authorRef };
      }
      if (coverImage) {
        doc.coverImage = coverImage;
      }

      await safeCreateOrReplace(doc);
      process.stdout.write(".");
    }
    process.stdout.write("\n");
  }

  console.warn = originalWarn;

  return { total: posts.length, mediaUploaded, unmapped };
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== WP → Sanity Migration ===\n");

  await checkToken();

  const categoryMap = await migrateCategories();
  const authorMap = await migrateAuthors();

  const { total, mediaUploaded, unmapped } = await migratePosts(categoryMap, authorMap);

  console.log("\n=== Migration complete ===");
  console.log(`  Categories : ${categoryMap.size}`);
  console.log(`  Authors    : ${authorMap.size}`);
  console.log(`  Posts      : ${total}`);
  console.log(`  Media      : ${mediaUploaded} assets uploaded`);
  if (unmapped.size > 0) {
    console.log(`  Unmapped HTML tags: ${[...unmapped].join(", ")}`);
  } else {
    console.log("  Unmapped HTML tags: none");
  }
}

main().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
