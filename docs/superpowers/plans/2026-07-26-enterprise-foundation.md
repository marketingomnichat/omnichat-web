# Fundação Enterprise omni.chat — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fundação completa do site enterprise omni.chat: Sanity (site + blog, page builder de seções, Visual Editing), Builder.io em `lp.omni.chat` via proxy multi-host, SEO/GEO/AEO e PostHog first-party.

**Architecture:** Monolito modular Next.js 16 App Router. Registry único de seções (`components/sections/registry.ts`) consumido pelo renderer Sanity e pelos custom components do Builder.io. ISR com `revalidateTag` via webhooks. Studio embutido em `/studio`. Spec: `docs/superpowers/specs/2026-07-26-enterprise-architecture-design.md`.

**Tech Stack:** Next.js 16.2.11, React 19, Tailwind v4, `next-sanity`, `sanity`, `@sanity/image-url`, `@builder.io/sdk-react` (gen2), `posthog-js`, `posthog-node`, `server-only`, `vitest` (dev).

## Global Constraints

- **Next.js 16 tem breaking changes** — antes de usar qualquer API, ler o guia em `node_modules/next/dist/docs/` (AGENTS.md). Proxy: `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`.
- **Dependências fixadas**: instalar com `npm install --save-exact`. Nenhuma dep além das listadas no Tech Stack (DevOps audita depois).
- **Design system obrigatório**: tokens `oc-*` de `app/globals.css`; roxo Whizz só em `components/whizz/`; Card borda XOR sombra; `#FFBC00` nunca com tinta branca. Gate: `npm run lint:design`.
- **Copy**: sentence case em títulos/botões, sem emoji, termos proibidos da skill `design-system-omnichat` (ex.: "atendimento"→"vendas", "ROI"→"ROAS", "bot"→"Whizz/IA generativa").
- **Credenciais só via env** — nada hardcoded; `.env.example` documenta tudo.
- **Todo task termina com**: `npm run lint && npm run build` verdes antes do commit.
- Conta Sanity é corporativa/externa: usar `NEXT_PUBLIC_SANITY_PROJECT_ID`/`NEXT_PUBLIC_SANITY_DATASET` de env; em dev local sem credenciais, rotas devem degradar com `notFound()`/listas vazias, nunca crash de build.

---

### Task 1: Dependências, env e test runner

**Files:**
- Modify: `package.json`
- Create: `.env.example`, `vitest.config.ts`, `.env.local` (não commitado)

**Interfaces:**
- Produces: deps instaladas; script `npm test` (vitest run); script `npm run typecheck` (`tsc --noEmit`); env vars nomeadas usadas por todos os tasks seguintes.

- [ ] **Step 1: Instalar dependências fixadas**

```bash
npm install --save-exact next-sanity sanity @sanity/image-url styled-components @builder.io/sdk-react posthog-js posthog-node server-only
npm install --save-exact --save-dev vitest
```

- [ ] **Step 2: Adicionar scripts ao package.json**

Em `scripts` (manter os existentes):

```json
"typecheck": "tsc --noEmit",
"test": "vitest run"
```

- [ ] **Step 3: Criar vitest.config.ts**

```ts
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    include: ["tests/**/*.test.ts"],
  },
});
```

- [ ] **Step 4: Criar .env.example**

```bash
# Sanity (conta corporativa OmniChat)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2026-07-01
# Token de leitura (viewer) para draft mode / visual editing
SANITY_API_READ_TOKEN=
# Secret compartilhado do webhook de revalidação
REVALIDATE_SECRET=

# Builder.io (LPs de campanha em lp.omni.chat)
NEXT_PUBLIC_BUILDER_API_KEY=

# PostHog (mesmo projeto/token já usado pela OmniChat)
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

# Hosts
NEXT_PUBLIC_SITE_URL=https://omni.chat
NEXT_PUBLIC_LP_HOST=lp.omni.chat
```

- [ ] **Step 5: Copiar para .env.local com valores de dev vazios e conferir que .gitignore cobre .env.local**

Run: `grep -n "env" .gitignore`
Expected: `.env*` (padrão do create-next-app já cobre; `.env.example` precisa ser força-adicionado ou o gitignore ajustado para `!.env.example`).

Adicionar ao `.gitignore` se necessário:

```
!.env.example
```

- [ ] **Step 6: Verificar e commitar**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: verdes.

```bash
git add package.json package-lock.json .env.example vitest.config.ts .gitignore
git commit -m "chore: add pinned deps, env template and test runner"
```

---

### Task 2: Cliente Sanity e queries GROQ

**Files:**
- Create: `lib/sanity/env.ts`, `lib/sanity/client.ts`, `lib/sanity/queries.ts`, `lib/sanity/image.ts`
- Test: `tests/queries.test.ts`

**Interfaces:**
- Consumes: env vars do Task 1.
- Produces:
  - `client` (SanityClient configurado) e `sanityFetch<T>({query, params, tags}): Promise<T>` de `lib/sanity/client.ts` — fetch com `next: {tags}` para ISR.
  - Queries string de `lib/sanity/queries.ts`: `PAGE_QUERY` (param `$slug`), `HOME_QUERY`, `PAGE_SLUGS_QUERY`, `POST_QUERY` (param `$slug`), `POSTS_QUERY`, `POST_SLUGS_QUERY`, `SETTINGS_QUERY`, `REDIRECTS_QUERY`, `LLMS_QUERY`.
  - `urlFor(source)` de `lib/sanity/image.ts`.

- [ ] **Step 1: Ler a doc do next-sanity instalado**

Run: `sed -n '1,150p' node_modules/next-sanity/README.md`
Confirmar API atual de client + fetch com tags (se a API divergir do código abaixo, seguir a doc instalada e manter as assinaturas do bloco Interfaces).

- [ ] **Step 2: Escrever teste falhando das queries**

```ts
// tests/queries.test.ts
import { describe, expect, it } from "vitest";
import {
  HOME_QUERY,
  PAGE_QUERY,
  POSTS_QUERY,
  POST_QUERY,
  REDIRECTS_QUERY,
  SETTINGS_QUERY,
} from "../lib/sanity/queries";

describe("GROQ queries", () => {
  it("busca page por slug com sections", () => {
    expect(PAGE_QUERY).toContain('_type == "page"');
    expect(PAGE_QUERY).toContain("$slug");
    expect(PAGE_QUERY).toContain("sections");
  });
  it("home é a page de slug 'home'", () => {
    expect(HOME_QUERY).toContain('"home"');
  });
  it("post traz seo e faq", () => {
    expect(POST_QUERY).toContain('_type == "post"');
    expect(POST_QUERY).toContain("seo");
    expect(POST_QUERY).toContain("faq");
  });
  it("posts ordenados por data desc", () => {
    expect(POSTS_QUERY).toContain("order(publishedAt desc)");
  });
  it("settings é singleton", () => {
    expect(SETTINGS_QUERY).toContain('_type == "siteSettings"');
    expect(SETTINGS_QUERY).toContain("[0]");
  });
  it("redirects trazem from/to/permanent", () => {
    for (const f of ["from", "to", "permanent"]) {
      expect(REDIRECTS_QUERY).toContain(f);
    }
  });
});
```

- [ ] **Step 3: Rodar e ver falhar**

Run: `npm test`
Expected: FAIL (módulo `lib/sanity/queries` não existe).

- [ ] **Step 4: Implementar env.ts, client.ts, queries.ts, image.ts**

```ts
// lib/sanity/env.ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2026-07-01";
export const hasSanityConfig = projectId.length > 0;
```

```ts
// lib/sanity/client.ts
import { createClient, type QueryParams } from "next-sanity";
import { apiVersion, dataset, hasSanityConfig, projectId } from "./env";

export const client = createClient({
  projectId: projectId || "placeholder",
  dataset,
  apiVersion,
  useCdn: true,
  stega: { studioUrl: "/studio" },
});

export async function sanityFetch<T>({
  query,
  params = {},
  tags,
}: {
  query: string;
  params?: QueryParams;
  tags: string[];
}): Promise<T | null> {
  // Sem credenciais (dev local/CI), degrada sem crash de build.
  if (!hasSanityConfig) return null;
  return client.fetch<T>(query, params, { next: { tags } });
}
```

```ts
// lib/sanity/queries.ts
const SEO_FIELDS = `seo{metaTitle, metaDescription, canonical, "ogImage": ogImage.asset->url, noIndex}`;

export const PAGE_QUERY = `*[_type == "page" && slug.current == $slug][0]{
  title, "slug": slug.current, ${SEO_FIELDS},
  sections[]{..., _type, _key}
}`;

export const HOME_QUERY = `*[_type == "page" && slug.current == "home"][0]{
  title, "slug": slug.current, ${SEO_FIELDS},
  sections[]{..., _type, _key}
}`;

export const PAGE_SLUGS_QUERY = `*[_type == "page" && defined(slug.current) && slug.current != "home"].slug.current`;

export const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  title, "slug": slug.current, excerpt, body, publishedAt, ${SEO_FIELDS},
  "author": author->{name, role}, "categories": categories[]->{title, "slug": slug.current},
  faq[]{question, answer}
}`;

