import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", title: "Resumo", type: "text", rows: 3 }),
    defineField({ name: "body", title: "Conteúdo", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({ name: "author", title: "Autor", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "categories", title: "Categorias", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] }),
    defineField({ name: "publishedAt", title: "Data de publicação", type: "datetime" }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "faq",
      title: "Perguntas frequentes",
      type: "array",
      description: "Perguntas e respostas — viram schema FAQPage (AEO)",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", title: "Pergunta", type: "string" }),
            defineField({ name: "answer", title: "Resposta", type: "text", rows: 4 }),
          ],
        }),
      ],
    }),
  ],
});
