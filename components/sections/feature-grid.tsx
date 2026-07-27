import { Card } from "@/components/ui/card";

type Feature = { icon?: string; title: string; text?: string };

export function FeatureGrid({ title, features = [] }: { title?: string; features?: Feature[] }) {
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8">{title}</h2>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} elevation="border" className="bg-oc-surface-gray">
            {f.icon && (
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[8px] bg-oc-orange-icon">
                <i className={`${f.icon} text-2xl text-oc-ink`} aria-hidden />
              </span>
            )}
            <h3 className="oc-h5">{f.title}</h3>
            {f.text && <p className="oc-body-sm mt-2 text-oc-neutral-dark">{f.text}</p>}
          </Card>
        ))}
      </div>
    </section>
  );
}
