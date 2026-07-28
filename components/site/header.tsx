"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { safeHref } from "@/lib/safe-href";

type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
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
  const onDark = DARK_HERO_ROUTES.has(pathname);

  const linkColor = onDark ? "text-[#FFBC00]" : "text-oc-ink";
  const logoColor = onDark ? "text-white" : "text-oc-ink";
  const ghostColor = onDark ? "text-[#FFBC00]" : "text-oc-dark";

  return (
    <header className="absolute top-0 left-0 right-0 z-50 bg-transparent">
      <div className="mx-auto flex max-w-oc-container items-center justify-between px-3 py-4">
        <Link href="/" className={`oc-h5 ${logoColor}`}>
          OmniChat
        </Link>
        <nav className="flex items-center gap-6">
          {nav.map((item) =>
            item.children?.length ? (
              <details
                key={item.href}
                className="relative"
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
                  <span aria-hidden="true">⌄</span>
                </summary>
                <ul
                  aria-label={`Subitens de ${item.label}`}
                  className="absolute left-0 top-full mt-3 min-w-52 rounded-[8px] bg-white p-2 shadow-lg"
                  role="menu"
                >
                  {item.children.map((child) => (
                    <li key={child.href} role="none">
                      <Link
                        href={safeHref(child.href)}
                        className="block rounded-[4px] px-3 py-2 text-[14px] font-semibold text-oc-ink hover:bg-oc-neutral-light focus:bg-oc-neutral-light focus:outline-none"
                        role="menuitem"
                      >
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
            className="rounded-[8px] bg-[#FFBC00] text-[#0B0C0E] px-[18px] py-[12px] text-[14px] font-semibold transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
          >
            Demo
          </Link>
        </nav>
      </div>
    </header>
  );
}
