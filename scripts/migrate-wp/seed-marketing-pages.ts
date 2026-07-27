/**
 * WP → Sanity: seed marketing pages (home, empresa, planos, chat-commerce-report).
 *
 * Copy extracted from live omni.chat pages on 2026-07-27.
 * Idempotent: uses createOrReplace with stable _id wp-page-{slug}.
 *
 * Usage:
 *   npx tsx scripts/migrate-wp/seed-marketing-pages.ts
 */

import { writeClient } from "./sanity-write";
import { uploadImageFromUrl } from "./media";

// ── helpers ───────────────────────────────────────────────────────────────────

function key(prefix: string, i: number): string {
  return `${prefix}-${i}`;
}

/** Build a richText section with plain paragraphs (Portable Text). */
function richTextSection(paragraphs: string[]) {
  return {
    _type: "richText",
    content: paragraphs.map((text, i) => ({
      _type: "block",
      _key: `rt-block-${i}`,
      style: "normal",
      markDefs: [],
      children: [{ _type: "span", _key: `rt-span-${i}`, text, marks: [] }],
    })),
  };
}

// ── upload helper (no-op if no omni.chat host) ────────────────────────────────

async function img(url: string, alt: string): Promise<{ imageUrl: string; alt: string }> {
  const assetId = await uploadImageFromUrl(url, alt);
  // Build CDN URL from assetId if upload succeeded
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
  let imageUrl = url; // fallback to original WP URL
  if (assetId && projectId) {
    // assetId format: "image-abc123-1200x800-png"
    const ref = assetId.startsWith("image-") ? assetId : `image-${assetId}`;
    imageUrl = `https://cdn.sanity.io/images/${projectId}/${dataset}/${ref.replace(/^image-/, "").replace(/-(\w+)$/, ".$1")}`;
  }
  return { imageUrl: imageUrl, alt };
}

/** Upload a list of logos and return logoCloud items with cdn.sanity.io URLs. */
async function buildLogos(
  prefix: string,
  logos: Array<{ name: string; url: string }>
): Promise<Array<{ _key: string; name: string; imageUrl: string }>> {
  const out: Array<{ _key: string; name: string; imageUrl: string }> = [];
  for (let i = 0; i < logos.length; i++) {
    const { imageUrl } = await img(logos[i].url, logos[i].name);
    if (imageUrl === logos[i].url) {
      console.warn(`[seed] logo upload fallback (WP URL kept): ${logos[i].url}`);
    }
    out.push({ _key: `${prefix}-${i}`, name: logos[i].name, imageUrl });
  }
  return out;
}

// ── HOME PAGE ─────────────────────────────────────────────────────────────────

