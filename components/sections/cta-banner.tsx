import Link from "next/link";
import { safeHref } from "@/lib/safe-href";
import type { Cta } from "@/shared/types";

export function CtaBanner({ title, text, cta }: { title?: string; text?: string; cta?: Cta }) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14">
      <div className="bg-oc-yellow-mass rounded-oc-modal p-10 md:p-14">
        {title && <h2 className="oc-h2 text-oc-ink max-w-[640px]">{title}</h2>}
        {text && <p className="oc-body-lg mt-3 text-oc-ink max-w-[560px]">{text}</p>}
        {cta && (
          <Link
            href={safeHref(cta.href)}
            className="oc-button-label mt-8 inline-block rounded-oc-button bg-oc-ink px-6 py-3 text-oc-surface transition-colors duration-150 ease-oc hover:bg-oc-dark"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
