import type { ReactNode } from "react";
import { Hero } from "./hero";
import { RichText } from "./rich-text";
import { CtaBanner } from "./cta-banner";
import { Stats } from "./stats";
import { FeatureGrid } from "./feature-grid";
import { Testimonials } from "./testimonials";
import { LogoCloud } from "./logo-cloud";
import { Faq } from "./faq";
import { FeatureSplit } from "./feature-split";
import { FeatureCarousel } from "./feature-carousel";
import { PricingTable } from "./pricing-table";
import { CtaForm } from "./cta-form";
import { LatestPosts } from "./latest-posts";
import { MediaBlock } from "./media-block";

// Componente de seção: função sync ou async (RSC). Props são validadas
// por cada componente; o registry apaga o tipo específico de props.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SectionComponent = (props: any) => ReactNode | Promise<ReactNode>;

// Chaves = `name` dos schemas em sanity/schemas/objects/sections.ts.
export const sectionRegistry: Record<string, SectionComponent> = {
  hero: Hero,
  richText: RichText,
  ctaBanner: CtaBanner,
  stats: Stats,
  featureGrid: FeatureGrid,
  testimonials: Testimonials,
  logoCloud: LogoCloud,
  faq: Faq,
  featureSplit: FeatureSplit,
  featureCarousel: FeatureCarousel,
  pricingTable: PricingTable,
  ctaForm: CtaForm,
  latestPosts: LatestPosts,
  mediaBlock: MediaBlock,
};
