import { Card } from "@/components/ui/card";

type Testimonial = { quote: string; name: string; role?: string; company?: string };

export function Testimonials({ title, items = [] }: { title?: string; items?: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8">{title}</h2>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((t) => (
          <Card key={t.name} elevation="shadow">
            <blockquote className="oc-body-lg">&quot;{t.quote}&quot;</blockquote>
            <p className="oc-label mt-4">{t.name}</p>
            <p className="oc-caption text-oc-neutral-dark">
              {[t.role, t.company].filter(Boolean).join(" · ")}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
