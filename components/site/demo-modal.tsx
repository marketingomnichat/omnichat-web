"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  buildHubSpotPayload,
  isSafeFormAction,
} from "@/lib/hubspot-form";

// Form HubSpot "MKT | SIte - Popup | Variante B" — mesmo destino do popup A/B
// do site WordPress (scripts/wp-demo-popup/). Campos = propriedades do CRM.
const FORM_ACTION =
  "https://api.hsforms.com/submissions/v3/integration/submit/20121735/0d0d61df-8014-4b0d-b2e9-aafb5f71a595";
const LOGO_URL =
  "https://storage.googleapis.com/omnichat-cdn-assets/logos/omnichat/colorida/omnichat.svg";

type FormStatus = "idle" | "loading" | "success" | "error";

const CASE_STUDIES = [
  {
    quote:
      "A jornada passou a conectar campanha, catálogo e vendedores no mesmo contexto. O time deixou de perder oportunidades entre canais e ganhou velocidade para fechar pedidos.",
    name: "Marina Costa",
    role: "Diretora de e-commerce",
    company: "Varejista nacional",
    initials: "MC",
    metric: "29x",
    result: "mais vendas recuperadas em um cenário ilustrativo.",
  },
  {
    quote:
      "Com o WhatsApp no centro da operação, a equipe passou a identificar intenção de compra e conduzir cada conversa com dados do cliente e disponibilidade de produto.",
    name: "Rafael Lima",
    role: "Gerente de vendas digitais",
    company: "Rede de casa e decoração",
    initials: "RL",
    metric: "3x",
    result: "mais conversões assistidas em um cenário ilustrativo.",
  },
  {
    quote:
      "O Whizz assumiu as conversas repetitivas e entregou ao vendedor apenas as oportunidades que precisavam de decisão humana, mantendo o tom de voz da marca.",
    name: "Camila Martins",
    role: "Head de relacionamento",
    company: "Grupo educacional",
    initials: "CM",
    metric: "60%",
    result: "menos tempo por conversa em um cenário ilustrativo.",
  },
] as const;

