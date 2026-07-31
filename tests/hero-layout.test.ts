import { describe, expect, it } from "vitest";
import { heroContentAlignClass } from "../components/sections/hero";

describe("heroContentAlignClass", () => {
  it("centraliza o conteúdo no layout productEmerge", () => {
    expect(heroContentAlignClass("productEmerge")).toContain("text-center");
    expect(heroContentAlignClass("productEmerge")).toContain("items-center");
  });

  it("mantém o alinhamento inicial no layout padrão", () => {
    expect(heroContentAlignClass("default")).not.toContain("text-center");
  });
});
