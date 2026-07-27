import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Página",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "sections",
      title: "Seções",
      type: "array",
      of: ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats", "featureSplit", "pricingTable", "ctaForm", "latestPosts"].map(
        (type) => defineArrayMember({ type })
      ),
    }),
  ],
});
