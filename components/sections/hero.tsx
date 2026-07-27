import Link from "next/link";
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
    <section className={dark ? "bg-oc-dark" : "bg-oc-surface"}>
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        {overline && (
          <p className={`oc-overline ${dark ? "text-oc-yellow-mass" : "text-oc-yellow-ink"}`}>{overline}</p>
        )}
        <h1 className={`oc-display mt-3 max-w-[800px] ${dark ? "text-oc-surface" : ""}`}>{title}</h1>
        {subtitle && (
          <p className={`oc-body-lg mt-5 max-w-[640px] ${dark ? "text-oc-neutral" : "text-oc-neutral-dark"}`}>
            {subtitle}
          </p>
        )}
        {ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={`oc-button-label rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc ${CTA_CLASS[cta.variant ?? "primary"]}`}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