export const POSTS_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc){
  title, "slug": slug.current, excerpt, publishedAt,
  "categories": categories[]->{title, "slug": slug.current}
}`;

export const POST_SLUGS_QUERY = `*[_type == "post" && defined(slug.current)].slug.current`;

export const SETTINGS_QUERY = `*[_type == "siteSettings"][0]{
  siteName, nav[]{label, href}, footerText,
  social[]{platform, url},
  organization{name, legalName, url, logoUrl, sameAs}
}`;

export const REDIRECTS_QUERY = `*[_type == "redirect"]{ "from": from, "to": to, "permanent": permanent }`;

export const LLMS_QUERY = `{
  "pages": *[_type == "page" && defined(slug.current) && seo.noIndex != true]{title, "slug": slug.current},
  "posts": *[_type == "post" && defined(slug.current)] | order(publishedAt desc){title, "slug": slug.current, excerpt}
}`;
```

```ts
// lib/sanity/image.ts
import createImageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { dataset, projectId } from "./env";

const builder = createImageUrlBuilder({ projectId, dataset });

export function urlFor(source: SanityImageSource) {
  return builder.image(source).auto("format");
}
```

- [ ] **Step 5: Rodar testes e gates**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Expected: verdes.

- [ ] **Step 6: Commit**

```bash
git add lib/ tests/
git commit -m "feat: sanity client, GROQ queries and image builder"
```

---

### Task 3: Schemas Sanity e Studio embutido

**Files:**
- Create: `sanity/schemas/objects/seo.ts`, `sanity/schemas/objects/sections.ts`, `sanity/schemas/documents/page.ts`, `sanity/schemas/documents/post.ts`, `sanity/schemas/documents/author.ts`, `sanity/schemas/documents/category.ts`, `sanity/schemas/documents/site-settings.ts`, `sanity/schemas/documents/redirect.ts`, `sanity/schemas/index.ts`, `sanity.config.ts`, `app/studio/[[...tool]]/page.tsx`
- Test: `tests/schemas.test.ts`

**Interfaces:**
- Produces: `schemaTypes` (array) de `sanity/schemas/index.ts`; tipos de seção com `name` exatamente: `hero`, `featureGrid`, `testimonials`, `logoCloud`, `ctaBanner`, `faq`, `richText`, `stats` (o registry do Task 4 usa esses nomes como chave); `sanity.config.ts` com Structure + Presentation tools.

- [ ] **Step 1: Teste falhando — schema cobre os 8 tipos de seção e os 6 documentos**

```ts
// tests/schemas.test.ts
import { describe, expect, it } from "vitest";
import { schemaTypes } from "../sanity/schemas";

const names = schemaTypes.map((t: { name: string }) => t.name);

describe("sanity schema", () => {
  it("tem os documentos do modelo de conteúdo", () => {
    for (const doc of ["page", "post", "author", "category", "siteSettings", "redirect"]) {
      expect(names).toContain(doc);
    }
  });
  it("tem os 8 tipos de seção do page builder", () => {
    for (const s of ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats"]) {
      expect(names).toContain(s);
    }
  });
  it("tem o objeto seo compartilhado", () => {
    expect(names).toContain("seo");
  });
});
```

Run: `npm test` — Expected: FAIL.

- [ ] **Step 2: Implementar objeto seo**

```ts
// sanity/schemas/objects/seo.ts
import { defineField, defineType } from "sanity";

export const seo = defineType({
  name: "seo",
  title: "SEO",
  type: "object",
  fields: [
    defineField({ name: "metaTitle", type: "string", validation: (r) => r.max(60) }),
    defineField({ name: "metaDescription", type: "text", rows: 3, validation: (r) => r.max(160) }),
    defineField({ name: "canonical", type: "url" }),
    defineField({ name: "ogImage", type: "image" }),
    defineField({ name: "noIndex", type: "boolean", initialValue: false }),
  ],
});
```

- [ ] **Step 3: Implementar os 8 objetos de seção**

```ts
// sanity/schemas/objects/sections.ts
import { defineArrayMember, defineField, defineType } from "sanity";

const cta = {
  name: "cta",
  type: "object" as const,
  fields: [
    defineField({ name: "label", type: "string" }),
    defineField({ name: "href", type: "string" }),
    defineField({
      name: "variant",
      type: "string",
      options: { list: ["primary", "secondary", "ghost"] },
      initialValue: "primary",
    }),
  ],
};

export const hero = defineType({
  name: "hero",
  type: "object",
  fields: [
    defineField({ name: "overline", type: "string" }),
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "subtitle", type: "text", rows: 2 }),
    defineField({ name: "ctas", type: "array", of: [defineArrayMember(cta)] }),
    defineField({
      name: "theme",
      type: "string",
      options: { list: ["light", "dark"] },
      initialValue: "light",
    }),
  ],
});

export const featureGrid = defineType({
  name: "featureGrid",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "features",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "icon", type: "string", description: "Nome Remix Icon, ex. ri-flashlight-line" }),
            defineField({ name: "title", type: "string" }),
            defineField({ name: "text", type: "text", rows: 3 }),
          ],
        }),
      ],
    }),
  ],
});

export const testimonials = defineType({
  name: "testimonials",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "quote", type: "text", rows: 4 }),
            defineField({ name: "name", type: "string" }),
            defineField({ name: "role", type: "string" }),
            defineField({ name: "company", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});

export const logoCloud = defineType({
  name: "logoCloud",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "logos",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "name", type: "string" }),
            defineField({ name: "imageUrl", type: "url", description: "URL do CDN OmniChat" }),
          ],
        }),
      ],
    }),
  ],
});

export const ctaBanner = defineType({
  name: "ctaBanner",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({ name: "text", type: "text", rows: 2 }),
    defineField({ name: "cta", ...cta }),
  ],
});

export const faq = defineType({
  name: "faq",
  type: "object",
  fields: [
    defineField({ name: "title", type: "string" }),
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", type: "string" }),
            defineField({ name: "answer", type: "text", rows: 4 }),
          ],
        }),
      ],
    }),
  ],
});

export const richText = defineType({
  name: "richText",
  type: "object",
  fields: [defineField({ name: "content", type: "array", of: [{ type: "block" }] })],
});

export const stats = defineType({
  name: "stats",
  type: "object",
  fields: [
    defineField({
      name: "items",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "value", type: "string" }),
            defineField({ name: "label", type: "string" }),
          ],
        }),
      ],
    }),
  ],
});

export const sectionTypes = [hero, featureGrid, testimonials, logoCloud, ctaBanner, faq, richText, stats];
```

- [ ] **Step 4: Implementar documentos**

```ts
// sanity/schemas/documents/page.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "seo", type: "seo" }),
    defineField({
      name: "sections",
      type: "array",
      of: ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats"].map(
        (type) => defineArrayMember({ type })
      ),
    }),
  ],
});
```

```ts
// sanity/schemas/documents/post.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const post = defineType({
  name: "post",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" }, validation: (r) => r.required() }),
    defineField({ name: "excerpt", type: "text", rows: 3 }),
    defineField({ name: "body", type: "array", of: [{ type: "block" }, { type: "image" }] }),
    defineField({ name: "author", type: "reference", to: [{ type: "author" }] }),
    defineField({ name: "categories", type: "array", of: [{ type: "reference", to: [{ type: "category" }] }] }),
    defineField({ name: "publishedAt", type: "datetime" }),
    defineField({ name: "seo", type: "seo" }),
    defineField({
      name: "faq",
      type: "array",
      description: "Perguntas e respostas — viram schema FAQPage (AEO)",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "question", type: "string" }),
            defineField({ name: "answer", type: "text", rows: 4 }),
          ],
        }),
      ],
    }),
  ],
});
```

```ts
// sanity/schemas/documents/author.ts
import { defineField, defineType } from "sanity";

export const author = defineType({
  name: "author",
  type: "document",
  fields: [
    defineField({ name: "name", type: "string", validation: (r) => r.required() }),
    defineField({ name: "role", type: "string" }),
  ],
});
```

```ts
// sanity/schemas/documents/category.ts
import { defineField, defineType } from "sanity";

export const category = defineType({
  name: "category",
  type: "document",
  fields: [
    defineField({ name: "title", type: "string", validation: (r) => r.required() }),
    defineField({ name: "slug", type: "slug", options: { source: "title" } }),
  ],
});
```

```ts
// sanity/schemas/documents/site-settings.ts
import { defineArrayMember, defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  type: "document",
  fields: [
    defineField({ name: "siteName", type: "string" }),
    defineField({
      name: "nav",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "label", type: "string" }),
            defineField({ name: "href", type: "string" }),
          ],
        }),
      ],
    }),
    defineField({ name: "footerText", type: "text", rows: 2 }),
    defineField({
      name: "social",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          fields: [
            defineField({ name: "platform", type: "string" }),
            defineField({ name: "url", type: "url" }),
          ],
        }),
      ],
    }),
    defineField({
      name: "organization",
      type: "object",
      description: "Dados do JSON-LD Organization",
      fields: [
        defineField({ name: "name", type: "string" }),
        defineField({ name: "legalName", type: "string" }),
        defineField({ name: "url", type: "url" }),
        defineField({ name: "logoUrl", type: "url" }),
        defineField({ name: "sameAs", type: "array", of: [{ type: "url" }] }),
      ],
    }),
  ],
});
```

