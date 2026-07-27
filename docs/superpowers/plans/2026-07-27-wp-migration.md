# Migração WordPress → Sanity Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reproduzir o site WordPress omni.chat neste Next.js (estrutura/copy fiéis, visual do DS novo), migrar todo o conteúdo para o Sanity, substituir Builder.io por LPs no Sanity e deixar o Studio em pt-BR.

**Architecture:** Mesmo monolito modular. Builder.io é removido; documento `landingPage` usa o registry de seções existente. Conteúdo WP entra via scripts idempotentes em `scripts/migrate-wp/` lendo a REST API ao vivo (`https://omni.chat/wp-json/wp/v2/*`) e escrevendo com `@sanity/client` (`_id` determinístico). 4 seções novas: `featureSplit`, `pricingTable`, `ctaForm`, `latestPosts`. Spec: `docs/superpowers/specs/2026-07-27-wp-migration-design.md`.

**Tech Stack:** Next.js 16.2.11, `next-sanity`, `sanity`, `@sanity/locale-pt-br`, `@sanity/client` (já vem com sanity), `tsx` (dev, para rodar scripts), vitest, Playwright.

## Global Constraints

- **Next.js 16 tem breaking changes** — ler `node_modules/next/dist/docs/` antes de usar APIs (AGENTS.md).
- **Deps fixadas**: `npm install --save-exact`. Novas deps permitidas nesta entrega: `@sanity/locale-pt-br`, `tsx` (dev), `node-html-parser` (dev, só scripts). Remover: `@builder.io/sdk-react`, `styled-components` (era dep do SDK gen2; remover só se `grep -r styled-components app components services` não achar uso próprio).
- **Design system obrigatório**: tokens `oc-*`; roxo Whizz só em `components/whizz/`; Card borda XOR sombra; `#FFBC00` nunca com tinta branca; `<Image>` nunca `<img>` (hook bloqueia). Gate: `npm run lint`.
- **Copy**: preservar o texto do WP fielmente (é conteúdo, não copy nova). Texto NOVO (labels de schema, mensagens) segue a skill `design-system-omnichat`: sentence case, sem emoji.
- **Schema todo em pt-BR**: todo `defineField`/`defineType` novo ou tocado ganha `title` (e `description` quando útil) em português.
- **Todo task termina com**: `npm run lint && npm run typecheck && npm test && npm run build` verdes antes do commit. E2E (`npm run test:e2e`) nos tasks que mexem em rotas.
- **Scripts de migração idempotentes**: `_id` determinístico (`wp-post-{id}`, `wp-page-{slug}`, `wp-category-{id}`); reexecutar atualiza, nunca duplica. Token de escrita via `SANITY_API_DEVELOPMENT_TOKEN` (validar com `scripts/migrate-wp/check-token.ts` do Task 5; se viewer, pedir token editor ao owner e PARAR).
- **Env**: nada hardcoded; `.env.example` sempre atualizado.

---

### Task 1: Remover Builder.io e criar documento landingPage

**Files:**
- Delete: `services/builder.ts`, `components/sections/builder-registry.ts`
- Modify: `package.json` (remover `@builder.io/sdk-react`; `styled-components` se sem uso próprio), `.env.example` (remover `NEXT_PUBLIC_BUILDER_API_KEY`), `sanity/schemas/index.ts`, `sanity/schemas/documents/page.ts` (referência de exemplo), `services/sanity/queries.ts`, `lib/revalidate.ts`, `app/lp/[[...slug]]/page.tsx` → substituir por `app/lp/[slug]/page.tsx`
- Create: `sanity/schemas/documents/landing-page.ts`
- Test: `tests/revalidate.test.ts` (ampliar), `tests/schemas.test.ts` (ampliar), `tests/e2e/proxy.spec.ts` (já cobre; deve continuar verde)

**Interfaces:**
- Consumes: `sectionRegistry`, `sanityFetch`, objeto `seo` de `sanity/schemas/objects/seo.ts`, `SectionRenderer` de `components/sections/section-renderer.tsx`.
- Produces: tipo de documento `landingPage` (campos `title`, `slug`, `seo`, `sections[]` — mesmos array members do `page`); `LANDING_PAGE_QUERY(slug)` e `LANDING_PAGE_SLUGS_QUERY` em `services/sanity/queries.ts`; `tagsFor("landingPage", slug)` → `["landingPage", "landingPage:"+slug]`; rota `/lp/[slug]` renderizando o documento.

