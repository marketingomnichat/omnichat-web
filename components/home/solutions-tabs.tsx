"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { isSvgUrl } from "@/components/ui/image-utils";
import { MediaPlaceholder } from "./media-placeholder";
import { CLIENT_LOGOS } from "./client-logo-strip";

/**
 * Seção “Perfect fit for every team” — cards de tab 171×120 + painel conteúdo
 * com checklist, depoimento e CTA amarelo (no lugar do gradiente ClickUp).
 */
const TEAMS = [
  {
    id: "marketing",
    label: "Marketing",
    icon: "ri-megaphone-line",
    title: "Campanhas que conversam e convertem",
    description: "Segmente, dispare templates e meça ROAS no WhatsApp.",
    bullets: [
      "Segmentação por comportamento e CRM",
      "Templates e mensagens ativas",
      "Recuperação de carrinho sem depender de e-mail",
    ],
    features: [
      { icon: "ri-flow-chart", text: "Jornadas de campanha no WhatsApp" },
      { icon: "ri-file-list-3-line", text: "Templates, docs e listas no mesmo lugar" },
      { icon: "ri-bar-chart-box-line", text: "ROAS e funil por campanha" },
      { icon: "ri-dashboard-line", text: "Painéis e insights de conversa" },
    ],
    quote:
      "Com a OmniChat, recuperamos 29x mais vendas em carrinhos abandonados e aumentamos nossa taxa de conversão em 19%, tudo direto no WhatsApp.",
    logo: CLIENT_LOGOS[0],
  },
  {
    id: "vendas",
    label: "Vendas",
    icon: "ri-shopping-bag-3-line",
    title: "Contexto para o time fechar mais",
    description: "Histórico, catálogo e Copilot na mesma conversa.",
    bullets: [
      "Inbox unificado multi-loja",
      "Whizz Copilot assistivo",
      "Integrações VTEX, Shopify e Magento",
    ],
    features: [
      { icon: "ri-chat-3-line", text: "Inbox omnichannel com contexto" },
      { icon: "ri-sparkling-line", text: "Sugestões do Copilot em tempo real" },
      { icon: "ri-store-2-line", text: "Catálogo e estoque na conversa" },
      { icon: "ri-links-line", text: "Checkout e Pix no chat" },
    ],
    quote:
      "Saímos de um canal limitante e migramos para o WhatsApp com apoio da tecnologia OmniChat.",
    logo: CLIENT_LOGOS[1],
  },
  {
    id: "whizz",
    label: "Whizz",
    icon: "ri-robot-2-line",
    title: "IA com profundidade de negócio",
    description: "O Whizz Agent vende com catálogo, regras e tom de voz da marca.",
    bullets: [
      "Qualificação e recomendação autônomas",
      "Regras comerciais e tom de voz",
      "Handoff para o time quando precisar",
    ],
    features: [
      { icon: "ri-robot-2-line", text: "Whizz Agent autônomo" },
      { icon: "ri-book-open-line", text: "Base de conhecimento do negócio" },
      { icon: "ri-mic-line", text: "Áudio e imagem na conversa" },
      { icon: "ri-shield-check-line", text: "API Meta oficial e LGPD" },
    ],
    quote:
      "O Whizz tem o calor humano e o tom de voz da marca — essencial para vender mais.",
    logo: CLIENT_LOGOS[2],
  },
  {
    id: "relacionamento",
    label: "Relacionamento",
    icon: "ri-heart-3-line",
    title: "Relacionamento com escala",
    description: "Orquestre humano e IA no mesmo canal, sem perder o tom da marca.",
    bullets: [
      "Filas e regras por operação",
      "Whizz Agent quando fizer sentido",
      "Dados da conversa no CRM",
    ],
    features: [
      { icon: "ri-team-line", text: "Filas e times multi-loja" },
      { icon: "ri-history-line", text: "Histórico completo do cliente" },
      { icon: "ri-customer-service-2-line", text: "Handoff humano com contexto" },
      { icon: "ri-line-chart-line", text: "CSAT e produtividade" },
    ],
    quote:
      "A gente entendeu que não existe cliente físico ou digital. Existe o mesmo cliente em diferentes canais.",
    logo: CLIENT_LOGOS[3],
  },
  {
    id: "varejo",
    label: "Varejo",
    icon: "ri-store-2-line",
    title: "Feito para varejo e e-commerce",
    description: "Do anúncio ao pedido entregue, no WhatsApp.",
    bullets: [
      "Multi-loja e estoque em tempo real",
      "Campanhas e recuperação de carrinho",
      "Integrações nativas de e-commerce",
    ],
    features: [
      { icon: "ri-shopping-cart-line", text: "Carrinho e pedido no chat" },
      { icon: "ri-truck-line", text: "Status de entrega na conversa" },
      { icon: "ri-coupon-line", text: "Cupons e ofertas personalizadas" },
      { icon: "ri-building-line", text: "Operação multi-loja" },
    ],
    quote:
      "Com a OmniChat, conseguimos ampliar o horário e automatizar interações mantendo a experiência personalizada.",
    logo: CLIENT_LOGOS[4],
  },
] as const;