function CaseStudyPanel() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = CASE_STUDIES[activeIndex];

  const goTo = (index: number) => {
    setActiveIndex(
      (index + CASE_STUDIES.length) % CASE_STUDIES.length,
    );
  };

  return (
    <aside className="flex min-h-[640px] flex-col justify-between bg-oc-dark px-8 py-10 text-white md:px-10 lg:min-h-full lg:px-12 lg:py-14">
      <div>
        <Image
          src={LOGO_URL}
          alt="OmniChat"
          width={160}
          height={80}
          className="h-20 w-40 object-contain object-left"
          unoptimized
        />

        <div className="mt-6">
          <p className="oc-overline text-oc-yellow-mass">Case OmniChat</p>
          <h3 className="mt-2 text-[24px] leading-[30px] font-bold text-white">
            Resultado construído com conversas
          </h3>
          <p className="mt-2 text-[12px] font-medium text-oc-neutral">
            Cenário ilustrativo
          </p>
        </div>

        <blockquote className="mt-8 text-[18px] leading-[28px] text-white">
          &ldquo;{active.quote}&rdquo;
        </blockquote>

        <div className="mt-6 flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-oc-yellow-cta text-[14px] font-black text-oc-ink">
            {active.initials}
          </div>
          <div>
            <p className="text-[14px] leading-[20px] font-bold text-white">
              {active.name}
            </p>
            <p className="text-[13px] leading-[19px] text-oc-neutral">
              {active.role} · {active.company}
            </p>
          </div>
        </div>

        <div className="mt-8 flex items-start gap-3 rounded-[12px] bg-white/10 p-4">
          <i
            aria-hidden
            className="ri-arrow-up-line mt-0.5 text-[20px] text-oc-yellow-mass"
          />
          <p className="text-[14px] leading-[22px] text-white">
            <span className="font-black text-oc-yellow-mass">
              {active.metric}
            </span>{" "}
            {active.result}
          </p>
        </div>
      </div>

      <div className="mt-10 flex items-center justify-between gap-5">
        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Case anterior"
            onClick={() => goTo(activeIndex - 1)}
            className="flex size-10 items-center justify-center rounded-oc-button border border-white/30 text-white transition-colors duration-150 hover:bg-white/10"
          >
            <i aria-hidden className="ri-arrow-left-line text-[20px]" />
          </button>
          <button
            type="button"
            aria-label="Próximo case"
            onClick={() => goTo(activeIndex + 1)}
            className="flex size-10 items-center justify-center rounded-oc-button border border-white/30 text-white transition-colors duration-150 hover:bg-white/10"
          >
            <i aria-hidden className="ri-arrow-right-line text-[20px]" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {CASE_STUDIES.map((item, index) => (
            <button
              key={item.name}
              type="button"
              aria-label={`Ir para o case ${index + 1}`}
              aria-current={index === activeIndex}
              onClick={() => goTo(index)}
              className={`h-1.5 rounded-full transition-[width,background-color] duration-200 ${
                index === activeIndex
                  ? "w-5 bg-oc-yellow-cta"
                  : "w-1.5 bg-white/40"
              }`}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}

function DemoLeadForm({ onSuccess }: { onSuccess?: () => void }) {
  const [status, setStatus] = useState<FormStatus>("idle");
  const safeAction = isSafeFormAction(FORM_ACTION)
    ? FORM_ACTION
    : undefined;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!safeAction || status === "loading") return;

    const form = event.currentTarget;
    const formData = new FormData(form);
    if (formData.get("_hp_field")) return;

    const countryCode = String(formData.get("pais") ?? "");
    const phone = String(formData.get("phone") ?? "");
    formData.set("phone", `${countryCode} ${phone}`.trim());
    formData.delete("pais");

    setStatus("loading");

    try {
      const response = await fetch(safeAction, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          buildHubSpotPayload(
            formData,
            window.location.href,
            document.title,
          ),
        ),
      });

      if (!response.ok) {
        setStatus("error");
        return;
      }

      setStatus("success");
      form.reset();
      onSuccess?.();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div
        className="flex min-h-[520px] flex-col items-center justify-center px-8 py-16 text-center md:px-12"
        role="status"
      >
        <span className="flex size-14 items-center justify-center rounded-[12px] bg-oc-success-light text-oc-success-dark">
          <i aria-hidden className="ri-check-line text-[28px]" />
        </span>
        <h2
          id="demo-modal-title"
          className="mt-6 text-[32px] leading-[40px] font-bold text-oc-ink"
        >
          Recebemos seu contato
        </h2>
        <p className="mt-3 max-w-[430px] text-[16px] leading-[24px] text-oc-neutral-dark">
          Em breve, um especialista da OmniChat entrará em contato para
          entender sua operação.
        </p>
      </div>
    );
  }

  const inputClass =
    "h-12 w-full rounded-oc-button border border-oc-input bg-white px-4 text-[16px] text-oc-ink placeholder:text-oc-neutral-dark focus:border-oc-border-focus focus:outline-none focus:ring-2 focus:ring-oc-yellow-cta/30 disabled:opacity-60";
  const selectClass = `${inputClass} appearance-none pr-10`;

  return (
    <div className="bg-oc-surface-alt px-6 py-10 md:px-10 lg:px-12 lg:py-14">
      <div className="text-center">
        <h2
          id="demo-modal-title"
          className="text-[32px] leading-[40px] font-bold text-oc-ink"
        >
          Solicite sua demonstração
        </h2>
        <p className="mx-auto mt-2 max-w-[570px] text-[16px] leading-[24px] text-oc-neutral-dark">
          Preencha os campos para falar com um especialista e entender como
          a OmniChat pode transformar conversas em vendas no WhatsApp.
        </p>
      </div>

      <form
        action={safeAction}
        method="post"
        onSubmit={handleSubmit}
        className="mt-7 grid gap-3"
      >
        <div className="pointer-events-none absolute -left-[9999px] opacity-0">
          <label htmlFor="demo-honeypot">Não preencher</label>
          <input
            id="demo-honeypot"
            name="_hp_field"
            type="text"
            tabIndex={-1}
            autoComplete="new-password"
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="demo-nome">
            Nome completo
          </label>
          <input
            id="demo-nome"
            name="firstname"
            type="text"
            required
            autoComplete="name"
            placeholder="Nome completo"
            disabled={status === "loading"}
            className={inputClass}
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="demo-email">
            E-mail corporativo
          </label>
          <input
            id="demo-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="E-mail corporativo"
            disabled={status === "loading"}
            className={inputClass}
          />
        </div>

        <div>
          <label className="sr-only" htmlFor="demo-empresa">
            Empresa
          </label>
          <input
            id="demo-empresa"
            name="company"
            type="text"
            required
            autoComplete="organization"
            placeholder="Empresa"
            disabled={status === "loading"}
            className={inputClass}
          />
        </div>

        <div className="flex">
          <label className="sr-only" htmlFor="demo-pais">
            País
          </label>
          <div className="relative shrink-0">
            <select
              id="demo-pais"
              name="pais"
              aria-label="País"
              defaultValue="+55"
              disabled={status === "loading"}
              className="h-12 appearance-none rounded-l-oc-button border border-r-0 border-oc-input bg-white py-0 pr-8 pl-3 text-[14px] font-bold text-oc-ink focus:z-10 focus:border-oc-border-focus focus:outline-none focus:ring-2 focus:ring-oc-yellow-cta/30"
            >
              <option value="+55">BR +55</option>
              <option value="+351">PT +351</option>
              <option value="+1">US +1</option>
              <option value="+244">AO +244</option>
              <option value="+258">MZ +258</option>
            </select>
            <i
              aria-hidden
              className="ri-arrow-down-s-line pointer-events-none absolute top-1/2 right-2 -translate-y-1/2 text-[16px] text-oc-neutral-dark"
            />
          </div>
          <div className="min-w-0 flex-1">
            <label className="sr-only" htmlFor="demo-telefone">
              Telefone
            </label>
            <input
              id="demo-telefone"
              name="phone"
              type="tel"
              required
              autoComplete="tel"
              placeholder="Telefone"
              disabled={status === "loading"}
              className={`${inputClass} rounded-l-none`}
            />
          </div>
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="demo-cargo">
            Cargo
          </label>
          <select
            id="demo-cargo"
            name="cargo"
            required
            defaultValue=""
            disabled={status === "loading"}
            className={selectClass}
          >
            <option value="" disabled>
              Cargo
            </option>
            {/* valores = valores internos da propriedade "cargo" no CRM */}
            <option value="CEO">CEO</option>
            <option value="Sócio/Dono">Sócio/Dono</option>
            <option value="Diretor/VP">Diretor/VP</option>
            <option value="Gerente/Head">Gerente/Head</option>
            <option value="Coordenador/Supervisor">
              Coordenador/Supervisor
            </option>
            <option value="Analista">Analista</option>
            <option value="Outro">Outro</option>
          </select>
          <i
            aria-hidden
            className="ri-arrow-down-s-line pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[18px] text-oc-neutral-dark"
          />
        </div>

        <div className="relative">
          <label className="sr-only" htmlFor="demo-segmento">
            Segmento
          </label>
          <select
            id="demo-segmento"
            name="segmentorevisado"
            required
            defaultValue=""
            disabled={status === "loading"}
            className={selectClass}
          >
            <option value="" disabled>
              Segmento
            </option>
            {/* valores = valores internos de "segmentorevisado" no CRM */}
            <option value="Varejo">Varejo</option>
            <option value="Educação">Educação</option>
            <option value="Serviços">Serviços</option>
            <option value="Indústria">Indústria</option>
            <option value="Outros Segmento">Outros Segmentos</option>
          </select>
          <i
            aria-hidden
            className="ri-arrow-down-s-line pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-[18px] text-oc-neutral-dark"
          />
        </div>

        <fieldset className="rounded-oc-button border border-oc-input bg-white p-3">
          <legend className="px-1 text-[14px] font-medium text-oc-neutral-dark">
            Quantas pessoas vendem pelo WhatsApp?
          </legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Até 10", "11–50", "51–200", "201+"].map((option) => (
              <label key={option} className="cursor-pointer">
                <input
                  type="radio"
                  name="qual_o_nmero_de_atendentesvendedores_da_empesa"
                  value={option}
                  required
                  disabled={status === "loading"}
                  className="peer sr-only"
                />
                <span className="block rounded-oc-button border border-oc-divider px-3 py-1.5 text-[13px] font-medium text-oc-neutral-dark transition-colors peer-checked:border-oc-ink peer-checked:bg-oc-yellow-cta peer-checked:text-oc-ink">
                  {option}
                </span>
              </label>
            ))}
          </div>
        </fieldset>

        {status === "error" && (
          <p className="text-[14px] text-oc-danger" role="alert">
            Não foi possível enviar. Revise os dados e tente novamente.
          </p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="mt-1 h-12 w-full rounded-oc-button bg-oc-yellow-cta px-6 text-[16px] font-bold text-oc-ink transition-colors duration-150 hover:bg-oc-yellow-hover active:bg-oc-yellow-press disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading"
            ? "Enviando…"
            : "Solicitar demonstração"}
        </button>

        <p className="text-center text-[12px] leading-[18px] text-oc-neutral-dark">
          Ao enviar, você concorda com a{" "}
          <Link
            href="/politicas-de-privacidade/"
            className="underline underline-offset-2"
          >
            Política de Privacidade
          </Link>{" "}
          da OmniChat.
        </p>
      </form>
    </div>
  );
}