async function buildHome() {
  // Images used in home featureSplits
  const imgAgenteIA = await img(
    "https://omni.chat/wp-content/uploads/2026/01/Home-carrossel-1.jpg",
    "Whizz Agent – agente de IA para vendas no WhatsApp"
  );
  const imgCopilot = await img(
    "https://omni.chat/wp-content/uploads/2026/01/Home-carrossel-2.jpg",
    "Whizz Copilot – assistente de IA para times de vendas"
  );
  const imgPosVenda = await img(
    "https://omni.chat/wp-content/uploads/2026/01/Home-carrossel-3.jpg",
    "Pós-venda automatizado com IA"
  );
  const imgConversas = await img(
    "https://omni.chat/wp-content/uploads/2026/03/card-home04-e1777070369518.png",
    "Gestão de conversas em múltiplos canais"
  );
  const imgCampanhas = await img(
    "https://omni.chat/wp-content/uploads/2026/03/card-home05.png",
    "Campanhas de marketing conversacional no WhatsApp"
  );

  const sections = [
    // 1. Hero
    {
      _type: "hero",
      _key: key("s", 0),
      title: "Domine marketing e vendas no WhatsApp com uma IA especialista em experiências que realmente convertem",
      subtitle: "A OmniChat conecta marketing, vendas e relacionamento no WhatsApp com uma IA Conversacional que garante experiências encantadoras, produtividade e conversas que vendem",
      ctas: [
        { _key: "cta-0", label: "Criar agente de IA", href: "#formulario", variant: "primary" },
        { _key: "cta-1", label: "Fale com um especialista", href: "https://omni.chat/#formulario", variant: "secondary" },
      ],
      theme: "dark",
    },
    // 2. featureSplit – Converta com agentes de IA (mediaSide: right)
    {
      _type: "featureSplit",
      _key: key("s", 1),
      title: "Converta com agentes de IA especialistas em vendas",
      body: "Conte com o Whizz Agent, nosso agente de IA, que qualifica conversas e vende produtos como um humano: 24 horas por dia, 7 dias por semana. Ele entende dúvidas, recomenda produtos e conduz o cliente até o checkout, enquanto seu time foca nas conversas estratégicas que geram valor.",
      image: imgAgenteIA,
      mediaSide: "right",
      cta: { label: "Veja uma demonstração", href: "https://omni.chat/#formulario", variant: "primary" },
      dark: false,
    },
    // 3. featureSplit – Empodere seu time (mediaSide: left)
    {
      _type: "featureSplit",
      _key: key("s", 2),
      title: "Empodere seu time para entregar experiências melhores com IA",
      body: "O Whizz Copilot é o assistente de IA do vendedor: gera respostas para objeções, ajusta gramática e tom de voz, tira dúvidas de produtos e mantém consistência na comunicação. Seu time atende mais pessoas por dia, com mais qualidade e menos esforço — enquanto o cliente avança na compra sem atrito.",
      image: imgCopilot,
      mediaSide: "left",
      cta: { label: "Veja uma demonstração", href: "https://omni.chat/#formulario", variant: "primary" },
      dark: false,
    },
    // 4. featureSplit – Pós-venda (mediaSide: right)
    {
      _type: "featureSplit",
      _key: key("s", 3),
      title: "Pós-venda que antecipa, resolve e fideliza",
      body: "Com até 70% das demandas automatizadas pela IA, sua operação ganha velocidade, reduz retrabalho e entrega uma experiência superior ao cliente.",
      image: imgPosVenda,
      mediaSide: "right",
      cta: { label: "Veja uma demonstração", href: "https://omni.chat/#formulario", variant: "primary" },
      dark: false,
    },
    // 5. featureSplit – Gerencie conversas (mediaSide: left)
    {
      _type: "featureSplit",
      _key: key("s", 4),
      title: "Gerencie conversas com clareza e consistência",
      body: "Centralize WhatsApp, site, Instagram e Facebook em uma única visão para acompanhar cada cliente em toda a jornada. Sua equipe resolve mais rápido, reduz retrabalho e oferece uma experiência contínua que aumenta satisfação e recompra.",
      image: imgConversas,
      mediaSide: "left",
      cta: { label: "Veja uma demonstração", href: "https://omni.chat/#formulario", variant: "primary" },
      dark: false,
    },
    // 6. featureSplit – Campanhas de marketing (mediaSide: right)
    {
      _type: "featureSplit",
      _key: key("s", 5),
      title: "Crie campanhas de marketing com resultados reais",
      body: "Alcance seu público no canal onde ele mais responde, com mensagens segmentadas e jornadas personalizadas que mantêm o cliente engajado. Do anúncio ao fluxo de reengajamento, cada ação traz impacto mensurável em conversão, engajamento e retorno de mídia.",
      image: imgCampanhas,
      mediaSide: "right",
      cta: { label: "Veja uma demonstração", href: "https://omni.chat/#formulario", variant: "primary" },
      dark: false,
    },
    // 7. Stats – Por que o canal conversacional é o canal que vende?
    {
      _type: "stats",
      _key: key("s", 6),
      items: [
        { _key: "stat-0", value: "12,5%", label: "em conversões totais no WhatsApp - 6x mais do que e-mail" },
        { _key: "stat-1", value: "27x", label: "mais retorno em campanhas de Marketing" },
        { _key: "stat-2", value: "60%", label: "de redução de tempo no atendimento ao consumidor com IA" },
      ],
    },
    // 8. featureGrid – Comece rápido / Cresça / Suporte / Comunidade
    {
      _type: "featureGrid",
      _key: key("s", 7),
      title: "Por que o canal conversacional é o canal que vende?",
      features: [
        {
          _key: "fg-0",
          icon: "ri-rocket-line",
          title: "Comece rápido, escale fácil",
          text: "Implante rapidamente e comece a vender desde o primeiro dia sem fricção e sem depender de longos projetos técnicos.",
        },
        {
          _key: "fg-1",
          icon: "ri-team-line",
          title: "Cresça com acompanhamento especializado",
          text: "Conte com um time de especialistas dedicado para acompanhar sua evolução, ajustar jornadas e garantir que tudo esteja operando no máximo desempenho.",
        },
        {
          _key: "fg-2",
          icon: "ri-customer-service-2-line",
          title: "Suporte humano quando você precisar",
          text: "Respostas rápidas, resolução na primeira interação e continuidade da operação para não deixar o canal parar.",
        },
        {
          _key: "fg-3",
          icon: "ri-community-line",
          title: "Acesse nossa comunidade",
          text: "Guias, tutoriais, templates e o OmniChat Academy para entender como criar fluxos, agentes e jornadas com total autonomia sem depender de terceiros.",
        },
      ],
    },
    // 9. ctaBanner – Descubra a solução ideal
    {
      _type: "ctaBanner",
      _key: key("s", 8),
      title: "Descubra a solução ideal",
      text: "Temos o plano certo para escalar suas vendas no WhatsApp. Escolha entre soluções flexíveis que combinam IA para vendas, marketing conversacional e integração com seus sistemas. Comece a vender mais no WhatsApp hoje.",
      cta: { label: "Saiba mais sobre nossos planos", href: "/planos", variant: "primary" },
    },
    // 10. featureGrid – Evolua sua empresa com nossas soluções
    {
      _type: "featureGrid",
      _key: key("s", 9),
      title: "Evolua sua empresa com nossas soluções",
      features: [
        { _key: "sol-0", icon: "ri-shopping-bag-line", title: "Varejo", text: "Transforme a jornada de compra com IA no WhatsApp." },
        { _key: "sol-1", icon: "ri-graduation-cap-line", title: "Educacional", text: "Engaje alunos e leads educacionais com automação conversacional." },
        { _key: "sol-2", icon: "ri-megaphone-line", title: "Marketing Studio", text: "Alcance, reengaje e converta com campanhas personalizadas no WhatsApp." },
        { _key: "sol-3", icon: "ri-store-2-line", title: "Sales Studio", text: "Profissionalize o atendimento digital com foco em conversão." },
      ],
    },
  ];

  return {
    _id: "wp-page-home",
    _type: "page",
    title: "Home",
    slug: { _type: "slug", current: "home" },
    sections,
    seo: {
      metaTitle: "OmniChat – Marketing e Vendas no WhatsApp com IA Conversacional",
      metaDescription: "A OmniChat conecta marketing, vendas e relacionamento no WhatsApp com uma IA Conversacional que garante experiências encantadoras, produtividade e conversas que vendem.",
    },
  };
}

