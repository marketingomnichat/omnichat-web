import { describe, expect, it } from "vitest";
import { schemaTypes } from "../sanity/schemas";

describe("ctaForm fields", () => {
  it("suporta type select com options", () => {
    const ctaForm = schemaTypes.find((t) => t.name === "ctaForm");
    expect(ctaForm).toBeDefined();

    const fieldsField = (
      ctaForm as { fields: { name: string; of?: { fields: { name: string; options?: { list?: string[] } }[] }[] }[] }
    ).fields.find((f) => f.name === "fields");
    const fieldSchema = fieldsField?.of?.[0]?.fields ?? [];
    const names = fieldSchema.map((f) => f.name);
    expect(names).toContain("options");

    const typeField = fieldSchema.find((f) => f.name === "type");
    expect(typeField?.options?.list).toEqual(expect.arrayContaining(["select"]));
  });
});
