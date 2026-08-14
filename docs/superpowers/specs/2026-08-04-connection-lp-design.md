# Design — LP Connection 2026 em connection.omni.chat

Data: 2026-08-04
Status: aprovado em conversa

## Contexto

A LP do evento OmniChat Connection 2026 existe hoje como template HubSpot exportado
(`lps-from-hubspot/connection.html`, 2.673 linhas, HTML autocontido com CSS inline).
Ela precisa ir ao ar em `connection.omni.chat` antes do cutover do site principal
(omni.chat segue no WordPress até lá). O projeto Next.js ainda não tem deploy.

Decisões tomadas com o usuário:

- A LP vira componentes React dentro deste projeto, com fidelidade visual total ao HTML.
- Conteúdo fica só em código (sem Sanity): a LP tem design único que não se encaixa
  nas 14 seções do registry, e a edição será via código/PR.
- Go-live independente do cutover: deploy do projeto na Vercel com apenas o domínio
  `connection.omni.chat` atachado.

## Roteamento e host

- Rota nova `app/connection/` fora do grupo `(site)`:
  - `layout.tsx` próprio — a LP tem navbar, footer e tema dark próprios, sem o chrome
    do site. Carrega a fonte Lato via `next/font` (pesos 300/400/700/900 + itálicos)
    e importa o CSS da LP.
  - `page.tsx` — compõe as seções; metadata completa (title, description, OG) e
    canonical `https://connection.omni.chat/`.
- `proxy.ts` ganha um segundo host, no mesmo padrão do `LP_HOST`:
  - Host `connection.omni.chat` (env `NEXT_PUBLIC_CONNECTION_HOST`, com
    `connection.localhost` em dev): `/` reescreve para `/connection`; qualquer outro
    path nesse host retorna 404.
  - No host principal, `/connection` redireciona 301 para
    `https://connection.omni.chat/` (evita conteúdo duplicado, igual à regra do `/lp/*`).

## Componentes e estilos

```
components/connection/
  navbar.tsx  hero.tsx  speakers.tsx  trilhas.tsx  ingresso.tsx
  omni.tsx  sponsors.tsx  footer-cta.tsx  faq.tsx  sponsor-modal.tsx
  content.ts          ← textos, speakers, FAQ, datas (edição centralizada)
  connection.css      ← CSS do HTML portado quase literal, tokens --lp-*
```

- Fidelidade visual vem de manter o CSS original quase intacto, escopado à rota
  (importado apenas no layout de `/connection`). Os tokens `--lp-*` já resolvem para
  os tokens `oc-*` da marca; a regra do DS se mantém (`#FFBC00` nunca com texto branco —
  o HTML já usa ink sobre amarelo).
- Imagens (speakers, sponsors, favicon) hoje apontam para
  `hubspotusercontent-na1.net`. Serão realocadas no CDN OmniChat e servidas via
  `<Image>` (obrigatório pelo lint), com host no `images.remotePatterns` se necessário.
- Favicon próprio da LP servido localmente (route metadata `icons`).

## Interatividade e formulário

- FAQ accordion e modal de patrocínio viram client components com estado React
  (substituem o script inline), preservando semântica ARIA
  (`aria-expanded`, `role="dialog"`, `aria-modal`, gestão de foco).
- O formulário do modal de patrocínio reaproveita o carregamento HubSpot existente
  (`lib/hubspot-form.ts`, padrão de `components/sections/cta-form.tsx`), com o mesmo
  portal ID e form ID do HTML original. Falha de carregamento mantém o fallback do
  HTML original (verificado durante o porte).

## Tratamento de erros

- Falha no script do HubSpot: o modal exibe o fallback (link/contato) em vez de área
  vazia — mesmo comportamento do padrão já usado no `cta-form.tsx`.
- Host desconhecido ou path inválido no host da LP: 404 direto no proxy.

## Testes

- Unit (`vitest`) do `proxy.ts`: rewrite do novo host, 404 de paths extras nesse host,
  redirect de `/connection` no host principal.
- Testing Library: FAQ (abre/fecha, `aria-expanded`) e modal (abre, fecha por botão e
  overlay, foco).
- Playwright e2e com `connection.localhost`: página inteira renderiza, modal abre e
  carrega o formulário.
- Comparação visual par a par contra o HTML original (fluxo de
  `docs/superpowers/visual-review/`) antes do go-live.

## Go-live (fora do repo, registrado no plano)

1. Criar o projeto na Vercel com as env vars do `.env.example`.
2. Atachar apenas o domínio `connection.omni.chat`.
3. Apontar o DNS (CNAME) de `connection` para a Vercel.
4. omni.chat principal permanece no WordPress até o cutover planejado.

## Fora de escopo

- Migração da LP para Sanity (`landingPage`) — pode ser avaliada depois do evento.
- Qualquer mudança no site principal ou no fluxo de LPs `lp.omni.chat`.
- Remoção de `lps-from-hubspot/connection.html` — mantido como referência de
  fidelidade até a revisão visual passar; removido no fim da implementação.
