import type { Metadata } from "next";
import { ConnectionHero } from "@/components/connection/hero";
import { ConnectionAbout } from "@/components/connection/about";
import { ConnectionFeatureTab } from "@/components/connection/feature-tab";
import { ConnectionFutureEvents } from "@/components/connection/future-events";
import { ConnectionSpeakers } from "@/components/connection/speakers";
import { ConnectionFooterCta } from "@/components/connection/footer-cta";
import { ConnectionBrands } from "@/components/connection/brands";
import { ConnectionPricing } from "@/components/connection/pricing";
import { ConnectionSlidingText } from "@/components/connection/sliding-text";
import { ConnectionContact } from "@/components/connection/contact";
import { ConnectionFaq } from "@/components/connection/faq";
import { ConnectionFooter } from "@/components/connection/footer";
import { ConnectionScrollEffects } from "@/components/connection/scroll-effects";

export const metadata: Metadata = {
  title: "OmniChat Connection 2026 — 17 set · Welluci Gardens, São Paulo",
  description: "O primeiro evento proprietário da OmniChat aberto ao mercado: IA conversacional com execução que gera resultado. 17 de setembro de 2026, São Paulo.",
};

// Template Daevnt (Figma 1:2, canvas 1920px) em layout fluido responsivo
// (mobile, tablet, laptop e desktop; em ~1920px reproduz o design original).
export default function ConnectionPage() {
  return (
    <main className="connection-main mx-auto w-full max-w-[1920px] overflow-x-clip">
      <ConnectionScrollEffects />
      <ConnectionHero />
      <ConnectionSpeakers />
      <ConnectionFooterCta />
      <ConnectionAbout />
      <ConnectionFeatureTab />
      <ConnectionFutureEvents />
      <ConnectionBrands />
      <ConnectionPricing />
      <ConnectionSlidingText />
      <ConnectionContact />
      <ConnectionFaq />
      <ConnectionFooter />
    </main>
  );
}
