import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  title: "Redirecionamento",
  type: "document",
  description: "Mapa 301 da migração WordPress — lido pelo proxy",
  fields: [
    defineField({ name: "from", title: "De", type: "string", description: "Path antigo, ex. /blog/post-antigo", validation: (r) => r.required() }),
    defineField({ name: "to", title: "Para", type: "string", validation: (r) => r.required() }),
    defineField({ name: "permanent", title: "Permanente", type: "boolean", initialValue: true }),
  ],
});
