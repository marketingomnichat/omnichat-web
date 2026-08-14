import Image from "next/image";
import { Card } from "@/components/ui/card";

type FeatureImage = { imageUrl: string; alt: string };
type Feature = { icon?: string; title: string; text?: string; image?: FeatureImage };

export function FeatureGrid({ title, features = [] }: { title?: string; features?: Feature[] }) {
  const allHaveImages =
    features.length > 0 && features.every((f) => Boolean(f.image?.imageUrl));
  const gridCols = allHaveImages ? "md:grid-cols-2" : "md:grid-cols-3";

  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8">{title}</h2>}
      <div className={`grid grid-cols-1 gap-6 ${gridCols}`}>
        {features.map((f) => (
          <Card key={f.title} elevation="border" className="bg-oc-surface-gray">
            {f.image?.imageUrl ? (
              <Image
                src={f.image.imageUrl}
                alt={f.image.alt ?? ""}
                width={600}
                height={360}
                className="mb-4 h-auto w-full rounded-oc-card object-cover"
              />
            ) : (
              f.icon && (
                <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[8px] bg-oc-orange-icon">
                  <i className={`${f.icon} text-2xl text-oc-ink`} aria-hidden />
                </span>
              )
            )}
            <h3 className="oc-h5">{f.title}</h3>
            {f.text && <p className="oc-body-sm mt-2 text-oc-neutral-dark">{f.text}</p>}
          </Card>
        ))}
      </div>
    </section>
  );
}