- [ ] **Step 1: Escrever teste do schema landingPage**

Em `tests/schemas.test.ts`, adicionar:

```ts
it("landingPage existe com page builder e seo", () => {
  const lp = schemaTypes.find((t) => t.name === "landingPage");
  expect(lp).toBeDefined();
  const fields = (lp as { fields: { name: string }[] }).fields.map((f) => f.name);
  expect(fields).toEqual(expect.arrayContaining(["title", "slug", "seo", "sections"]));
});
```

- [ ] **Step 2: Rodar e ver falhar** — `npm test` → FAIL (landingPage undefined)

- [ ] **Step 3: Criar o schema**

`sanity/schemas/documents/landing-page.ts` — copiar o padrão de `page.ts` (mesmos members do array `sections`), com labels pt-BR:

```ts
import { defineField, defineType } from "sanity";

export const landingPage = defineType({
  name: "landingPage",
  title: "Landing page",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Título", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "seo", title: "SEO", type: "seo" }),
    defineField({
      name: "sections",
      title: "Seções",
      type: "array",
      of: [/* mesmos of do page.ts: hero, featureGrid, testimonials, logoCloud, ctaBanner, faq, richText, stats */],
    }),
  ],
});
```

Registrar em `sanity/schemas/index.ts`.

- [ ] **Step 4: Teste de revalidate**

Em `tests/revalidate.test.ts`:

```ts
it("landingPage gera tags de coleção e slug", () => {
  expect(tagsFor("landingPage", "black-friday")).toEqual(["landingPage", "landingPage:black-friday"]);
});
```

Rodar → FAIL → adicionar o caso em `lib/revalidate.ts` seguindo o padrão dos outros tipos → PASS.

- [ ] **Step 5: Queries**

Em `services/sanity/queries.ts` (padrão dos existentes, projeção de sections igual à do PAGE_QUERY):

```ts
export const LANDING_PAGE_QUERY = groq`*[_type == "landingPage" && slug.current == $slug][0]{ title, seo, sections[]{ ..., } }`;
export const LANDING_PAGE_SLUGS_QUERY = groq`*[_type == "landingPage" && defined(slug.current)].slug.current`;
```

(Reusar a projeção de seções exata do `PAGE_QUERY` — copiar o bloco.)

- [ ] **Step 6: Substituir a rota LP**

Apagar `app/lp/[[...slug]]/page.tsx`, `services/builder.ts`, `components/sections/builder-registry.ts`. Criar `app/lp/[slug]/page.tsx` no padrão de `app/(site)/[slug]/page.tsx` (mesma degradação `notFound()`), usando `LANDING_PAGE_QUERY`, tags `["landingPage", "landingPage:"+slug]`, `generateStaticParams` com `LANDING_PAGE_SLUGS_QUERY`, `generateMetadata` com `buildMetadata`. O layout `app/lp/layout.tsx` (enxuto) permanece.

- [ ] **Step 7: Remover deps e env**

```bash
npm uninstall @builder.io/sdk-react
grep -rn 'styled-components' app components services lib shared || npm uninstall styled-components
grep -rn 'BUILDER' . --include='*.ts' --include='*.tsx' --include='*.example' -l
```

Remover `NEXT_PUBLIC_BUILDER_API_KEY` de `.env.example` e qualquer referência restante (o grep deve terminar vazio).

- [ ] **Step 8: Gates + e2e** — `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e` (proxy.spec deve continuar verde: LP host sem conteúdo → 404).

- [ ] **Step 9: Commit** — `git commit -m "feat: replace builder.io with sanity landing pages"`

---

### Task 2: Studio em pt-BR

**Files:**
- Modify: `package.json`, `sanity.config.ts`, todos os arquivos de `sanity/schemas/**` (labels)
- Test: `tests/schemas.test.ts`

