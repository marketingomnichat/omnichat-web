type Social = { platform: string; url: string };
import { safeHref } from "@/lib/safe-href";
type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type AppStoreLinks = { appStoreUrl?: string; googlePlayUrl?: string };

const SOCIAL_ICON: Record<string, string> = {
  linkedin: "ri-linkedin-box-fill",
  instagram: "ri-instagram-line",
  youtube: "ri-youtube-fill",
};

export function Footer({
  footerText,
  footerColumns = [],
  social = [],
  appStoreLinks,
}: {
  footerText?: string;
  footerColumns?: FooterColumn[];
  social?: Social[];
  appStoreLinks?: AppStoreLinks;
}) {
  const { appStoreUrl, googlePlayUrl } = appStoreLinks ?? {};
  const hasAppLinks = Boolean(appStoreUrl || googlePlayUrl);

  return (
    <footer className="mt-auto bg-oc-yellow-mass">
      <div className="mx-auto max-w-oc-container px-6 pt-8 pb-4">
        <p className="oc-h5 text-oc-ink">OmniChat</p>

        <div className="mt-8 grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-7">
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            {social.length > 0 && (
              <>
                <p className="oc-h5 text-oc-ink">Siga a Omni</p>
                <div className="mt-3 flex items-center gap-3">
                  {social.map((s) => (
                    <a
                      key={s.platform}
                      href={safeHref(s.url)}
                      className="text-oc-ink transition-colors duration-150 hover:text-oc-dark"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={s.platform}
                    >
                      <i
                        className={`${SOCIAL_ICON[s.platform.toLowerCase()] ?? "ri-link"} text-2xl`}
                        aria-hidden
                      />
                    </a>
                  ))}
                </div>
              </>
            )}

            {hasAppLinks && (
              <>
                <p className="oc-h5 mt-8 text-oc-ink">Baixe o aplicativo</p>
                <div className="mt-3 flex flex-col items-start gap-2">
                  {appStoreUrl && (
                    <a
                      href={safeHref(appStoreUrl)}
                      className="oc-caption text-oc-ink underline transition-colors duration-150 hover:text-oc-dark"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      App Store
                    </a>
                  )}
                  {googlePlayUrl && (
                    <a
                      href={safeHref(googlePlayUrl)}
                      className="oc-caption text-oc-ink underline transition-colors duration-150 hover:text-oc-dark"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Google Play
                    </a>
                  )}
                </div>
              </>
            )}
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="oc-overline text-oc-ink">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => (
                  <li key={`${col.title}-${link.label}-${link.href}`}>
                    <a
                      href={safeHref(link.href)}
                      className="oc-caption text-oc-ink transition-colors duration-150 hover:text-oc-dark"
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
        </div>

        {footerText && (
          <p className="oc-body-sm mt-6 max-w-[480px] text-oc-ink whitespace-pre-line">{footerText}</p>
        )}
      </div>
    </footer>
  );
}
