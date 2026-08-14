import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { DemoModal } from "@/components/site/demo-modal";
import { sanityFetch } from "@/services/sanity/client";
import { SETTINGS_QUERY } from "@/services/sanity/queries";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string; iconUrl?: string; iconAlt?: string }[];
};
type Settings = {
  nav?: NavItem[];
  footerText?: string;
  footerColumns?: FooterColumn[];
  social?: { platform: string; url: string }[];
  appStoreLinks?: { appStoreUrl?: string; googlePlayUrl?: string };
  footerBadges?: { imageUrl: string; alt: string; href: string; kind?: "store" | "certificate"; width?: number; height?: number }[];
} | null;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<Settings>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  return (
    <>
      <Header />
      {children}
      <Footer
        footerText={settings?.footerText}
        footerColumns={settings?.footerColumns ?? []}
        social={settings?.social ?? []}
        appStoreLinks={settings?.appStoreLinks}
        footerBadges={settings?.footerBadges ?? []}
      />
      <DemoModal />
    </>
  );
}
