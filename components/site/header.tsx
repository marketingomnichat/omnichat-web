"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { safeHref } from "@/lib/safe-href";

type NavItem = { label: string; href: string };

/*
 * Header WP: overlay transparente sobre o hero (sem sombra, sem bg).
 * A cor dos links muda com o fundo da página, como no WordPress:
 * amarelo #FFBC00 sobre hero escuro, tinta escura sobre página clara
 * (WCAG AA — amarelo sobre branco reprova contraste).
 */
const DARK_HERO_ROUTES = new Set(["/", "/planos", "/chat-commerce-report"]);

export function Header({ nav = [] }: { nav?: NavItem[] }) {
  const pathname = usePathname();
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
          {nav.map((item) => (
            <Link
              key={item.href}
              href={safeHref(item.href)}
              className={`${linkColor} text-[20px] font-normal`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/login"
            className={`rounded-[8px] border-0 bg-transparent ${ghostColor} px-[18px] py-[12px] text-[14px] font-semibold`}
          >
            Login
          </Link>
          <Link
            href="/contato"
            className="rounded-[8px] bg-[#FFBC00] text-[#0B0C0E] px-[18px] py-[12px] text-[14px] font-semibold transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
          >
            Fale com vendas
          </Link>
        </nav>
      </div>
    </header>
  );
}
