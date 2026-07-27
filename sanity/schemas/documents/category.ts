import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
  ],
});