```ts
// sanity/schemas/documents/redirect.ts
import { defineField, defineType } from "sanity";

export const redirect = defineType({
  name: "redirect",
  type: "document",
  description: "Mapa 301 da migração WordPress — lido pelo proxy",
  fields: [
    defineField({ name: "from", type: "string", description: "Path antigo, ex. /blog/post-antigo", validation: (r) => r.required() }),
    defineField({ name: "to", type: "string", validation: (r) => r.required() }),
    defineField({ name: "permanent", type: "boolean", initialValue: true }),
  ],
});
```

```ts
// sanity/schemas/index.ts
import { seo } from "./objects/seo";
import { sectionTypes } from "./objects/sections";
import { page } from "./documents/page";
import { post } from "./documents/post";
import { author } from "./documents/author";
import { category } from "./documents/category";
import { siteSettings } from "./documents/site-settings";
import { redirect } from "./documents/redirect";

export const schemaTypes = [seo, ...sectionTypes, page, post, author, category, siteSettings, redirect];
```

- [ ] **Step 5: sanity.config.ts + rota do Studio**

Antes, conferir a doc instalada: `sed -n '1,80p' node_modules/next-sanity/README.md` (seção do Studio embutido).

```ts
// sanity.config.ts
"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { presentationTool } from "sanity/presentation";
import { apiVersion, dataset, projectId } from "./lib/sanity/env";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "omnichat",
  title: "OmniChat Web",
  projectId: projectId || "placeholder",
  dataset,
  basePath: "/studio",
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: { previewMode: { enable: "/api/draft-mode/enable" } },
    }),
  ],
  schema: { types: schemaTypes },
  apiVersion,
});
```

```tsx
// app/studio/[[...tool]]/page.tsx
import { NextStudio } from "next-sanity/studio";
import config from "../../../sanity.config";

export const dynamic = "force-static";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

- [ ] **Step 6: Rodar testes e gates**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Expected: verdes (o build do Studio sem projectId real usa "placeholder" — não pode quebrar).

- [ ] **Step 7: Commit**

```bash
git add sanity/ sanity.config.ts app/studio tests/schemas.test.ts
git commit -m "feat: sanity schemas (page builder, blog, settings, redirects) and embedded studio"
```

---

### Task 4: Registry e componentes de seção (parte 1: hero, richText, ctaBanner, stats)

**Files:**
- Create: `components/sections/types.ts`, `components/sections/registry.ts`, `components/sections/hero.tsx`, `components/sections/rich-text.tsx`, `components/sections/cta-banner.tsx`, `components/sections/stats.tsx`
- Test: `tests/registry.test.ts`

**Interfaces:**
- Consumes: nomes de tipo do Task 3 (`hero` etc.), tokens do DS, `Card` de `components/ui/card.tsx`.
- Produces:
  - `SectionData = { _type: string; _key: string } & Record<string, unknown>` de `components/sections/types.ts`.
  - `sectionRegistry: Record<string, ComponentType<any>>` de `components/sections/registry.ts` — chaves idênticas aos `name` dos schemas. Task 5 completa o registry; Task 6 o consome no renderer; Task 11 no Builder.io.
  - `Cta` type: `{ label: string; href: string; variant?: "primary" | "secondary" | "ghost" }`.

- [ ] **Step 1: Teste falhando — registry cobre os tipos implementados nesta parte**

```ts
// tests/registry.test.ts
import { describe, expect, it } from "vitest";
import { sectionRegistry } from "../components/sections/registry";

describe("section registry", () => {
  it("cobre os 8 tipos de seção do schema", () => {
    for (const t of ["hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq", "richText", "stats"]) {
      expect(sectionRegistry[t], `faltando: ${t}`).toBeDefined();
    }
  });
});
```

Run: `npm test` — Expected: FAIL. (O teste só ficará verde no fim do Task 5 — nesta parte, rodar com `npm test -- -t registry` e aceitar o FAIL parcial documentado no commit.)

- [ ] **Step 2: types.ts e componentes**

```ts
// components/sections/types.ts
export type SectionData = { _type: string; _key: string } & Record<string, unknown>;

export type Cta = { label: string; href: string; variant?: "primary" | "secondary" | "ghost" };
```

```tsx
// components/sections/hero.tsx
import Link from "next/link";
import type { Cta } from "./types";

const CTA_CLASS: Record<NonNullable<Cta["variant"]>, string> = {
  primary:
    "bg-oc-yellow-cta text-oc-ink hover:bg-oc-yellow-hover active:bg-oc-yellow-press",
  secondary:
    "bg-oc-neutral-light text-oc-ink hover:bg-oc-secondary-hover active:bg-oc-secondary-press",
  ghost: "text-oc-ink hover:oc-ghost-hover active:oc-ghost-press",
};