**Interfaces:**
- Consumes: schemas existentes.
- Produces: Studio com UI pt-BR; todos os fields com `title` em português (usado pelos editores de marketing).

- [ ] **Step 1: Instalar locale** — `npm install --save-exact @sanity/locale-pt-br`

- [ ] **Step 2: Registrar no config**

Em `sanity.config.ts`:

```ts
import { ptBRLocale } from "@sanity/locale-pt-br";
// em plugins: [...existentes, ptBRLocale()]
```

- [ ] **Step 3: Teste de labels pt-BR**

Em `tests/schemas.test.ts`:

```ts
it("todo field de documento tem title definido (pt-BR)", () => {
  for (const t of schemaTypes) {
    for (const f of (t as { fields?: { name: string; title?: string }[] }).fields ?? []) {
      expect(f.title, `${t.name}.${f.name} sem title`).toBeTruthy();
    }
  }
});
```

Rodar → provavelmente FAIL nos fields sem title.

- [ ] **Step 4: Traduzir todos os schemas** — passar por `sanity/schemas/documents/*.ts` e `sanity/schemas/objects/*.ts` adicionando `title` pt-BR a cada `defineType`/`defineField` (ex.: `excerpt` → "Resumo", `body` → "Conteúdo", `author` → "Autor", `publishedAt` → "Data de publicação", `metaTitle` → "Título (meta)", `noIndex` → "Não indexar"). Teste do Step 3 → PASS.

- [ ] **Step 5: Verificar Studio manualmente** — `npm run dev`, abrir `/studio`, conferir UI em português (menu "Conteúdo", botões "Publicar" etc.).

- [ ] **Step 6: Gates + commit** — `git commit -m "feat: sanity studio in pt-br with translated schemas"`

---

### Task 3: Seção featureSplit

**Files:**
- Modify: `sanity/schemas/objects/sections.ts`, `sanity/schemas/documents/page.ts`, `sanity/schemas/documents/landing-page.ts`, `components/sections/registry.ts`, `services/sanity/queries.ts` (projeção)
- Create: `components/sections/feature-split.tsx`
- Test: `tests/registry.test.ts` (paridade já força), `tests/schemas.test.ts`

**Interfaces:**
- Consumes: tokens DS, `Cta` de `shared/types.ts`, padrão dos componentes de seção existentes.
- Produces: tipo `featureSplit` no schema e no registry — campos: `overline?`, `title`, `body?` (text), `image?` ({imageUrl: url, alt: string}), `mediaSide` ("left"|"right", default "right"), `cta?` (Cta), `dark?` (boolean). Usado pelos seeds do Task 8.

- [ ] **Step 1: Schema** — em `sections.ts`, novo `defineType` `featureSplit` (labels pt-BR: "Bloco mídia + texto"), com os campos acima; adicionar ao array `sectionTypes` e ao `of` de `sections` em `page.ts` e `landing-page.ts`.

- [ ] **Step 2: Rodar `npm test`** — `tests/registry.test.ts` (paridade schema↔registry) deve FALHAR acusando `featureSplit` sem componente.

- [ ] **Step 3: Componente**

`components/sections/feature-split.tsx` — grid 2 colunas (`md:grid-cols-2`), texto com `oc-overline`/`oc-h2`/corpo, imagem com `<Image>` (mesmo padrão de dimensões do logo-cloud: width/height nominais + classes), ordem invertida quando `mediaSide === "left"` (`md:order-first`), fundo `oc-ink` com texto claro quando `dark`. CTA com o mesmo componente de botão usado pelo `hero`.

- [ ] **Step 4: Registrar** — `registry.ts`: `featureSplit: FeatureSplit`. Projeção da seção nas queries (`PAGE_QUERY`, `LANDING_PAGE_QUERY`) se a projeção for por spread já cobre; conferir.

- [ ] **Step 5: Testes verdes + gates + commit** — `git commit -m "feat: featureSplit section"`

---

### Task 4: Seções pricingTable, ctaForm e latestPosts

**Files:**
- Modify: `sanity/schemas/objects/sections.ts`, `page.ts`, `landing-page.ts`, `components/sections/registry.ts`, `components/sections/section-renderer.tsx` (se precisar de dados async p/ latestPosts)
- Create: `components/sections/pricing-table.tsx`, `components/sections/cta-form.tsx`, `components/sections/latest-posts.tsx`
- Test: `tests/registry.test.ts`, `tests/schemas.test.ts`

