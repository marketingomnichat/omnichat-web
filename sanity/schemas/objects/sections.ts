import { defineArrayMember, defineField, defineType } from "sanity";

const cta = {
  name: "cta",
  type: "object" as const,
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "href", type: "string" }),
    defineField({
      name: "variant",
      type: "string",
      options: { list: ["primary", "secondary", "ghost"] },
      initialValue: "primary",
    }),
  ],
};

export const hero = defineType({
  name: "hero",
  type: "object",
  fields: [
    defineField({ name: "overline", type: "string" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", type: "text", rows: 2 }),
    defineField({ name: "ctas", type: "array", of: [defineArrayMember(cta)] }),
    defineField({
      name: "theme",
      type: "string",
      options: { list: ["light", "dark"] },
      initialValue: "light",
    }),
  ],
});

export const featureGrid = defineType({
  name: "featureGrid",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", type: "string", description: "Nome Remix Icon, ex. ri-flashlight-line" }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "text", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
  ],
});

export const testimonials = defineType({
  name: "testimonials",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", type: "text", rows: 4 }),
            defineField({ name: "name", type: "string" }),
            defineField({ name: "role", type: "string" }),
            defineField({ name: "company", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});

export const logoCloud = defineType({
  name: "logoCloud",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "imageUrl", type: "url", description: "URL do CDN OmniChat" }),
          ],
        }),
      ],
    }),
  ],
});

export const ctaBanner = defineType({
  name: "ctaBanner",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({ ...cta, name: "cta" }),
  ],
});

export const faq = defineType({
  name: "faq",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", type: "string" }),
            defineField({ name: "answer", type: "text", rows: 4 }),
          ],
        }),
      ],
    }),
  ],
});

export const richText = defineType({
  name: "richText",
  type: "object",
  fields: [defineField({ name: "content", type: "array", of: [{ type: "block" }] })],
});

export const stats = defineType({
  name: "stats",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string" }),
            defineField({ name: "label", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});

export const sectionTypes = [hero, featureGrid, testimonials, logoCloud, ctaBanner, faq, richText, stats];
