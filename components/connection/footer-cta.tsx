import Image from "next/image";

const SYMPLA_URL = "https://www.sympla.com.br/evento/omnichat-connection/3445039";

// Faixa CTA da LP antiga (lps-from-hubspot/connection.html, .footer-cta),
// posicionada após a seção de palestrantes.
export function ConnectionFooterCta() {
  return (
    <section
      className="relative w-full overflow-hidden bg-(--lp-accent) py-14 lg:py-[72px]"
      aria-labelledby="connection-footer-cta-heading"
      data-name="footer cta"
    >
      {/* Fundo — mesmo gradient da divisória pós-hero */}
      <Image
        src="/connection/connection-gradient-2026.svg"
        alt=""
        fill
        aria-hidden
        sizes="100vw"
        className="object-cover"
      />

      <div className="relative z-[1] mx-auto flex w-full max-w-[1920px] flex-wrap items-center justify-between gap-8 px-5 sm:px-8 lg:px-[60px] 2xl:px-[300px]">
        <div className="max-w-[640px]">
          <h2
            id="connection-footer-cta-heading"
            className="text-[clamp(24px,3vw,34px)] font-black tracking-[-0.02em] leading-[1.15] text-(--lp-ink-on-accent) [text-wrap:balance]"
          >
            17 de setembro. 250 vagas.
            <br aria-hidden />
            Preço do lote atual por tempo limitado.
          </h2>
          <p className="mt-3 text-[16px] font-normal leading-[1.5] text-(--lp-ink-on-accent) opacity-[0.78]">
            Welluci Gardens, São Paulo · pagamento em até 12x na Sympla.
          </p>
        </div>

        <a
          href={SYMPLA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="lp-btn lp-btn-dark lp-btn-lg uppercase tracking-[0.08em]"
        >
          Garantir ingresso agora
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            aria-hidden
            className="size-4 shrink-0"
          >
            <path d="M5 12h14M13 6l6 6-6 6" />
          </svg>
        </a>
      </div>
    </section>
  );
}
