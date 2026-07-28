import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Configurações do site",
  type: "document",
  fields: [
    defineField({ name: "siteName", title: "Nome do site", type: "string" }),
    defineField({
      name: "nav",
      title: "Navegação",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", title: "Rótulo", type: "string" }),
            defineField({ name: "href", title: "Link", type: "string" }),
            defineField({
              name: "children",
              title: "Subitens",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Rótulo", type: "string" }),
                    defineField({ name: "href", title: "Link", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({ name: "footerText", title: "Texto do rodapé (copyright)", type: "text", rows: 2 }),
    defineField({
      name: "footerColumns",
      title: "Colunas do rodapé",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "title", title: "Título da coluna", type: "string" }),
            defineField({
              name: "links",
              title: "Links",
              type: "array",
              of: [
                defineArrayMember({
                  type: "object",
                  fields: [
                    defineField({ name: "label", title: "Rótulo", type: "string" }),
                    defineField({ name: "href", title: "URL", type: "string" }),
                  ],
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    defineField({
      name: "social",
      title: "Redes sociais",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", title: "Plataforma", type: "string" }),
            defineField({ name: "url", title: "URL", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "appStoreLinks",
      title: "Links das lojas de aplicativo",
      type: "object",
      fields: [
        defineField({ name: "appStoreUrl", title: "App Store", type: "url" }),
        defineField({ name: "googlePlayUrl", title: "Google Play", type: "url" }),
      ],
    }),
    defineField({
      name: "organization",
      title: "Organização",
      type: "object",
      description: "Dados do JSON-LD Organization",
      fields: [
        defineField({ name: "name", title: "Nome", type: "string" }),
        defineField({ name: "legalName", title: "Razão social", type: "string" }),
        defineField({ name: "url", title: "URL", type: "url" }),
        defineField({ name: "logoUrl", title: "URL do logotipo", type: "url" }),
        defineField({ name: "sameAs", title: "Perfis (sameAs)", type: "array", of: [{ type: "url" }] }),
      ],
    }),
  ],
});
