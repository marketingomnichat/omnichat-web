import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { sanityFetch } from "@/services/sanity/client";
import { SETTINGS_QUERY } from "@/services/sanity/queries";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type NavItem = { label: string; href: string; children?: { label: string; href: string }[] };
type Settings = {
  nav?: NavItem[];
  footerText?: string;
  footerColumns?: FooterColumn[];
  social?: { platform: string; url: string }[];
} | null;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<Settings>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  return (
    <>
      <Header nav={settings?.nav ?? []} />
      {children}
      <Footer footerText={settings?.footerText} footerColumns={settings?.footerColumns ?? []} social={settings?.social ?? []} />
    </>
  );
}
