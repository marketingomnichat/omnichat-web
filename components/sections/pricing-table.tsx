import Link from "next/link";
import { Card } from "@/components/ui/card";

type Plan = {
  _key?: string;
  name: string;
  description?: string;
  highlight?: boolean;
  features?: string[];
  ctaLabel: string;
  ctaHref: string;
};

export function PricingTable({
  title,
  plans = [],
}: {
  title?: string;
  plans?: Plan[];
}) {
  return (
    <section className="bg-oc-surface">
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        {title && (
          <h2 className="oc-h2 mb-12 text-center">{title}</h2>
        )}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <Card
              key={plan._key ?? i}
              elevation={plan.highlight ? "shadow" : "border"}
              className={plan.highlight ? "border border-oc-yellow-cta" : ""}
            >
              <h3 className="oc-h3 text-oc-ink">{plan.name}</h3>
              {plan.description && (
                <p className="oc-body-sm mt-2 text-oc-neutral-dark">{plan.description}</p>
              )}
              {plan.features && plan.features.length > 0 && (
                <ul className="mt-6 space-y-3">
                  {plan.features.map((feature, fi) => (
                    <li key={fi} className="flex items-start gap-2">
                      <svg
                        className="mt-1 h-4 w-4 shrink-0 text-oc-yellow-ink"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M2.5 8.5l3.5 3.5 7.5-8" />
                      </svg>
                      <span className="oc-body-sm text-oc-neutral-dark">{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-8">
                <Link
                  href={plan.ctaHref}
                  className="oc-button-label block rounded-oc-button bg-oc-yellow-cta px-6 py-3 text-center text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover active:bg-oc-yellow-press"
                >
                  {plan.ctaLabel}
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