**Interfaces:**
- Consumes: `Card` (`elevation`), `sanityFetch` + `POSTS_QUERY` (latestPosts), `PostCard` de `components/site/post-card.tsx`.
- Produces:
  - `pricingTable`: `title?`, `plans[]` — cada plano `{name, description, highlight?: boolean, features: string[], ctaLabel, ctaHref}` (sem preço numérico: o site atual não publica preços; validação `plans` min 1).
  - `ctaForm`: `overline?`, `title`, `body?`, `formAction` (url), `buttonLabel`, `fields[]` (array de `{name, label, type: "text"|"email"|"tel", required}`) — POST simples para `formAction` (destino atual do WP; sem backend próprio, conforme spec).
  - `latestPosts`: `title?`, `limit` (number, default 4) — server component que busca posts via `sanityFetch` com tag `post`.

- [ ] **Step 1: Schemas dos 3 tipos** (labels pt-BR: "Tabela de planos", "Formulário de captura", "Últimos posts"); adicionar aos `sectionTypes` e aos `of` dos dois documentos. `npm test` → paridade FALHA.

- [ ] **Step 2: pricing-table.tsx** — grid de `Card`s (borda; `highlight` usa sombra + borda `oc-yellow-cta`), nome `oc-h3`, lista de features com ícone check, CTA botão primário. Sem preço.

- [ ] **Step 3: cta-form.tsx** — client component (`"use client"`), `<form action={formAction} method="post">` com inputs gerados de `fields[]` (labels visíveis, `required` nativo), botão primário. Sem JS de submit próprio.

- [ ] **Step 4: latest-posts.tsx** — async server component: `sanityFetch({query: POSTS_QUERY, tags: ["post"]})`, slice `limit`, render com `PostCard`. Se o renderer atual só suporta componentes síncronos, ajustar `section-renderer.tsx` para aceitar async (React 19 suporta server components async em árvore de RSC — conferir doc `node_modules/next/dist/docs/`).

- [ ] **Step 5: Paridade verde, gates, commit** — `git commit -m "feat: pricingTable, ctaForm and latestPosts sections"`

---

### Task 5: Conversor HTML → Portable Text + cliente WP

**Files:**
- Create: `scripts/migrate-wp/html-to-pt.ts`, `scripts/migrate-wp/wp-client.ts`, `scripts/migrate-wp/sanity-write.ts`, `scripts/migrate-wp/check-token.ts`
- Modify: `package.json` (devDep `tsx`; script `"migrate:wp": "tsx scripts/migrate-wp/run.ts"` — run.ts vem no Task 6)
- Test: `tests/html-to-pt.test.ts`

**Interfaces:**
- Consumes: nada do app (módulos puros de script).
- Produces:
  - `htmlToPortableText(html: string, opts: {uploadImage: (url: string, alt: string) => Promise<string>}): Promise<PortableTextBlock[]>` — converte p, h2–h4, ul/ol/li, a (marks com href), strong/em, blockquote, img (chama `uploadImage`, insere bloco `{_type: "image", asset: {_ref}}`), figure/figcaption; desconhecidos → texto plano + `console.warn("[migrate] bloco não mapeado: <tag>")`.
  - `wpFetchAll<T>(endpoint: string): Promise<T[]>` — pagina `per_page=100` até `x-wp-totalpages`.
  - `writeClient` — `createClient` de `sanity` com `token: process.env.SANITY_API_DEVELOPMENT_TOKEN`, `useCdn: false`, `apiVersion` da env.
  - `check-token.ts` — cria e deleta um doc `_id: "migrate-wp.token-check"`; se 403, imprime instrução de gerar token editor e `process.exit(1)`.

- [ ] **Step 1: Instalar tsx** — `npm install --save-exact --save-dev tsx`

- [ ] **Step 2: Testes do conversor primeiro** (`tests/html-to-pt.test.ts`) — casos com HTML real do WP:

