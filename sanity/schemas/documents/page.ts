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
      name: "home",
      title: "Composição editorial da home",
      type: "homeComposition",
      description: "Usada apenas pela página com slug home. Mantém toda a narrativa comercial editável em um único lugar.",
      hidden: ({ document }) => {
        const slug = document?.slug as { current?: string } | undefined;
        return slug?.current !== "home";
      },
    }),
    defineField({
      name: "sections",
      title: "Seções",
      type: "array",
      of: ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats", "featureSplit", "featureCarousel", "pricingTable", "ctaForm", "latestPosts", "mediaBlock"].map(
        (type) => defineArrayMember({ type })
      ),
    }),
  ],
});
