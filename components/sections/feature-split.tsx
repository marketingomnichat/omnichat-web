import Image from "next/image";
import { safeHref } from "@/lib/safe-href";
import Link from "next/link";
import type { Cta } from "@/shared/types";

const CTA_CLASS: Record<NonNullable<Cta["variant"]>, string> = {
  primary:
    "bg-oc-yellow-cta text-oc-ink hover:bg-oc-yellow-hover active:bg-oc-yellow-press",
  secondary:
    "bg-oc-neutral-light text-oc-ink hover:bg-oc-secondary-hover active:bg-oc-secondary-press",
  ghost: "text-oc-ink hover:oc-ghost-hover active:oc-ghost-press",
};

type FeatureImage = { imageUrl: string; alt: string };

export function FeatureSplit({
  overline,
  title,
  body,
  image,
  mediaSide = "right",
  cta,
  dark = false,
}: {
  overline?: string;
  title: string;
  body?: string;
  image?: FeatureImage;
  mediaSide?: "left" | "right";
  cta?: Cta;
  dark?: boolean;
}) {
  return (
    <section className={dark ? "bg-oc-ink" : "bg-oc-surface"}>
      <div className="mx-auto grid max-w-oc-container items-center gap-12 px-6 py-oc-section md:grid-cols-2">
        {/* Text column */}
        <div className={mediaSide === "left" ? "md:order-last" : ""}>
          {overline && (
            <p
              className={`oc-overline ${
                dark ? "text-oc-yellow-mass" : "text-oc-yellow-ink"
              }`}
            >
              {overline}
            </p>
          )}
          <h2
            className={`oc-h2 mt-3 ${dark ? "text-oc-surface" : ""}`}
          >
            {title}
          </h2>
          {body && (
            <p
              className={`oc-body-lg mt-5 ${
                dark ? "text-oc-neutral" : "text-oc-neutral-dark"
              }`}
            >
              {body}
            </p>
          )}
          {cta && (
            <div className="mt-8">
              <Link
                href={safeHref(cta.href)}
                className={`oc-button-label rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc ${
                  CTA_CLASS[cta.variant ?? "primary"]
                }`}
              >
                {cta.label}
              </Link>
            </div>
          )}
        </div>

        {/* Media column */}
        {image?.imageUrl && (
          <div className={mediaSide === "left" ? "md:order-first" : ""}>
            <Image
              src={image.imageUrl}
              alt={image.alt ?? ""}
              width={600}
              height={400}
              className="h-auto w-full rounded-lg object-cover"
            />
          </div>
        )}
      </div>
    </section>
  );
}
