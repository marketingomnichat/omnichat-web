import { StatCounter } from "@/components/connection/stat-counter";

const STATS = [
  {
    nodeId: "174:27",
    value: 10,
    prefix: "+",
    suffix: " anos",
    smallSuffix: undefined,
    label: "De chat-commerce no Brasil",
    caption: "Transformando conversa em receita",
  },
  {
    nodeId: "217:15",
    value: 500,
    prefix: "",
    suffix: "",
    smallSuffix: "+",
    label: "Marcas na plataforma",
    caption: "Operando jornadas conversacionais",
  },
  {
    nodeId: "217:19",
    value: 1,
    prefix: "+",
    suffix: " bi",
    smallSuffix: undefined,
    label: "Mensagens transacionadas",
    caption: "No último ano, na plataforma OmniChat",
  },
] as const;

// Seção about do template Daevnt (nodes 133:122 + 138:128 + 217:23) — layout fluido responsivo.
export function ConnectionAbout() {
  return (
    <section className="relative w-full overflow-hidden py-16 sm:py-20 lg:py-[150px]" data-node-id="133:122">
      <div className="relative mx-auto w-full max-w-[1920px] px-5 text-center sm:px-8 lg:px-[60px] 2xl:px-[300px]">
        {/* Cabeçalho da seção */}
        <p
          className="text-[14px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-(--lp-accent)"
          data-node-id="133:57"
        >
          Por que a OmniChat
        </p>
        <h2
          className="mx-auto mt-5 max-w-[900px] text-[clamp(32px,3.8vw,60px)] font-black tracking-[-0.02em] leading-[1.08] text-(--lp-white) [text-wrap:balance]"
          data-node-id="133:54"
        >
          {`Feito por quem transforma conversa em `}
          <span className="lp-italic text-(--lp-accent)">receita</span>
          {` há uma década.`}
        </h2>
        <p
          className="mx-auto mt-6 max-w-[720px] text-[17px] font-normal leading-[1.6] text-[#d4d4d4] lg:text-[20px]"
          data-node-id="133:56"
        >
          O Connection nasceu como encontro fechado — e a resposta do público o trouxe ao mercado. Um dia de
          conteúdo com quem está na vanguarda do chat commerce brasileiro e define esse mercado.
        </p>

        {/* CTAs */}
        <div className="mt-9 flex flex-wrap items-center justify-center gap-4 lg:mt-[45px]" data-node-id="133:121">
          <a href="#ingresso" className="lp-btn lp-btn-accent lp-btn-lg" data-node-id="133:58">
            Garantir ingresso
          </a>
          <a href="#patrocinio" className="lp-btn lp-btn-secondary lp-btn-lg">
            Quero patrocinar
          </a>
        </div>

        {/* Fun facts */}
        <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3 sm:gap-6 lg:mt-[160px] lg:gap-10" data-node-id="217:23">
          {STATS.map((stat) => (
            <div key={stat.nodeId} className="text-center" data-node-id={stat.nodeId}>
              <StatCounter
                value={stat.value}
                prefix={stat.prefix}
                suffix={stat.suffix}
                smallSuffix={stat.smallSuffix}
                className="text-[clamp(48px,4.2vw,80px)] font-black tracking-[-0.02em] leading-none"
                smallClassName="text-[clamp(32px,2.6vw,50px)] leading-[1.1]"
              />
              <p className="mt-4 text-[22px] font-bold leading-[1.1] text-(--lp-white) lg:mt-[10px] lg:text-[30px]">
                {stat.label}
              </p>
              <p className="mt-2 text-[16px] font-normal leading-[1.5] text-[#d4d4d4]">{stat.caption}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
