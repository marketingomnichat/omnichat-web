# Migração WordPress → Sanity + LPs no Sanity + Studio pt-BR

Data: 2026-07-27 · Status: aprovado por João Moitinho (owner omni.chat)

## Contexto e decisões

- Reproduzir o site WordPress omni.chat neste Next.js: **estrutura, ordem de seções e copy fiéis ao site atual, visual com o design system novo** (tokens `oc-*`). Nada de clonar o CSS do tema WP.
- **Builder.io sai do projeto.** As LPs de campanha passam a ser documentos no Sanity, renderizadas pelo mesmo registry de seções. O código HTML+CSS+JS das LPs será fornecido depois; esta entrega deixa a infraestrutura pronta.
- Studio Sanity inteiro em **pt-BR** (locale oficial + schema traduzido).
- Fonte da migração: **REST API ao vivo** de omni.chat (aberta; 8 páginas, 201 posts, 17 categorias, Elementor nas páginas de marketing). O export .wpress não está disponível (download corrompe).
- Imagens migram para **assets do Sanity** (somente as referenciadas; capa + inline). Site fica independente do WP.
- Posts já vivem em `/blog/{slug}` no WP — sem necessidade de redirects em massa; documentos `redirect` só para divergências pontuais.

## Inventário WP

| Conteúdo | Qtde | Destino |
|---|---|---|
| Páginas marketing (home, empresa, planos, chat-commerce-report) | 4 | `page` com `sections[]`, modelagem manual guiada pelo site renderizado |
| Páginas legais (lgpd, termos-de-uso, politicas-de-privacidade) | 3 | `page` com seção `richText` convertida do HTML |
| Índice do blog | 1 | já existe rota própria (`/blog`) — não vira documento |
| Posts | 201 | `post` com Portable Text, categorias, data, excerpt, SEO |
| Categorias | 17 | `category` |
| Mídia | 949 no WP | apenas as referenciadas viram assets Sanity |

## Remoção do Builder.io

- Remover: dep `@builder.io/sdk-react`, `services/builder.ts`, `components/sections/builder-registry.ts`, env `NEXT_PUBLIC_BUILDER_API_KEY`.
- `app/lp/[slug]` passa a renderizar documento `landingPage` do Sanity (layout enxuto sem chrome institucional, como hoje). Proxy multi-host não muda (host LP → rewrite `/lp/*`).
- Novo documento **`landingPage`**: `title`, `slug`, `seo`, `sections[]` — mesmo page builder do `page`. Tag de cache `landingPage` / `landingPage:{slug}`; webhook de revalidação passa a cobrir o tipo.

## Modelagem manual das páginas de marketing

Fluxo por página: screenshot + HTML renderizado do WP → mapa de blocos → seções do DS (criar tipos que faltarem, candidatos: `pricingTable`, `ctaForm`/captura de lead, faixa de integrações) → conteúdo real extraído → documento `page` populado via script. Toda seção nova segue o fluxo padrão: schema em `sanity/schemas/objects/sections.ts` + componente em `components/sections/` + registry + teste de paridade.

Validação de fidelidade: screenshots Playwright das páginas migradas lado a lado com o WP ao vivo, aprovadas pelo owner antes do cutover.

Header/footer/nav do WP reproduzidos em `siteSettings` (mesmos itens de menu e links).

## Script de migração (`scripts/migrate-wp/`)

- Node/TS, roda com `npx tsx` ou vitest-friendly; usa REST API (`/wp-json/wp/v2/*`) e escreve via `@sanity/client` com token de **escrita** (`SANITY_API_DEVELOPMENT_TOKEN` — validar permissão; se viewer, gerar token editor).
- **Idempotente**: `_id` determinístico (`wp-post-{id}`, `wp-page-{slug}`, `wp-category-{id}`, `wp-media-{id}`) — reexecutar atualiza em vez de duplicar.
- Conversão **Gutenberg/HTML → Portable Text** própria e testada (unit): parágrafos, headings, listas, links, imagens (upload + referência), blockquote, código; o que não mapear degrada para bloco de texto com aviso no log.
- SEO por conteúdo: meta title/description do Yoast (via head da página renderizada ou plugin REST se exposto) → objeto `seo`.
- Relatório final: contagens migradas, mídias enviadas, blocos não mapeados, divergências de slug (→ candidatos a `redirect`).

## Studio pt-BR

- `@sanity/locale-pt-br` (oficial, fixada) registrado no `sanity.config.ts`.
- Todos os schemas com `title`/`description` de campos em português (page, post, author, category, siteSettings, redirect, landingPage e todas as seções).

## Testes

- Unit: conversor HTML→Portable Text (casos reais extraídos de posts do omni.chat), seções novas no teste de paridade do registry.
- E2E: páginas migradas (/, /empresa, /planos, /chat-commerce-report, 3 legais) respondendo 200 com conteúdo, posts amostrais em `/blog/{slug}`, a11y (axe) nas páginas novas, LP de exemplo em host LP.
- Gates de sempre: `lint`, `lint:design`, `typecheck`, `test`, `build` verdes por task.

## Fora de escopo

- Migração do conteúdo das LPs (aguarda o código HTML+CSS+JS; a infraestrutura `landingPage` fica pronta).
- Cutover de DNS/desligamento do WP (após aceite visual do owner).
- Formulários de captura com backend real (a seção `ctaForm` renderiza e aponta para o destino atual; integração de marketing é fase posterior).
