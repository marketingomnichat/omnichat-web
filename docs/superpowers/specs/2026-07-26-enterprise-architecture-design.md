# Arquitetura enterprise omni.chat — Sanity + Builder.io + SEO/GEO/AEO + PostHog

Data: 2026-07-26 · Status: aprovado por João Moitinho (owner omni.chat)

## Contexto

Migração do site omni.chat (WordPress → Next.js 16.2.11 + Sanity). O design system já está
implementado (tokens Tailwind v4, guardrails em `scripts/check-design-rules.mjs`, skill em
`.claude/skills/design-system-omnichat/`). Esta spec define a fundação enterprise: CMS,
page building pelo marketing, LPs de campanha, SEO/GEO/AEO e analytics. Conteúdo real e
cutover são fases posteriores do plano de migração.

Decisões de contexto:

- **Repo único** — site, LPs, Studio e proxy no mesmo Next.js; DevOps da OmniChat audita
  dependências e configuração depois (deps mínimas e fixadas).
- **Sanity** alimenta site institucional + blog. A conta corporativa do Sanity é externa
  (não conectada a este ambiente): `projectId`/`dataset`/token entram por env var; schema
  versionado no repo e deployado por quem tem acesso.
- **Builder.io** alimenta LPs de campanha (substituindo HubSpot) em `lp.omni.chat`,
  roteadas por `proxy.ts` no mesmo deploy.
- **Escopo desta entrega**: fundação completa, sem conteúdo migrado.

## Arquitetura

Monolito modular com registry de seções compartilhado:

1. **Studio embutido** em `app/studio/[[...tool]]` — schema e renderização mudam no mesmo
   PR; uma superfície de auditoria.
2. **Registry único de seções** (`components/sections/registry.ts`) — mapa `_type →
   componente React do DS`. O renderer do Sanity e os custom components do Builder.io
   consomem o mesmo registry: marketing compõe, não estiliza; guardrails de lint alcançam
   100% do que renderiza.
3. **ISR com revalidação por tag** — páginas estáticas na CDN; webhook do Sanity →
   `revalidateTag` por documento; webhook do Builder.io idem. Publicou → site atualiza em
   segundos, sem rebuild.

## Modelo de conteúdo (Sanity)

| Documento | Campos principais |
|---|---|
| `page` | `title`, `slug`, `seo`, `sections[]` (page builder) |
| `post` | título, slug, excerpt, `body` Portable Text, autor (ref), categorias (ref), data, `seo`, `faq[]` opcional |
| `author`, `category` | refs do blog |
| `siteSettings` (singleton) | nav, footer, social, `organization` (JSON-LD), defaults de SEO |
| `redirect` | `from`, `to`, `permanent` — mapa 301 da migração gerenciável no CMS, lido pelo proxy |

- Objeto **`seo`** compartilhado (`metaTitle`, `metaDescription`, `canonical`, `ogImage`,
  `noIndex`) — paridade 1:1 com Yoast na migração.
- **Seções iniciais (~8)**: `hero`, `featureGrid`, `testimonials`, `logoCloud`,
  `ctaBanner`, `faq`, `richText`, `stats`.
- **Visual Editing**: Presentation tool + draft mode + overlays click-to-edit; preview de
  rascunho ao vivo.

## Rotas e proxy multi-host

```
app/
  (site)/            → omni.chat (layout institucional: header/footer)
    page.tsx         → home (documento page "home")
    [slug]/page.tsx  → páginas do builder Sanity
    blog/…           → índice, [slug], categoria
  lp/[slug]/         → Builder.io, layout enxuto sem chrome institucional
  studio/[[...tool]] → Sanity Studio
proxy.ts             → (1) host lp.omni.chat/x → rewrite interno /lp/x
                       (2) redirects 301 do Sanity (cacheados), preservando query string
                       (3) bloqueia /lp/* no host principal (evita conteúdo duplicado)
```

- Next 16: `proxy.ts` (ex-middleware), runtime Node, só redirect/rewrite/headers.
- Builder.io: SDK gen2 (`@builder.io/sdk-react`, sem `eval` — aprovável em security
  review), componentes permitidos = registry do DS, inputs de tema restritos aos tokens.

## SEO / GEO / AEO

- **SEO técnico**: `generateMetadata` por rota lendo `seo` do Sanity (canonical
  self-referencing, OG/Twitter, noIndex); `sitemap.ts` dinâmico (páginas + posts + LPs);
  `robots.ts` bloqueando `/studio` e `/api`; 301 no proxy com query string preservada.
- **JSON-LD** via componente único `<JsonLd>`: `Organization` + `WebSite` no root
  (de `siteSettings`), `Article` + `BreadcrumbList` em posts, `FAQPage` quando houver FAQ.
- **GEO/AEO**: `llms.txt` gerado do Sanity; FAQ como cidadão de primeira classe no schema
  (formato extraível que answer engines citam); headings semânticos garantidos pelos
  componentes de seção; conteúdo 100% server-rendered; `robots.ts` permitindo
  explicitamente GPTBot, ClaudeBot, PerplexityBot e afins (política de IA aberta).

## PostHog

- **Reverse proxy first-party**: rewrite `/ingest/*` → PostHog cloud no `next.config.ts`
  (resiste a adblocker/ITP; cookies no domínio próprio).
- Provider client com `capture_pageview: 'history_change'` (App Router é SPA); **mesmo
  project token atual** — continuidade dos dashboards e conexões Google Ads/Meta/Intercom.
- Captura server-side (`posthog-node`) para conversões críticas (ex.: formulário via API
  route) — atribuição independente do browser.
- `lp.omni.chat` compartilha token e proxy: campanha e site na mesma timeline de usuário.

## Enterprise/DevOps-readiness

- **Dependências mínimas, versões fixadas** (sem `^`): `next-sanity`,
  `@sanity/image-url`, `sanity`, `styled-components` (exigência do Studio),
  `@builder.io/sdk-react`, `posthog-js`, `posthog-node`, `server-only`.
- **`.env.example`** documentando: Sanity projectId/dataset/token de leitura, Builder.io
  public key, PostHog key/host, secret do endpoint de revalidação. Zero credencial no repo.
- **CI (GitHub Actions)**: `lint` (ESLint + `lint:design`) → `typecheck` → `build` como
  gate de merge — guardrails do DS incluídos.
- **`CLAUDE.md`** enxuto: comandos, convenções do registry, regra Whizz, como criar seção.

## Tratamento de erros

- Página/LP não encontrada no CMS → `notFound()` (404 do App Router).
- Sanity indisponível em revalidação → conteúdo estático anterior continua servido (ISR).
- Webhook com secret inválido → 401, sem revalidar.
- Draft mode restrito a sessões autenticadas do Studio.

## Testes e verificação

- `npm run lint` (ESLint + guardrails DS), `typecheck`, `build` — CI.
- Teste de fumaça local: dev server + página montada por seções renderiza; rota `/lp/x`
  responde via rewrite simulando host `lp.omni.chat`; `/sitemap.xml`, `/robots.txt`,
  `/llms.txt` respondem; JSON-LD presente no HTML; eventos PostHog chegam via `/ingest`.
- Teste negativo dos guardrails permanece válido (violações deliberadas falham o lint).

## Fora de escopo (fases seguintes)

Migração de conteúdo do WordPress, mapa 301 real, cutover de DNS, componente de logo do
CDN (base URL pendente — ver memória do projeto), formulários HubSpot, consent
mode/LGPD banner, dark mode.
