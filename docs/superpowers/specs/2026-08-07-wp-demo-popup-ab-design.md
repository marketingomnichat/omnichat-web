# Teste A/B do popup de demonstração no WordPress (omni.chat)

Data: 2026-08-07
Status: aprovado em conversa; pendente revisão final do spec

## Objetivo

Portar o popup de demonstração deste projeto (`components/site/demo-modal.tsx`) para o site WordPress atual como snippet standalone e rodar um teste A/B via PostHog. Hipótese: CTAs abrindo um popup com form + prova social convertem mais que o fluxo atual (rolar até o form embutido na página).

- Variante `control` (A): comportamento atual — CTA rola até `section#formulario` (Contact Form 7, form id 98).
- Variante `popup` (B): a seção `section#formulario` é escondida; todo CTA que aponta para `#formulario` abre o popup, que envia direto para a API do HubSpot.

## Escopo (allowlist de páginas)

O snippet só ativa nestes paths (normalizados sem barra final):

1. `/` (home)
2. `/produto/marketing-studio`
3. `/produto/sales-studio`
4. `/solucao/varejo`
5. `/solucao/educacional`

Fora da allowlist o snippet não faz nada (nem captura eventos).

## Fatos verificados no site (fetch em 2026-08-07)

- Form embutido: Contact Form 7 v6.1.6, `div.wpcf7#wpcf7-f98-o1` dentro de `section#formulario` (classe `formulario py-5`). Não é embed HubSpot.
- CTAs de demo: todos terminam em `#formulario`. Seletor de interceptação: `a[href$="#formulario"]`. CTAs com href absoluto têm `target="_blank"` — o popup deve prevenir default e abrir na mesma aba/página.
- PostHog: snippet posthog-js v2 inline no `<head>` de todas as páginas, project key `phc_ke2m…8QAw` (mesma do projeto "Omnichat", id 520582), `api_host: https://us.i.posthog.com`.
- HubSpot: só tracking script (portal 20121735). O popup envia para o mesmo endpoint do projeto: `https://api.hsforms.com/submissions/v3/integration/submit/20121735/4b6b3796-b24c-4786-ba60-39e2bba014b0`.
- Tema custom `omni` (Bootstrap + AOS), sem Elementor. WP Rocket 3.23.1 com delay/minificação de JS.

## Arquitetura

Um único arquivo autocontido `wp-demo-popup-ab.js` (IIFE, vanilla JS, ES2017, sem dependências), com CSS injetado via `<style>` pelo próprio script. Colado no WordPress via WPCode (footer), com exclusão configurada no WP Rocket (delay JS e minificação) para o snippet.

Fluxo:

1. Guard de allowlist por `location.pathname`.
2. Injeta CSS anti-flicker imediatamente: `section#formulario { visibility: hidden }`.
3. Espera `window.posthog` e chama `posthog.onFeatureFlags`. Lê a flag `demo-popup-ab`.
   - `popup`: mantém a seção escondida (`display: none`), registra o interceptador de cliques e o handler de hash `#formulario`.
   - `control`, flag indefinida ou timeout de 2s: remove o CSS anti-flicker (seção reaparece) e nada mais muda visualmente.
4. Nos dois braços, registra o listener de conversão do braço ativo (ver eventos).

### Popup (variante B)

Réplica visual do `demo-modal.tsx` em HTML/CSS puro, com tokens da marca hardcoded no CSS do snippet (valores copiados de `app/globals.css`: amarelo CTA `#FFBC00` nunca com texto branco, ink, dark, surface-alt, radius de modal/botão). Sem Remix Icon: ícones em SVG inline.

- Layout: grid 2 colunas ≥1024px (form à esquerda, painel de case à direita fundo dark), coluna única no mobile; overlay com blur; scroll interno; `role="dialog"`, `aria-modal`, focus trap, Esc fecha, clique no overlay fecha, foco volta ao CTA de origem.
- Form: campos idênticos ao do projeto — nome, e-mail corporativo, empresa, país (+55 default) + telefone, cargo, segmento, tamanho da operação (radio pills) — com honeypot `_hp_field`, estados loading/erro/sucesso inline.
- Envio: payload igual ao de `lib/hubspot-form.ts` (`fields` + `context: { pageUri, pageName }`), telefone concatenado com DDI, segmento concatenado com tamanho da operação via " · ". Bonus sobre o projeto: incluir `context.hutk` lido do cookie `hubspotutk` (o tracking do HubSpot já roda no WP), para atribuição correta do lead.

### Painel de cases por página

Conteúdo fiel aos artigos publicados no blog (recortes verificados em 2026-08-07). Cases sem citação de pessoa não ganham depoimento inventado: o painel omite o bloco de avatar/nome e mostra só métrica + frase de resultado.

| Página | Carrossel (ordem) |
|---|---|
| Home | iPlace, Hering, ASICS |
| Marketing Studio | Hering, Karsten, iPlace |
| Sales Studio | ASICS, Decathlon, iPlace |
| Varejo | iPlace, ASICS, Decathlon |
| Educacional | Grupo Gavinho, iPlace, ASICS |