export function Hero({
  overline,
  title,
  subtitle,
  ctas = [],
  theme = "light",
}: {
  overline?: string;
  title: string;
  subtitle?: string;
  ctas?: Cta[];
  theme?: "light" | "dark";
}) {
  const dark = theme === "dark";
  return (
    <section className={dark ? "bg-oc-dark" : "bg-oc-surface"}>
      <div className="mx-auto max-w-[1280px] px-6 py-24">
        {overline && (
          <p className={`oc-overline ${dark ? "text-oc-yellow-mass" : "text-oc-yellow-ink"}`}>{overline}</p>
        )}
        <h1 className={`oc-display mt-3 max-w-[800px] ${dark ? "text-oc-surface" : ""}`}>{title}</h1>
        {subtitle && (
          <p className={`oc-body-lg mt-5 max-w-[640px] ${dark ? "text-oc-neutral" : "text-oc-neutral-dark"}`}>
            {subtitle}
          </p>
        )}
        {ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((cta) => (
              <Link
                key={cta.label}
                href={cta.href}
                className={`oc-button-label rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc ${CTA_CLASS[cta.variant ?? "primary"]}`}
              >
                {cta.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
```

```tsx
// components/sections/rich-text.tsx
import { PortableText, type PortableTextBlock } from "next-sanity";

export function RichText({ content }: { content?: PortableTextBlock[] }) {
  if (!content?.length) return null;
  return (
    <section className="mx-auto max-w-[720px] px-6 py-14">
      <div className="oc-body flex flex-col gap-4 [&_h2]:oc-h2 [&_h3]:oc-h3 [&_a]:underline">
        <PortableText value={content} />
      </div>
    </section>
  );
}
```

```tsx
// components/sections/cta-banner.tsx
import Link from "next/link";
import type { Cta } from "./types";

export function CtaBanner({ title, text, cta }: { title?: string; text?: string; cta?: Cta }) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14">
      <div className="bg-oc-yellow-mass rounded-oc-modal p-10 md:p-14">
        {title && <h2 className="oc-h2 text-oc-ink max-w-[640px]">{title}</h2>}
        {text && <p className="oc-body-lg mt-3 text-oc-ink max-w-[560px]">{text}</p>}
        {cta && (
          <Link
            href={cta.href}
            className="oc-button-label mt-8 inline-block rounded-oc-button bg-oc-ink px-6 py-3 text-oc-surface transition-colors duration-150 ease-oc hover:bg-oc-dark"
          >
            {cta.label}
          </Link>
        )}
      </div>
    </section>
  );
}
```

```tsx
// components/sections/stats.tsx
export function Stats({ items = [] }: { items?: { value: string; label: string }[] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14">
      <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
        {items.map((s) => (
          <div key={s.label}>
            <dd className="oc-h1 text-oc-yellow-ink">{s.value}</dd>
            <dt className="oc-label mt-1 text-oc-neutral-dark">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 3: registry.ts (parcial, com os 4 desta parte)**

```ts
// components/sections/registry.ts
import type { ComponentType } from "react";
import { Hero } from "./hero";
import { RichText } from "./rich-text";
import { CtaBanner } from "./cta-banner";
import { Stats } from "./stats";

// Chaves = `name` dos schemas em sanity/schemas/objects/sections.ts.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const sectionRegistry: Record<string, ComponentType<any>> = {
  hero: Hero,
  richText: RichText,
  ctaBanner: CtaBanner,
  stats: Stats,
};
```

- [ ] **Step 4: Gates (teste do registry ainda falha por design — os outros 4 tipos vêm no Task 5)**

Run: `npm run lint && npm run typecheck && npm run build`
Expected: verdes. `npm test`: só `tests/registry.test.ts` falhando, pelos 4 tipos restantes.

- [ ] **Step 5: Commit**

```bash
git add components/sections tests/registry.test.ts
git commit -m "feat: section registry with hero, rich text, cta banner and stats"
```

---

### Task 5: Componentes de seção (parte 2: featureGrid, testimonials, logoCloud, faq)

**Files:**
- Create: `components/sections/feature-grid.tsx`, `components/sections/testimonials.tsx`, `components/sections/logo-cloud.tsx`, `components/sections/faq.tsx`
- Modify: `components/sections/registry.ts`

**Interfaces:**
- Consumes: `Card` de `components/ui/card.tsx` (prop `elevation`), tipos do Task 4.
- Produces: registry completo com as 8 chaves — `tests/registry.test.ts` passa.

- [ ] **Step 1: Implementar os 4 componentes**

```tsx
// components/sections/feature-grid.tsx
import { Card } from "@/components/ui/card";

type Feature = { icon?: string; title: string; text?: string };

export function FeatureGrid({ title, features = [] }: { title?: string; features?: Feature[] }) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14">
      {title && <h2 className="oc-h2 mb-8">{title}</h2>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {features.map((f) => (
          <Card key={f.title} elevation="border">
            {f.icon && (
              <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-oc-button bg-oc-attention-light">
                <i className={`${f.icon} text-2xl text-oc-yellow-ink`} aria-hidden />
              </span>
            )}
            <h3 className="oc-h5">{f.title}</h3>
            {f.text && <p className="oc-body-sm mt-2 text-oc-neutral-dark">{f.text}</p>}
          </Card>
        ))}
      </div>
    </section>
  );
}
```

```tsx
// components/sections/testimonials.tsx
import { Card } from "@/components/ui/card";

type Testimonial = { quote: string; name: string; role?: string; company?: string };

export function Testimonials({ title, items = [] }: { title?: string; items?: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14">
      {title && <h2 className="oc-h2 mb-8">{title}</h2>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {items.map((t) => (
          <Card key={t.name} elevation="shadow">
            <blockquote className="oc-body-lg">“{t.quote}”</blockquote>
            <p className="oc-label mt-4">{t.name}</p>
            <p className="oc-caption text-oc-neutral-dark">
              {[t.role, t.company].filter(Boolean).join(" · ")}
            </p>
          </Card>
        ))}
      </div>
    </section>
  );
}
```

```tsx
// components/sections/logo-cloud.tsx
/* eslint-disable @next/next/no-img-element -- logos vêm do CDN OmniChat por URL */
type Logo = { name: string; imageUrl: string };

export function LogoCloud({ title, logos = [] }: { title?: string; logos?: Logo[] }) {
  if (!logos.length) return null;
  return (
    <section className="mx-auto max-w-[1280px] px-6 py-14">
      {title && <p className="oc-overline mb-6 text-center text-oc-neutral-dark">{title}</p>}
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
        {logos.map((l) => (
          <img key={l.name} src={l.imageUrl} alt={l.name} className="h-8 w-auto" loading="lazy" />
        ))}
      </div>
    </section>
  );
}
```

```tsx
// components/sections/faq.tsx
type FaqItem = { question: string; answer: string };

export function Faq({ title, items = [] }: { title?: string; items?: FaqItem[] }) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-[720px] px-6 py-14">
      <h2 className="oc-h2 mb-8">{title ?? "Perguntas frequentes"}</h2>
      <div className="flex flex-col divide-y divide-oc-divider">
        {items.map((item) => (
          <details key={item.question} className="group py-4">
            <summary className="oc-h5 cursor-pointer list-none">{item.question}</summary>
            <p className="oc-body mt-3 text-oc-neutral-dark">{item.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Completar o registry**

Adicionar em `components/sections/registry.ts`:

```ts
import { FeatureGrid } from "./feature-grid";
import { Testimonials } from "./testimonials";
import { LogoCloud } from "./logo-cloud";
import { Faq } from "./faq";
// no objeto:
  featureGrid: FeatureGrid,
  testimonials: Testimonials,
  logoCloud: LogoCloud,
  faq: Faq,
```

- [ ] **Step 3: Rodar tudo verde**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Expected: TODOS verdes, incluindo `tests/registry.test.ts`.

- [ ] **Step 4: Commit**

```bash
git add components/sections
git commit -m "feat: complete section registry with grid, testimonials, logos and faq"
```

---

### Task 6: Renderer, layout do site e rotas de página

**Files:**
- Create: `components/sections/section-renderer.tsx`, `components/site/header.tsx`, `components/site/footer.tsx`, `app/(site)/layout.tsx`, `app/(site)/[slug]/page.tsx`, `lib/seo.ts`
- Modify: `app/page.tsx` → move para `app/(site)/page.tsx` (home via `HOME_QUERY`; o styleguide atual move para `app/(site)/styleguide/page.tsx`)
- Test: `tests/seo.test.ts`

**Interfaces:**
- Consumes: `sanityFetch`, `PAGE_QUERY`/`HOME_QUERY`/`PAGE_SLUGS_QUERY`/`SETTINGS_QUERY`, `sectionRegistry`, `SectionData`.
- Produces:
  - `<SectionRenderer sections={SectionData[]} />`.
  - `buildMetadata({seo, title, path}): Metadata` de `lib/seo.ts` — usado também no blog (Task 7). Assinatura: `{ seo?: { metaTitle?: string; metaDescription?: string; canonical?: string; ogImage?: string; noIndex?: boolean } | null; title: string; path: string }`.
  - Tags de cache: página usa tags `["page", "page:" + slug]`; settings `["siteSettings"]` (o webhook do Task 9 revalida por essas tags).

- [ ] **Step 1: Teste falhando de buildMetadata**

```ts
// tests/seo.test.ts
import { describe, expect, it } from "vitest";
import { buildMetadata } from "../lib/seo";

describe("buildMetadata", () => {
  it("usa metaTitle do seo quando existe, senão title", () => {
    expect(buildMetadata({ seo: { metaTitle: "X" }, title: "Y", path: "/a" }).title).toBe("X");
    expect(buildMetadata({ seo: null, title: "Y", path: "/a" }).title).toBe("Y");
  });
  it("canonical self-referencing por padrão", () => {
    const m = buildMetadata({ seo: null, title: "T", path: "/precos" });
    expect(m.alternates?.canonical).toBe("https://omni.chat/precos");
  });
  it("respeita canonical custom e noIndex", () => {
    const m = buildMetadata({ seo: { canonical: "https://omni.chat/outro", noIndex: true }, title: "T", path: "/a" });
    expect(m.alternates?.canonical).toBe("https://omni.chat/outro");
    expect(m.robots).toEqual({ index: false, follow: false });
  });
});
```

Run: `npm test` — Expected: FAIL.

- [ ] **Step 2: Implementar lib/seo.ts**

```ts
// lib/seo.ts
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

export type SeoData = {
  metaTitle?: string;
  metaDescription?: string;
  canonical?: string;
  ogImage?: string;
  noIndex?: boolean;
} | null;

export function buildMetadata({ seo, title, path }: { seo?: SeoData; title: string; path: string }): Metadata {
  const resolvedTitle = seo?.metaTitle ?? title;
  const description = seo?.metaDescription;
  return {
    title: resolvedTitle,
    description,
    alternates: { canonical: seo?.canonical ?? `${SITE_URL}${path}` },
    openGraph: {
      title: resolvedTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: "OmniChat",
      images: seo?.ogImage ? [{ url: seo.ogImage }] : undefined,
    },
    ...(seo?.noIndex ? { robots: { index: false, follow: false } } : {}),
  };
}
```

- [ ] **Step 3: SectionRenderer**

```tsx
// components/sections/section-renderer.tsx
import { sectionRegistry } from "./registry";
import type { SectionData } from "./types";

export function SectionRenderer({ sections }: { sections?: SectionData[] | null }) {
  if (!sections?.length) return null;
  return (
    <>
      {sections.map(({ _type, _key, ...props }) => {
        const Section = sectionRegistry[_type];
        if (!Section) {
          if (process.env.NODE_ENV === "development") {
            console.warn(`Seção sem componente no registry: ${_type}`);
          }
          return null;
        }
        return <Section key={_key} {...props} />;
      })}
    </>
  );
}
```

- [ ] **Step 4: Header/footer institucionais + layout do route group**

```tsx
// components/site/header.tsx
import Link from "next/link";

type NavItem = { label: string; href: string };

export function Header({ nav = [] }: { nav?: NavItem[] }) {
  return (
    <header className="border-b border-oc-divider bg-oc-surface">
      <div className="mx-auto flex max-w-[1280px] items-center justify-between px-6 py-4">
        <Link href="/" className="oc-h5">
          OmniChat
        </Link>
        <nav className="flex items-center gap-6">
          {nav.map((item) => (
            <Link key={item.href} href={item.href} className="oc-label hover:text-oc-yellow-ink">
              {item.label}
            </Link>
          ))}
          <Link
            href="/contato"
            className="oc-button-label rounded-oc-button bg-oc-yellow-cta px-5 py-2.5 text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover"
          >
            Fale com vendas
          </Link>
        </nav>
      </div>
    </header>
  );
}
```

```tsx
// components/site/footer.tsx
type Social = { platform: string; url: string };

export function Footer({ footerText, social = [] }: { footerText?: string; social?: Social[] }) {
  return (
    <footer className="mt-auto bg-oc-dark">
      <div className="mx-auto max-w-[1280px] px-6 py-12">
        <p className="oc-h5 text-oc-yellow-mass">OmniChat</p>
        {footerText && <p className="oc-body-sm mt-3 max-w-[480px] text-oc-neutral">{footerText}</p>}
        <div className="mt-6 flex gap-5">
          {social.map((s) => (
            <a key={s.platform} href={s.url} className="oc-caption text-oc-neutral hover:text-oc-yellow-mass">
              {s.platform}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
```

```tsx
// app/(site)/layout.tsx
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { sanityFetch } from "@/lib/sanity/client";
import { SETTINGS_QUERY } from "@/lib/sanity/queries";

type Settings = {
  nav?: { label: string; href: string }[];
  footerText?: string;
  social?: { platform: string; url: string }[];
} | null;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await sanityFetch<Settings>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
  return (
    <>
      <Header nav={settings?.nav ?? []} />
      {children}
      <Footer footerText={settings?.footerText} social={settings?.social ?? []} />
    </>
  );
}
```

- [ ] **Step 5: Home e rota dinâmica**

Mover o styleguide atual: `git mv app/page.tsx` → conteúdo vai para `app/(site)/styleguide/page.tsx` (adicionar `export const metadata = { robots: { index: false } }`).

```tsx
// app/(site)/page.tsx
import type { Metadata } from "next";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { sanityFetch } from "@/lib/sanity/client";
import { HOME_QUERY } from "@/lib/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";
import type { SectionData } from "@/components/sections/types";

type PageDoc = { title: string; seo?: SeoData; sections?: SectionData[] } | null;

export async function generateMetadata(): Promise<Metadata> {
  const page = await sanityFetch<PageDoc>({ query: HOME_QUERY, tags: ["page", "page:home"] });
  return buildMetadata({ seo: page?.seo, title: page?.title ?? "OmniChat", path: "/" });
}

export default async function HomePage() {
  const page = await sanityFetch<PageDoc>({ query: HOME_QUERY, tags: ["page", "page:home"] });
  if (!page) {
    return (
      <main className="mx-auto max-w-[720px] px-6 py-24">
        <h1 className="oc-h1">OmniChat</h1>
        <p className="oc-body mt-4 text-oc-neutral-dark">
          Conteúdo ainda não publicado no CMS. Configure o Sanity e publique a página “home”.
        </p>
      </main>
    );
  }
  return (
    <main>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
```

```tsx
// app/(site)/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SectionRenderer } from "@/components/sections/section-renderer";
import { sanityFetch } from "@/lib/sanity/client";
import { PAGE_QUERY, PAGE_SLUGS_QUERY } from "@/lib/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";
import type { SectionData } from "@/components/sections/types";

type PageDoc = { title: string; slug: string; seo?: SeoData; sections?: SectionData[] } | null;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: PAGE_SLUGS_QUERY, tags: ["page"] });
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await sanityFetch<PageDoc>({ query: PAGE_QUERY, params: { slug }, tags: ["page", `page:${slug}`] });
  if (!page) return {};
  return buildMetadata({ seo: page.seo, title: page.title, path: `/${slug}` });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await sanityFetch<PageDoc>({ query: PAGE_QUERY, params: { slug }, tags: ["page", `page:${slug}`] });
  if (!page) notFound();
  return (
    <main>
      <SectionRenderer sections={page.sections} />
    </main>
  );
}
```

Nota Next 16: `params` é Promise — conferir em `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/page.md` se a assinatura confere e ajustar se divergir.

- [ ] **Step 6: Gates e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Expected: verdes.

```bash
git add app/ components/ lib/seo.ts tests/seo.test.ts
git commit -m "feat: site layout, section renderer and CMS-driven pages"
```

---

### Task 7: Blog (índice, post, categoria)

**Files:**
- Create: `app/(site)/blog/page.tsx`, `app/(site)/blog/[slug]/page.tsx`, `app/(site)/blog/categoria/[slug]/page.tsx`, `components/site/post-card.tsx`

**Interfaces:**
- Consumes: `sanityFetch`, `POSTS_QUERY`/`POST_QUERY`/`POST_SLUGS_QUERY`, `buildMetadata`, `Card`.
- Produces: rotas `/blog`, `/blog/[slug]`, `/blog/categoria/[slug]`; tags de cache `["post"]` e `["post:" + slug]`. O `<JsonLd>` (Task 10) será adicionado ao post depois.

- [ ] **Step 1: PostCard**

```tsx
// components/site/post-card.tsx
import Link from "next/link";
import { Card } from "@/components/ui/card";

export type PostListItem = {
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  categories?: { title: string; slug: string }[];
};

export function PostCard({ post }: { post: PostListItem }) {
  return (
    <Card elevation="border">
      {post.categories?.[0] && <p className="oc-overline text-oc-yellow-ink">{post.categories[0].title}</p>}
      <h2 className="oc-h4 mt-2">
        <Link href={`/blog/${post.slug}`} className="hover:text-oc-yellow-ink">
          {post.title}
        </Link>
      </h2>
      {post.excerpt && <p className="oc-body-sm mt-2 text-oc-neutral-dark">{post.excerpt}</p>}
      {post.publishedAt && (
        <p className="oc-caption mt-4 text-oc-neutral-dark">
          {new Date(post.publishedAt).toLocaleDateString("pt-BR", { dateStyle: "long" })}
        </p>
      )}
    </Card>
  );
}
```

- [ ] **Step 2: Índice do blog**

```tsx
// app/(site)/blog/page.tsx
import type { Metadata } from "next";
import { PostCard, type PostListItem } from "@/components/site/post-card";
import { sanityFetch } from "@/lib/sanity/client";
import { POSTS_QUERY } from "@/lib/sanity/queries";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  seo: null,
  title: "Blog OmniChat — vendas e IA no WhatsApp",
  path: "/blog",
});

export default async function BlogIndex() {
  const posts = (await sanityFetch<PostListItem[]>({ query: POSTS_QUERY, tags: ["post"] })) ?? [];
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-14">
      <h1 className="oc-h1">Blog</h1>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 3: Post individual (com FAQ para AEO)**

```tsx
// app/(site)/blog/[slug]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextBlock } from "next-sanity";
import { Faq } from "@/components/sections/faq";
import { sanityFetch } from "@/lib/sanity/client";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/lib/sanity/queries";
import { buildMetadata, type SeoData } from "@/lib/seo";

type PostDoc = {
  title: string;
  slug: string;
  excerpt?: string;
  body?: PortableTextBlock[];
  publishedAt?: string;
  seo?: SeoData;
  author?: { name: string; role?: string };
  categories?: { title: string; slug: string }[];
  faq?: { question: string; answer: string }[];
} | null;

export async function generateStaticParams() {
  const slugs = await sanityFetch<string[]>({ query: POST_SLUGS_QUERY, tags: ["post"] });
  return (slugs ?? []).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityFetch<PostDoc>({ query: POST_QUERY, params: { slug }, tags: ["post", `post:${slug}`] });
  if (!post) return {};
  return buildMetadata({ seo: post.seo, title: post.title, path: `/blog/${slug}` });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await sanityFetch<PostDoc>({ query: POST_QUERY, params: { slug }, tags: ["post", `post:${slug}`] });
  if (!post) notFound();
  return (
    <main className="mx-auto max-w-[720px] px-6 py-14">
      <article>
        {post.categories?.[0] && <p className="oc-overline text-oc-yellow-ink">{post.categories[0].title}</p>}
        <h1 className="oc-h1 mt-2">{post.title}</h1>
        <p className="oc-caption mt-4 text-oc-neutral-dark">
          {post.author?.name}
          {post.publishedAt &&
            ` · ${new Date(post.publishedAt).toLocaleDateString("pt-BR", { dateStyle: "long" })}`}
        </p>
        <div className="oc-body mt-8 flex flex-col gap-4 [&_h2]:oc-h2 [&_h3]:oc-h3 [&_a]:underline">
          {post.body && <PortableText value={post.body} />}
        </div>
      </article>
      {post.faq && post.faq.length > 0 && <Faq items={post.faq} />}
    </main>
  );
}
```

- [ ] **Step 4: Categoria**

```tsx
// app/(site)/blog/categoria/[slug]/page.tsx
import type { Metadata } from "next";
import { PostCard, type PostListItem } from "@/components/site/post-card";
import { sanityFetch } from "@/lib/sanity/client";
import { buildMetadata } from "@/lib/seo";

const CATEGORY_POSTS_QUERY = `*[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc){
  title, "slug": slug.current, excerpt, publishedAt,
  "categories": categories[]->{title, "slug": slug.current}
}`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return buildMetadata({ seo: null, title: `Blog — ${slug}`, path: `/blog/categoria/${slug}` });
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const posts =
    (await sanityFetch<PostListItem[]>({ query: CATEGORY_POSTS_QUERY, params: { slug }, tags: ["post"] })) ?? [];
  return (
    <main className="mx-auto max-w-[1280px] px-6 py-14">
      <h1 className="oc-h1">{slug}</h1>
      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </main>
  );
}
```

- [ ] **Step 5: Gates e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

```bash
git add app/\(site\)/blog components/site/post-card.tsx
git commit -m "feat: blog index, post page with faq and category listing"
```

---

### Task 8: Visual Editing (draft mode + Presentation)

**Files:**
- Create: `app/api/draft-mode/enable/route.ts`, `components/site/sanity-visual-editing.tsx`
- Modify: `app/layout.tsx`

**Interfaces:**
- Consumes: `client` de `lib/sanity/client.ts`, `SANITY_API_READ_TOKEN`.
- Produces: draft mode habilitável só pelo Presentation tool (valida com o token); overlays de visual editing ativos quando draft mode ligado.

- [ ] **Step 1: Ler doc instalada do next-sanity sobre draft mode/visual editing**

Run: `grep -n -i -A 20 "draft" node_modules/next-sanity/README.md | head -80`
Seguir a API atual (`defineEnableDraftMode` ou equivalente). Implementação de referência:

```ts
// app/api/draft-mode/enable/route.ts
import { defineEnableDraftMode } from "next-sanity/draft-mode";
import { client } from "@/lib/sanity/client";

export const { GET } = defineEnableDraftMode({
  client: client.withConfig({ token: process.env.SANITY_API_READ_TOKEN }),
});
```

```tsx
// components/site/sanity-visual-editing.tsx
"use client";

import { VisualEditing } from "next-sanity/visual-editing";

export function SanityVisualEditing() {
  return <VisualEditing />;
}
```

Em `app/layout.tsx`, dentro do `<body>`, após `{children}`:

```tsx
import { draftMode } from "next/headers";
import { SanityVisualEditing } from "@/components/site/sanity-visual-editing";
// no componente (torná-lo async):
const { isEnabled } = await draftMode();
// no JSX:
{isEnabled && <SanityVisualEditing />}
```

- [ ] **Step 2: Gates e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

```bash
git add app/api/draft-mode app/layout.tsx components/site/sanity-visual-editing.tsx
git commit -m "feat: draft mode and visual editing for sanity presentation"
```

---

### Task 9: Webhook de revalidação

**Files:**
- Create: `app/api/revalidate/route.ts`, `lib/revalidate.ts`
- Test: `tests/revalidate.test.ts`

**Interfaces:**
- Consumes: `REVALIDATE_SECRET`.
- Produces: `POST /api/revalidate?secret=...` recebendo `{_type, slug}` do webhook Sanity; `tagsFor(_type, slug): string[]` de `lib/revalidate.ts` (puro, testável).

- [ ] **Step 1: Teste falhando**

```ts
// tests/revalidate.test.ts
import { describe, expect, it } from "vitest";
import { tagsFor } from "../lib/revalidate";

describe("tagsFor", () => {
  it("page revalida a tag geral e a específica", () => {
    expect(tagsFor("page", "precos")).toEqual(["page", "page:precos"]);
  });
  it("post idem", () => {
    expect(tagsFor("post", "meu-post")).toEqual(["post", "post:meu-post"]);
  });
  it("siteSettings e redirect revalidam só a geral", () => {
    expect(tagsFor("siteSettings")).toEqual(["siteSettings"]);
    expect(tagsFor("redirect")).toEqual(["redirect"]);
  });
  it("tipo desconhecido não revalida nada", () => {
    expect(tagsFor("author")).toEqual([]);
  });
});
```

Run: `npm test` — Expected: FAIL.

- [ ] **Step 2: Implementar**

```ts
// lib/revalidate.ts
const SLUGGED = new Set(["page", "post"]);
const GLOBAL = new Set(["siteSettings", "redirect"]);

export function tagsFor(_type: string, slug?: string): string[] {
  if (SLUGGED.has(_type)) return slug ? [_type, `${_type}:${slug}`] : [_type];
  if (GLOBAL.has(_type)) return [_type];
  return [];
}
```

```ts
// app/api/revalidate/route.ts
import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { tagsFor } from "@/lib/revalidate";

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const body = (await req.json()) as { _type?: string; slug?: { current?: string } | string };
  const slug = typeof body.slug === "string" ? body.slug : body.slug?.current;
  const tags = tagsFor(body._type ?? "", slug);
  for (const tag of tags) revalidateTag(tag);
  return NextResponse.json({ ok: true, revalidated: tags });
}
```

Nota: conferir assinatura de `revalidateTag` na doc instalada (`node_modules/next/dist/docs/01-app/03-api-reference/04-functions/revalidateTag.md`) — no Next 16 pode exigir profile (`revalidateTag(tag, "max")`); ajustar conforme a doc.

- [ ] **Step 3: Gates, teste manual e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

Teste manual: `npm run dev` e

```bash
curl -s -X POST "http://localhost:3000/api/revalidate?secret=errado" -d '{}' -H 'content-type: application/json'
# esperado: {"ok":false} status 401
```

```bash
git add app/api/revalidate lib/revalidate.ts tests/revalidate.test.ts
git commit -m "feat: tag-based revalidation webhook with shared secret"
```

---

### Task 10: proxy.ts multi-host + redirects 301

**Files:**
- Create: `proxy.ts` (raiz do projeto), `lib/redirects.ts`
- Test: `tests/redirects.test.ts`

**Interfaces:**
- Consumes: `REDIRECTS_QUERY`, `sanityFetch`, `NEXT_PUBLIC_LP_HOST`.
- Produces: `matchRedirect(pathname, redirects): {to, permanent} | null` de `lib/redirects.ts` (puro); proxy que (1) rewrita host LP → `/lp/*`, (2) aplica 301 do Sanity preservando query, (3) bloqueia `/lp/*` e `/studio` no host LP.

- [ ] **Step 1: Ler a doc do proxy**

Run: `sed -n '1,200p' node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`

- [ ] **Step 2: Teste falhando do matcher**

```ts
// tests/redirects.test.ts
import { describe, expect, it } from "vitest";
import { matchRedirect } from "../lib/redirects";

const redirects = [
  { from: "/blog/antigo", to: "/blog/novo", permanent: true },
  { from: "/precos/", to: "/precos", permanent: true },
];

describe("matchRedirect", () => {
  it("match exato", () => {
    expect(matchRedirect("/blog/antigo", redirects)).toEqual({ to: "/blog/novo", permanent: true });
  });
  it("normaliza trailing slash do from", () => {
    expect(matchRedirect("/precos", redirects)).toEqual({ to: "/precos", permanent: true });
  });
  it("sem match retorna null", () => {
    expect(matchRedirect("/qualquer", redirects)).toBeNull();
  });
  it("não redireciona para si mesmo", () => {
    expect(matchRedirect("/precos", [{ from: "/precos", to: "/precos", permanent: true }])).toBeNull();
  });
});
```

Run: `npm test` — Expected: FAIL.

- [ ] **Step 3: Implementar lib/redirects.ts**

```ts
// lib/redirects.ts
export type RedirectRule = { from: string; to: string; permanent: boolean };

const strip = (p: string) => (p.length > 1 && p.endsWith("/") ? p.slice(0, -1) : p);

export function matchRedirect(
  pathname: string,
  redirects: RedirectRule[]
): { to: string; permanent: boolean } | null {
  const path = strip(pathname);
  for (const r of redirects) {
    if (strip(r.from) === path && strip(r.to) !== path) {
      return { to: r.to, permanent: r.permanent };
    }
  }
  return null;
}
```

- [ ] **Step 4: Implementar proxy.ts**

```ts
// proxy.ts
import { type NextRequest, NextResponse } from "next/server";
import { matchRedirect, type RedirectRule } from "./lib/redirects";
import { sanityFetch } from "./lib/sanity/client";
import { REDIRECTS_QUERY } from "./lib/sanity/queries";

const LP_HOST = process.env.NEXT_PUBLIC_LP_HOST ?? "lp.omni.chat";

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const host = request.headers.get("host") ?? "";
  const isLpHost = host === LP_HOST || host.startsWith("lp.localhost");

  // 1. Host das LPs: tudo vira /lp/<path>; studio e rotas do site não existem lá.
  if (isLpHost) {
    if (pathname.startsWith("/lp/") || pathname.startsWith("/studio")) {
      return NextResponse.redirect(new URL(`https://${LP_HOST}/`, request.url), 308);
    }
    const url = request.nextUrl.clone();
    url.pathname = `/lp${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // 2. Host principal não serve /lp/* direto (conteúdo duplicado entre hosts).
  if (pathname.startsWith("/lp")) {
    return NextResponse.redirect(new URL(pathname.replace(/^\/lp\/?/, "/"), request.url), 308);
  }

  // 3. Redirects 301 gerenciados no Sanity (cacheados por tag "redirect").
  const redirects = (await sanityFetch<RedirectRule[]>({ query: REDIRECTS_QUERY, tags: ["redirect"] })) ?? [];
  const match = matchRedirect(pathname, redirects);
  if (match) {
    const dest = new URL(match.to + search, request.url); // preserva query string (atribuição)
    return NextResponse.redirect(dest, match.permanent ? 308 : 307);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|api|ingest|favicon.ico|.*\\..*).*)"],
};
```

- [ ] **Step 5: Gates, fumaça manual e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`

Fumaça: `npm run dev` e

```bash
curl -s -o /dev/null -w "%{http_code}" -H "Host: lp.localhost:3000" http://localhost:3000/qualquer
# esperado: 404 (rewrite para /lp/qualquer, que sem conteúdo dá notFound) — NÃO 500
```

```bash
git add proxy.ts lib/redirects.ts tests/redirects.test.ts
git commit -m "feat: multi-host proxy with cms-managed 301 redirects"
```

---

### Task 11: Builder.io nas LPs

**Files:**
- Create: `app/lp/[[...slug]]/page.tsx`, `app/lp/layout.tsx`, `lib/builder.ts`, `components/sections/builder-registry.ts`

**Interfaces:**
- Consumes: `sectionRegistry` (Task 4/5), `NEXT_PUBLIC_BUILDER_API_KEY`.
- Produces: rota `/lp/[[...slug]]` renderizando conteúdo Builder.io do modelo `landing-page`; custom components registrados a partir do registry (marketing só compõe com blocos do DS).

- [ ] **Step 1: Ler a doc do SDK gen2 instalado**

Run: `sed -n '1,120p' node_modules/@builder.io/sdk-react/README.md`
Confirmar API atual (`fetchOneEntry`, `Content`, `customComponents`) e ajustar o código abaixo à doc instalada mantendo as interfaces.

- [ ] **Step 2: lib/builder.ts + registro dos componentes do DS**

```ts
// lib/builder.ts
export const BUILDER_API_KEY = process.env.NEXT_PUBLIC_BUILDER_API_KEY ?? "";
export const BUILDER_MODEL = "landing-page";
export const hasBuilderConfig = BUILDER_API_KEY.length > 0;
```

```ts
// components/sections/builder-registry.ts
// Expõe os componentes do DS como blocos do Builder.io. Inputs espelham os
// schemas Sanity — mesma composição nas duas ferramentas.
import type { RegisteredComponent } from "@builder.io/sdk-react";
import { Hero } from "./hero";
import { FeatureGrid } from "./feature-grid";
import { Testimonials } from "./testimonials";
import { LogoCloud } from "./logo-cloud";
import { CtaBanner } from "./cta-banner";
import { Faq } from "./faq";
import { Stats } from "./stats";

const ctaInputs = [
  { name: "label", type: "string" },
  { name: "href", type: "string" },
  { name: "variant", type: "string", enum: ["primary", "secondary", "ghost"], defaultValue: "primary" },
];

export const builderComponents: RegisteredComponent[] = [
  {
    component: Hero,
    name: "Hero",
    inputs: [
      { name: "overline", type: "string" },
      { name: "title", type: "string", required: true },
      { name: "subtitle", type: "longText" },
      { name: "theme", type: "string", enum: ["light", "dark"], defaultValue: "light" },
      { name: "ctas", type: "list", subFields: ctaInputs },
    ],
  },
  {
    component: FeatureGrid,
    name: "FeatureGrid",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "features",
        type: "list",
        subFields: [
          { name: "icon", type: "string" },
          { name: "title", type: "string" },
          { name: "text", type: "longText" },
        ],
      },
    ],
  },
  {
    component: Testimonials,
    name: "Testimonials",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "quote", type: "longText" },
          { name: "name", type: "string" },
          { name: "role", type: "string" },
          { name: "company", type: "string" },
        ],
      },
    ],
  },
  {
    component: LogoCloud,
    name: "LogoCloud",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "logos",
        type: "list",
        subFields: [
          { name: "name", type: "string" },
          { name: "imageUrl", type: "string" },
        ],
      },
    ],
  },
  {
    component: CtaBanner,
    name: "CtaBanner",
    inputs: [
      { name: "title", type: "string" },
      { name: "text", type: "longText" },
      { name: "cta", type: "object", subFields: ctaInputs },
    ],
  },
  {
    component: Faq,
    name: "Faq",
    inputs: [
      { name: "title", type: "string" },
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "question", type: "string" },
          { name: "answer", type: "longText" },
        ],
      },
    ],
  },
  {
    component: Stats,
    name: "Stats",
    inputs: [
      {
        name: "items",
        type: "list",
        subFields: [
          { name: "value", type: "string" },
          { name: "label", type: "string" },
        ],
      },
    ],
  },
];
```

- [ ] **Step 3: Layout e rota das LPs**

```tsx
// app/lp/layout.tsx
// Sem header/footer institucional: LP de campanha é chrome-free por design.
export default function LpLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
```

```tsx
// app/lp/[[...slug]]/page.tsx
import { notFound } from "next/navigation";
import { Content, fetchOneEntry } from "@builder.io/sdk-react";
import { builderComponents } from "@/components/sections/builder-registry";
import { BUILDER_API_KEY, BUILDER_MODEL, hasBuilderConfig } from "@/lib/builder";

