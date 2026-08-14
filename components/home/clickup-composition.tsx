import Link from "next/link";
import { safeHref } from "@/lib/safe-href";
import type { HomeComposition } from "@/shared/types";
import { ClientLogoStrip, CLIENT_LOGOS } from "./client-logo-strip";
import { CasesCarousel } from "./home-interactions";
import { CommercialStoryStack } from "./commercial-story-stack";
import { ProductTabs } from "./product-tabs";
import { WhizzFinalCallout, WhizzHomeSection, WhizzProofHeading } from "@/components/whizz/whizz-switcher";

const FALLBACK: Required<HomeComposition> = {
  hero: {
    title: "Venda no WhatsApp com IA do seu negócio",
    description: "Conecte marketing, vendedores e dados para transformar cada conversa em uma oportunidade de venda.",
    cta: { label: "Agendar uma demonstração", href: "#formulario" },
    proof: "API Meta oficial · LGPD · Operação multi-loja",
    tabs: [
      { id: "whizz-agent", label: "Whizz Agent", description: "Whizz Agent conduzindo uma venda no WhatsApp" },
      { id: "copilot", label: "Copilot", description: "Whizz Copilot apoiando um vendedor" },
      { id: "marketing-vendas", label: "Marketing e vendas", description: "Jornada comercial conectada na OmniChat" },
    ],
  },
  logos: { title: "Mais de 500 marcas confiam na OmniChat para vender no WhatsApp.", items: CLIENT_LOGOS.map((logo) => ({ name: logo.name, image: { url: logo.imageUrl, alt: logo.name, width: 176, height: 56 } })) },
  journey: { title: "Uma jornada de vendas. Todo o contexto.", text: "A OmniChat conecta marketing, vendas e relacionamento no WhatsApp para acompanhar o cliente do anúncio ao pedido entregue.", steps: ["Anúncio", "Conversa", "Recomendação", "Checkout", "Pós-venda"] },
  whizz: {
    title: "IA com profundidade do seu negócio",
    text: "O Whizz combina catálogo, regras comerciais e tom de voz para vender de forma autônoma ou ampliar a capacidade do seu time.",
    items: [
      { label: "Whizz Agent", title: "O Whizz Agent vende por você", text: "Qualifica conversas, recomenda produtos, recupera carrinhos e conduz o cliente até o checkout, 24 horas por dia.", benefits: ["Catálogo e regras comerciais", "Recomendação de produtos", "Qualificação e checkout"] },
      { label: "Whizz Copilot", title: "O Copilot vende com você", text: "Sugere respostas, resume conversas, ajusta o tom de voz e ajuda vendedores a avançar cada oportunidade.", benefits: ["Respostas e resumos", "Busca de produto por imagem", "Transcrição de áudio"] },
    ],
  },
  stories: {
    title: "A jornada comercial no mesmo canal",
    items: [
      { overline: "Marketing", title: "Campanhas que mantêm a conversa ativa", text: "Ative sua base com mensagens relevantes e acompanhe o resultado de cada campanha.", benefits: ["Segmentação por comportamento e CRM", "Recuperação de carrinho", "Conversão e ROAS por campanha"] },
      { overline: "Vendas", title: "Contexto para o time fechar mais", text: "Reúna produtos, histórico e meios de pagamento para reduzir o atrito na decisão de compra.", benefits: ["Inbox unificado", "Catálogo e estoque", "Checkout e Pix na conversa"] },
      { overline: "Pós-venda", title: "Pós-venda que antecipa e fideliza", text: "Mantenha o histórico acessível e conduza cada demanda para a melhor resolução.", benefits: ["Acompanhamento de pedidos", "Demandas recorrentes", "Transferência com todo o histórico"] },
    ],
  },
  proof: {
    title: "Resultados associados a histórias reais",
    text: "Cases e métricas com fonte clara para apoiar decisões comerciais.",
    cases: [
      { company: "Hering", quote: "Com a OmniChat, recuperamos 29x mais vendas em carrinhos abandonados e aumentamos nossa taxa de conversão em 19%.", sourceLabel: "Case Hering", sourceUrl: "https://omni.chat/blog/hering-da-tradicao-a-recuperacao-de-carrinhos-com-inteligencia-artificial/" },
      { company: "Kappesberg", quote: "Ampliamos nosso horário de vendas e mantivemos uma experiência personalizada nas conversas.", sourceLabel: "Case Kappesberg", sourceUrl: "https://omni.chat/blog/como-a-kappesberg-aumentou-em-150-sua-conversao/" },
      { company: "iPlace", quote: "Migramos para o principal canal do brasileiro, o WhatsApp, com apoio da tecnologia OmniChat.", sourceLabel: "Talk iPlace", sourceUrl: "https://lp.omni.chat/talks-iplace-2024" },
    ],
    metrics: [
      { value: "29x", label: "mais vendas recuperadas em carrinhos abandonados", source: "Hering", sourceUrl: "https://omni.chat/blog/hering-da-tradicao-a-recuperacao-de-carrinhos-com-inteligencia-artificial/" },
      { value: "19%", label: "de aumento na taxa de conversão", source: "Hering", sourceUrl: "https://omni.chat/blog/hering-da-tradicao-a-recuperacao-de-carrinhos-com-inteligencia-artificial/" },
      { value: "150%", label: "de aumento em conversão", source: "Kappesberg", sourceUrl: "https://omni.chat/blog/como-a-kappesberg-aumentou-em-150-sua-conversao/" },
    ],
  },
  integrations: {
    title: "Integrações para uma operação conectada",
    text: "Infraestrutura oficial, dados do negócio e regras comerciais trabalhando na mesma jornada.",
    items: [
      { label: "Meta + LGPD", detail: "API oficial do WhatsApp e operação aderente à LGPD." }, { label: "VTEX", detail: "Catálogo, estoque e pedidos conectados à conversa." },
      { label: "Shopify", detail: "Dados da loja disponíveis na jornada comercial." }, { label: "Magento", detail: "Integração com a operação de e-commerce." },
      { label: "Wake", detail: "Commerce conectado às vendas conversacionais." }, { label: "RD Station", detail: "Segmentos e dados de marketing conectados." },
      { label: "Salesforce", detail: "Contexto de CRM disponível para a operação." }, { label: "Filas e lojas", detail: "Roteamento por lojas, filas e regras comerciais." },
    ],
  },
  finalCta: { title: "Transforme conversas em vendas no WhatsApp", text: "Veja como a OmniChat conecta IA, vendedores e dados do seu negócio em uma jornada comercial completa.", primary: { label: "Agendar uma demonstração", href: "#formulario" }, secondary: { label: "Conhecer os planos", href: "/planos" } },
};

