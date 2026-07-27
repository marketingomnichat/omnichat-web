export function Stats({ items = [] }: { items?: { value: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label}>
            <dd className="oc-h3-stat text-oc-yellow-ink">{s.value}</dd>
            <dt className="oc-label mt-1 text-oc-neutral-dark">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
