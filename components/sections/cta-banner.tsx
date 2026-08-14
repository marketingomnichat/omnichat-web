import Image from "next/image";
import Link from "next/link";
import { safeHref } from "@/lib/safe-href";
import type { Cta } from "@/shared/types";

type SectionImage = { imageUrl: string; alt: string };

export function CtaBanner({
  title,
  text,
  cta,
  image,
}: {
  title?: string;
  text?: string;
  cta?: Cta;
  image?: SectionImage;
}) {
  const hasImage = Boolean(image?.imageUrl);

  return (
    <section
      className="w-full py-oc-section"
      style={{ background: "linear-gradient(32.58deg, #000000 66.85%, #21272A 108.34%)" }}
    >
      <div className="mx-auto max-w-oc-container px-6">
        <div className="bg-oc-yellow-mass rounded-oc-modal p-10 md:p-14">
          <div
            className={`grid items-center gap-8 ${hasImage ? "md:grid-cols-2" : ""}`}
          >
            {hasImage && image && (
              <div>
                <Image
                  src={image.imageUrl}
                  alt={image.alt ?? ""}
                  width={480}
                  height={480}
                  className="h-auto w-full rounded-lg object-cover"
                />
              </div>
            )}
            <div>
              {title && <h2 className="oc-h2 text-oc-ink max-w-[640px]">{title}</h2>}
              {text && <p className="oc-body-lg mt-3 text-oc-ink max-w-[560px]">{text}</p>}
              {cta && (
                <Link
                  href={safeHref(cta.href)}
                  className="oc-button-label mt-8 inline-block rounded-oc-button bg-[#FFBC00] px-6 py-3 text-[#0B0C0E] transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
                >
                  {cta.label}
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