function mergeContent(content?: HomeComposition): Required<HomeComposition> {
  return {
    hero: { ...FALLBACK.hero, ...content?.hero, tabs: content?.hero?.tabs?.length === 3 ? content.hero.tabs : FALLBACK.hero.tabs },
    logos: { ...FALLBACK.logos, ...content?.logos, items: content?.logos?.items?.length ? content.logos.items : FALLBACK.logos.items },
    journey: { ...FALLBACK.journey, ...content?.journey, steps: content?.journey?.steps?.length ? content.journey.steps : FALLBACK.journey.steps },
    whizz: { ...FALLBACK.whizz, ...content?.whizz, items: content?.whizz?.items?.length === 2 ? content.whizz.items : FALLBACK.whizz.items },
    stories: { ...FALLBACK.stories, ...content?.stories, items: content?.stories?.items?.length === 3 ? content.stories.items : FALLBACK.stories.items },
    proof: { ...FALLBACK.proof, ...content?.proof, cases: content?.proof?.cases?.length === 3 ? content.proof.cases : FALLBACK.proof.cases, metrics: content?.proof?.metrics?.length === 3 ? content.proof.metrics : FALLBACK.proof.metrics },
    integrations: { ...FALLBACK.integrations, ...content?.integrations, items: content?.integrations?.items?.length ? content.integrations.items : FALLBACK.integrations.items },
    finalCta: { ...FALLBACK.finalCta, ...content?.finalCta },
  };
}

