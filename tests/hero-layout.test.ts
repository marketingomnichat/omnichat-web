import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { Hero, heroContentAlignClass } from "../components/sections/hero";

type ElementProps = Record<string, unknown>;

function descendantElements(node: ReactNode): ReactElement<ElementProps>[] {
  if (Array.isArray(node)) return node.flatMap(descendantElements);
  if (!isValidElement<ElementProps>(node)) return [];

  return [node, ...descendantElements(node.props.children as ReactNode)];
}

function heroElements(layout: "default" | "productEmerge") {
  return descendantElements(
    Hero({
      title: "Centralize sua operação",
      subtitle: "Converse com clientes em um só lugar.",
      backgroundMedia: { type: "image", url: "https://example.com/product.png" },
      layout,
    }),
  );
}

describe("heroContentAlignClass", () => {
  it("centraliza o conteúdo no layout productEmerge", () => {
    expect(heroContentAlignClass("productEmerge")).toContain("text-center");
    expect(heroContentAlignClass("productEmerge")).toContain("items-center");
  });

  it("mantém o alinhamento inicial no layout padrão", () => {
    expect(heroContentAlignClass("default")).not.toContain("text-center");
  });

  it("limita título e subtítulo a 720px no productEmerge", () => {
    const elements = heroElements("productEmerge");
    const heading = elements.find((element) => element.type === "h1");
    const subtitle = elements.find((element) => element.type === "p");

    expect(heading?.props.className).toContain("max-w-[720px]");
    expect(subtitle?.props.className).toContain("max-w-[720px]");
  });

  it("prioriza o topo da mídia apenas no productEmerge", () => {
    const productMedia = heroElements("productEmerge").find((element) => "media" in element.props);
    const defaultMedia = heroElements("default").find((element) => "media" in element.props);

    expect(productMedia?.props.objectPosition).toBe("top");
    expect(defaultMedia?.props.objectPosition).toBeUndefined();
  });
});
