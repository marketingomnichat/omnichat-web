import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", type: "string", validation: (r) => r.max(60) }),
    defineField({ name: "metaDescription", type: "text", rows: 3, validation: (r) => r.max(160) }),
    defineField({ name: "canonical", type: "url" }),
    defineField({ name: "ogImage", type: "image" }),
    defineField({ name: "noIndex", type: "boolean", initialValue: false }),
  ],
});
