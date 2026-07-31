import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();

  return {
    ...actual,
    useEffect: () => undefined,
    useRef: <T,>(initialValue: T) => ({ current: initialValue }),
    useState: <T,>(initialValue: T) => [initialValue, () => undefined] as const,
  };
});

import { FeatureCarousel } from "../components/sections/feature-carousel";
import { FeatureSplit } from "../components/sections/feature-split";
import { LogoCloud } from "../components/sections/logo-cloud";
import { Stats } from "../components/sections/stats";
import { Testimonials } from "../components/sections/testimonials";
import { Card } from "../components/ui/card";
import { isSvgUrl } from "../components/ui/image-utils";
import { Panel } from "../components/ui/panel";

type ElementProps = Record<string, unknown>;

function descendantElements(node: ReactNode): ReactElement<ElementProps>[] {
  if (Array.isArray(node)) return node.flatMap(descendantElements);
  if (!isValidElement<ElementProps>(node)) return [];

  return [node, ...descendantElements(node.props.children as ReactNode)];
}

function containsComponent(node: ReactNode, component: unknown) {
  return descendantElements(node).some((element) => element.type === component);
}

describe("seções de marketing em Panel", () => {
  it("envolve o conteúdo claro de feature split em um único painel", () => {
    const section = FeatureSplit({ title: "Vendas centralizadas" });

    expect(containsComponent(section, Panel)).toBe(true);
  });

  it("mantém feature split escuro sem painel branco", () => {
    const section = FeatureSplit({ title: "Whizz", dark: true });

    expect(containsComponent(section, Panel)).toBe(false);
  });

  it.each([
    ["stats", Stats({ items: [{ value: "42%", label: "Conversão" }] })],
    ["logo cloud", LogoCloud({ logos: [{ name: "Omni", imageUrl: "/omni.png" }] })],
    ["testimonials", Testimonials({ items: [{ quote: "Resultado comprovado." }] })],
    ["feature carousel", FeatureCarousel({ items: [{ title: "Whizz" }] })],
  ])("%s usa painel para agrupar seu conteúdo", (_name, section) => {
    expect(containsComponent(section, Panel)).toBe(true);
  });

  it("não aninha Card nos painéis de depoimentos", () => {
    const section = Testimonials({ items: [{ quote: "Resultado comprovado." }] });

    expect(containsComponent(section, Card)).toBe(false);
  });

  it("passa a superfície escura explicitamente ao painel do carrossel", () => {
    const section = FeatureCarousel({ items: [{ title: "Whizz", dark: true }] });
    const panel = descendantElements(section).find((element) => element.type === Panel);

    expect(panel?.props.surface).toBe("dark");
  });

  it("identifica logos SVG, inclusive com query string", () => {
    expect(isSvgUrl("https://cdn.sanity.io/logo.svg")).toBe(true);
    expect(isSvgUrl("https://cdn.sanity.io/logo.svg?version=2")).toBe(true);
    expect(isSvgUrl("https://cdn.sanity.io/logo.png")).toBe(false);
  });
});
