import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { sanityFetch } from "@/lib/sanity/client";
import { SETTINGS_QUERY } from "@/lib/sanity/queries";

type Settings = {
  nav?: { label: string; href: string }[];
  footerText?: string;
  social?: { platform: string; url: string }[];
} | null;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<Settings>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  return (
    <>
      <Header nav={settings?.nav ?? []} />
      {children}
      <Footer footerText={settings?.footerText} social={settings?.social ?? []} />
    </>
  );
}
