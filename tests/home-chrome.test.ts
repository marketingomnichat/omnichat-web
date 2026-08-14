import { parse } from "node-html-parser";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";

vi.mock("next/navigation", () => ({
  usePathname: () => "/",
}));

import { ClickupCompositionHome } from "../components/home/clickup-composition";
import {
  CLIENT_LOGOS,
  ClientLogoStrip,
} from "../components/home/client-logo-strip";
import { Footer } from "../components/site/footer";
import { Header } from "../components/site/header";

describe("chrome da home inspirado no Figma", () => {
  it("mantém a navbar de 101px com a navegação e CTAs definidos", () => {
    const html = renderToStaticMarkup(createElement(Header));
    const document = parse(html);
    const header = document.querySelector("header");

    expect(header?.getAttribute("class")).toContain("h-[101px]");
    expect(header?.getAttribute("class")).toContain("shadow-[0_10px_25px");

    for (const label of [
      "Produtos",
      "Marketing Studio",
      "Vendas",
      "Soluções",
      "Varejo",
      "Educacional",
      "Recursos",
      "Blog",
      "Casos de Estudo",
      "Eventos",
      "Relatórios",
      "Sobre",
      "Sobre nós",
      "Carreiras",
      "Imprensa",
      "Suporte",
      "Planos",
      "Login",
      "Demo",
    ]) {
      expect(html).toContain(label);
    }

    const logo = document.querySelector('img[alt="OmniChat"]');
    expect(logo?.getAttribute("width")).toBe("200");
    expect(logo?.getAttribute("height")).toBe("100");
  });

  it("exibe uma única grade de logos sem marquee automático", () => {
    const html = renderToStaticMarkup(createElement(ClientLogoStrip));
    const document = parse(html);
    const logos = document.querySelectorAll("[data-client-logo]");

    expect(document.querySelector("[data-logo-marquee]")).toBeNull();
    expect(logos).toHaveLength(CLIENT_LOGOS.length);
  });

  it("concentra Agent e Copilot em uma única seção Whizz", () => {
    const html = renderToStaticMarkup(createElement(ClickupCompositionHome));
    const document = parse(html);
    const section = document.querySelector('[aria-labelledby="whizz-title"]');

    expect(section).not.toBeNull();
    expect(section?.getAttribute("class")).toContain("oc-whizz");
    expect(section?.textContent).toContain("O Whizz Agent vende por você");
    expect(section?.textContent).toContain("Whizz Copilot");
  });

  it("mantém apenas CTAs de abertura e encerramento sem formulário fixo", () => {
    const html = renderToStaticMarkup(createElement(ClickupCompositionHome));
    const document = parse(html);

    expect(document.querySelector("form") === null).toBe(true);
    expect(document.querySelectorAll('[href="#formulario"]')).toHaveLength(2);
  });

  it("converte CTA de demonstração do rodapé em gatilho do modal", () => {
    const html = renderToStaticMarkup(
      createElement(Footer, {
        footerColumns: [
          {
            title: "Planos",
            links: [
              {
                label: "Agende uma demo",
                href: "https://api.whatsapp.com/send?phone=554137950418",
              },
            ],
          },
        ],
      }),
    );
    const document = parse(html);
    const trigger = document.querySelector("[data-demo-modal-trigger]");

    expect(trigger?.getAttribute("href")).toBe("#formulario");
    expect(trigger?.textContent).toContain("Agende uma demo");
  });
});
