import { defineArrayMember, defineField, defineType } from "sanity";

const cta = {
  name: "cta",
  type: "object" as const,
  fields: [
    defineField({ name: "label", title: "Rótulo", type: "string" }),
    defineField({ name: "href", title: "Link", type: "string" }),
    defineField({
      name: "variant",
      title: "Variante",
      type: "string",
      options: { list: ["primary", "secondary", "ghost"] },
      initialValue: "primary",
    }),
  ],
};

export const hero = defineType({
  name: "hero",
  title: "Hero",
  type: "object",
  fields: [
    defineField({ name: "overline", title: "Sobretítulo", type: "string" }),
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", title: "Subtítulo", type: "text", rows: 2 }),
    defineField({ name: "ctas", title: "Botões de ação", type: "array", of: [defineArrayMember(cta)] }),
    defineField({
      name: "theme",
      title: "Tema",
      type: "string",
      options: { list: ["light", "dark"] },
      initialValue: "light",
    }),
  ],
});

export const featureGrid = defineType({
  name: "featureGrid",
  title: "Grade de recursos",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({
      name: "features",
      title: "Recursos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", title: "Ícone", type: "string", description: "Nome Remix Icon, ex. ri-flashlight-line" }),
            defineField({ name: "title", title: "Título", type: "string" }),
            defineField({ name: "text", title: "Texto", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
  ],
});

export const testimonials = defineType({
  name: "testimonials",
  title: "Depoimentos",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({
      name: "items",
      title: "Itens",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", title: "Citação", type: "text", rows: 4 }),
            defineField({ name: "name", title: "Nome", type: "string" }),
            defineField({ name: "role", title: "Cargo", type: "string" }),
            defineField({ name: "company", title: "Empresa", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});

export const logoCloud = defineType({
  name: "logoCloud",
  title: "Nuvem de logos",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({
      name: "logos",
      title: "Logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", title: "Nome", type: "string" }),
            defineField({ name: "imageUrl", title: "URL da imagem", type: "url", description: "URL do CDN OmniChat" }),
          ],
        }),
      ],
    }),
  ],
});

export const ctaBanner = defineType({
  name: "ctaBanner",
  title: "Banner de ação",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({ name: "text", title: "Texto", type: "text", rows: 2 }),
    defineField({ ...cta, name: "cta", title: "Botão de ação" }),
  ],
});

export const faq = defineType({
  name: "faq",
  title: "Perguntas frequentes",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({
      name: "items",
      title: "Itens",
      type: "array",
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

export const richText = defineType({
  name: "richText",
  title: "Texto livre",
  type: "object",
  fields: [defineField({ name: "content", title: "Conteúdo", type: "array", of: [{ type: "block" }] })],
});

export const stats = defineType({
  name: "stats",
  title: "Estatísticas",
  type: "object",
  fields: [
    defineField({
      name: "items",
      title: "Itens",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", title: "Valor", type: "string" }),
            defineField({ name: "label", title: "Rótulo", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});

export const featureSplit = defineType({
  name: "featureSplit",
  title: "Bloco mídia + texto",
  type: "object",
  fields: [
    defineField({ name: "overline", title: "Sobretítulo", type: "string" }),
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "body", title: "Corpo", type: "text", rows: 4 }),
    defineField({
      name: "image",
      title: "Imagem",
      type: "object",
      fields: [
        defineField({ name: "imageUrl", title: "URL da imagem", type: "url" }),
        defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
      ],
    }),
    defineField({
      name: "mediaSide",
      title: "Lado da mídia",
      type: "string",
      options: { list: ["left", "right"] },
      initialValue: "right",
    }),
    defineField({ ...cta, name: "cta", title: "Botão de ação" }),
    defineField({ name: "dark", title: "Fundo escuro", type: "boolean", initialValue: false }),
  ],
});

export const sectionTypes = [hero, featureGrid, testimonials, logoCloud, ctaBanner, faq, richText, stats, featureSplit];
