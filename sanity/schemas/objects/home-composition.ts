import { defineArrayMember, defineField, defineType } from "sanity";

const actionFields = [
  defineField({ name: "label", title: "Rótulo", type: "string", validation: (rule) => rule.required() }),
  defineField({ name: "href", title: "Link", type: "string", validation: (rule) => rule.required() }),
];

const imageField = (name: string, title: string, required = false) =>
  defineField({
    name,
    title,
    type: "image",
    options: { hotspot: true },
    validation: required ? (rule) => rule.required() : undefined,
    fields: [
      defineField({
        name: "alt",
        title: "Texto alternativo",
        type: "string",
        validation: (rule) => rule.required(),
      }),
    ],
  });

const responsiveImages = [
  imageField("image", "Imagem desktop", true),
  imageField("imageMobile", "Imagem mobile"),
];

const benefitArray = defineField({
  name: "benefits",
  title: "Benefícios",
  type: "array",
  of: [defineArrayMember({ type: "string" })],
});

export const homeComposition = defineType({
  name: "homeComposition",
  title: "Composição da home",
  type: "object",
  fields: [
    defineField({
      name: "hero",
      title: "1. Hero e demonstração",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título", type: "string", validation: (rule) => rule.required() }),
        defineField({ name: "description", title: "Descrição", type: "text", rows: 3 }),
        defineField({ name: "cta", title: "CTA principal", type: "object", fields: actionFields }),
        defineField({ name: "proof", title: "Microprova", type: "string" }),
        defineField({
          name: "tabs",
          title: "Abas de produto",
          type: "array",
          validation: (rule) => rule.min(3).max(3),
          of: [
            defineArrayMember({
              type: "object",
              fields: [
                defineField({ name: "id", title: "Identificador", type: "slug", options: { source: "label" } }),
                defineField({ name: "label", title: "Rótulo", type: "string", validation: (rule) => rule.required() }),
                defineField({ name: "description", title: "Descrição acessível", type: "string" }),
                ...responsiveImages,
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "logos",
      title: "2. Logos de clientes",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({
          name: "items",
          title: "Logos",
          type: "array",
          of: [defineArrayMember({ type: "object", fields: [defineField({ name: "name", title: "Empresa", type: "string" }), imageField("image", "Logo", true)] })],
        }),
      ],
    }),
    defineField({
      name: "journey",
      title: "3. Ponte de jornada",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
        defineField({ name: "steps", title: "Etapas", type: "array", of: [defineArrayMember({ type: "string" })] }),
      ],
    }),
    defineField({
      name: "whizz",
      title: "4. Whizz Agent e Copilot",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Opções",
          type: "array",
          validation: (rule) => rule.min(2).max(2),
          of: [defineArrayMember({ type: "object", fields: [
            defineField({ name: "label", title: "Rótulo", type: "string" }),
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({ name: "text", title: "Texto", type: "text", rows: 4 }),
            benefitArray,
            ...responsiveImages,
          ] })],
        }),
      ],
    }),
    defineField({
      name: "stories",
      title: "5. Marketing, vendas e pós-venda",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título da seção", type: "string" }),
        defineField({
          name: "items",
          title: "Histórias comerciais",
          type: "array",
          validation: (rule) => rule.min(3).max(3),
          of: [defineArrayMember({ type: "object", fields: [
            defineField({ name: "overline", title: "Categoria", type: "string" }),
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
            benefitArray,
            ...responsiveImages,
          ] })],
        }),
      ],
    }),
    defineField({
      name: "proof",
      title: "6. Cases e métricas",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "text", title: "Texto", type: "text", rows: 2 }),
        defineField({
          name: "cases",
          title: "Cases (principal primeiro)",
          type: "array",
          validation: (rule) => rule.min(3).max(3),
          of: [defineArrayMember({ type: "object", fields: [
            defineField({ name: "company", title: "Empresa", type: "string" }),
            imageField("logo", "Logo"),
            defineField({ name: "quote", title: "Citação", type: "text", rows: 5 }),
            defineField({ name: "sourceLabel", title: "Rótulo da fonte", type: "string" }),
            defineField({ name: "sourceUrl", title: "URL da fonte", type: "url" }),
            ...responsiveImages,
          ] })],
        }),
        defineField({
          name: "metrics",
          title: "Métricas verificadas",
          type: "array",
          validation: (rule) => rule.min(3).max(3),
          of: [defineArrayMember({ type: "object", fields: [
            defineField({ name: "value", title: "Valor", type: "string" }),
            defineField({ name: "label", title: "Descrição", type: "string" }),
            defineField({ name: "source", title: "Empresa ou fonte", type: "string" }),
            defineField({ name: "sourceUrl", title: "URL da fonte", type: "url" }),
          ] })],
        }),
      ],
    }),
    defineField({
      name: "integrations",
      title: "7. Integrações e infraestrutura",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
        defineField({
          name: "items",
          title: "Integrações",
          type: "array",
          of: [defineArrayMember({ type: "object", fields: [
            defineField({ name: "label", title: "Nome", type: "string" }),
            defineField({ name: "detail", title: "Tooltip", type: "string" }),
            imageField("logo", "Logo"),
          ] })],
        }),
      ],
    }),
    defineField({
      name: "finalCta",
      title: "8. CTA final",
      type: "object",
      fields: [
        defineField({ name: "title", title: "Título", type: "string" }),
        defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
        defineField({ name: "primary", title: "CTA primário", type: "object", fields: actionFields }),
        defineField({ name: "secondary", title: "CTA secundário", type: "object", fields: actionFields }),
      ],
    }),
  ],
});
