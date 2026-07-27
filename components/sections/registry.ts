import type { ComponentType } from "react";
import { Hero } from "./hero";
import { RichText } from "./rich-text";
import { CtaBanner } from "./cta-banner";
import { Stats } from "./stats";
import { FeatureGrid } from "./feature-grid";
import { Testimonials } from "./testimonials";
import { LogoCloud } from "./logo-cloud";
import { Faq } from "./faq";

// Chaves = `name` dos schemas em sanity/schemas/objects/sections.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionRegistry: Record<string, ComponentType<any>> = {
  hero: Hero,
  richText: RichText,
  ctaBanner: CtaBanner,
  stats: Stats,
  featureGrid: FeatureGrid,
  testimonials: Testimonials,
  logoCloud: LogoCloud,
  faq: Faq,
};