// ── EMPRESA PAGE ──────────────────────────────────────────────────────────────

async function buildEmpresa() {
  const imgTeam = await img(
    "https://omni.chat/wp-content/uploads/2026/01/Carrossel-2.jpg",
    "Grupo comemorando em evento de tecnologia com camiseta e blusa amarela do OmniChat"
  );
  const imgSmile = await img(
    "https://omni.chat/wp-content/uploads/2025/11/9b9bb98e38dca37353a39530dcc66ba5ac1bc52f.png",
    "Pessoa sorrindo com celular na mão"
  );
  const pressLogos = await buildLogos("logo", [
    { name: "Logo Marketing", url: "https://omni.chat/wp-content/uploads/2025/11/Vector-2.svg" },
    { name: "Logo Vendas", url: "https://omni.chat/wp-content/uploads/2025/11/Vector-1.svg" },
  ]);

  const sections = [
    // 1. Hero
    {
      _type: "hero",
      _key: key("s", 0),
      title: "Criamos tecnologia para aproximar marcas e consumidores com conversas que geram valor.",
      ctas: [
        { _key: "cta-0", label: "Venha ser um Omnier", href: "https://omni.chat/empresa/#vagas", variant: "primary" },
      ],
      theme: "light",
    },
    // 2. richText – manifesto
    {
      _key: key("s", 1),
      ...richTextSection([
        "Somos o parceiro de crescimento de empresas que veem os canais conversacionais, como WhatsApp, Instagram Direct, Messenger e Web Chat, muito mais do que uma forma de atendimento, mas um verdadeiro centro de receita.",
      ]),
    },
    // 3. featureSplit – 500 marcas (mediaSide: right)
    {
      _type: "featureSplit",
      _key: key("s", 2),
      title: "Mais de 500 marcas transformando suas operações",
      body: "Com uma plataforma robusta e IA no centro da jornada, ajudamos mais de 500 marcas a transformar suas operações em ecossistemas integrados por meio dos canais conversacionais, entregando alta performance. Aqui, automação caminha com personalização, velocidade anda de mãos dadas com precisão e a escala acontece com controle e previsibilidade.",
      image: imgSmile,
      mediaSide: "right",
      dark: false,
    },
    // 4. featureSplit – recuperação de carrinhos (mediaSide: left)
    {
      _type: "featureSplit",
      _key: key("s", 3),
      title: "Recuperação de carrinhos e crescimento em receita",
      body: "Seja na recuperação de carrinhos abandonados, no aumento do ticket médio por meio de campanhas de marketing, ou na criação de novas receitas com agentes de IA, o impacto é claro: aumento exponencial das conversões de suas campanhas, mais eficiência e um modelo de vendas realmente alinhado às expectativas do consumidor atual, com conversas úteis, fluídas e que geram valor do início ao fim.",
      image: imgTeam,
      mediaSide: "left",
      dark: false,
    },
    // 5. featureSplit dark – Seja um Omnier
    {
      _type: "featureSplit",
      _key: key("s", 4),
      title: "Seja um Omnier e ajude a transformar o mundo, uma conversa por vez.",
      body: "Na OmniChat, nosso propósito se reflete em tudo o que fazemos, inclusive na forma como construímos nosso time. Aqui, valorizamos diversidade, empatia, protagonismo e colaboração real. Ser um Omnier é ter espaço para crescer, contribuir, se desenvolver e impactar milhares de pessoas com soluções inovadoras nas vendas conversacionais.",
      mediaSide: "right",
      cta: { label: "Venha ser um Omnier", href: "https://omni.chat/empresa/#vagas", variant: "primary" },
      dark: true,
    },
    // 6. featureGrid – Benefícios de ser um Omnier
    {
      _type: "featureGrid",
      _key: key("s", 5),
      title: "Benefícios de ser um Omnier",
      features: [
        { _key: "b-0", icon: "ri-heart-pulse-line", title: "TotalPass e Wellhub", text: "Acesso a academias e bem-estar." },
        { _key: "b-1", icon: "ri-home-office-line", title: "Ajuda de custo para home office", text: "Apoio para montar seu ambiente de trabalho em casa." },
        { _key: "b-2", icon: "ri-graduation-cap-line", title: "OmniAcademy e OmniEducation", text: "Plataforma de aprendizado interna para desenvolvimento contínuo." },
        { _key: "b-3", icon: "ri-hospital-line", title: "Plano de saúde e odontológico", text: "Cobertura para você e sua família." },
        { _key: "b-4", icon: "ri-cake-line", title: "Day Off de aniversário", text: "Um dia livre no seu aniversário." },
        { _key: "b-5", icon: "ri-restaurant-line", title: "Vale-refeição", text: "Benefício de alimentação." },
        { _key: "b-6", icon: "ri-shield-line", title: "Seguro de vida", text: "Proteção para você e sua família." },
        { _key: "b-7", icon: "ri-computer-line", title: "Apoio para compra de mesa e cadeira", text: "Estrutura ergonômica para trabalho remoto." },
        { _key: "b-8", icon: "ri-star-line", title: "OmniCelebrate e OnHappy", text: "Programas de reconhecimento e engajamento." },
        { _key: "b-9", icon: "ri-parent-line", title: "Auxílio creche", text: "Apoio para pais e mães." },
      ],
    },
    // 7. logoCloud – Imprensa
    {
      _type: "logoCloud",
      _key: key("s", 6),
      title: "A OmniChat está no radar das maiores empresas e veículos do mercado",
      logos: pressLogos,
    },
    // 8. latestPosts
    {
      _type: "latestPosts",
      _key: key("s", 7),
      title: "Conteúdos em destaque",
      limit: 4,
    },
  ];

  return {
    _id: "wp-page-empresa",
    _type: "page",
    title: "Empresa",
    slug: { _type: "slug", current: "empresa" },
    sections,
    seo: {
      metaTitle: "Empresa – OmniChat",
      metaDescription: "Criamos tecnologia para aproximar marcas e consumidores com conversas que geram valor.",
    },
  };
}