export default async function LandingPage({ params }: { params: Promise<{ slug?: string[] }> }) {
  const { slug } = await params;
  if (!hasBuilderConfig) notFound();
  const urlPath = `/${(slug ?? []).join("/")}`;
  const content = await fetchOneEntry({
    model: BUILDER_MODEL,
    apiKey: BUILDER_API_KEY,
    userAttributes: { urlPath },
  });
  if (!content) notFound();
  return (
    <main>
      <Content model={BUILDER_MODEL} apiKey={BUILDER_API_KEY} content={content} customComponents={builderComponents} />
    </main>
  );
}
```

- [ ] **Step 4: Gates, fumaça e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Fumaça: sem `NEXT_PUBLIC_BUILDER_API_KEY`, `curl -H "Host: lp.localhost:3000" http://localhost:3000/x` → 404 limpo.

```bash
git add app/lp lib/builder.ts components/sections/builder-registry.ts
git commit -m "feat: builder.io landing pages with ds-only component registry"
```

---

### Task 12: SEO/GEO/AEO — JSON-LD, sitemap, robots, llms.txt

**Files:**
- Create: `components/seo/json-ld.tsx`, `lib/llms.ts`, `app/sitemap.ts`, `app/robots.ts`, `app/llms.txt/route.ts`
- Modify: `app/layout.tsx` (Organization/WebSite), `app/(site)/blog/[slug]/page.tsx` (Article/Breadcrumb/FAQPage)
- Test: `tests/llms.test.ts`

