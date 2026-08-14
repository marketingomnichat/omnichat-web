import Image from "next/image";
import { safeHref } from "@/lib/safe-href";

type Social = { platform: string; url: string };
type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };
type AppStoreLinks = { appStoreUrl?: string; googlePlayUrl?: string };
type FooterBadge = { imageUrl: string; alt: string; href: string; kind?: "store" | "certificate"; width?: number; height?: number };

const FOOTER_LOGO = "https://omni.chat/wp-content/uploads/2025/12/Conteudo.svg";

/**
 * Selos ISO reais (PNGs do site em produção). O href do badge continua
 * apontando para o certificado completo; o selo é só a arte do rodapé.
 */
const ISO_SEALS: Record<string, { imageUrl: string; width: number; height: number }> = {
  "27001": { imageUrl: "https://omni.chat/wp-content/uploads/2025/11/ISO-IEC-27001-V2-1.png", width: 89, height: 128 },
  "27701": { imageUrl: "https://omni.chat/wp-content/uploads/2025/12/ISO-IEC-27701-V3.png", width: 95, height: 128 },
  "27018": { imageUrl: "https://omni.chat/wp-content/uploads/2025/11/ISO-IEC-27018-V2-1.png", width: 95, height: 128 },
};

function resolveIsoSeal(badge: FooterBadge) {
  const code = /27001|27701|27018/.exec(`${badge.alt} ${badge.href}`)?.[0];
  return code ? ISO_SEALS[code] : undefined;
}

const SOCIAL_ICON: Record<string, string> = {
  linkedin: "ri-linkedin-box-fill",
  instagram: "ri-instagram-line",
  youtube: "ri-youtube-fill",
};

function FooterBadgeLink({ badge, width, height }: { badge: FooterBadge; width: number; height: number }) {
  const seal = resolveIsoSeal(badge);
  const src = seal?.imageUrl ?? badge.imageUrl;
  const intrinsicWidth = seal?.width ?? badge.width ?? width;
  const intrinsicHeight = seal?.height ?? badge.height ?? height;
  return (
    <a
      href={safeHref(badge.href)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={badge.alt}
    >
      <Image
        src={src}
        alt={badge.alt}
        width={intrinsicWidth}
        height={intrinsicHeight}
        // Selos ISO travam a proporção real (89/95 × 128); lojas mantêm h-auto.
        style={seal ? { width: intrinsicWidth, height: intrinsicHeight } : undefined}
        className={seal ? undefined : "h-auto w-auto"}
      />
    </a>
  );
}

export function Footer({
  footerText,
  footerColumns = [],
  social = [],
  appStoreLinks,
  footerBadges = [],
}: {
  footerText?: string;
  footerColumns?: FooterColumn[];
  social?: Social[];
  appStoreLinks?: AppStoreLinks;
  footerBadges?: FooterBadge[];
}) {
  const { appStoreUrl, googlePlayUrl } = appStoreLinks ?? {};
  const storeHrefs = new Set([appStoreUrl, googlePlayUrl].filter(Boolean));
  const storeBadges = footerBadges.filter((badge) => badge.kind === "store" || storeHrefs.has(badge.href));
  const isoBadges = footerBadges.filter((badge) => badge.kind === "certificate" || (!badge.kind && !storeHrefs.has(badge.href)));
  const hasAppLinks = Boolean(appStoreUrl || googlePlayUrl || storeBadges.length);

  return (
    <footer className="mt-auto bg-oc-yellow-mass">
      <div className="mx-auto max-w-oc-container px-6 pt-8 pb-4">
        <Image src={FOOTER_LOGO} alt="OmniChat" width={135} height={35} className="h-[35px] w-[135px] object-contain object-left" unoptimized />

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
                  {storeBadges.length > 0 ? (
                    storeBadges.map((badge) => (
                      <FooterBadgeLink key={badge.href} badge={badge} width={135} height={40} />
                    ))
                  ) : (
                    <>
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
                    </>
                  )}
                </div>
              </>
            )}
          </div>

          {footerColumns.map((col) => (
            <div key={col.title}>
              <p className="oc-overline text-oc-ink">{col.title}</p>
              <ul className="mt-3 space-y-2">
                {col.links.map((link) => {
                  const opensDemoModal =
                    /\b(?:demo|demonstração)\b/i.test(link.label);

                  return (
                    <li key={`${col.title}-${link.label}-${link.href}`}>
                      <a
                        href={safeHref(
                          opensDemoModal ? "#formulario" : link.href,
                        )}
                        data-demo-modal-trigger={
                          opensDemoModal ? true : undefined
                        }
                        className="oc-caption text-oc-ink transition-colors duration-150 hover:text-oc-dark"
                        target={
                          !opensDemoModal && link.href.startsWith("http")
                            ? "_blank"
                            : undefined
                        }
                        rel={
                          !opensDemoModal && link.href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                      >
                        {link.label}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 grid gap-8 border-t border-oc-ink/25 pt-8 md:grid-cols-[1fr_auto] md:items-end">
          {isoBadges.length > 0 && (
            <div className="flex flex-wrap items-end gap-4">
              {isoBadges.map((badge, index) => (
                <FooterBadgeLink key={badge.href} badge={badge} width={index === 0 ? 89 : 95} height={128} />
              ))}
            </div>
          )}
          {footerText && (
            <p className="oc-body-sm max-w-[520px] text-oc-ink whitespace-pre-line md:text-right">{footerText}</p>
          )}
        </div>
      </div>
    </footer>
  );
}
