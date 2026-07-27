type Social = { platform: string; url: string };
type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

export function Footer({
  footerText,
  footerColumns = [],
  social = [],
}: {
  footerText?: string;
  footerColumns?: FooterColumn[];
  social?: Social[];
}) {
  return (
    <footer className="mt-auto bg-oc-dark">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <p className="oc-h5 text-oc-yellow-mass">OmniChat</p>

        {footerColumns.length > 0 && (
          <nav aria-label="Links do rodapé" className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-6">
            {footerColumns.map((col) => (
              <div key={col.title}>
                <p className="oc-overline text-oc-neutral">{col.title}</p>
                <ul className="mt-3 space-y-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        className="oc-caption text-oc-neutral hover:text-oc-yellow-mass transition-colors duration-150"
                        target={link.href.startsWith("http") ? "_blank" : undefined}
                        rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        )}

        <div className="mt-8 flex gap-5">
          {social.map((s) => (
            <a
              key={s.platform}
              href={s.url}
              className="oc-caption text-oc-neutral hover:text-oc-yellow-mass transition-colors duration-150"
              target="_blank"
              rel="noopener noreferrer"
            >
              {s.platform}
            </a>
          ))}
        </div>

        {footerText && (
          <p className="oc-body-sm mt-6 max-w-[480px] text-oc-neutral whitespace-pre-line">{footerText}</p>
        )}
      </div>
    </footer>
  );
}
