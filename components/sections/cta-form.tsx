"use client";

type FormField = {
  _key?: string;
  name: string;
  label: string;
  type?: "text" | "email" | "tel";
  required?: boolean;
};

export function CtaForm({
  overline,
  title,
  body,
  formAction,
  buttonLabel,
  fields = [],
}: {
  overline?: string;
  title: string;
  body?: string;
  formAction: string;
  buttonLabel: string;
  fields?: FormField[];
}) {
  return (
    <section className="bg-oc-surface">
      <div className="mx-auto max-w-[768px] px-6 py-24">
        {overline && (
          <p className="oc-overline text-oc-yellow-ink">{overline}</p>
        )}
        <h2 className="oc-h2 mt-3 text-oc-ink">{title}</h2>
        {body && (
          <p className="oc-body-lg mt-5 text-oc-neutral-dark">{body}</p>
        )}
        <form
          // Mesma regra do validador do schema — https:// ou path de barra única;
          // protege contra doc gravado fora do Studio (API) com action maliciosa.
          action={/^(https:\/\/|\/(?!\/))/.test(formAction) ? formAction : undefined}
          method="post"
          className="mt-10 space-y-6"
        >
          {fields.map((field, i) => (
            <div key={field._key ?? i} className="flex flex-col gap-1.5">
              <label
                htmlFor={`form-field-${field.name}`}
                className="oc-body-sm font-medium text-oc-ink"
              >
                {field.label}
                {field.required && (
                  <span className="ml-1 text-oc-yellow-ink" aria-hidden="true">*</span>
                )}
              </label>
              <input
                id={`form-field-${field.name}`}
                name={field.name}
                type={field.type ?? "text"}
                required={field.required}
                className="rounded-oc-button border border-oc-divider bg-white px-4 py-3 text-oc-ink placeholder:text-oc-neutral-dark focus:border-oc-yellow-cta focus:outline-none focus:ring-2 focus:ring-oc-yellow-cta/30"
              />
            </div>
          ))}
          <button
            type="submit"
            className="oc-button-label mt-2 rounded-oc-button bg-oc-yellow-cta px-8 py-3 text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover active:bg-oc-yellow-press"
          >
            {buttonLabel}
          </button>
        </form>
      </div>
    </section>
  );
}
