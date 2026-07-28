export function Stats({
  title,
  items = [],
}: {
  title?: string;
  items?: { value: string; label: string }[];
}) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-10 text-center">{title}</h2>}
      <dl className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <dd className="oc-h3-stat text-oc-yellow-ink">{s.value}</dd>
            <dt className="oc-label mt-2 text-oc-neutral-dark">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
