import Image from "next/image";

// Seção pricing do template Daevnt (node 207:161) — grid fluido responsivo.

const SYMPLA_URL = "https://www.sympla.com.br/evento/omnichat-connection/3445039";

const FEATURES = [
  "Acesso ao auditório e keynotes",
  "Centro de exposição e demos",
  "Alimentação completa no dia",
  "Kit de boas-vindas do evento",
] as const;

const PLANS = [
  {
    nodeId: "207:66",
    lote: "1º Lote · Pré-venda",
    price: "Encerrado",
    note: "Pré-venda finalizada",
    cta: "Lote encerrado",
    href: null,
    highlight: false,
    closed: true,
  },
  {
    nodeId: "207:111",
    lote: "2º Lote",
    price: "R$ 619,90",
    note: "Em até 12x na Sympla",
    cta: "Comprar agora",
    href: SYMPLA_URL,
    highlight: true,
    closed: false,
  },
  {
    nodeId: "207:89",
    lote: "3º Lote",
    price: "Em breve",
    note: "Em até 12x na Sympla",
    cta: "Aguardando abertura",
    href: null,
    highlight: false,
    closed: false,
  },
] as const;

export function ConnectionPricing() {
  return (
    <section id="ingresso" className="relative w-full scroll-mt-[100px] pb-16 lg:pb-[150px]" data-node-id="207:161">
      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-[60px] 2xl:px-[300px]">
        {/* Título */}
        <div data-node-id="215:4">
          <h2
            className="text-center text-[clamp(40px,4.2vw,80px)] font-black tracking-[-0.02em] leading-none text-white"
            data-node-id="207:159"
          >
            <span className="lp-italic">Ingresso</span>
          </h2>
          <p
            className="mx-auto mt-6 max-w-[692.985px] text-center text-[18px] font-normal leading-[1.5] text-[#d4d4d4] lg:mt-[34px] lg:text-[20px]"
            data-node-id="215:3"
          >
            Vagas limitadas e lotes progressivos: a pré-venda termina quando o lote esgota. Quem garante antes paga menos
            e tem prioridade nas demos e nas mesas de networking
          </p>
        </div>

        {/* Planos */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:mt-[90px] lg:gap-[30px] xl:grid-cols-3">
          {PLANS.map((plan) => (
            <div
              key={plan.nodeId}
              className="relative flex w-full max-w-[420px] flex-col items-center overflow-hidden rounded-[16px] px-8 py-14 justify-self-center text-center md:last:col-span-2 md:last:justify-self-center lg:py-[62px] xl:last:col-span-1"
              data-node-id={plan.nodeId}
            >
              {/* Fundo do card */}
              {plan.highlight ? (
                <div className="absolute inset-0 bg-(--lp-accent)" data-node-id="207:112" />
              ) : (
                <div className="absolute inset-0 bg-white opacity-[0.06]" />
              )}

              <div
                className={`relative ${plan.highlight ? "text-(--lp-ink-on-accent)" : "text-white"} ${
                  plan.closed ? "opacity-60" : ""
                }`}
              >
                <p className="whitespace-nowrap text-[22px] font-bold leading-[1.1] lg:text-[24px]">{plan.lote}</p>
                <p className="mt-[12px] whitespace-nowrap text-[clamp(38px,2.7vw,50px)] font-black tracking-[-0.02em] leading-[1.1]">
                  {plan.price}
                </p>
                <div className="mt-[20px] flex items-center justify-center gap-[10px]">
                  <p className="whitespace-nowrap text-[18px] font-normal leading-[1.1]">{plan.note}</p>
                  {!plan.closed ? (
                    <Image
                      src={plan.highlight ? "/connection/pricing-down-arrow-ink.svg" : "/connection/pricing-down-arrow.svg"}
                      alt=""
                      width={14.667}
                      height={8}
                    />
                  ) : null}
                </div>

                <ul className="mt-[35px] flex flex-col items-start gap-[8px] text-left">
                  {FEATURES.map((feature) => (
                    <li key={feature} className="flex items-center gap-[10px]">
                      <Image
                        src={plan.highlight ? "/connection/pricing-check-ink.svg" : "/connection/pricing-check-accent.svg"}
                        alt=""
                        width={14.03}
                        height={13.677}
                        className="shrink-0"
                      />
                      <span className="text-[16px] font-normal leading-[1.6]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.href ? (
                  <a
                    href={plan.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`mt-[45px] flex items-center justify-center rounded-[8px] px-[30px] py-[21px] text-[15px] font-bold tracking-[0.08em] uppercase leading-[1.1] sm:px-[40px] sm:text-[16px] ${
                      plan.highlight ? "bg-(--lp-purple) text-white" : "border border-solid border-white text-white"
                    }`}
                  >
                    {plan.cta}
                  </a>
                ) : (
                  <p
                    className={`mt-[45px] flex items-center justify-center rounded-[8px] border border-solid px-[30px] py-[21px] text-[15px] font-bold tracking-[0.08em] uppercase leading-[1.1] sm:px-[40px] sm:text-[16px] ${
                      plan.closed ? "border-white/50 text-white/70" : "border-white text-white"
                    }`}
                  >
                    {plan.cta}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
