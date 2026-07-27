// Expõe os componentes do DS como blocos do Builder.io. Inputs espelham os
// schemas Sanity — mesma composição nas duas ferramentas.
import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Hero } from "./hero";
import { FeatureGrid } from "./feature-grid";
import { Testimonials } from "./testimonials";
import { LogoCloud } from "./logo-cloud";
import { CtaBanner } from "./cta-banner";
import { Faq } from "./faq";
import { Stats } from "./stats";

const ctaInputs = [
  { name: "label", type: "string" },
  { name: "href", type: "string" },
  { name: "variant", type: "string", enum: ["primary", "secondary", "ghost"], defaultValue: "primary" },
];

export const builderComponents: RegisteredComponent[] = [
  {
    component: Hero,
    name: "Hero",
    inputs: [
      { name: "overline", type: "string" },
      { name: "title", type: "string", required: true },
      { name: "subtitle", type: "longText" },
      { name: "theme", type: "string", enum: ["light", "dark"], defaultValue: "light" },
      { name: "ctas", type: "list", subFields: ctaInputs },
    ],
  },
  {
    component: FeatureGrid,
    name: "FeatureGrid",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "features",
        type: "list",
        subFields: [
          { name: "icon", type: "string" },
          { name: "title", type: "string" },
          { name: "text", type: "longText" },
        ],
      },
    ],
  },
  {
    component: Testimonials,
    name: "Testimonials",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "quote", type: "longText" },
          { name: "name", type: "string" },
          { name: "role", type: "string" },
          { name: "company", type: "string" },
        ],
      },
    ],
  },
  {
    component: LogoCloud,
    name: "LogoCloud",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "logos",
        type: "list",
        subFields: [
          { name: "name", type: "string" },
          { name: "imageUrl", type: "string" },
        ],
      },
    ],
  },
  {
    component: CtaBanner,
    name: "CtaBanner",
    inputs: [
      { name: "title", type: "string" },
      { name: "text", type: "longText" },
      { name: "cta", type: "object", subFields: ctaInputs },
    ],
  },
  {
    component: Faq,
    name: "Faq",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "question", type: "string" },
          { name: "answer", type: "longText" },
        ],
      },
    ],
  },
  {
    component: Stats,
    name: "Stats",
    inputs: [
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "value", type: "string" },
          { name: "label", type: "string" },
        ],
      },
    ],
  },
];