// ── PLANOS PAGE ───────────────────────────────────────────────────────────────

async function buildPlanos() {
  const WA_CTA = "https://api.whatsapp.com/send/?phone=554137950418&text=Ol%C3%A1%2C+vim+do+site+e+quero+falar+com+o+Whizz%21&type=phone_number&app_absent=0";

  const sections = [
    // 1. Hero
    {
      _type: "hero",
      _key: key("s", 0),
      title: "Escolha o plano ideal para aumentar as vendas da sua empresa",
      subtitle: "Planos flexíveis que se adaptam ao seu momento, com as funcionalidades que você realmente precisa para escalar vendas.",
      ctas: [
        { _key: "cta-0", label: "Descubra o plano certo para você", href: WA_CTA, variant: "primary" },
      ],
      theme: "light",
    },
    // 2. pricingTable
    {
      _type: "pricingTable",
      _key: key("s", 1),
      title: "Compare funcionalidades, entenda os diferenciais de cada plano e encontre a solução ideal para impulsionar sua operação de vendas e marketing conversacional.",
      plans: [
        {
          _key: "plan-0",
          name: "Marketing Studio",
          description: "Ideal para quem quer atrair, reengajar e converter via WhatsApp Marketing.",
          highlight: false,
          features: [
            "Disparo de campanhas personalizadas no WhatsApp",
            "Segmentação por comportamento, interesse ou CRM",
            "Integrações com Meta API, CAPI e Google API",
            "Recuperação de carrinhos abandonados e reengajamento inteligente",
            "Roteamento de campanhas para humano, bot, ou agentes de IA",
            "Alcance sua base com eficiência no canal mais usado do Brasil",
            "Gere conversões até 6x maiores que no e-commerce tradicional",
            "Recupere vendas com mensagens automáticas e personalizadas",
          ],
          ctaLabel: "Quero contratar o Marketing Studio",
          ctaHref: WA_CTA,
        },
        {
          _key: "plan-1",
          name: "Sales Studio Essential",
          description: "Perfeito para quem está profissionalizando o atendimento digital.",
          highlight: false,
          features: [
            "Venda assistida no WhatsApp",
            "Bot Pro para respostas automáticas",
            "App mobile de gestão de atendimentos",
            "Integrações com plataformas de e-commerce",
            "Acesso à API oficial do WhatsApp Business",
            "Empresas que querem estruturar o atendimento digital com agilidade e foco em conversão",
            "Varejistas que desejam sair do atendimento manual e começar com inteligência",
          ],
          ctaLabel: "Venda mais com o Sales Studio",
          ctaHref: WA_CTA,
        },
        {
          _key: "plan-2",
          name: "Sales Studio PRO",
          description: "Ideal para empresas em crescimento que precisam escalar com inteligência.",
          highlight: true,
          features: [
            "Inclui tudo do Essential + novas funcionalidades com IA",
            "Whizz Copilot: transcrição de áudios, resumo de conversas, tira-dúvidas de produto com IA",
            "Whizz Agent: 1 agente com IA, 3 uploads de Business Memory, múltiplos atendentes simultâneos, integração avançada com CRM/ERP",
            "Reduza custo operacional com IA",
            "Escale o atendimento com inteligência",
            "Melhore a experiência sem perder personalização",
          ],
          ctaLabel: "Converse com um especialista",
          ctaHref: WA_CTA,
        },
        {
          _key: "plan-3",
          name: "Sales Studio Enterprise",
          description: "Feito para operações complexas que exigem performance máxima.",
          highlight: false,
          features: [
            "Inclui tudo do PRO + funcionalidades premium",
            "Copilot Avançado: busca de produtos por imagem enviada no WhatsApp, sugestão ativa de respostas com IA, transcrição e resumo de conversas em tempo real",
            "Whizz Agent Avançado: 10 agentes com IA, 25 uploads de Business Memory, Mensagens ilimitadas, Usuários ilimitados",
            "Serviços adicionais: suporte técnico dedicado, SLA prioritário, treinamentos e onboarding personalizados",
          ],
          ctaLabel: "Escale suas vendas",
          ctaHref: WA_CTA,
        },
        {
          _key: "plan-4",
          name: "Marketing Studio + Sales Studio + Whizz",
          description: "Combine Marketing Studio + Sales Studio + Whizz. Juntos eles criam uma jornada conversacional fluida e automatizada.",
          highlight: true,
          features: [
            "O Marketing Studio atrai e engaja leads com campanhas personalizadas no WhatsApp.",
            "O Whizz qualifica, responde e avança o cliente na jornada, com IA Conversacional 24/7.",
            "O pedido é fechado direto na conversa — com frete, link de checkout e automação total.",
            "Seu time atua onde realmente importa, com foco estratégico.",
          ],
          ctaLabel: "Escale suas vendas",
          ctaHref: WA_CTA,
        },
      ],
    },
    // 3. ctaBanner – Pronto para transformar
    {
      _type: "ctaBanner",
      _key: key("s", 2),
      title: "Pronto para transformar seu WhatsApp no principal canal de vendas com IA?",
      cta: { label: "Descubra o plano certo para você", href: WA_CTA, variant: "primary" },
    },
    // 4. ctaBanner – Descubra o plano ideal (quiz)
    {
      _type: "ctaBanner",
      _key: key("s", 3),
      title: "Descubra o plano ideal para o seu negócio",
      text: "Temos o plano certo para escalar suas vendas no WhatsApp. Escolha entre soluções flexíveis que combinam IA para vendas, marketing conversacional e integração com seus sistemas. Comece a vender mais no WhatsApp hoje.",
      cta: { label: "Saiba mais sobre nossos planos", href: WA_CTA, variant: "primary" },
    },
  ];

  return {
    _id: "wp-page-planos",
    _type: "page",
    title: "Planos",
    slug: { _type: "slug", current: "planos" },
    sections,
    seo: {
      metaTitle: "Planos – OmniChat",
      metaDescription: "Planos flexíveis que se adaptam ao seu momento, com as funcionalidades que você realmente precisa para escalar vendas no WhatsApp com IA.",
    },
  };
}

