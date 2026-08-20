"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

// Seção "feature tab" do template Daevnt (node 200:687) — layout fluido responsivo.
// O Figma só traz o estado da aba "ABOUT EXPO"; as demais derivam do mesmo layout com copy baseado no rótulo.
const TABS = [
  {
    id: "marketing",
    label: "MARKETING",
    eyebrow: "Trilha 01 · Atrair e qualificar",
    headingLarge: "Campanhas ",
    headingSmall: "que viram conversas qualificadas.",
    body: "Sem perda de intenção e com contexto para o lead avançar. Como a IA acelera o funil desde o clique no anúncio até a conversa no WhatsApp.",
  },
  {
    id: "vendas",
    label: "VENDAS",
    eyebrow: "Trilha 02 · Converter e fechar",
    headingLarge: "Negociação ",
    headingSmall: "e fechamento onde a conversa começou.",
    body: "Negociação, carrinho e fechamento no mesmo lugar onde a conversa começou. Como o WhatsApp virou infraestrutura de receita.",
  },
  {
    id: "pos-venda",
    label: "PÓS-VENDA",
    eyebrow: "Trilha 03 · Reter e expandir",
    headingLarge: "Menos carga ",
    headingSmall: "operacional, mais presença.",
    body: "Como a IA transforma suporte reativo em relacionamento ativo e incentiva a recompra. Do primeiro \u201coi\u201d à recompra.",
  },
] as const;

// Duração de exibição de cada aba antes de avançar automaticamente.
const TAB_DURATION = 6000;

export function ConnectionFeatureTab() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const pausedRef = useRef(false);
  const tab = TABS[active];

  // Auto-rotate com indicador de progresso dentro do botão ativo.
  useEffect(() => {
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    let raf = 0;
    let elapsed = 0;
    let last = performance.now();

    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      if (!pausedRef.current) {
        elapsed += dt;
        if (elapsed >= TAB_DURATION) {
          setProgress(0);
          setActive((a) => (a + 1) % TABS.length);
          return;
        }
        setProgress(elapsed / TAB_DURATION);
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active]);

  return (
    <section className="relative w-full pb-16 lg:pb-[150px]" data-node-id="200:687">
      <div className="relative overflow-hidden" data-node-id="214:176">
        {/* Fundo azul + gradiente em hard-light (node 214:176) */}
        <div className="absolute inset-0 bg-[#16181d]" data-node-id="174:29" />
        <div className="absolute inset-0 overflow-hidden" data-node-id="214:172">
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-50 mix-blend-hard-light">
            <Image
              src="/connection/feature-tab-bg-gradient.jpg"
              alt=""
              width={4096}
              height={2731}
              className="absolute left-[-13.91%] top-[-21.09%] h-[142.18%] w-[113.91%] max-w-none"
            />
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-[1920px] px-5 pb-16 pt-12 sm:px-8 lg:px-[60px] lg:pb-[120px] lg:pt-[97.87px] 2xl:px-[160px]">
          {/* Lista de abas (node 174:17) */}
          <div
            role="tablist"
            aria-label="Trilhas do evento"
            className="flex flex-wrap gap-x-10 gap-y-4 lg:justify-center lg:gap-x-[60px]"
            data-node-id="174:17"
            onMouseEnter={() => {
              pausedRef.current = true;
            }}
            onMouseLeave={() => {
              pausedRef.current = false;
            }}
          >
            {TABS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                role="tab"
                id={`connection-tab-${t.id}`}
                aria-selected={active === i}
                aria-controls={`connection-tabpanel-${t.id}`}
                onClick={() => {
                  setProgress(0);
                  setActive(i);
                }}
                className={`flex flex-col items-stretch gap-[10px] whitespace-nowrap pb-[2px] text-[14px] font-bold tracking-[0.08em] uppercase leading-[1.1] transition-colors sm:text-[16px] ${
                  active === i ? "text-(--lp-accent)" : "text-white hover:text-(--lp-secondary)"
                }`}
              >
                <span>{t.label}</span>
                {/* Linha de progresso do auto-rotate — mesma temática de carregamento */}
                <span aria-hidden className="relative h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                  {active === i ? (
                    <span
                      className="absolute inset-y-0 left-0 rounded-full bg-(--lp-accent)"
                      style={{ width: `${progress * 100}%` }}
                    />
                  ) : null}
                </span>
              </button>
            ))}
          </div>

          {/* Conteúdo da aba (node 174:8) — layout original, sem a imagem */}
          <div
            role="tabpanel"
            id={`connection-tabpanel-${tab.id}`}
            aria-labelledby={`connection-tab-${tab.id}`}
            className="mt-12 lg:mt-[100px]"
            data-node-id="174:8"
          >
            <div className="max-w-[757px]" data-node-id="174:7">
              <p className="text-white [word-break:break-word]" data-node-id="138:132">
                <span className="text-[20px] font-normal leading-[1.1] lg:text-[24px]">{tab.eyebrow}</span>
                <br />
                <span className="lp-italic text-[clamp(40px,4.2vw,80px)] font-black tracking-[-0.02em] leading-none">
                  {tab.headingLarge}
                </span>
                <span className="text-[clamp(30px,3.2vw,60px)] font-black tracking-[-0.02em] leading-[1.15]">
                  {tab.headingSmall}
                </span>
              </p>
              <p
                className="mt-8 max-w-[651.544px] text-[18px] font-normal leading-[1.5] text-[#d4d4d4] [word-break:break-word] lg:mt-[50px] lg:text-[20px]"
                data-node-id="169:4"
              >
                {tab.body}
              </p>
              <a
                href="#"
                className="mt-10 inline-flex items-center justify-center gap-[5px] rounded-[8px] bg-(--lp-accent) px-[40px] py-[20px] lg:mt-[60px]"
                data-node-id="141:133"
              >
                <span className="whitespace-nowrap text-[16px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-(--lp-ink-on-accent)" data-node-id="141:134">
                  VER PROGRAMAÇÃO
                </span>
                <span className="flex size-[22px] items-center justify-center" data-node-id="234:25">
                  <Image src="/connection/feature-tab-arrow-right.svg" alt="" width={13} height={13} />
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
