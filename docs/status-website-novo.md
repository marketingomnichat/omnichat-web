# Novo website OmniChat — status detalhado para ClickUp

**Fonte:** repositório `web-omnichat`, branch `feat/home-superdesign-fidelity`. Base: histórico de commits, planos em `docs/superpowers/plans/`, specs em `docs/superpowers/specs/` e o estado atual do working tree (alterações ainda não commitadas). **Data do levantamento:** 2026-08-11.

**Stack:** Next.js 16 (App Router), React 19, Tailwind v4, Sanity (CMS + page builder + Studio embutido em `/studio`), HubSpot (formulários), PostHog (analytics first-party), vitest (unit) + Playwright (e2e).

**Objetivo geral:** sair do WordPress para Next.js + Sanity, com conteúdo migrado, design system `oc-*` próprio e uma home product-led. Roxo Whizz restrito aos blocos de IA (`components/whizz/`).

---

## Visão em uma linha

Fundação, migração de conteúdo e fidelidade visual da home estão **concluídas e commitadas**. A fase atual — pivô da home para composição product-led estilo ClickUp — está **em implementação no working tree** (código escrito, ainda não commitado) e **bloqueada por uma aprovação visual do owner**.

---

## Fases do projeto

O trabalho está dividido em 6 planos versionados. Ordem cronológica:

| # | Plano | Foco | Situação |
|---|---|---|---|
| 1 | `2026-07-26-enterprise-foundation` | Fundação Next.js + Sanity + SEO + PostHog | Concluído |
| 2 | `2026-07-27-wp-migration` | Migração WordPress → Sanity | Concluído |
| 3 | `2026-07-28-home-production-fidelity` | Home igual ao omni.chat ao vivo | Concluído |
| 4 | `2026-07-28-home-superdesign-fidelity` | Fechar gap visual vs draft Superdesign | Concluído |
| 5 | `2026-07-31-visual-renovation-v2` | Sistema visual product-led (Panel, header adaptativo) | Concluído |
| 6 | `2026-07-31-clickup-composition-omnichat-pivot` | Home composição ClickUp com marca/copy OmniChat | **Em andamento** |

Planos paralelos (fora da onda principal da home):
- `2026-08-04-connection-lp-design` — LP Connection 2026 em `connection.omni.chat` (spec/design commitado).
- `2026-08-07-wp-demo-popup-ab-design` — teste A/B do popup de demo ainda no WordPress (spec commitada; scripts em `scripts/wp-demo-popup/` pendentes).

---

## O que foi CONCLUÍDO (commitado)

### Fundação e arquitetura
- Monolito modular Next.js 16 App Router com registry único de seções (`components/sections/registry.ts`) consumido pelo `SectionRenderer` do Sanity.
- Sanity para site e blog, com Visual Editing e Studio embutido em `/studio` (pt-BR).
- ISR com `revalidateTag` via webhook `/api/revalidate?secret=`; tags de cache `page`/`page:slug`, `post`/`post:slug`, `siteSettings`, `redirect`.
- SEO/GEO/AEO: metadata builder, JSON-LD, `llms.txt`, redirects — cobertos por testes (`seo.test.ts`, `json-ld.test.ts`, `llms.test.ts`, `redirects.test.ts`).

### Migração WordPress → Sanity
- Scripts idempotentes em `scripts/migrate-wp/` lendo a REST API ao vivo do WP e escrevendo com `@sanity/client` (`_id` determinístico).
- Builder.io removido; LPs de campanha migradas para o tipo `landingPage` no Sanity (host `lp.omni.chat` via middleware).
- Mídias do WP sobem para o Sanity CDN pelo seed.
- Conversão de HTML para pt-BR coberta por teste (`html-to-pt.test.ts`).

### Page builder — 14 seções registradas
`hero`, `richText`, `ctaBanner`, `stats`, `featureGrid`, `testimonials`, `logoCloud`, `faq`, `featureSplit`, `featureCarousel`, `pricingTable`, `ctaForm`, `latestPosts`, `mediaBlock`. Paridade schema ↔ registry forçada por `tests/registry.test.ts`.