**Interfaces:**
- Consumes: `sanityFetch`, `SETTINGS_QUERY`, `LLMS_QUERY`, `PAGE_SLUGS_QUERY`, `POSTS_QUERY`.
- Produces: `<JsonLd data={object} />`; `buildLlmsTxt({pages, posts}): string` de `lib/llms.ts` (puro).

- [ ] **Step 1: Teste falhando de buildLlmsTxt**

```ts
// tests/llms.test.ts
import { describe, expect, it } from "vitest";
import { buildLlmsTxt } from "../lib/llms";

describe("buildLlmsTxt", () => {
  const out = buildLlmsTxt({
    pages: [{ title: "Preços", slug: "precos" }],
    posts: [{ title: "Post A", slug: "post-a", excerpt: "Resumo A" }],
  });
  it("começa com heading da OmniChat", () => {
    expect(out.startsWith("# OmniChat")).toBe(true);
  });
  it("lista páginas e posts com URLs absolutas", () => {
    expect(out).toContain("https://omni.chat/precos");
    expect(out).toContain("https://omni.chat/blog/post-a");
    expect(out).toContain("Resumo A");
  });
});
```

Run: `npm test` — Expected: FAIL.

- [ ] **Step 2: Implementar**

```tsx
// components/seo/json-ld.tsx
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...data }) }}
    />
  );
}
```