export function DemoModal() {
  const [open, setOpen] = useState(false);
  const openerRef = useRef<HTMLElement | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const close = useCallback(() => {
    setOpen(false);
    window.setTimeout(() => openerRef.current?.focus(), 0);
  }, []);

  useEffect(() => {
    const handleTrigger = (event: MouseEvent) => {
      if (!(event.target instanceof Element)) return;

      const trigger = event.target.closest<HTMLElement>(
        'a[href="#formulario"], [data-demo-modal-trigger]',
      );
      if (!trigger) return;

      event.preventDefault();
      openerRef.current = trigger;
      setOpen(true);
    };

    document.addEventListener("click", handleTrigger, true);

    const hashTimer = window.location.hash === "#formulario"
      ? window.setTimeout(() => setOpen(true), 0)
      : undefined;

    return () => {
      document.removeEventListener("click", handleTrigger, true);
      if (hashTimer !== undefined) window.clearTimeout(hashTimer);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusable = () =>
      Array.from(
        dialogRef.current?.querySelectorAll<HTMLElement>(
          'button:not([disabled]), a[href], input:not([disabled]):not([tabindex="-1"]), select:not([disabled])',
        ) ?? [],
      );

    window.setTimeout(() => focusable()[0]?.focus(), 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        return;
      }

      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;

      const first = elements[0];
      const last = elements[elements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(11,12,14,0.48)] p-3 backdrop-blur-sm md:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) close();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="demo-modal-title"
        className="relative max-h-[calc(100vh-24px)] w-full max-w-[1080px] overflow-y-auto rounded-oc-modal bg-white shadow-oc-lg md:max-h-[calc(100vh-48px)]"
      >
        <button
          type="button"
          aria-label="Fechar formulário"
          onClick={close}
          className="absolute top-4 right-4 z-10 flex size-10 items-center justify-center rounded-oc-button bg-white text-oc-ink shadow-oc-sm transition-colors duration-150 hover:bg-oc-surface-alt"
        >
          <i aria-hidden className="ri-close-line text-[22px]" />
        </button>

        <div className="grid lg:grid-cols-[minmax(0,1fr)_384px]">
          <DemoLeadForm />
          <CaseStudyPanel />
        </div>
      </div>
    </div>
  );
}