### Home — fidelidade de produção e Superdesign
- Hero com layout `productEmerge` (produto como âncora) e vídeo de fundo.
- Header adaptativo: overlay escuro no topo, estado sólido claro ao rolar, submenu com ícones, drawer mobile; refresh do estado de scroll ao navegar. Coberto por `header-appearance.test.ts` e `hero-layout.test.ts`.
- `featureGrid` com cards de foto; carrossel de `testimonials` (scroll-snap, sem Swiper); `featureCarousel` de produtos; imagens laterais em `ctaBanner`/`ctaForm`.
- Footer com bloco de loja e selos ISO; correção de keys React únicas para links com href repetido.
- `ctaForm` enviando para o HubSpot como JSON no client (`tests/cta-form-hubspot.test.ts`, `cta-form-fields.test.ts`).

### Renovação visual v2 (product-led)
- Primitivo `Panel` (borda XOR sombra) e tokens de densidade de superfície em `globals.css` (`panel.test.ts`, `marketing-panels.test.ts`).
- Motion intencional no header, hero e painéis.
- Densidade de copy v2 aplicada em empresa/planos CCR.
- Revisão visual da home refeita após cada fase (`docs/superpowers/visual-review/`).

### Docs de design commitados
- Plano do pivô ClickUp-composition.
- Design da LP Connection 2026.
- Spec do teste A/B do popup de demo no WordPress.

---

## O que está EM ANDAMENTO (working tree, ainda não commitado)

O pivô da home (plano 6) já foi parcialmente implementado em código, mas **não commitado** e com os checkboxes do plano ainda desmarcados. 26 arquivos alterados/novos. Principais mudanças:

### Home migrada de page-builder puro para composição dedicada
- `app/(site)/page.tsx` agora renderiza `ClickupCompositionHome` em vez do `SectionRenderer` genérico, consumindo `page.home` (novo campo).
- Novo schema Sanity `sanity/schemas/objects/home-composition.ts` (`homeComposition`): objeto editável com ações, imagens responsivas (desktop/mobile), benefícios e blocos de composição.
- Novos tipos em `shared/types.ts` (`HomePageData`, `HomeComposition`, `HomeTab`, `HomeMediaItem`).
- `HOME_QUERY` e queries ajustadas (`services/sanity/queries.ts`, `tests/queries.test.ts`).

### Novos componentes de home (`components/home/`)
- `clickup-composition.tsx` — orquestra a home product-led.
- `product-tabs.tsx` — abas de produto.
- `solutions-tabs.tsx` — abas de soluções (Marketing / Vendas / Atendimento).
- `feature-accordion.tsx` — acordeão de features.
- `client-logo-strip.tsx` — faixa de logos de clientes.
- `figma-callouts.tsx`, `media-placeholder.tsx` — apoio de layout/mídia.

### Whizz (IA)
- `components/whizz/whizz-ecosystem.tsx` — bloco de ecossistema Whizz.
- `components/whizz/whizz-switcher.tsx` — alternador de mídia Whizz.

### Popup de demo
- `components/site/demo-modal.tsx` — modal de demo.
- E2E `tests/e2e/demo-modal.spec.ts`.

### Chrome e infra
- `header.tsx` reescrito (+322/-… linhas no diff) para o header sticky product-marketing.
- `footer.tsx` ampliado.
- `next.config.ts`, `services/sanity/image.ts` ajustados (provável host de imagem novo).
- Schemas `page.ts` e `site-settings.ts` ganharam campos; `schemas.test.ts` atualizado.
- Assets em `public/figma-assets/` e refs `omnichat-bigtech-51c2d670.html` / `omnichat-bigtech-99575455.html`.

> Risco registrado: este trabalho está só no working tree. Sem commit, não passou pelos gates (`lint`, `typecheck`, `test`, `build`) de forma verificável nem por review. Não confirmei localmente que os testes passam neste estado.

---