```ts
// lib/llms.ts
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

export function buildLlmsTxt({
  pages,
  posts,
}: {
  pages: { title: string; slug: string }[];
  posts: { title: string; slug: string; excerpt?: string }[];
}): string {
  const lines = [
    "# OmniChat",
    "",
    "> Plataforma de jornada conversacional no WhatsApp: IA com profundidade de negócio (catálogo, regras, voz) rodando a jornada completa, com integração nativa e dados que provam resultado.",
    "",
    "## Páginas",
    ...pages.map((p) => `- [${p.title}](${SITE_URL}/${p.slug === "home" ? "" : p.slug})`),
    "",
    "## Blog",
    ...posts.map((p) => `- [${p.title}](${SITE_URL}/blog/${p.slug})${p.excerpt ? `: ${p.excerpt}` : ""}`),
    "",
  ];
  return lines.join("\n");
}
```

```ts
// app/llms.txt/route.ts
import { buildLlmsTxt } from "@/lib/llms";
import { sanityFetch } from "@/lib/sanity/client";
import { LLMS_QUERY } from "@/lib/sanity/queries";

export async function GET() {
  const data = await sanityFetch<{
    pages: { title: string; slug: string }[];
    posts: { title: string; slug: string; excerpt?: string }[];
  }>({ query: LLMS_QUERY, tags: ["page", "post"] });
  const body = buildLlmsTxt(data ?? { pages: [], posts: [] });
  return new Response(body, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
```

```ts
// app/sitemap.ts
import type { MetadataRoute } from "next";
import { sanityFetch } from "@/lib/sanity/client";
import { PAGE_SLUGS_QUERY, POSTS_QUERY } from "@/lib/sanity/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pageSlugs = (await sanityFetch<string[]>({ query: PAGE_SLUGS_QUERY, tags: ["page"] })) ?? [];
  const posts =
    (await sanityFetch<{ slug: string; publishedAt?: string }[]>({ query: POSTS_QUERY, tags: ["post"] })) ?? [];
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    ...pageSlugs.map((slug) => ({ url: `${SITE_URL}/${slug}`, changeFrequency: "weekly" as const, priority: 0.8 })),
    { url: `${SITE_URL}/blog`, changeFrequency: "daily", priority: 0.7 },
    ...posts.map((p) => ({
      url: `${SITE_URL}/blog/${p.slug}`,
      lastModified: p.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
```

