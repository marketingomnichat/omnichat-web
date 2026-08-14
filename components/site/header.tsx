"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { safeHref } from "@/lib/safe-href";

type NavChild = {
  label: string;
  href: string;
  icon: string;
  description: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

const LOGO_URL =
  "https://storage.googleapis.com/omnichat-cdn-assets/logos/omnichat/colorida/omnichat.svg";

export const HEADER_NAV_ITEMS: NavItem[] = [
  {
    label: "Produtos",
    href: "#produtos",
    children: [
      {
        label: "Marketing Studio",
        href: "/produto/marketing-studio/",
        icon: "ri-megaphone-line",
        description: "Campanhas, segmentação e ROAS no WhatsApp",
      },
      {
        label: "Vendas",
        href: "/produto/sales-studio/",
        icon: "ri-shopping-bag-3-line",
        description: "Inbox, Copilot e contexto para vender mais",
      },
    ],
  },
  {
    label: "Soluções",
    href: "#solucoes",
    children: [
      {
        label: "Varejo",
        href: "/solucao/varejo/",
        icon: "ri-store-2-line",
        description: "Jornada conversacional para varejo e e-commerce",
      },
      {
        label: "Educacional",
        href: "/solucao/educacional/",
        icon: "ri-graduation-cap-line",
        description: "Captação e relacionamento no setor educacional",
      },
    ],
  },
  {
    label: "Recursos",
    href: "#recursos",
    children: [
      {
        label: "Blog",
        href: "/blog/",
        icon: "ri-article-line",
        description: "Conteúdo sobre vendas conversacionais",
      },
      {
        label: "Casos de Estudo",
        href: "/blog/categoria/cases-de-sucesso/",
        icon: "ri-briefcase-4-line",
        description: "Resultados de clientes OmniChat",
      },
      {
        label: "Eventos",
        href: "/blog/categoria/eventos/",
        icon: "ri-calendar-event-line",
        description: "Encontros, webinars e conversas",
      },
      {
        label: "Relatórios",
        href: "/chat-commerce-report/",
        icon: "ri-file-chart-line",
        description: "Dados do comércio conversacional",
      },
    ],
  },
  {
    label: "Sobre",
    href: "#sobre",
    children: [
      {
        label: "Sobre nós",
        href: "/empresa/",
        icon: "ri-building-line",
        description: "Conheça a OmniChat",
      },
      {
        label: "Carreiras",
        href: "/empresa/#vagas",
        icon: "ri-team-line",
        description: "Faça parte do nosso time",
      },
      {
        label: "Imprensa",
        href: "/imprensa/",
        icon: "ri-newspaper-line",
        description: "Notícias e materiais institucionais",
      },
      {
        label: "Suporte",
        href: "https://api.whatsapp.com/send/?phone=554137950418&type=phone_number&app_absent=0",
        icon: "ri-customer-service-2-line",
        description: "Fale com a OmniChat",
      },
    ],
  },
  { label: "Planos", href: "/planos/" },
];

function Caret({ open }: { open: boolean }) {
  return (
    <i
      aria-hidden
      className={`ri-arrow-down-s-line text-[16px] transition-transform duration-200 ${
        open ? "rotate-180" : ""
      }`}
    />
  );
}

export function Header() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setDrawerOpen(false);
      setOpenMenu(null);
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, []);

  useEffect(() => {
    document.body.style.overflow = drawerOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-[101px] rounded-b-[9px] bg-white shadow-[0_10px_25px_0_rgba(16,30,54,0.1)]">
      <div className="mx-auto flex h-full max-w-[1300px] items-center justify-between px-4 xl:px-0">
        <Link
          href="/"
          aria-label="OmniChat — Página inicial"
          className="flex h-full shrink-0 items-center overflow-hidden"
        >
          <Image
            src={LOGO_URL}
            alt="OmniChat"
            width={200}
            height={100}
            className="h-[100px] w-[200px] object-contain"
            priority
            unoptimized
          />
        </Link>

        <nav
          aria-label="Navegação principal"
          className="hidden h-full flex-1 items-center justify-between pl-3 xl:flex"
        >
          <div className="flex h-full items-center gap-5">
            {HEADER_NAV_ITEMS.map((item) =>
            item.children?.length ? (
              <div
                key={item.href}
                className="relative flex h-full items-center"
                onMouseEnter={() => setOpenMenu(item.href)}
                onMouseLeave={() => setOpenMenu(null)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenMenu(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setOpenMenu(null);
                    event.currentTarget.querySelector("button")?.focus();
                  }
                }}
              >
                <button
                  type="button"
                  aria-haspopup="menu"
                  aria-expanded={openMenu === item.href}
                  className="flex h-full items-center gap-1 text-[14px] font-bold text-oc-ink transition-colors duration-150 hover:text-oc-neutral-dark"
                  onClick={() =>
                    setOpenMenu((current) => (current === item.href ? null : item.href))
                  }
                  onFocus={() => setOpenMenu(item.href)}
                >
                  {item.label}
                  <Caret open={openMenu === item.href} />
                </button>

                <div
                  className={`absolute top-[84px] left-1/2 w-[336px] -translate-x-1/2 rounded-[12px] bg-white p-2 shadow-[0_10px_25px_rgba(16,30,54,0.14)] transition-[opacity,transform,visibility] duration-200 ${
                    openMenu === item.href
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  <ul
                    aria-label={`Subitens de ${item.label}`}
                    className="grid gap-1"
                    role="menu"
                  >
                    {item.children.map((child) => (
                      <li key={child.href} role="none">
                        <Link
                          href={safeHref(child.href)}
                          className="flex items-center gap-3 rounded-[8px] px-3 py-3 text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-surface-alt focus:bg-oc-surface-alt focus:outline-none"
                          role="menuitem"
                          onClick={() => setOpenMenu(null)}
                        >
                          <span className="flex size-10 shrink-0 items-center justify-center rounded-[8px] bg-oc-attention-light text-oc-yellow-ink">
                            <i aria-hidden className={`${child.icon} text-[20px]`} />
                          </span>
                          <span>
                            <span className="block text-[15px] font-bold">{child.label}</span>
                            <span className="mt-0.5 block text-[12px] leading-[16px] font-normal text-oc-neutral-dark">
                              {child.description}
                            </span>
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={safeHref(item.href)}
                className="flex h-full items-center text-[14px] font-bold text-oc-ink transition-colors duration-150 hover:text-oc-neutral-dark"
              >
                {item.label}
              </Link>
            )
          )}
          </div>

          <div className="flex items-center gap-2">
          <Link
            href="https://app.omni.chat/"
              className="flex h-[43px] min-w-[91px] items-center justify-center rounded-[9px] bg-[#E9EBF0] px-5 text-[14px] font-bold text-oc-ink shadow-[0_10px_25px_rgba(16,30,54,0.1)] transition-colors duration-150 hover:bg-oc-secondary-hover"
          >
            Login
          </Link>
          <Link
            href="#formulario"
              className="flex h-[43px] min-w-[102px] items-center justify-center rounded-[9px] bg-oc-yellow-cta px-5 text-[14px] font-bold text-oc-ink shadow-[0_10px_25px_rgba(255,188,0,0.28)] transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
          >
            Demo
          </Link>
          </div>
        </nav>

        <button
          aria-controls="mobile-navigation"
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? "Fechar menu" : "Abrir menu"}
          className="flex size-11 items-center justify-center rounded-[9px] bg-oc-yellow-cta text-oc-ink xl:hidden"
          onClick={() => setDrawerOpen((open) => !open)}
          type="button"
        >
          <i
            aria-hidden
            className={`${drawerOpen ? "ri-close-line" : "ri-menu-line"} text-[24px]`}
          />
        </button>
      </div>

      {drawerOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-x-0 top-[101px] bottom-0 z-10 flex flex-col overflow-y-auto bg-white px-6 py-5 text-oc-ink xl:hidden"
        >
          <nav aria-label="Navegação mobile" className="flex flex-1 flex-col">
            {HEADER_NAV_ITEMS.map((item) =>
              item.children?.length ? (
                <details key={item.href} className="border-b border-oc-divider py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[18px] font-bold marker:hidden">
                    {item.label}
                    <i aria-hidden className="ri-arrow-down-s-line text-[20px]" />
                  </summary>
                  <ul className="mt-3 grid gap-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={safeHref(child.href)}
                          className="flex items-center gap-3 rounded-[8px] px-2 py-2.5 text-[15px] font-bold hover:bg-oc-surface-alt focus:bg-oc-surface-alt focus:outline-none"
                          onClick={() => setDrawerOpen(false)}
                        >
                          <span className="flex size-9 items-center justify-center rounded-[8px] bg-oc-attention-light text-oc-yellow-ink">
                            <i aria-hidden className={`${child.icon} text-[18px]`} />
                          </span>
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ) : (
                <Link
                  key={item.href}
                  href={safeHref(item.href)}
                  className="border-b border-oc-divider py-4 text-[18px] font-bold"
                  onClick={() => setDrawerOpen(false)}
                >
                  {item.label}
                </Link>
              )
            )}
          </nav>
          <div className="grid gap-3 pt-6">
            <Link
              href="https://app.omni.chat/"
              className="rounded-[9px] bg-[#E9EBF0] px-[18px] py-[14px] text-center text-[14px] font-bold text-oc-ink"
              onClick={() => setDrawerOpen(false)}
            >
              Login
            </Link>
            <Link
              href="#formulario"
              className="rounded-[9px] bg-oc-yellow-cta px-[18px] py-[14px] text-center text-[14px] font-bold text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
              onClick={() => setDrawerOpen(false)}
            >
              Demo
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
