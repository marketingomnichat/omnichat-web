import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
  ],
});
