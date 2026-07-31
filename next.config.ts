import type { NextConfig } from "next";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.replace("us.i", "us-assets.i").replace("eu.i", "eu-assets.i");

// CDN de assets OmniChat (logos etc.) — aceita hostname puro ou URL completa
// com path de bucket (ex.: https://storage.googleapis.com/omnichat-cdn-assets/),
// restringindo o remotePattern ao caminho do bucket.
const ASSET_CDN = process.env.NEXT_PUBLIC_ASSET_CDN_HOST;
const assetCdnUrl = ASSET_CDN ? new URL(ASSET_CDN.includes("://") ? ASSET_CDN : `https://${ASSET_CDN}`) : null;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "omni.chat", pathname: "/wp-content/uploads/**" },
      ...(assetCdnUrl
        ? [
            {
              protocol: "https" as const,
              hostname: assetCdnUrl.hostname,
              pathname: `${assetCdnUrl.pathname.replace(/\/$/, "")}/**`,
            },
          ]
        : []),
    ],
  },
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${POSTHOG_ASSETS}/static/:path*` },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  skipTrailingSlashRedirect: true, // exigência do proxy reverso do PostHog
};

export default nextConfig;
