import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  type: "document",
  description: "Mapa 301 da migração WordPress — lido pelo proxy",
  fields: [
    defineField({ name: "from", type: "string", description: "Path antigo, ex. /blog/post-antigo", validation: (r) => r.required() }),
    defineField({ name: "to", type: "string", validation: (r) => r.required() }),
    defineField({ name: "permanent", type: "boolean", initialValue: true }),
  ],
});