export function ClickupCompositionHome({ content }: { content?: HomeComposition }) {
  const home = mergeContent(content);
  return (
    <main className="bg-white">
      {/* Header fixo tem 101px — o padding compensa para o H1 não ficar encoberto. */}
      <section className="pb-20 pt-[140px] md:pt-[160px]" aria-labelledby="home-hero-title">
        <div className="mx-auto max-w-[820px] px-6 text-center"><h1 id="home-hero-title" className="text-[46px] leading-[1.06] font-black tracking-[-1.5px] text-oc-dark sm:text-[64px]">{home.hero.title}</h1><p className="mx-auto mt-5 max-w-[650px] text-[19px] leading-7 text-oc-ink">{home.hero.description}</p><Link href={safeHref(home.hero.cta?.href)} data-demo-modal-trigger={home.hero.cta?.href === "#formulario" || undefined} className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-oc-button bg-oc-yellow-cta px-7 text-[16px] font-bold text-oc-ink transition-colors duration-150 hover:bg-oc-yellow-hover">{home.hero.cta?.label}<i className="ri-arrow-right-line" aria-hidden /></Link><p className="mt-4 text-[14px] font-medium text-oc-neutral-dark"><i className="ri-shield-check-line mr-2" aria-hidden />{home.hero.proof}</p></div>
        <div className="mt-14"><ProductTabs tabs={home.hero.tabs ?? []} /></div>
      </section>
      <ClientLogoStrip title={home.logos.title} logos={home.logos.items} />
      <section className="bg-white py-24" aria-labelledby="journey-title"><div className="mx-auto max-w-[1080px] px-6 text-center"><h2 id="journey-title" className="text-[38px] leading-tight font-black text-oc-dark md:text-[48px]">{home.journey.title}</h2><p className="mx-auto mt-5 max-w-[700px] text-[18px] leading-7 text-oc-ink">{home.journey.text}</p><ol className="mt-10 flex snap-x snap-mandatory items-center gap-3 overflow-x-auto pb-3 md:justify-center md:overflow-visible">{home.journey.steps?.map((step, index) => <li key={step} className="flex shrink-0 snap-center items-center gap-3"><span className="rounded-[8px] bg-oc-surface-alt px-4 py-3 text-[14px] font-bold text-oc-ink">{step}</span>{index < (home.journey.steps?.length ?? 0) - 1 && <i className="ri-arrow-right-line text-oc-yellow-ink" aria-hidden />}</li>)}</ol></div></section>
      <WhizzHomeSection title={home.whizz.title} text={home.whizz.text} items={home.whizz.items ?? []} />
      <CommercialStoryStack title={home.stories.title} items={home.stories.items ?? []} />
      <section className="bg-oc-surface-alt py-24 md:py-40" aria-labelledby="proof-title"><div className="mx-auto max-w-[1200px] px-6"><WhizzProofHeading title={home.proof.title} text={home.proof.text} /><div className="mt-16"><CasesCarousel cases={home.proof.cases ?? []} /></div><dl className="mt-14 grid gap-8 border-t border-oc-divider pt-10 md:grid-cols-3">{home.proof.metrics?.map((metric) => <div key={metric._key ?? `${metric.value}-${metric.source}`}><dt className="text-[15px] leading-6 text-oc-neutral-dark">{metric.label}</dt><dd className="mt-2 text-[42px] font-black text-oc-yellow-ink">{metric.value}</dd>{metric.sourceUrl ? <Link href={metric.sourceUrl} className="mt-2 inline-block text-[13px] font-bold text-oc-ink underline">Fonte: {metric.source}</Link> : <p className="mt-2 text-[13px] font-bold text-oc-ink">{metric.source}</p>}</div>)}</dl></div></section>
      <WhizzFinalCallout
        title={home.finalCta.title}
        text={home.finalCta.text}
        primary={home.finalCta.primary}
        secondary={home.finalCta.secondary}
        logos={home.logos.items ?? []}
        image={home.hero.tabs?.[0]?.image}
      />
    </main>
  );
}
