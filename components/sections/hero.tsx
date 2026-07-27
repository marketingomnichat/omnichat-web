import Link from "next/link";
import { safeHref } from "@/lib/safe-href";
import type { Cta } from "@/shared/types";

const CTA_CLASS: Record<NonNullable<Cta["variant"]>, string> = {
  primary:
    "bg-oc-yellow-cta text-oc-ink hover:bg-oc-yellow-hover active:bg-oc-yellow-press",
  secondary:
    "bg-oc-neutral-light text-oc-ink hover:bg-oc-secondary-hover active:bg-oc-secondary-press",
  ghost: "text-oc-ink hover:oc-ghost-hover active:oc-ghost-press",
};

export function Hero({
  overline,
  title,
  subtitle,
  ctas = [],
  theme = "light",
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  ctas?: Cta[];
  theme?: "light" | "dark";
}) {
  const dark = theme === "dark";
  return (
    <section className={dark ? "bg-black" : "bg-white"}>
      <div className="mx-auto max-w-oc-container px-6 py-oc-hero">
        {overline && (
          <p className={`oc-overline ${dark ? "text-oc-yellow-mass" : "text-oc-yellow-ink"}`}>{overline}</p>
        )}
        <h1
          className={
            dark
              ? "oc-h1 mt-3 max-w-[800px] text-white text-[44.8px] leading-[56px] font-bold"
              : "mt-3 max-w-[800px] text-[60px] leading-[64px] font-bold"
          }
        >
          {title}
        </h1>
        {subtitle && (
          <p
            className={`mt-5 max-w-[640px] ${
              dark
                ? "text-white text-[32px] leading-[48px] font-normal"
                : "oc-body-lg text-oc-neutral-dark"
            }`}
          >
            {subtitle}
          </p>
        )}
        {ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((cta) =>
              dark && (cta.variant ?? "primary") === "primary" ? (
                <Link
                  key={cta.label}
                  href={safeHref(cta.href)}
                  className="bg-[#FFBC00] text-[#0B0C0E] rounded-[8px] px-[18px] py-[12px] text-[14px] font-semibold transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover active:bg-oc-yellow-press"
                >
                  {cta.label}
                </Link>
              ) : (
                <Link
                  key={cta.label}
                  href={safeHref(cta.href)}
                  className={`oc-button-label rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc ${CTA_CLASS[cta.variant ?? "primary"]}`}
                >
                  {cta.label}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