export function SolutionsTabs() {
  const [activeId, setActiveId] = useState<(typeof TEAMS)[number]["id"]>("marketing");
  const active = TEAMS.find((t) => t.id === activeId) ?? TEAMS[0];

  return (
    <section className="overflow-hidden bg-white">
      <div className="mx-auto max-w-280 px-6 py-25">
        <h2 className="text-center text-[47px] leading-15 font-black text-oc-yellow-ink">
          Encaixe certo para cada time
        </h2>
        <p className="mx-auto mt-3 max-w-120 text-center text-[20px] leading-6.75 font-bold text-oc-ink">
          Comece rápido com soluções prontas.
          <br />
          <span className="font-normal">Customize conforme a operação cresce.</span>
        </p>

        {/* Tab cards — mesma proporção ClickUp ~171×120 */}
        <div className="mt-10 flex flex-wrap justify-center gap-[19px] py-6">
          {TEAMS.map((team) => {
            const selected = team.id === activeId;
            return (
              <button
                key={team.id}
                type="button"
                onClick={() => setActiveId(team.id)}
                className={`relative flex h-30 w-[171px] flex-col items-center justify-center rounded-[14px] bg-white transition-colors duration-150 ${
                  selected
                    ? "shadow-oc-md text-oc-ink"
                    : "border border-oc-divider text-oc-neutral-dark hover:border-oc-input"
                }`}
              >
                {selected && <span className="absolute -inset-3 -z-10 rounded-[20px] bg-oc-yellow-mass/25 blur-xl" />}
                <i className={`${team.icon} text-[32px] ${selected ? "text-oc-yellow-ink" : ""}`} aria-hidden />
                <span className={`mt-2 text-[16px] ${selected ? "font-bold" : "font-medium"}`}>
                  {team.label}
                </span>
              </button>
            );
          })}
          <Link
            href="/planos"
            className="flex h-30 w-[169px] flex-col items-center justify-center rounded-[14px] border border-oc-divider bg-white text-[16px] font-medium leading-[25px] text-oc-neutral-dark hover:border-oc-input"
          >
            Ver todos
            <br />
            os times
          </Link>
        </div>

        {/* Content panel */}
        <div className="relative mt-2 overflow-hidden rounded-[14px] border border-oc-divider bg-white">
          <div className="grid lg:grid-cols-[1fr_459px]">
            <div className="p-[50px] pr-8">
              <h3 className="text-[20px] leading-[30px] font-extrabold text-oc-ink">{active.title}</h3>
              <p className="mt-2 max-w-[420px] text-[16px] leading-6 font-medium text-oc-ink">
                {active.description}
              </p>
              <ul className="mt-6 space-y-3">
                {active.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3 text-[16px] leading-5 font-medium text-oc-ink">
                    <i className="ri-checkbox-circle-fill mt-0.5 text-[19px] text-oc-success" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex items-start gap-4">
                <div className="size-[103px] shrink-0 overflow-hidden rounded-full bg-oc-surface-alt">
                  <MediaPlaceholder label="Foto" aspectClass="aspect-square" className="h-full w-full" />
                </div>
                <div className="pt-1">
                  <div className="flex items-center gap-3">
                    <div className="flex text-oc-yellow-ink" aria-label="5 estrelas">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <i key={i} className="ri-star-fill text-[14px]" aria-hidden />
                      ))}
                    </div>
                    <Image
                      src={active.logo.imageUrl}
                      alt={active.logo.name}
                      width={84}
                      height={16}
                      className="h-4 w-auto object-contain"
                      unoptimized={isSvgUrl(active.logo.imageUrl)}
                    />
                  </div>
                  <p className="mt-3 max-w-[420px] text-[16px] leading-[22px] text-oc-ink">
                    <span className="font-bold">&ldquo;{active.quote.split(".")[0]}.</span>
                    <span>{active.quote.includes(".") ? active.quote.slice(active.quote.indexOf(".") + 1) : ""}&rdquo;</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-oc-surface-alt p-9 lg:rounded-r-[14px]">
              <div className="overflow-hidden rounded-xl border border-oc-divider bg-white">
                {active.features.map((f, idx) => (
                  <div
                    key={f.text}
                    className={`flex items-center gap-3 px-[13px] py-[14px] ${
                      idx < active.features.length - 1 ? "border-b border-oc-divider" : ""
                    }`}
                  >
                    <span className="flex size-10 items-center justify-center rounded-lg bg-oc-surface-alt">
                      <i className={`${f.icon} text-[22px] text-oc-yellow-ink`} aria-hidden />
                    </span>
                    <span className="text-[16px] leading-6 text-oc-ink">{f.text}</span>
                  </div>
                ))}
              </div>
              <Link
                href="#formulario"
                className="relative mt-6 flex h-13 items-center justify-center gap-2 rounded-xl bg-oc-yellow-cta text-[16px] font-bold text-oc-ink shadow-oc-md transition-colors duration-150 hover:bg-oc-yellow-hover"
              >
                Usar esta solução
                <i className="ri-arrow-right-line" aria-hidden />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
