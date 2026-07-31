"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { safeHref } from "@/lib/safe-href";
import {
  HEADER_SCROLL_THRESHOLD_PX,
  resolveHeaderAppearance,
} from "@/components/site/header-appearance";

type NavChild = {
  label: string;
  href: string;
  iconUrl?: string;
  iconAlt?: string;
};

type NavItem = {
  label: string;
  href: string;
  children?: NavChild[];
};

/*
 * Header WP: overlay transparente sobre o hero (sem sombra, sem bg).
 * A cor dos links muda com o fundo da página, como no WordPress:
 * amarelo #FFBC00 sobre hero escuro, tinta escura sobre página clara
 * (WCAG AA — amarelo sobre branco reprova contraste).
 */
const DARK_HERO_ROUTES = new Set(["/", "/planos", "/chat-commerce-report"]);

export function Header({ nav = [] }: { nav?: NavItem[] }) {
  const pathname = usePathname();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const appearance = resolveHeaderAppearance({
    onDarkHeroRoute: DARK_HERO_ROUTES.has(pathname),
    scrolled,
  });
  const isDark = appearance === "darkOverlay";

  const linkColor = isDark ? "text-oc-yellow-cta" : "text-oc-ink";
  const logoColor = isDark ? "text-white" : "text-oc-ink";
  const ghostColor = isDark ? "text-oc-yellow-cta" : "text-oc-dark";

  useEffect(() => {
    if (!drawerOpen) return;

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [drawerOpen]);

  useEffect(() => {
    const updateScrolled = () => {
      setScrolled(window.scrollY > HEADER_SCROLL_THRESHOLD_PX);
    };

    updateScrolled();
    window.addEventListener("scroll", updateScrolled);
    return () => window.removeEventListener("scroll", updateScrolled);
  }, [pathname]);

  return (
    <header
      className={`top-0 right-0 left-0 z-50 transition-colors duration-200 ease-oc motion-reduce:transition-none ${
        isDark
          ? "absolute bg-transparent"
          : "fixed border-b border-oc-divider bg-oc-surface/95 backdrop-blur-sm"
      }`}
    >
      <div className="mx-auto flex max-w-oc-container items-center justify-between px-3 py-4">
        <Link href="/" className={`oc-h5 ${logoColor}`}>
          OmniChat
        </Link>
        <nav aria-label="Navegação principal" className="hidden items-center gap-6 md:flex">
          {nav.map((item) =>
            item.children?.length ? (
              <details
                key={item.href}
                className="static"
                open={openMenu === item.href}
                onMouseEnter={() => setOpenMenu(item.href)}
                onMouseLeave={() => setOpenMenu(null)}
                onToggle={(event) => {
                  setOpenMenu(event.currentTarget.open ? item.href : null);
                }}
                onFocus={() => setOpenMenu(item.href)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setOpenMenu(null);
                  }
                }}
                onKeyDown={(event) => {
                  if (event.key === "Escape") {
                    setOpenMenu(null);
                    event.currentTarget.querySelector("summary")?.focus();
                  }
                }}
              >
                <summary
                  aria-haspopup="menu"
                  aria-expanded={openMenu === item.href}
                  className={`${linkColor} flex cursor-pointer list-none items-center gap-1 text-[20px] font-normal marker:hidden`}
                >
                  {item.label}
                  <svg aria-hidden="true" className="size-4" fill="none" viewBox="0 0 24 24">
                    <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                  </svg>
                </summary>
                <div className="fixed inset-x-0 top-[76px] bg-oc-surface shadow-lg">
                  <ul
                    aria-label={`Subitens de ${item.label}`}
                    className="mx-auto grid max-w-oc-container grid-cols-2 gap-2 px-3 py-4"
                    role="menu"
                  >
                    {item.children.map((child) => (
                      <li key={child.href} role="none">
                        <Link
                          href={safeHref(child.href)}
                          className="flex items-center gap-3 rounded-[8px] px-4 py-3 text-[16px] font-semibold text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-neutral-light focus:bg-oc-neutral-light focus:outline-none"
                          role="menuitem"
                        >
                          {child.iconUrl ? (
                            <Image
                              src={child.iconUrl}
                              alt={child.iconAlt ?? ""}
                              width={20}
                              height={20}
                              className="size-5 object-contain"
                            />
                          ) : null}
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </details>
            ) : (
              <Link
                key={item.href}
                href={safeHref(item.href)}
                className={`${linkColor} text-[20px] font-normal`}
              >
                {item.label}
              </Link>
            )
          )}
          <Link
            href="https://app.omni.chat/"
            className={`rounded-[8px] border-0 bg-transparent ${ghostColor} px-[18px] py-[12px] text-[14px] font-semibold`}
          >
            Login
          </Link>
          <Link
            href="#formulario"
            className="rounded-[8px] bg-oc-yellow-cta px-[18px] py-[12px] text-[14px] font-semibold text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
          >
            Demo
          </Link>
        </nav>
        <button
          aria-controls="mobile-navigation"
          aria-expanded={drawerOpen}
          aria-label={drawerOpen ? "Fechar menu" : "Abrir menu"}
          className="flex size-11 items-center justify-center rounded-[8px] bg-oc-yellow-cta text-oc-ink md:hidden"
          onClick={() => setDrawerOpen((open) => !open)}
          type="button"
        >
          {drawerOpen ? (
            <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
              <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          ) : (
            <svg aria-hidden="true" className="size-6" fill="none" viewBox="0 0 24 24">
              <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
            </svg>
          )}
        </button>
      </div>
      {drawerOpen ? (
        <div
          id="mobile-navigation"
          className="fixed inset-0 z-10 flex min-h-screen flex-col bg-oc-dark px-6 pb-8 pt-24 text-white md:hidden"
        >
          <nav aria-label="Navegação mobile" className="flex flex-1 flex-col gap-2 overflow-y-auto">
            {nav.map((item) =>
              item.children?.length ? (
                <details key={item.href} className="border-b border-white/20 py-3">
                  <summary className="flex cursor-pointer list-none items-center justify-between text-[20px] font-semibold marker:hidden">
                    {item.label}
                    <svg aria-hidden="true" className="size-5" fill="none" viewBox="0 0 24 24">
                      <path d="m6 9 6 6 6-6" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
                    </svg>
                  </summary>
                  <ul className="mt-3 space-y-1">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={safeHref(child.href)}
                          className="flex items-center gap-3 rounded-[8px] px-2 py-3 text-[16px] font-semibold hover:bg-white/10 focus:bg-white/10 focus:outline-none"
                          onClick={() => setDrawerOpen(false)}
                        >
                          {child.iconUrl ? (
                            <Image
                              src={child.iconUrl}
                              alt={child.iconAlt ?? ""}
                              width={20}
                              height={20}
                              className="size-5 object-contain"
                            />
                          ) : null}
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
                  className="border-b border-white/20 py-3 text-[20px] font-semibold"
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
              className="rounded-[8px] border border-oc-yellow-cta px-[18px] py-[12px] text-center text-[14px] font-semibold text-oc-yellow-cta"
            >
              Login
            </Link>
            <Link
              href="#formulario"
              className="rounded-[8px] bg-oc-yellow-cta px-[18px] py-[12px] text-center text-[14px] font-semibold text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
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
