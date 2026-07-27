import type { Metadata } from "next";
import { Lato } from "next/font/google";
import { draftMode } from "next/headers";
import { AnalyticsProvider } from "@/components/analytics/posthog-provider";
import { JsonLd } from "@/components/seo/json-ld";
import { SanityVisualEditing } from "@/components/site/sanity-visual-editing";
import { sanityFetch } from "@/services/sanity/client";
import { SETTINGS_QUERY } from "@/services/sanity/queries";
import "./globals.css";

// Lato é a única fonte do sistema; Thin 100 é proibido pela spec.
const lato = Lato({
  variable: "--font-lato",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
});

export const metadata: Metadata = {
  title: "OmniChat — Jornada conversacional no WhatsApp",
  description:
    "IA com profundidade de negócio rodando a jornada completa dentro do WhatsApp, com integração nativa e dados que provam resultado.",
};

type Org = {
  organization?: { name?: string; legalName?: string; url?: string; logoUrl?: string; sameAs?: string[] };
} | null;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { isEnabled } = await draftMode();
  const settings = await sanityFetch<Org>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  const org = settings?.organization;
  return (
    <html lang="pt-BR" className={`${lato.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {org && (
          <JsonLd
            data={{
              "@type": "Organization",
              name: org.name,
              legalName: org.legalName,
              url: org.url,
              logo: org.logoUrl,
              sameAs: org.sameAs,
            }}
          />
        )}
        <JsonLd
          data={{
            "@type": "WebSite",
            name: "OmniChat",
            url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat",
          }}
        />
        <AnalyticsProvider>{children}</AnalyticsProvider>
        {isEnabled && <SanityVisualEditing />}
      </body>
    </html>
  );
}