## O que ainda PRECISA ser feito

### Bloqueio principal — decisão do owner (plano 6, Task 0)
- **Aprovar o alvo visual** do draft Superdesign OmniChat, ou listar até 3 ajustes antes de fechar o código. A variante v1 simples (`37893a8e`) foi descartada como baseline fraca; falta **escolher entre "bigtech A" (`51c2d670`) e "bigtech B" (`99575455`)** ou pedir um iterate.
- Enquanto isso não fecha, o código do pivô fica sujeito a retrabalho.

### Home product-led (plano 6, Tasks 1–6)
- **Task 1 — Hero:** faixa inferior com screenshot de produto real (inbox/Whizz/campanha) no lugar de vídeo abstrato. Teste `hero-layout` exigindo image band em `productEmerge`.
- **Task 2 — Feature blocks:** splits grandes estilo ClickUp (mídia bleed, menos "card WP"); Whizz deep-dive dark só com accent Whizz. Teste estrutural garantindo que split dark não usa Panel branco.
- **Task 3 — Header sticky:** decidir entre `lightSolid` sempre ou dark overlay condicional; ajustar testes de appearance se a home sair de `DARK_HERO_ROUTES`.
- **Task 4 — Reseed da home** na ordem canônica: hero → featureSplit Whizz → Marketing → Vendas → Atendimento → logoCloud → (stats opcional) → (testimonials opcional) → ctaForm. Rodar `npx tsx scripts/migrate-wp/seed-marketing-pages.ts` com `.next` limpo.
- **Task 5 — Logos + âncora:** logos legíveis em painel claro; `scroll-mt ≥ altura do header` no `#formulario`.
- **Task 6 — Aceite visual:** gerar `home-novo.png` e comparar **com o draft OmniChat aprovado, não com o WordPress**.

### Higiene de entrega (transversal)
- Commitar o WIP em incrementos e passar os gates: `npm run lint && npm run typecheck && npm test`, depois `npm run build`.
- Atualizar os checkboxes do plano 6 conforme cada Task fecha.
- Rodar `npm run lint:design` (guardrails do design system: borda XOR sombra, `#FFBC00` sem texto branco, Whizz só em `components/whizz/`, `<Image>` nunca `<img>`).
- E2E de acessibilidade e conteúdo (`a11y.spec.ts`, `content.spec.ts`) verdes na home nova.

### Cutover e planos paralelos
- **Revisão visual pré-cutover:** comparar pares `-wp.png` vs `-novo.png` em `docs/superpowers/visual-review/` antes de qualquer troca de DNS.
- **Teste A/B do popup de demo** (`scripts/wp-demo-popup/`) — implementação ainda pendente (só a spec está commitada).
- **LP Connection 2026** em `connection.omni.chat` — design definido, implementação a confirmar.

---

## Próximos passos sugeridos (ordem)

1. Owner escolhe a variante bigtech (A ou B) e aprova o draft — desbloqueia o resto.
2. Commitar o WIP atual em incrementos, passando os gates a cada um.
3. Fechar Tasks 1–5 do plano 6 (hero band, splits, header, reseed, logos/âncora).
4. Task 6: aceite visual contra o draft aprovado.
5. Revisão visual `-wp` vs `-novo` e só então planejar cutover de DNS.

---

## Fora de escopo (onda 1)

- Clone pixel-perfect do HTML ClickUp.
- Redesign editorial do blog.
- Trocar a fonte do site (mantém Lato / `oc-*`, não Plus Jakarta).

---

## Lacunas deste status (não inventadas)

- **Sem datas por tarefa:** o git não carrega prazo, só a sequência de commits. Os planos são datados de 2026-07-26 a 2026-08-07.
- **Sem métricas de negócio:** tráfego, conversão, MQL/SAL/MRR não estão no repositório — ficam em HubSpot/PostHog/BigQuery, não consultados neste levantamento.
- **Status do WIP não verificado:** o trabalho do pivô está no working tree; não rodei os gates para confirmar que compila/passa nos testes neste exato estado.