```ts
import { htmlToPortableText } from "../scripts/migrate-wp/html-to-pt";
const noUpload = { uploadImage: async () => "image-fake" };

it("converte parágrafos e headings", async () => {
  const blocks = await htmlToPortableText("<h2>Título</h2><p>Texto <strong>forte</strong>.</p>", noUpload);
  expect(blocks[0]).toMatchObject({ _type: "block", style: "h2" });
  expect(blocks[1].children.map((c: { text: string }) => c.text).join("")).toBe("Texto forte.");
  expect(blocks[1].children[1].marks).toContain("strong");
});

it("converte listas e links", async () => {
  const blocks = await htmlToPortableText('<ul><li><a href="https://x.y">item</a></li></ul>', noUpload);
  expect(blocks[0]).toMatchObject({ _type: "block", listItem: "bullet" });
  expect(blocks[0].markDefs[0]).toMatchObject({ _type: "link", href: "https://x.y" });
});

it("converte imagem chamando uploadImage", async () => {
  const up = vi.fn(async () => "image-abc");
  const blocks = await htmlToPortableText('<img src="https://omni.chat/a.png" alt="x">', { uploadImage: up });
  expect(up).toHaveBeenCalledWith("https://omni.chat/a.png", "x");
  expect(blocks[0]).toMatchObject({ _type: "image", asset: { _ref: "image-abc" } });
});
```

- [ ] **Step 3: Implementar o conversor** — parser sem dependência nova: regex não serve; usar `parse5`? NÃO adicionar dep — Node 22 não tem DOM. Alternativa aprovada: o pacote `sanity` já traz `@sanity/block-tools`? Não confiável. **Decisão: usar `parse5` que já é dependência transitiva? Não.** Implementar com a API `HTMLRewriter`? Não existe em Node. **Usar o parser leve embutido em `next` não é público.** Portanto: adicionar devDep `node-html-parser` (fixada) — leve, sem transitivas, só para scripts. (Constraint de deps: registrar no relatório para o DevOps; é devDependency de script, não vai ao bundle.)

```bash
npm install --save-exact --save-dev node-html-parser
```

Implementar `htmlToPortableText` percorrendo a árvore do `node-html-parser`, gerando blocks com `_key` (usar hash curto do conteúdo para determinismo).

- [ ] **Step 4: wp-client** — `wpFetchAll` com fetch nativo, paginação por header; `check-token.ts` conforme interface.

- [ ] **Step 5: Testes verdes, gates, commit** — `git commit -m "feat: wp migration toolkit (html to portable text, wp client, token check)"`

---

### Task 6: Migração de categorias, autores, mídia e posts

**Files:**
- Create: `scripts/migrate-wp/run.ts`, `scripts/migrate-wp/media.ts`
- Test: `tests/html-to-pt.test.ts` (já cobre conversão); validação por execução real + relatório

**Interfaces:**
- Consumes: `wpFetchAll`, `htmlToPortableText`, `writeClient`, schema `post`/`category`/`author` existentes.
- Produces: dataset populado; `uploadImageFromUrl(url): Promise<string>` em `media.ts` (baixa do WP, `writeClient.assets.upload("image", buffer, {filename})`, cache local em `scripts/migrate-wp/.media-cache.json` url→assetId para idempotência); relatório em stdout.

- [ ] **Step 1: media.ts** — download com fetch (seguir redirects), upload, cache; pular URLs fora de `omni.chat`.

- [ ] **Step 2: run.ts** — ordem: `check-token` → categorias (`wp-category-{id}`, title, slug) → autores (`/wp/v2/users` públicos; `wp-author-{id}`) → posts em lotes de 20: `{_id: "wp-post-{id}", _type: "post", title (decodificar entities), slug, excerpt (strip tags), publishedAt: date, categories: refs, author: ref, coverImage: upload de featured_media, body: await htmlToPortableText(content.rendered), seo: {metaTitle: yoast_head_json?.title ?? title, metaDescription: yoast_head_json?.description ?? excerpt}}` via `createOrReplace`. (Conferir se a API expõe `yoast_head_json` — `curl 'https://omni.chat/wp-json/wp/v2/posts?per_page=1' | grep yoast`; se não, fallback title/excerpt.)

