// FAQ no formato da LP antiga (lps-from-hubspot/connection.html):
// aside fixo (overline + título + contato) e grupos de perguntas em accordion.
// Usa <details>/<summary> nativos — sem JS, acessível por teclado.

const FAQ_GROUPS = [
  {
    label: "Informações gerais",
    items: [
      {
        q: "O que é o OmniChat Connection?",
        a: "O OmniChat Connection é o primeiro evento proprietário da OmniChat aberto ao mercado. Enquanto os eventos de tecnologia vendem tendência, nosso ponto de partida é outro: IA conversacional já não é novidade, mas falta clareza sobre o que realmente está gerando resultado. Um dia de conteúdo de alto nível com speakers que estão definindo esse mercado, cases com números reais e debates que separam execução de promessa.",
      },
      {
        q: "Quando e onde o OmniChat Connection acontece?",
        a: "O evento acontece no dia 17 de setembro de 2026, no Welluci Gardens — Av. Queiroz Filho, 830, Vila Hamburguesa, São Paulo, SP.",
      },
      {
        q: "Qual o horário do evento?",
        a: "Das 09h às 21h. O conteúdo no palco vai até as 18h, seguido de happy hour.",
      },
    ],
  },
  {
    label: "Ingresso",
    items: [
      {
        q: "Como faço para garantir meu ingresso?",
        a: "Os ingressos estão disponíveis na Sympla. Acesse a página do evento e escolha o lote disponível.",
      },
      {
        q: "Qual o valor do ingresso?",
        a: "Os ingressos são vendidos em lotes progressivo. Cada lote inclui acesso ao auditório, centro de exposição, alimentação e kit de boas-vindas.",
      },
      {
        q: "O ingresso é transferível?",
        a: "Para dúvidas sobre transferência de ingresso, entre em contato diretamente pela Sympla ou pelo e-mail marketing@omni.chat.",
      },
      {
        q: "Haverá emissão de nota fiscal?",
        a: "Não há emissão de nota fiscal para os ingressos do OmniChat Connection 2026. Após a aprovação da compra, o ingresso é enviado diretamente para o e-mail cadastrado na Sympla. O próprio ingresso tem validade como comprovante fiscal, conforme o Decreto Municipal (Art. 37), que reconhece bilhetes e ingressos de eventos como documentos fiscais para efeitos da legislação tributária do Município de São Paulo.",
      },
    ],
  },
  {
    label: "Agenda e conteúdo",
    items: [
      {
        q: "Qual é a programação do evento?",
        a: "O OmniChat Connection tem uma jornada de conteúdo dividida em três trilhas: Marketing, Vendas e Pós-venda. A agenda completa será publicada no site à medida que os palestrantes forem confirmados.",
      },
      {
        q: "Quem são os palestrantes?",
        a: "A curadoria prioriza profissionais com atuação direta no mercado de IA conversacional, e-commerce e estratégia de crescimento. Os nomes serão anunciados conforme os contratos forem fechados.",
      },
    ],
  },
  {
    label: "Local e estrutura",
    items: [
      {
        q: "Como chegar ao evento?",
        a: "O Welluci Gardens fica na Av. Queiroz Filho, 830, Vila Hamburguesa, São Paulo, CEP 05319-000. O espaço é acessível de carro, aplicativo de transporte ou metrô (estação Villa-Lobos–Jaguaré, Linha 2-Verde).",
      },
      {
        q: "Haverá estacionamento no local?",
        a: "Sim. O espaço conta com estacionamento próprio localizado na frente do venue. A organização do evento não possui convênio ou negociação de tarifas especiais — o pagamento é feito diretamente no local.",
      },
      {
        q: "Haverá guarda-volumes?",
        a: "Sim. Teremos maleiro disponível para volumes grandes e pequenos.",
      },
      {
        q: "O evento dispõe de alimentação?",
        a: "Sim. O evento conta com alimentação completa ao longo do dia: coffee breaks, almoço e happy hour.",
      },
    ],
  },
  {
    label: "No dia do evento",
    items: [
      {
        q: "Menores de idade podem acessar o evento?",
        a: "O evento é voltado para público profissional adulto. A entrada de menores de 18 anos não é proibida, mas está condicionada ao acompanhamento de um responsável legal com ingresso válido. O conteúdo programado não é direcionado a menores de idade.",
      },
      {
        q: "Quais os horários de credenciamento?",
        a: "O credenciamento e a retirada de crachás acontecem das 08h às 09h30, antes da abertura oficial do evento.",
      },
      {
        q: "Sou da imprensa. Como faço para me credenciar?",
        a: "Envie um e-mail para marketing@omni.chat com seu nome completo, veículo de comunicação e tipo de cobertura pretendida. Nossa equipe retornará com as instruções para credenciamento.",
      },
    ],
  },
] as const;

export function ConnectionFaq() {
  return (
    <section id="faq" className="relative w-full py-16 lg:py-[150px]" aria-labelledby="connection-faq-heading">
      <div className="mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-y-12 px-5 sm:px-8 lg:grid-cols-[minmax(0,340px)_minmax(0,1fr)] lg:gap-x-[80px] lg:px-[60px] 2xl:px-[300px]">
        {/* Aside */}
        <div className="lg:sticky lg:top-[96px] lg:self-start">
          <p className="text-[14px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-(--lp-accent)">FAQ</p>
          <h2
            id="connection-faq-heading"
            className="mt-4 text-[clamp(32px,3vw,56px)] font-black tracking-[-0.02em] leading-[1.05] text-(--lp-white)"
          >
            Perguntas <span className="lp-italic">frequentes</span>
          </h2>
          <p className="mt-4 text-[16px] font-normal leading-[1.6] text-[#d4d4d4] lg:text-[18px]">
            Tudo o que você precisa saber sobre o Connection 2026, do ingresso ao dia do evento.
          </p>
          <a
            href="mailto:marketing@omni.chat"
            className="mt-7 inline-flex items-center gap-2 text-[14px] font-bold text-(--lp-accent) transition-colors hover:text-(--lp-accent-3)"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              aria-hidden
              className="size-4 shrink-0"
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <path d="m3 7 9 6 9-6" />
            </svg>
            Ainda com dúvidas? Fale com a gente
          </a>
        </div>

        {/* Grupos */}
        <div className="flex min-w-0 flex-col gap-[48px]">
          {FAQ_GROUPS.map((group, gi) => (
            <div key={group.label}>
              <p className="border-b border-white/20 pb-[14px] text-[12px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-[#9a9ba1]">
                {group.label}
              </p>
              {group.items.map((item, ii) => (
                <details
                  key={item.q}
                  className="group border-b border-white/10"
                  open={gi === 0 && ii === 0}
                >
                  <summary className="flex cursor-pointer list-none items-start justify-between gap-6 py-[22px] text-[17px] font-bold leading-[1.4] text-(--lp-white) transition-colors hover:text-(--lp-accent) [&::-webkit-details-marker]:hidden">
                    <span>{item.q}</span>
                    <span
                      aria-hidden
                      className="mt-px size-6 shrink-0 text-(--lp-accent) transition-transform duration-250 group-open:rotate-45"
                    >
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.75}
                        className="block size-6"
                      >
                        <path d="M12 5v14M5 12h14" />
                      </svg>
                    </span>
                  </summary>
                  <p className="max-w-[680px] pb-6 pr-12 text-[15px] font-normal leading-[1.65] text-[#d4d4d4]">
                    {item.a}
                  </p>
                </details>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
