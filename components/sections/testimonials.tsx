import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { safeHref } from "@/lib/safe-href";

type Testimonial = {
  quote: string;
  name?: string;
  role?: string;
  company?: string;
  logoUrl?: string;
  logoAlt?: string;
  href?: string;
};

export function Testimonials({ title, items = [] }: { title?: string; items?: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8 text-center">{title}</h2>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <Card key={t.name ?? t.logoAlt ?? i} elevation="shadow" className="flex h-full flex-col items-center text-center">
            {t.logoUrl && (
              <Image
                src={t.logoUrl}
                alt={t.logoAlt ?? t.company ?? ""}
                width={160}
                height={48}
                className="mb-6 h-12 w-auto object-contain"
              />
            )}
            <blockquote className="oc-body-lg">&quot;{t.quote}&quot;</blockquote>
            {(t.name || t.role || t.company) && (
              <>
                {t.name && <p className="oc-label mt-4">{t.name}</p>}
                <p className="oc-caption text-oc-neutral-dark">
                  {[t.role, t.company].filter(Boolean).join(" · ")}
                </p>
              </>
            )}
            {t.href && (
              <Link
                href={safeHref(t.href)}
                className="oc-button-label mt-6 text-oc-yellow-ink underline-offset-4 hover:underline"
              >
                Saiba mais
              </Link>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
