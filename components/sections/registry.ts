import type { ComponentType } from "react";
import { Hero } from "./hero";
import { RichText } from "./rich-text";
import { CtaBanner } from "./cta-banner";
import { Stats } from "./stats";

// Chaves = `name` dos schemas em sanity/schemas/objects/sections.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionRegistry: Record<string, ComponentType<any>> = {
  hero: Hero,
  richText: RichText,
  ctaBanner: CtaBanner,
  stats: Stats,
};
