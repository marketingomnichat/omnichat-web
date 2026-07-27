/**
 * Media upload helper for WP→Sanity migration.
 *
 * uploadImageFromUrl(url, alt):
 *   - Skips URLs not from omni.chat (returns empty string)
 *   - Returns cached assetId when available (.media-cache.json)
 *   - Downloads with redirect-following fetch, uploads to Sanity assets
 *   - Caches url→assetId for idempotency
 */

import { readFileSync, writeFileSync, existsSync } from "fs";
import path from "path";
import { writeClient } from "./sanity-write";

const CACHE_PATH = path.join(
  path.dirname(new URL(import.meta.url).pathname),
  ".media-cache.json"
);
const OMNICHAT_HOST = "omni.chat";

type MediaCache = Record<string, string>;

function loadCache(): MediaCache {
  if (existsSync(CACHE_PATH)) {
    try {
      return JSON.parse(readFileSync(CACHE_PATH, "utf-8")) as MediaCache;
    } catch {
      return {};
    }
  }
  return {};
}

function saveCache(cache: MediaCache): void {
  writeFileSync(CACHE_PATH, JSON.stringify(cache, null, 2), "utf-8");
}

const cache: MediaCache = loadCache();

export async function uploadImageFromUrl(
  url: string,
  alt: string
): Promise<string> {
  if (!url) return "";

  // Only upload media from omni.chat
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith(OMNICHAT_HOST)) {
      return "";
    }
  } catch {
    return "";
  }

  // Return cached asset ref
  if (cache[url]) {
    return cache[url];
  }

  // Download image
  let buffer: Buffer;
  try {
    const response = await fetch(url, { redirect: "follow" });
    if (!response.ok) {
      console.warn(`[media] Failed to fetch ${url}: ${response.status}`);
      return "";
    }
    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  } catch (err) {
    console.warn(`[media] Error downloading ${url}:`, err);
    return "";
  }

  // Derive filename from URL
  const urlPath = new URL(url).pathname;
  const filename = path.basename(urlPath) || "image.jpg";

  // Upload to Sanity
  try {
    const asset = await writeClient.assets.upload("image", buffer, {
      filename,
      contentType: guessContentType(filename),
      ...(alt ? { description: alt } : {}),
    });
    const assetId = `image-${asset._id.replace(/^image-/, "")}`;
    cache[url] = assetId;
    saveCache(cache);
    return assetId;
  } catch (err) {
    console.warn(`[media] Error uploading ${url}:`, err);
    return "";
  }
}

function guessContentType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const map: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".svg": "image/svg+xml",
    ".avif": "image/avif",
  };
  return map[ext] ?? "image/jpeg";
}
