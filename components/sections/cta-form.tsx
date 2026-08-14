"use client";

import Image from "next/image";
import { useState } from "react";
import { buildHubSpotPayload, isSafeFormAction } from "@/lib/hubspot-form";

type FormField = {
  _key?: string;
  name: string;
  label: string;
  type?: "text" | "email" | "tel" | "select";
  options?: string[];
  required?: boolean;
};

type SectionImage = { imageUrl: string; alt: string };

type FormStatus = "idle" | "loading" | "success" | "error";

const SUCCESS_MESSAGE =
  "Recebemos seu contato. Em breve um especialista fala com você.";
const ERROR_MESSAGE = "Não foi possível enviar. Tente de novo.";

export function CtaForm({
  overline,
  title,
  body,
  formAction,
  buttonLabel,
  fields = [],
  asideImage,
}: {
  overline?: string;
  title: string;
  body?: string;
  formAction: string;
  buttonLabel: string;
  fields?: FormField[];
  asideImage?: SectionImage;
}) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const safeAction = isSafeFormAction(formAction) ? formAction : undefined;
  const hasAsideImage = Boolean(asideImage?.imageUrl);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!safeAction || status === "loading") return;

    setStatus("loading");

    const form = event.currentTarget;
    const payload = buildHubSpotPayload(
      new FormData(form),
      window.location.href,
      document.title,
    );

    try {
      const response = await fetch(safeAction, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <section
      id="formulario"
      className="scroll-mt-28"
      style={{ background: "linear-gradient(32.58deg, #000000 66.85%, #21272A 108.34%)" }}
    >
      <div className="mx-auto max-w-oc-container px-6 py-oc-section">
        <div
          className={`grid items-center gap-10 ${hasAsideImage ? "md:grid-cols-2" : ""}`}
        >
          <div>
            {overline && (
              <p className="oc-overline text-oc-yellow-mass">{overline}</p>
            )}
            <h2 className="oc-h2 mt-3 text-white">{title}</h2>
            {body && (
              <p className="oc-body-lg mt-5 text-white">{body}</p>
            )}
            {status === "success" ? (
              <p className="oc-body-lg mt-10 text-white" role="status">
                {SUCCESS_MESSAGE}
              </p>
            ) : (
              <form
                action={safeAction}
                method="post"
                onSubmit={handleSubmit}
                className="mt-10 space-y-6"
              >
                {fields.map((field, i) => (
                  <div key={field._key ?? i} className="flex flex-col gap-1.5">
                    <label
                      htmlFor={`form-field-${field.name}`}
                      className="oc-body-sm font-medium text-white"
                    >
                      {field.label}
                      {field.required && (
                        <span className="ml-1 text-oc-yellow-mass" aria-hidden="true">*</span>
                      )}
                    </label>
                    {field.type === "select" ? (
                      <select
                        id={`form-field-${field.name}`}
                        name={field.name}
                        required={field.required}
                        disabled={status === "loading"}
                        className="rounded-oc-button border border-oc-divider bg-white px-4 py-3 text-oc-ink focus:border-oc-yellow-cta focus:outline-none focus:ring-2 focus:ring-oc-yellow-cta/30 disabled:opacity-60"
                        defaultValue=""
                      >
                        <option value="" disabled>
                          {field.label}
                        </option>
                        {(field.options ?? []).map((opt) => (
                          <option key={opt} value={opt}>
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={`form-field-${field.name}`}
                        name={field.name}
                        type={field.type ?? "text"}
                        required={field.required}
                        disabled={status === "loading"}
                        className="rounded-oc-button border border-oc-divider bg-white px-4 py-3 text-oc-ink placeholder:text-oc-neutral-dark focus:border-oc-yellow-cta focus:outline-none focus:ring-2 focus:ring-oc-yellow-cta/30 disabled:opacity-60"
                      />
                    )}
                  </div>
                ))}
                {status === "error" && (
                  <p className="oc-body-sm text-oc-yellow-mass" role="alert">
                    {ERROR_MESSAGE}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="oc-button-label mt-2 rounded-oc-button bg-oc-yellow-cta px-8 py-3 text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover active:bg-oc-yellow-press disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "Enviando…" : buttonLabel}
                </button>
              </form>
            )}
          </div>

          {hasAsideImage && asideImage && (
            <div>
              <Image
                src={asideImage.imageUrl}
                alt={asideImage.alt ?? ""}
                width={560}
                height={640}
                className="h-auto w-full rounded-lg object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