- [ ] **Step 3: Rodar** — `npm run migrate:wp` (esperado ~201 posts, 17 categorias; relatório final com contagens e blocos não mapeados). Rodar 2ª vez → mesmas contagens, zero duplicatas (verificar `*[_type=="post"]` count via `npx sanity documents query` ou script).

- [ ] **Step 4: Conferir no site** — `npm run dev`, `/blog` lista posts reais, abrir 3 posts (um antigo, um com imagens inline, um recente) e conferir corpo/imagens.

- [ ] **Step 5: Gates + commit** — `git commit -m "feat: migrate wp posts, categories, authors and media to sanity"`

---

### Task 7: Páginas legais + siteSettings (nav/footer do WP)

**Files:**
- Create: `scripts/migrate-wp/legal-pages.ts`, `scripts/migrate-wp/site-settings.ts` (chamados pelo `run.ts`)
- Test: execução + e2e existente

**Interfaces:**
- Consumes: `htmlToPortableText`, `writeClient`, schema `page`, `siteSettings`.
- Produces: docs `wp-page-lgpd`, `wp-page-termos-de-uso`, `wp-page-politicas-de-privacidade` (`page` com uma seção `richText` contendo o corpo convertido); `siteSettings` com nav igual ao WP: Home, Soluções?, Planos, Empresa, Conteúdo (/blog), Chat Commerce Report — **extrair os itens reais do header renderizado de omni.chat** (`curl -sL https://omni.chat | grep -A2 'nav'`), mesmos labels e ordem; footer com colunas/links do WP e social links reais.

- [ ] **Step 1: legal-pages.ts** — para cada slug legal: fetch da page via REST, `htmlToPortableText(content.rendered)`, doc `page` com `sections: [{_type: "richText", _key: "body", content: blocks}]` (conferir nome do campo do richText no schema), seo do título.
- [ ] **Step 2: site-settings.ts** — extrair nav/footer do HTML renderizado (uma vez, hardcoded no script com os valores reais extraídos — é seed, não parser genérico) e `createOrReplace` do singleton `siteSettings`.
- [ ] **Step 3: Rodar, conferir `/lgpd` etc. renderizando; header/footer do site com menu real.**
- [ ] **Step 4: Gates + commit** — `git commit -m "feat: migrate legal pages and site settings from wp"`

---

### Task 8: Modelagem das 4 páginas de marketing

**Files:**
- Create: `scripts/migrate-wp/seed-marketing-pages.ts`
- Test: e2e (Task 9); aprovação visual do owner

**Interfaces:**
- Consumes: todas as seções (incl. Task 3/4), `writeClient`, `uploadImageFromUrl`.
- Produces: docs `page` com `_id`: `wp-page-home` (slug "home"), `wp-page-empresa`, `wp-page-planos`, `wp-page-chat-commerce-report`, seções na MESMA ordem do WP.

Mapa de blocos (extraído do site em 2026-07-27 — conferir contra o site ao vivo ao implementar; copy SEMPRE extraída da página renderizada, nunca inventada):

- **home**: hero (H1 "Domine marketing e vendas no WhatsApp…", CTA) → featureSplit ×5 (agentes de IA vendas / empodere seu time / pós-venda / gerencie conversas / campanhas de marketing — alternando mediaSide) → stats (contadores da faixa "Por que o canal conversacional…") → featureGrid (comece rápido / cresça com acompanhamento / suporte humano / comunidade) → ctaBanner ("Descubra a solução ideal") → featureGrid ou logoCloud final ("Evolua sua empresa com nossas soluções") conforme o rendered.
- **empresa**: hero → richText (manifesto "Somos o parceiro de crescimento…") → featureSplit (500 marcas / recuperação de carrinho) → featureSplit dark ("Seja um Omnier…") → featureGrid (benefícios de ser Omnier) → logoCloud (imprensa "no radar das maiores empresas…") → latestPosts (os 4 posts destacados).
- **planos**: hero → pricingTable (4 planos: descrições H3 extraídas + features das listas do WP + combo "Marketing Studio + Sales Studio + Whizz" como plano `highlight`) → ctaBanner ("Pronto para transformar seu WhatsApp…") → ctaBanner quiz ("Descubra o plano ideal…").
- **chat-commerce-report**: hero → ctaForm (captura do report — extrair `action` do form real do WP e os campos) → logoCloud ("Grandes marcas no Chat-Commerce Report 2026") → featureSplit → featureGrid (4 destaques: escala / IA 24h / campanhas / benchmarks) → testimonials ("Depoimentos") → ctaBanner ("Os padrões já estão mapeados…") → richText ("Quem somos nós?").

