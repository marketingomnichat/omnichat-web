import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "seo", type: "seo" }),
    defineField({
      name: "faq",
      type: "array",
      description: "Perguntas e respostas — viram schema FAQPage (AEO)",
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