Recortes aprovados (números do corpo dos artigos):

- **iPlace** — métrica `281x` ROAS; resultado: campanha de lançamento do iPhone 15 foi a melhor em vendas dos últimos 10 anos, com o WhatsApp no centro da estratégia. Quote: "Saímos de um canal limitante, sem conversação, como o SMS e migramos para o principal canal e queridinho do brasileiro, o WhatsApp com apoio da tecnologia OmniChat." — Paulo Rosa, Gerente de CRM da iPlace, Grupo Herval.
- **Hering** — métrica `123x` ROAS em campanhas de carrinho abandonado, com 20% de taxa de conversão. Sem quote (painel sem bloco de pessoa).
- **ASICS** — métrica `4x` mais conversão que o e-commerce tradicional; WhatsApp responde por mais de 60% das vendas omnichannel. Quote: "O Whizz Copilot já ajuda até nas vendas dentro da loja física. Ele compara produtos e responde mais rápido." — Gustavo Reis, CRM | CX | SAC Manager da ASICS Brasil.
- **Karsten** — métrica `+215%` no ticket médio; ROAS superior a 440x em carrinho abandonado. Quote: "Nós tínhamos receio de fazer a comunicação no WhatsApp e parecermos invasivos, mas aos poucos começamos a entender o quanto o cliente já está habituado com o uso do canal." — Valéria Bitencourt, Head de E-commerce e Transformação Digital.
- **Decathlon** — métrica `12%` do GMV influenciado pelo WhatsApp (loja física + e-commerce). Quote: "Com a contratação da Omnichat, e já com todos os canais integrados, foi possível centralizar tudo em uma única ferramenta" — Any Zamaro, Coordenadora de CRM da Decathlon.
- **Grupo Gavinho (UniCesumar)** — métrica `100%` dos leads de matrícula qualificados pela IA antes da transferência ao time humano, durante o recesso e sem consultor ativo. Sem quote (painel sem bloco de pessoa).

## Experimento no PostHog

- Feature flag / experimento: `demo-popup-ab`, variantes `control` e `popup`, 50/50, nas 5 URLs (o gate real é a allowlist do script; a flag pode ser 100% rollout com multivariante).
- Eventos capturados pelo snippet (todos com propriedades `variant`, `page_path`):
  - `demo_form_submitted` — conversão primária. No `control`, disparado pelo evento DOM `wpcf7mailsent` do Contact Form 7; no `popup`, no sucesso do POST ao HubSpot.
  - `demo_popup_opened` — só variante B.
  - `demo_form_error` — falha de envio (nos dois braços; no control via `wpcf7mailfailed`/`wpcf7invalid`).
- Métrica do experimento: funil exposição da flag → `demo_form_submitted`.

## Riscos e decisões registradas

1. **Pipelines de lead diferentes por braço**: control entrega via Contact Form 7, popup via HubSpot form `4b6b3796`. Confirmar com o time que os dois desembocam no mesmo pipeline comercial antes de ativar a flag. (Sinalizado ao usuário; ativação da flag é manual e fica como gate.)
2. **Flicker**: mitigado com CSS anti-flicker + timeout de 2s fail-open para control (se o PostHog não responder, ninguém perde o form).
3. **WP Rocket**: se o snippet entrar no delay-JS, usuários da variante B podem clicar antes do interceptador existir. Exclusão no Rocket é passo obrigatório do deploy.
4. **Divergência título vs. corpo nos artigos** (Hering 120x/123x, Karsten 200%/215%): decidido usar os números do corpo.

## Testes

- Unit (vitest): montagem do payload HubSpot do snippet (reaproveita os casos de `tests/cta-form-hubspot.test.ts` como referência), lógica de allowlist e de resolução de variante (timeout, flag ausente, control, popup).
- E2E (Playwright): fixture HTML reproduzindo o markup do WP (CTAs `a[href$="#formulario"]`, `section#formulario` com form CF7 fake, stub de `window.posthog`); cenários: variante popup abre/fecha/foca/envia (HubSpot mockado) e captura eventos; variante control não altera a página e captura `demo_form_submitted` no `wpcf7mailsent`; timeout do PostHog libera o form.
- Manual pré-ativação: colar snippet no WPCode, flag em rollout condicional (ex.: só para distinct_id de teste), validar nas 5 páginas em desktop e mobile, conferir lead chegando no HubSpot e eventos no PostHog. Só então abrir 50/50.

## Entregáveis

1. `scripts/wp-demo-popup/wp-demo-popup-ab.js` (fonte do snippet, versionado neste repo) + instruções de deploy em `scripts/wp-demo-popup/README.md` (WPCode + exclusões WP Rocket).
2. Testes unit e e2e descritos acima.
3. Experimento `demo-popup-ab` criado no PostHog (via MCP) com a métrica primária configurada.