// ── CHAT COMMERCE REPORT PAGE ─────────────────────────────────────────────────

async function buildChatCommerceReport() {
  // HubSpot form endpoint: portal 20121735, form 4b6b3796-b24c-4786-ba60-39e2bba014b0
  const formAction = "https://api.hsforms.com/submissions/v3/integration/submit/20121735/4b6b3796-b24c-4786-ba60-39e2bba014b0";

  const imgFeatureSplit = await img(
    "https://omni.chat/wp-content/uploads/2026/04/Image-04.png",
    "O consumidor já está comprando pelo WhatsApp"
  );
  const ccrLogos = await buildLogos("l", [
    { name: "Alô", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-alo-1.png" },
    { name: "Mobly", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-mobly-1.png" },
    { name: "Asics", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-asics-1.png" },
    { name: "Reebok", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-reebok.png" },
    { name: "Acer", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-acer.png" },
    { name: "Pirelli", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-pirelli.png" },
    { name: "Crocs", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-crocs.png" },
    { name: "Azzas", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-azzas.png" },
    { name: "La Moda", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-lamoda.png" },
    { name: "Decathlon", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-decathlon-1.png" },
    { name: "Natura", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-natura.png" },
    { name: "AMC", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-amc.png" },
    { name: "Montblanc", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-montblanc.png" },
    { name: "Henry Schein", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-henryschein.png" },
    { name: "L'Occitane", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-loccitane.png" },
    { name: "Kiko Milano", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-kikomilano.png" },
    { name: "Michael Kors", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-michaelkors.png" },
    { name: "Tiffany & Co.", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-tiffanyco.png" },
    { name: "TAG Heuer", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-tagheuer.png" },
    { name: "Tory Burch", url: "https://omni.chat/wp-content/uploads/2026/04/Logo-toryburch.png" },
  ]);

  const sections = [
    // 1. Hero
    {
      _type: "hero",
      _key: key("s", 0),
      title: "Um retrato em dados da jornada conversacional e o impacto da IA no Brasil",
      subtitle: "Explore agora as melhores práticas do mercado conversacional",
      ctas: [
        { _key: "cta-0", label: "Acesse o Estudo", href: "#formulario", variant: "primary" },
      ],
      theme: "dark",
    },
    // 2. ctaForm – captura do report
    {
      _type: "ctaForm",
      _key: key("s", 1),
      title: "O que 1 bilhão de mensagens revelam sobre vender no WhatsApp",
      body: "Preencha o formulário e acesse gratuitamente o Chat Commerce Report 2026.",
      formAction,
      buttonLabel: "Acesse o Estudo",
      fields: [
        { _key: "f-0", name: "company", label: "Nome da empresa", type: "text", required: false },
        { _key: "f-1", name: "website", label: "URL do site", type: "text", required: false },
        { _key: "f-2", name: "hs_whatsapp_phone_number", label: "Número de telefone do WhatsApp", type: "tel", required: true },
        { _key: "f-3", name: "firstname", label: "Nome", type: "text", required: false },
        { _key: "f-4", name: "email", label: "E-mail", type: "email", required: false },
      ],
    },
    // 3. logoCloud – Grandes marcas
    {
      _type: "logoCloud",
      _key: key("s", 2),
      title: "Grandes marcas no Chat-Commerce Report 2026",
      logos: ccrLogos,
    },
    // 4. featureSplit – O consumidor já está comprando pelo WhatsApp
    {
      _type: "featureSplit",
      _key: key("s", 3),
      title: "O consumidor já está comprando pelo WhatsApp. E sua marca, está vendendo lá com inteligência?",
      body: "Entenda como a conversa passou a conectar atração, conversão, relacionamento e recompra dentro do mesmo fluxo, com a IA como base da operação. 96% das conversas entre marcas e consumidores no Brasil acontecem no WhatsApp. O canal que antes era suporte virou o principal ambiente de decisão de compra.",
      image: imgFeatureSplit,
      mediaSide: "right",
      dark: false,
    },
    // 5. featureGrid – 4 destaques
    {
      _type: "featureGrid",
      _key: key("s", 4),
      title: "O que você vai encontrar no relatório",
      features: [
        {
          _key: "fg-0",
          icon: "ri-bar-chart-box-line",
          title: "A escala que confirma o padrão",
          text: "Dados reais de 1 bilhão de mensagens e 600 marcas sobre como vender mais no WhatsApp com IA.",
        },
        {
          _key: "fg-1",
          icon: "ri-robot-line",
          title: "IA que vende, qualifica e atende 24h",
          text: "Como a inteligência artificial está transformando a jornada conversacional no Brasil.",
        },
        {
          _key: "fg-2",
          icon: "ri-megaphone-line",
          title: "Campanhas que transformam resposta em receita",
          text: "As melhores práticas de marketing conversacional com retorno mensurável.",
        },
        {
          _key: "fg-3",
          icon: "ri-pie-chart-line",
          title: "Benchmarks por setor: onde ainda existe margem",
          text: "Comparativos por segmento para identificar oportunidades de crescimento.",
        },
      ],
    },
    // 6. testimonials
    {
      _type: "testimonials",
      _key: key("s", 5),
      title: "Depoimentos",
      items: [
        {
          _key: "t-0",
          quote: "A IA não esquece, não pede demissão e escala sem perder qualidade.",
          name: "Bruna Canani",
          role: "Senior Product Owner",
          company: "Hering",
        },
        {
          _key: "t-1",
          quote: "O WhatsApp virou nosso novo ponto de venda. Se não estivermos com o cliente lá, perdemos o contato.",
          name: "Thiago Belisário",
          role: "Diretor Executivo de Lojas",
          company: "Mobly",
        },
        {
          _key: "t-2",
          quote: "A Black Friday exige uma abordagem assertiva para alcançar clientes no momento certo, e o WhatsApp é ideal por estar disponível 24 horas por dia.",
          name: "Júlia Cavalcanti",
          role: "Head Digital",
          company: "Farm",
        },
      ],
    },
    // 7. ctaBanner – Os padrões já estão mapeados
    {
      _type: "ctaBanner",
      _key: key("s", 6),
      title: "Os padrões já estão mapeados. Sua operação está preparada para 2026?",
      cta: { label: "Acesse o Estudo", href: "#formulario", variant: "primary" },
    },
    // 8. richText – Quem somos nós?
    {
      _key: key("s", 7),
      ...richTextSection([
        "Quem somos nós?",
        "A OmniChat é a plataforma de marketing, vendas e pós-venda com IA no WhatsApp. O que diferencia nossa inteligência artificial é a profundidade: cada agente é treinado com o catálogo, as regras comerciais e o tom de voz da marca para vender, qualificar e atender como se fosse a própria empresa.",
        "A plataforma integra nativamente com os principais e-commerces e CRMs do mercado, e os dados de comportamento retroalimentam campanhas, conversas e decisões em tempo real.",
        "Mais de 500 marcas usam a OmniChat para crescer em conversão, ticket médio e eficiência operacional no WhatsApp.",
        "Anualmente, a OmniChat publica o Chat Commerce Report, um dos principais estudos sobre a jornada conversacional no WhatsApp no Brasil.",
      ]),
    },
  ];

  return {
    _id: "wp-page-chat-commerce-report",
    _type: "page",
    title: "Chat Commerce Report",
    slug: { _type: "slug", current: "chat-commerce-report" },
    sections,
    seo: {
      metaTitle: "Chat Commerce Report | Dados sobre jornada conversacional - OmniChat",
      metaDescription: "Dados reais de 1 bilhão de mensagens e 600 marcas sobre como vender mais no WhatsApp com IA. Baixe grátis o Chat Commerce Report 2026.",
    },
  };
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log("=== Seed: marketing pages ===\n");

  console.log("[seed] Building home…");
  const home = await buildHome();
  await writeClient.createOrReplace(home as Parameters<typeof writeClient.createOrReplace>[0]);
  console.log(`[seed] ✓ wp-page-home (${home.sections.length} sections)`);

  console.log("[seed] Building empresa…");
  const empresa = await buildEmpresa();
  await writeClient.createOrReplace(empresa as Parameters<typeof writeClient.createOrReplace>[0]);
  console.log(`[seed] ✓ wp-page-empresa (${empresa.sections.length} sections)`);

  console.log("[seed] Building planos…");
  const planos = await buildPlanos();
  await writeClient.createOrReplace(planos as Parameters<typeof writeClient.createOrReplace>[0]);
  console.log(`[seed] ✓ wp-page-planos (${planos.sections.length} sections)`);

  console.log("[seed] Building chat-commerce-report…");
  const ccr = await buildChatCommerceReport();
  await writeClient.createOrReplace(ccr as Parameters<typeof writeClient.createOrReplace>[0]);
  console.log(`[seed] ✓ wp-page-chat-commerce-report (${ccr.sections.length} sections)`);

  console.log("\n=== Seed complete ===");
  console.log("Pages seeded: home, empresa, planos, chat-commerce-report");
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
