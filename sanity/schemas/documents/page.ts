import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "seo", type: "seo" }),
    defineField({
      name: "sections",
      type: "array",
      of: ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats"].map(
        (type) => defineArrayMember({ type })
      ),
    }),
  ],
});
