import Link from "next/link";

type NavItem = { label: string; href: string };

export function Header({ nav = [] }: { nav?: NavItem[] }) {
  return (
    <header className="border-b border-oc-divider bg-oc-surface">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <Link href="/" className="oc-h5">
          OmniChat
        </Link>
        <nav className="flex items-center gap-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="oc-label hover:text-oc-yellow-ink">
              {item.label}
            </Link>
          ))}
          <Link
            href="/contato"
            className="oc-button-label rounded-oc-button bg-oc-yellow-cta px-5 py-2.5 text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
          >
            Fale com vendas
          </Link>
        </nav>
      </div>
    </header>
  );
}
