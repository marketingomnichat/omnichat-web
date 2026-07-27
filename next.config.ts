import type { NextConfig } from "next";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.replace("us.i", "us-assets.i").replace("eu.i", "eu-assets.i");

// Host do CDN de assets OmniChat (logos etc.); definir quando a base URL for fechada
const ASSET_CDN_HOST = process.env.NEXT_PUBLIC_ASSET_CDN_HOST;

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      ...(ASSET_CDN_HOST ? [{ protocol: "https" as const, hostname: ASSET_CDN_HOST }] : []),
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