- [ ] **Step 1: Extrair conteúdo real** — para cada página, `curl -sL https://omni.chat/{slug}/` e montar no script os objetos de seção com copy literal (títulos, parágrafos, features, depoimentos, URLs de imagem → `uploadImageFromUrl`).
- [ ] **Step 2: Seed idempotente** — `createOrReplace` dos 4 docs; home com o slug que a rota home consome (conferir `app/(site)/page.tsx` — documento "home").
- [ ] **Step 3: Rodar e revisar página a página no dev** contra o WP aberto do lado (mesma ordem de seções, copy idêntica).
- [ ] **Step 4: Gates + commit** — `git commit -m "feat: seed marketing pages modeled from wp site"`

---

### Task 9: E2E ampliado + validação visual

**Files:**
- Create: `tests/e2e/content.spec.ts`, `scripts/visual-compare.ts`
- Modify: `tests/e2e/a11y.spec.ts` (adicionar /planos, /empresa, /chat-commerce-report)

**Interfaces:**
- Consumes: conteúdo migrado (Tasks 6–8), suite Playwright existente.
- Produces: e2e cobrindo conteúdo real; `scripts/visual-compare.ts` gera `docs/superpowers/visual-review/{pagina}-{wp|novo}.png` para aprovação do owner.

- [ ] **Step 1: content.spec.ts**

```ts
const PAGES = [
  { path: "/", h1: /Domine marketing e vendas no WhatsApp/i },
  { path: "/empresa", h1: /Criamos tecnologia para aproximar/i },
  { path: "/planos", h1: /Escolha o plano/i },
  { path: "/chat-commerce-report", h1: /retrato em dados da jornada/i },
  { path: "/lgpd", h1: /LGPD/i },
];
for (const p of PAGES)
  test(`${p.path} renderiza conteúdo migrado`, async ({ page }) => {
    await page.goto(p.path);
    await expect(page.locator("h1")).toContainText(p.h1);
  });
test("post migrado abre com corpo", async ({ page }) => {
  await page.goto("/blog/reduzir-custo-do-whatsapp");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.locator("article p").first()).toBeVisible();
});
```

- [ ] **Step 2: a11y nas páginas novas** (mesmo padrão, adicionar paths).
- [ ] **Step 3: visual-compare.ts** — Playwright standalone: para cada página, screenshot full-page do WP ao vivo e do localhost, salvos lado a lado em `docs/superpowers/visual-review/`; imprimir caminhos.
- [ ] **Step 4: Rodar tudo** — `npm run test:e2e` verde; gerar os pares de screenshot.
- [ ] **Step 5: Commit** — `git commit -m "test: e2e for migrated content and visual comparison tooling"`

---

### Task 10: Limpeza, docs e verificação final

**Files:**
- Modify: `CLAUDE.md`, `.env.example`, `docs/` conforme necessário

- [ ] **Step 1: CLAUDE.md** — remover menções ao Builder.io; documentar `landingPage`, seções novas, `npm run migrate:wp`, fluxo de LP no Sanity.
- [ ] **Step 2: Varredura** — `grep -rn -i builder app components services lib shared sanity tests scripts *.ts` → vazio (exceto histórico em docs/specs antigas, que ficam).
- [ ] **Step 3: Suite completa** — `npm run lint && npm run typecheck && npm test && npm run build && npm run test:e2e` tudo verde.
- [ ] **Step 4: Commit final** — `git commit -m "chore: docs and cleanup after wp migration"`
- [ ] **Step 5: Apresentar ao owner** — pares de screenshot de `docs/superpowers/visual-review/` para aceite visual (gate antes de qualquer cutover de DNS).
