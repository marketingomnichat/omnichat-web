import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", title: "Título (meta)", type: "string", validation: (r) => r.max(60) }),
    defineField({ name: "metaDescription", title: "Descrição (meta)", type: "text", rows: 3, validation: (r) => r.max(160) }),
    defineField({ name: "canonical", title: "URL canônica", type: "url" }),
    defineField({ name: "ogImage", title: "Imagem OG", type: "image" }),
    defineField({ name: "noIndex", title: "Não indexar", type: "boolean", initialValue: false }),
  ],
});
