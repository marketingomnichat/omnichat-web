"use client";

import { useState } from "react";
import { MediaPlaceholder } from "./media-placeholder";

/**
 * Accordion ClickUp-identical: H2 gradiente + lista expandível à esquerda +
 * mídia com borda “gradiente” à direita.
 */
const ITEMS = [
  {
    id: "whizz",
    title: "Venda com o Whizz Agent",
    body: "Treinado com catálogo, regras comerciais e tom de voz da marca. Qualifica leads, recomenda produtos e conduz a conversa até a compra no WhatsApp.",
    chips: ["Catálogo", "Regras", "Checkout"],
    mediaLabel: "Placeholder — Whizz Agent",
  },
  {
    id: "visibility",
    title: "Visibilidade da jornada",
    body: "Acompanhe funil, conversão e ROAS das campanhas no WhatsApp em um só lugar. Decisões com dados da conversa.",
    chips: ["Funil", "ROAS", "Relatórios"],
    mediaLabel: "Placeholder — painel de resultados",
  },
  {
    id: "copilot",
    title: "Escale o time com Copilot",
    body: "Sugestões de resposta, resumo de conversa, busca de produto por imagem e transcrição de áudio. O Copilot vende com o seu time.",
    chips: ["Sugestão", "Resumo", "Áudio"],
    mediaLabel: "Placeholder — Whizz Copilot",
  },
] as const;

export function FeatureAccordion() {
  const [activeId, setActiveId] = useState<(typeof ITEMS)[number]["id"]>("whizz");
  const active = ITEMS.find((i) => i.id === activeId) ?? ITEMS[0];

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-280 px-6 pb-20 pt-25">
        <div className="mx-auto mb-8 max-w-112.5 text-center">
          <h2 className="text-[47px] leading-15 font-black tracking-[-0.5px] text-oc-yellow-ink">
            Venda mais com
            <br />
            menos esforço
          </h2>
          <p className="mt-3.5 text-[20px] leading-6.75 text-oc-ink">
            Orquestre marketing, vendas e relacionamento no WhatsApp, com IA que conhece o seu
            negócio.
          </p>
        </div>

        <div className="grid min-h-[725px] items-center gap-10 lg:grid-cols-[510px_1fr]">
          <div className="relative z-10 py-12">
            {ITEMS.map((item) => {
              const open = item.id === activeId;
              return (
                <div key={item.id} className={open ? "mb-6" : "mb-1"}>
                  <button
                    type="button"
                    onClick={() => setActiveId(item.id)}
                    className="w-full py-3 text-left"
                    aria-expanded={open}
                  >
                    <h3
                      className={`text-[36px] leading-[46px] font-black transition-colors duration-200 ${open ? "text-oc-yellow-ink" : "text-oc-neutral/70 hover:text-oc-neutral-dark"}`}
                    >
                      {item.title}
                    </h3>
                  </button>
                  {open && (
                    <div className="mt-1 animate-oc-enter-up">
                      <p className="max-w-125 text-[16px] leading-6 font-bold text-oc-ink">
                        {item.body.split(". ")[0]}.{" "}
                        <span className="font-normal">{item.body.split(". ").slice(1).join(". ")}</span>
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        {item.chips.map((chip) => (
                          <span
                            key={chip}
                            className="rounded-lg border border-oc-divider bg-white/20 px-3 py-1.5 text-[16px] text-oc-ink"
                          >
                            {chip}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="relative min-h-[585px] lg:w-[510px]">
            <div className="absolute -right-[367px] top-3 h-[562px] w-[840px] rounded-[14px] bg-oc-yellow-mass shadow-oc-md" aria-hidden />
            <div className="absolute left-[61px] top-8 h-[574px] w-[862px] overflow-hidden rounded-[14px] bg-white shadow-oc-panel">
              <MediaPlaceholder label={active.mediaLabel} aspectClass="h-full" className="rounded-[14px]" />
            </div>
            <div className="absolute left-[-94px] top-[144px] z-10 h-[379px] w-[352px] overflow-hidden rounded-[14px] bg-white p-4 shadow-oc-lg">
              <div className="flex h-full flex-col rounded-[10px] bg-oc-surface-alt p-5">
                <div className="flex items-center gap-3"><span className="flex size-10 items-center justify-center rounded-lg bg-oc-yellow-mass text-oc-ink"><i className="ri-whatsapp-line text-[22px]" /></span><div><p className="text-[12px] text-oc-ink-muted">Conversa ativa</p><p className="text-[14px] font-bold text-oc-ink">Cliente OmniChat</p></div></div>
                <div className="mt-5 rounded-[9px] bg-white p-4 text-[12px] leading-5 text-oc-ink">Olá. Quero encontrar o melhor produto para minha necessidade.</div>
                <div className="mt-3 self-end rounded-[9px] bg-oc-yellow-mass p-4 text-[12px] leading-5 text-oc-ink">Posso ajudar. Separei opções com base no seu perfil.</div>
                <div className="mt-auto flex items-center gap-2 rounded-lg bg-white px-3 py-2 text-[11px] text-oc-ink-muted">Digite sua mensagem <i className="ri-send-plane-fill ml-auto text-oc-yellow-ink" /></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
