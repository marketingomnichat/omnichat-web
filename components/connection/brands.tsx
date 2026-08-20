import Image from "next/image";

// Seção de patrocinadores e apoiadores — faixa amarela fluida.
// Por enquanto apenas Meta e Google (versões monocromáticas em tinta sobre amarelo).
const SPONSORS = [
  {
    name: "Meta",
    src: "/connection/logo-meta-ink.svg",
    width: 948,
    height: 191,
    className: "h-[44px] w-auto sm:h-[56px] lg:h-[68px]",
  },
  {
    name: "Google",
    src: "/connection/logo-google-ink.svg",
    width: 272,
    height: 92,
    className: "h-[48px] w-auto sm:h-[62px] lg:h-[76px]",
  },
] as const;

export function ConnectionBrands() {
  return (
    <section className="relative w-full pb-16 lg:pb-[150px]" data-node-id="198:632">
      {/* Faixa amarela */}
      <div className="w-full bg-(--lp-accent) py-12 lg:py-[104px]" data-node-id="178:30">
        <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-[60px] 2xl:px-[100px]">
          {/* Título */}
          <p
            className="text-center text-[clamp(22px,2.2vw,42px)] font-black tracking-[-0.02em] leading-[1.1] text-(--lp-ink-on-accent)"
            data-node-id="92:11"
          >
            Patrocinadores & Apoiadores
          </p>

          {/* Logos */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-20 gap-y-10 lg:mt-[95px] lg:gap-x-[220px]">
            {SPONSORS.map((sponsor) => (
              <Image
                key={sponsor.name}
                src={sponsor.src}
                alt={sponsor.name}
                width={sponsor.width}
                height={sponsor.height}
                className={sponsor.className}
              />
            ))}
          </div>

          {/* CTA de patrocínio */}
          <p className="mt-12 text-center text-[18px] font-bold leading-[1.4] text-(--lp-ink-on-accent) lg:mt-[80px] lg:text-[22px]">
            Apareça aqui entre os grandes,{" "}
            <a href="#patrocinio" className="underline [text-underline-position:from-font]">
              patrocine o Connection
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
