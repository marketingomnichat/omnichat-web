type FaqItem = { question: string; answer: string };

export function Faq({ title, items = [] }: { title?: string; items?: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[720px] px-6 py-14">
      <h2 className="oc-h2 mb-8">{title ?? "Perguntas frequentes"}</h2>
      <div className="flex flex-col divide-y divide-oc-divider">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="oc-h5 cursor-pointer list-none">{item.question}</summary>
            <p className="oc-body mt-3 text-oc-neutral-dark">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
