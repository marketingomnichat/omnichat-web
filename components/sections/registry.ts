import type { ComponentType } from "react";
import React from "react";
import { Hero } from "./hero";
import { RichText } from "./rich-text";
import { CtaBanner } from "./cta-banner";
import { Stats } from "./stats";
import { FeatureGrid } from "./feature-grid";
import { Testimonials } from "./testimonials";
import { LogoCloud } from "./logo-cloud";
import { Faq } from "./faq";
import { FeatureSplit } from "./feature-split";
import { PricingTable } from "./pricing-table";
import { CtaForm } from "./cta-form";
import { LatestPosts } from "./latest-posts";

// Chaves = `name` dos schemas em sanity/schemas/objects/sections.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionRegistry: Record<string, ComponentType<any> | ((props: any) => Promise<React.ReactNode>)> = {
  hero: Hero,
  richText: RichText,
  ctaBanner: CtaBanner,
  stats: Stats,
  featureGrid: FeatureGrid,
  testimonials: Testimonials,
  logoCloud: LogoCloud,
  faq: Faq,
  featureSplit: FeatureSplit,
  pricingTable: PricingTable,
  ctaForm: CtaForm,
  latestPosts: LatestPosts,
};
