import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string" }),
    defineField({
      name: "nav",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({ name: "footerText", type: "text", rows: 2 }),
    defineField({
      name: "social",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string" }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "organization",
      type: "object",
      description: "Dados do JSON-LD Organization",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "legalName", type: "string" }),
        defineField({ name: "url", type: "url" }),
        defineField({ name: "logoUrl", type: "url" }),
        defineField({ name: "sameAs", type: "array", of: [{ type: "url" }] }),
      ],
    }),
  ],
});