```ts
// app/robots.ts
import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat";
// Política de IA aberta: o objetivo GEO/AEO é ser citado por answer engines.
const AI_BOTS = ["GPTBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended", "cohere-ai", "CCBot"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/studio", "/api/"] },
      ...AI_BOTS.map((bot) => ({ userAgent: bot, allow: "/" as const, disallow: ["/studio", "/api/"] })),
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

- [ ] **Step 3: JSON-LD no root layout e no post**

Em `app/layout.tsx` (dentro do body, antes de children):

```tsx
import { JsonLd } from "@/components/seo/json-ld";
import { sanityFetch } from "@/lib/sanity/client";
import { SETTINGS_QUERY } from "@/lib/sanity/queries";

type Org = { organization?: { name?: string; legalName?: string; url?: string; logoUrl?: string; sameAs?: string[] } } | null;
const settings = await sanityFetch<Org>({ query: SETTINGS_QUERY, tags: ["siteSettings"] });
const org = settings?.organization;
// JSX:
{org && (
  <JsonLd data={{ "@type": "Organization", name: org.name, legalName: org.legalName, url: org.url, logo: org.logoUrl, sameAs: org.sameAs }} />
)}
<JsonLd data={{ "@type": "WebSite", name: "OmniChat", url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://omni.chat" }} />
```

Em `app/(site)/blog/[slug]/page.tsx`, dentro do `<article>`:

```tsx
<JsonLd
  data={{
    "@type": "Article",
    headline: post.title,
    datePublished: post.publishedAt,
    author: post.author ? { "@type": "Person", name: post.author.name } : undefined,
    publisher: { "@type": "Organization", name: "OmniChat" },
  }}
/>
<JsonLd
  data={{
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Blog", item: "https://omni.chat/blog" },
      { "@type": "ListItem", position: 2, name: post.title },
    ],
  }}
/>
{post.faq && post.faq.length > 0 && (
  <JsonLd
    data={{
      "@type": "FAQPage",
      mainEntity: post.faq.map((f) => ({
        "@type": "Question",
        name: f.question,
        acceptedAnswer: { "@type": "Answer", text: f.answer },
      })),
    }}
  />
)}
```

- [ ] **Step 4: Gates, fumaça e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Fumaça: `npm run dev` e conferir `curl localhost:3000/robots.txt`, `curl localhost:3000/sitemap.xml`, `curl localhost:3000/llms.txt` respondem 200.

```bash
git add app/ components/seo lib/llms.ts tests/llms.test.ts
git commit -m "feat: json-ld, sitemap, robots with ai bots policy and llms.txt"
```

---

### Task 13: PostHog first-party

**Files:**
- Create: `components/analytics/posthog-provider.tsx`, `lib/posthog-server.ts`
- Modify: `next.config.ts` (rewrites `/ingest`), `app/layout.tsx` (provider)

**Interfaces:**
- Consumes: `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST`.
- Produces: pageviews client (history_change) via `/ingest`; `captureServerEvent(distinctId, event, properties)` de `lib/posthog-server.ts` para conversões server-side.

- [ ] **Step 1: Rewrites no next.config.ts**

```ts
// next.config.ts
import type { NextConfig } from "next";

const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const POSTHOG_ASSETS = POSTHOG_HOST.replace("us.i", "us-assets.i").replace("eu.i", "eu-assets.i");

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      { source: "/ingest/static/:path*", destination: `${POSTHOG_ASSETS}/static/:path*` },
      { source: "/ingest/:path*", destination: `${POSTHOG_HOST}/:path*` },
    ];
  },
  skipTrailingSlashRedirect: true, // exigência do proxy reverso do PostHog
};

export default nextConfig;
```

- [ ] **Step 2: Provider client**

```tsx
// components/analytics/posthog-provider.tsx
"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect } from "react";

export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: "/ingest",
      ui_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
      capture_pageview: "history_change", // App Router é SPA
      capture_pageleave: true,
    });
  }, []);
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
```

Envolver `{children}` do root layout (`app/layout.tsx`) com `<AnalyticsProvider>`.

- [ ] **Step 3: Captura server-side**

```ts
// lib/posthog-server.ts
import "server-only";
import { PostHog } from "posthog-node";

let client: PostHog | null = null;

function getClient(): PostHog | null {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!key) return null;
  if (!client) {
    client = new PostHog(key, {
      host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com",
      flushAt: 1, // serverless: envia imediatamente
      flushInterval: 0,
    });
  }
  return client;
}

export async function captureServerEvent(
  distinctId: string,
  event: string,
  properties?: Record<string, unknown>
) {
  const ph = getClient();
  if (!ph) return;
  ph.capture({ distinctId, event, properties });
  await ph.flush();
}
```

- [ ] **Step 4: Gates, fumaça e commit**

Run: `npm test && npm run lint && npm run typecheck && npm run build`
Fumaça: com key de dev no `.env.local`, `npm run dev` → abrir localhost:3000 e conferir no Network requests a `/ingest/` (200/eventos enfileirados). Sem key: zero request, zero erro no console.

```bash
git add next.config.ts components/analytics lib/posthog-server.ts app/layout.tsx
git commit -m "feat: first-party posthog with history-change pageviews and server capture"
```

---

### Task 14: CI, CLAUDE.md e verificação final

**Files:**
- Create: `.github/workflows/ci.yml`
- Modify: `CLAUDE.md`

**Interfaces:**
- Consumes: todos os scripts (`lint`, `lint:design`, `typecheck`, `test`, `build`).
- Produces: gate de merge; documentação operacional.

- [ ] **Step 1: Workflow de CI**

```yaml
# .github/workflows/ci.yml
name: CI
on:
  push:
    branches: [main]
  pull_request:

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck
      - run: npm test
      - run: npm run build
        env:
          NEXT_PUBLIC_SITE_URL: https://omni.chat
```

- [ ] **Step 2: CLAUDE.md (substituir o conteúdo atual mantendo o @AGENTS.md)**

```markdown
@AGENTS.md

# omni.chat — Next.js 16 + Sanity + Builder.io

## Comandos
- `npm run dev` / `npm run build` / `npm run lint` (ESLint + guardrails DS) / `npm run typecheck` / `npm test`

## Convenções
- Design system: tokens `oc-*` em `app/globals.css`; skill `design-system-omnichat` é a fonte da verdade de marca/copy.
- Roxo Whizz só em `components/whizz/`. Card: borda XOR sombra (prop `elevation`). `#FFBC00` nunca com texto branco. Gate: `npm run lint:design`.
- Seção nova = schema em `sanity/schemas/objects/sections.ts` + componente em `components/sections/` + entrada no `registry.ts` + (se for para LPs) `builder-registry.ts`. Teste `tests/registry.test.ts` força a paridade.
- Conteúdo: Sanity (site/blog) com tags de cache `page`/`page:slug`, `post`/`post:slug`, `siteSettings`, `redirect`; webhook `/api/revalidate?secret=` revalida.
- LPs de campanha: Builder.io, host `lp.omni.chat` → rewrite `/lp/*` no `proxy.ts`.
- Env: ver `.env.example`. Nunca commitar credencial.
```

- [ ] **Step 3: Verificação final completa**

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

Fumaça completa com `npm run dev`:

1. `curl -s localhost:3000/ | grep -o "<h1[^>]*>[^<]*"` — home renderiza (fallback sem CMS ou conteúdo).
2. `curl -s localhost:3000/robots.txt | grep GPTBot` — política de IA presente.
3. `curl -s localhost:3000/sitemap.xml | head -3` — XML válido.
4. `curl -s localhost:3000/llms.txt | head -3` — markdown com "# OmniChat".
5. `curl -s -o /dev/null -w "%{http_code}" -H "Host: lp.localhost:3000" localhost:3000/teste` — 404 limpo (rewrite funciona).
6. `curl -s -o /dev/null -w "%{http_code}" -X POST "localhost:3000/api/revalidate?secret=x"` — 401.
7. `curl -s localhost:3000/ | grep "application/ld+json"` — JSON-LD no HTML.

- [ ] **Step 4: Commit final**

```bash
git add .github CLAUDE.md
git commit -m "chore: ci gates and operational docs"
```

---

## Pós-implementação (fora deste plano, exige credenciais/acesso)

1. Preencher `.env.local` com credenciais reais (Sanity corporativo, Builder.io, PostHog) e testar Studio + Visual Editing de ponta a ponta.
2. Deploy do schema Sanity (`npx sanity schema deploy` por quem tem acesso à conta corporativa).
3. Configurar webhook no Sanity Manage → `/api/revalidate?secret=...` e no Builder.io.
4. Criar modelo `landing-page` no Builder.io e conectar a public key.
5. DNS de `lp.omni.chat` apontando para o mesmo deploy.
```
