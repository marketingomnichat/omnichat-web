# Home omni.chat (Superdesign) — Plano de Fidelidade Visual

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fechar o gap visual entre a home Next.js e o draft Superdesign `omni.chat` (clone fiel do WP ao vivo), reordenando o seed Sanity e evoluindo seções/chrome até a revisão visual `home-wp` ≈ `home-novo`.

**Architecture:** Continuar o page builder existente (`SectionRenderer` + Sanity `page` slug `home`). Não clonar HTML/CSS Bootstrap do draft — mapear cada bloco do draft para seções `oc-*` já registradas (ou 1 seção nova mínima). Conteúdo vem do seed idempotente `scripts/migrate-wp/seed-marketing-pages.ts`. Referência canônica do design: draft Superdesign + HTML arquivado.

**Tech Stack:** Next.js 16, React 19, Tailwind v4 (`oc-*`), Sanity (`page`/`siteSettings`), vitest, Playwright (`scripts/visual-compare.ts`).

## Fonte do design

| Item | Valor |
|---|---|
| Project ID | `2a82a61f-95d0-417b-a2c4-5df081236b01` |
| Draft ID | `8767a8c3-af33-4ffe-b96a-0531e30f74a0` |
| Preview | https://p.superdesign.dev/draft/8767a8c3-af33-4ffe-b96a-0531e30f74a0 |
| HTML arquivado | `docs/superpowers/design-refs/home-superdesign-8767a8c3.html` |
| Spec tokens WP | `docs/superpowers/specs/2026-07-27-wp-visual-tokens.md` |
| Screenshots | `docs/superpowers/visual-review/home-{wp,novo}.png` |

## Mapa draft → seções (ordem obrigatória)

| # | Classe WP no draft | Seção Sanity | Status atual |
|---|---|---|---|
| 0 | `header` | `siteSettings.nav` + `Header` | Parcial (sem dropdowns; CTA errado) |
| 1 | `.hero.hero-home` | `hero` (theme dark) | Parcial (sem prompt tipográfico / highlight Whizz) |
| 2 | `.antes-depois` | `richText` lead | Ausente (texto colado no subtitle do hero) |
| 3 | `.depoimentos` swiper | `testimonials` | Ausente no seed home |
| 4 | `.produtos-carrossel` (5 slides) | `featureSplit` ×5 | Presente (stack, não carrossel — ok nesta fase) |
| 5 | `.numeros` | `stats` + `title` | Parcial (sem título de seção) |
| 6 | `.metodo` (ecossistema) | `mediaBlock` **novo** | Ausente |
| 7 | `.cards-informativos` | `featureGrid` | Presente com **título errado** |
| 8 | `.cta` planos | `ctaBanner` | Presente |
| 9 | `.formulario` | `ctaForm` | Ausente no seed home (há grid “soluções” inventado) |
| 10 | `footer` | `Footer` + `siteSettings` | Parcial (faltam “Siga a Omni” / app) |

## Global Constraints

- **Design system**: tokens `oc-*` em `app/globals.css`; roxo Whizz só em `components/whizz/`; Card borda XOR sombra; `#FFBC00` nunca com tinta branca; `<Image>` nunca `<img>`. Gate: `npm run lint` (inclui `lint:design`).
- **Copy**: preservar o texto do draft/WP fielmente (é conteúdo). Labels novos de schema em pt-BR, sentence case, sem emoji (skill `design-system-omnichat`).
- **Seção nova** = schema em `sanity/schemas/objects/sections.ts` + componente em `components/sections/` + `registry.ts` + paridade em `tests/registry.test.ts` (hoje exige 12; sobe para 13 com `mediaBlock`).
- **Não** adicionar Swiper nesta entrega — carrosséis viram grid/stack fiéis em conteúdo; motion de carrossel fica fora de escopo (fase 2).
- **Formulário**: manter POST para `formAction` existente (HubSpot do seed de outras páginas / destino atual); sem backend novo. Selects do WP (Cargo, Solução) entram como `type: "select"` + `options[]`.
- **Todo task** termina com `npm run lint && npm run typecheck && npm test` verdes antes do commit. Build + visual-compare nos tasks finais.
- **Ignorar** `.superdesign/` no git (tmp + init local).

---

### Task 1: Ignorar artefatos Superdesign e fixar referência

**Files:**
- Modify: `.gitignore`
- Keep (já criado): `docs/superpowers/design-refs/home-superdesign-8767a8c3.html`

**Interfaces:**
- Consumes: nenhum
- Produces: `.superdesign/` fora do git; HTML de referência versionado para o agente

- [ ] **Step 1: Atualizar `.gitignore`**

Acrescentar no final:

```gitignore
# Superdesign (CLI local — init/tmp; drafts HTML de referência vão em docs/)
.superdesign/
```

- [ ] **Step 2: Confirmar referência**

```bash
test -s docs/superpowers/design-refs/home-superdesign-8767a8c3.html && wc -c docs/superpowers/design-refs/home-superdesign-8767a8c3.html
```

Expected: arquivo ~150 KB presente.

- [ ] **Step 3: Commit**

```bash
git add .gitignore docs/superpowers/design-refs/home-superdesign-8767a8c3.html docs/superpowers/plans/2026-07-28-home-superdesign-fidelity.md
git commit -m "docs: archive Superdesign home draft and fidelity plan"
```

---

### Task 2: Stats com título + Testimonials com logo/link

**Files:**
- Modify: `sanity/schemas/objects/sections.ts` (`stats`, `testimonials`)
- Modify: `components/sections/stats.tsx`
- Modify: `components/sections/testimonials.tsx`
- Test: `tests/schemas.test.ts` (se existir asserção de fields; senão criar caso mínimo)

**Interfaces:**
- Consumes: `Card` (`elevation="shadow"`)
- Produces:
  - `stats`: campo opcional `title?: string`
  - `testimonials.items[]`: campos opcionais `logoUrl?: string`, `logoAlt?: string`, `href?: string` (além de `quote`, `name`, `role`, `company`)

- [ ] **Step 1: Schema `stats.title`**

Em `stats` em `sections.ts`, adicionar antes de `items`:

```ts
defineField({ name: "title", title: "Título", type: "string" }),
```

- [ ] **Step 2: Schema testimonials — logo + link**

Nos fields de cada item de `testimonials`, acrescentar:

```ts
defineField({ name: "logoUrl", title: "URL do logo", type: "url" }),
defineField({ name: "logoAlt", title: "Alt do logo", type: "string" }),
defineField({ name: "href", title: "Link Saiba mais", type: "string" }),
```

- [ ] **Step 3: Componente Stats**

```tsx
export function Stats({
  title,
  items = [],
}: {
  title?: string;
  items?: { value: string; label: string }[];
}) {
  if (!items.length) return null;
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-10 text-center">{title}</h2>}
      <dl className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {items.map((s) => (
          <div key={s.label} className="text-center">
            <dd className="oc-h3-stat text-oc-yellow-ink">{s.value}</dd>
            <dt className="oc-label mt-2 text-oc-neutral-dark">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
```

- [ ] **Step 4: Componente Testimonials**

Atualizar o card para logo + link (sem inventar nome se só houver quote+logo no WP):

```tsx
import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/card";
import { safeHref } from "@/lib/safe-href";

type Testimonial = {
  quote: string;
  name?: string;
  role?: string;
  company?: string;
  logoUrl?: string;
  logoAlt?: string;
  href?: string;
};

export function Testimonials({ title, items = [] }: { title?: string; items?: Testimonial[] }) {
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8 text-center">{title}</h2>}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((t, i) => (
          <Card key={t.name ?? t.logoAlt ?? i} elevation="shadow" className="flex h-full flex-col items-center text-center">
            {t.logoUrl && (
              <Image
                src={t.logoUrl}
                alt={t.logoAlt ?? t.company ?? ""}
                width={160}
                height={48}
                className="mb-6 h-12 w-auto object-contain"
              />
            )}
            <blockquote className="oc-body-lg">&quot;{t.quote}&quot;</blockquote>
            {(t.name || t.role || t.company) && (
              <>
                {t.name && <p className="oc-label mt-4">{t.name}</p>}
                <p className="oc-caption text-oc-neutral-dark">
                  {[t.role, t.company].filter(Boolean).join(" · ")}
                </p>
              </>
            )}
            {t.href && (
              <Link
                href={safeHref(t.href)}
                className="oc-button-label mt-6 text-oc-yellow-ink underline-offset-4 hover:underline"
              >
                Saiba mais
              </Link>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 5: Gates**

```bash
npm run lint && npm run typecheck && npm test
```

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git commit -m "feat: extend stats title and testimonial logo/link for home fidelity"
```

---

### Task 3: Seção `mediaBlock` (ecossistema)

**Files:**
- Modify: `sanity/schemas/objects/sections.ts`, `sanity/schemas/documents/page.ts`, `sanity/schemas/documents/landing-page.ts`, `components/sections/registry.ts`
- Create: `components/sections/media-block.tsx`
- Modify: `tests/registry.test.ts` (lista de 12 → 13, incluir `mediaBlock`)

**Interfaces:**
- Consumes: `next/image`
- Produces: tipo `mediaBlock` — `{ title?: string; image: { imageUrl: string; alt: string }; imageMobile?: { imageUrl: string; alt: string } }`

- [ ] **Step 1: Atualizar teste de paridade**

Em `tests/registry.test.ts`:

```ts
it("cobre os 13 tipos de seção do schema", () => {
  for (const t of [
    "hero", "featureGrid", "testimonials", "logoCloud", "ctaBanner", "faq",
    "richText", "stats", "featureSplit", "pricingTable", "ctaForm", "latestPosts",
    "mediaBlock",
  ]) {
    expect(sectionRegistry[t], `faltando: ${t}`).toBeDefined();
  }
});
```

Rodar `npm test` → FAIL (`mediaBlock` undefined).

- [ ] **Step 2: Schema**

```ts
export const mediaBlock = defineType({
  name: "mediaBlock",
  title: "Bloco de mídia",
  type: "object",
  fields: [
    defineField({ name: "title", title: "Título", type: "string" }),
    defineField({
      name: "image",
      title: "Imagem desktop",
      type: "object",
      validation: (r) => r.required(),
      fields: [
        defineField({ name: "imageUrl", title: "URL", type: "url", validation: (r) => r.required() }),
        defineField({ name: "alt", title: "Texto alternativo", type: "string", validation: (r) => r.required() }),
      ],
    }),
    defineField({
      name: "imageMobile",
      title: "Imagem mobile",
      type: "object",
      fields: [
        defineField({ name: "imageUrl", title: "URL", type: "url" }),
        defineField({ name: "alt", title: "Texto alternativo", type: "string" }),
      ],
    }),
  ],
});
```

Registrar em `sectionTypes`, nos `of` de `page` e `landingPage`, e em `registry.ts`.

- [ ] **Step 3: Componente**

```tsx
import Image from "next/image";

type Media = { imageUrl: string; alt: string };

export function MediaBlock({
  title,
  image,
  imageMobile,
}: {
  title?: string;
  image: Media;
  imageMobile?: Media;
}) {
  return (
    <section className="mx-auto max-w-oc-container px-6 py-oc-section">
      {title && <h2 className="oc-h2 mb-8 text-center">{title}</h2>}
      <div className="relative mx-auto w-full max-w-[1126px]">
        <Image
          src={image.imageUrl}
          alt={image.alt}
          width={1126}
          height={600}
          className={`h-auto w-full ${imageMobile?.imageUrl ? "hidden lg:block" : ""}`}
        />
        {imageMobile?.imageUrl && (
          <Image
            src={imageMobile.imageUrl}
            alt={imageMobile.alt || image.alt}
            width={600}
            height={800}
            className="h-auto w-full lg:hidden"
          />
        )}
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Gates + commit**

```bash
npm run lint && npm run typecheck && npm test
git commit -m "feat: add mediaBlock section for ecosystem visual"
```

---

### Task 4: `ctaForm` com select + layout 2 colunas do draft

**Files:**
- Modify: `sanity/schemas/objects/sections.ts` (`ctaForm.fields[].type` + `options`)
- Modify: `components/sections/cta-form.tsx`
- Test: unit leve em `tests/cta-form-fields.test.ts` (opcional se preferir smoke via typecheck)

**Interfaces:**
- Consumes: schema `ctaForm`
- Produces: `type: "text" | "email" | "tel" | "select"`; quando `select`, `options: string[]`

- [ ] **Step 1: Schema**

Trocar o `list` de `type` para `["text", "email", "tel", "select"]` e adicionar:

```ts
defineField({
  name: "options",
  title: "Opções (select)",
  type: "array",
  of: [defineArrayMember({ type: "string" })],
  hidden: ({ parent }) => parent?.type !== "select",
}),
```

- [ ] **Step 2: Render select no formulário**

No map de `fields`, se `field.type === "select"`:

```tsx
<select
  id={`form-field-${field.name}`}
  name={field.name}
  required={field.required}
  className="rounded-oc-button border border-oc-divider bg-white px-4 py-3 text-oc-ink focus:border-oc-yellow-cta focus:outline-none focus:ring-2 focus:ring-oc-yellow-cta/30"
  defaultValue=""
>
  <option value="" disabled>
    {field.label}
  </option>
  {(field.options ?? []).map((opt) => (
    <option key={opt} value={opt}>
      {opt}
    </option>
  ))}
</select>
```

Manter o gradiente escuro existente. Layout: título + form em coluna única nesta fase (foto lateral do WP fica fora — YAGNI até o seed trazer `asideImage`).

- [ ] **Step 3: Gates + commit**

```bash
npm run lint && npm run typecheck && npm test
git commit -m "feat: ctaForm select fields for home lead form"
```

---

### Task 5: Header — dropdowns + CTAs do draft

**Files:**
- Modify: `components/site/header.tsx`
- Modify: `scripts/migrate-wp/site-settings.ts` (estrutura de nav com `children?`)
- Modify: schema `siteSettings` se `nav` for flat hoje — promover para `{ label, href, children?: {label, href}[] }`
- Modify: `app/(site)/layout.tsx` (passar nav tipada)

**Interfaces:**
- Consumes: `safeHref`, `DARK_HERO_ROUTES`
- Produces: Header com dropdowns Produtos/Soluções; Login → `https://app.omni.chat/`; Demo → `#formulario` (amarelo CTA)

- [ ] **Step 1: Tipar nav com children**

```ts
type NavItem = {
  label: string;
  href: string;
  children?: { label: string; href: string }[];
};
```

Atualizar seed:

```ts
const NAV_ITEMS = [
  {
    label: "Produtos",
    href: "#produtos",
    children: [
      { label: "Marketing Studio", href: "/produto/marketing-studio/" },
      { label: "Vendas", href: "/produto/sales-studio/" },
    ],
  },
  {
    label: "Soluções",
    href: "#solucoes",
    children: [
      { label: "Varejo", href: "/solucao/varejo/" },
      { label: "Educacional", href: "/solucao/educacional/" },
    ],
  },
  { label: "Planos", href: "/planos/" },
  { label: "Empresa", href: "/empresa/" },
  { label: "Conteúdo", href: "/blog/" },
];
```

- [ ] **Step 2: Header CTAs + dropdown**

Substituir o botão “Fale com vendas” por:

```tsx
<Link href="https://app.omni.chat/" className={/* ghost */}>
  Login
</Link>
<Link
  href="#formulario"
  className="rounded-[8px] bg-[#FFBC00] text-[#0B0C0E] px-[18px] py-[12px] text-[14px] font-semibold ..."
>
  Demo
</Link>
```

Para itens com `children`, renderizar `<details>`/`<summary>` ou menu hover acessível (`aria-haspopup`, teclado). Desktop: hover/focus; mobile: details nativo. Não adicionar lib de menu.

- [ ] **Step 3: Schema siteSettings** — se `nav` for array de `{label,href}` apenas, acrescentar `children` opcional (array de objetos iguais). Studio pt-BR: “Subitens”.

- [ ] **Step 4: Gates + commit**

```bash
npm run lint && npm run typecheck && npm test
git commit -m "feat: header dropdowns and Demo CTA matching WP home"
```

---

### Task 6: Hero — highlight Whizz + prompt “Criar agente…”

**Files:**
- Modify: `sanity/schemas/objects/sections.ts` (`hero`)
- Modify: `components/sections/hero.tsx`
- Create: `components/sections/hero-agent-prompt.tsx` (`"use client"`)
- Create: `components/whizz/hero-highlight.tsx` (ou classes em `components/whizz/tokens.css`)

**Interfaces:**
- Consumes: tokens Whizz (`components/whizz/`)
- Produces:
  - `hero.highlightPhrase?: string` (ex.: `"IA especialista"`) — trecho do `title` pintado com gradiente Whizz
  - `hero.agentPrompt?: { prefix: string; phrases: string[] }` — UI “Criar agente de IA para… {frase animada}”

- [ ] **Step 1: Schema hero**

```ts
defineField({
  name: "highlightPhrase",
  title: "Trecho em destaque (Whizz)",
  type: "string",
  description: "Substring de title que recebe o gradiente Whizz",
}),
defineField({
  name: "agentPrompt",
  title: "Prompt Criar agente",
  type: "object",
  fields: [
    defineField({ name: "prefix", title: "Prefixo", type: "string" }),
    defineField({
      name: "phrases",
      title: "Frases rotativas",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
  ],
}),
```

- [ ] **Step 2: Highlight no H1**

Se `highlightPhrase` e `title.includes(highlightPhrase)`:

```tsx
const [before, after] = splitOnce(title, highlightPhrase);
// before + <span className="whizz-text-gradient">{highlightPhrase}</span> + after
```

Estilo do span **obrigatoriamente** via `components/whizz/` (classe CSS Whizz), nunca token `oc-*` roxo.

- [ ] **Step 3: Client prompt**

`hero-agent-prompt.tsx`: ciclo simples `useEffect` + `setInterval` (~3s) entre `phrases`. Markup: pill branca com prefixo + frase. Clique/submit navega para `#formulario` (mesmo destino do CTA Demo). Sem dependência externa.

- [ ] **Step 4: Compor no Hero**

Ordem no hero dark: overline? → h1 → agentPrompt? → subtitle? → ctas. Padding `py-oc-hero`. Fundo `#000` (não `bg-black` genérico se o token `oc-dark`/`#000` do WP for o alvo — usar `bg-black` ou classe explícita `#000` como no visual tokens).

- [ ] **Step 5: Gates + commit**

```bash
npm run lint && npm run typecheck && npm test
git commit -m "feat: hero Whizz highlight and agent prompt for home"
```

---

### Task 7: Reescrever seed da home na ordem do draft

**Files:**
- Modify: `scripts/migrate-wp/seed-marketing-pages.ts` (`buildHome` apenas)

**Interfaces:**
- Consumes: `img()` helper, schemas atualizados (Tasks 2–6)
- Produces: `wp-page-home` com seções na ordem da tabela do mapa

- [ ] **Step 1: Remover o featureGrid “Evolua sua empresa…” inventado do final da home**

- [ ] **Step 2: Montar `sections` nesta ordem exata**

1. **hero** — title do draft; `highlightPhrase: "IA especialista"`; `theme: "dark"`; `agentPrompt.prefix: "Criar agente de IA para..."`; `phrases` com as frases tipográficas do draft (começar com a do aluno/rematrícula e 2–3 variantes reais do WP se estiverem no HTML; se só uma estiver no HTML arquivado, usar essa + frases já usadas no site); CTAs: primário opcional (pode omitir se o prompt substitui) + secundário “Fale com um especialista” → `#formulario`. **Não** colocar o lead longo no `subtitle`.

2. **richText** — um bloco com o parágrafo `.antes-depois`:  
   “A OmniChat conecta marketing, vendas e relacionamento no WhatsApp com uma IA Conversacional que garante experiências encantadoras, produtividade e conversas que vendem”

3. **testimonials** — itens do draft (Hering, Kappesberg, iPlace, Mobly, Veste, Espaço Smart…), cada um com `quote`, `logoUrl` (URL `omni.chat/wp-content/...` via `img()` → Sanity ou URL CDN), `href` “Saiba mais” do draft. Sem `title` ou com título vazio (no WP o lead fica na seção anterior).

4. **featureSplit ×5** — manter copy/imagens já seedadas (Agente, Copilot, Pós-venda, Conversas, Campanhas).

5. **stats** — `title: "Por que o canal conversacional é o canal que vende?"` + 3 items (12,5% / 27x / 60%) com labels **exatos** do draft.

6. **mediaBlock** — desktop `ecossistema-omni.png`, mobile `ecossistema-omni-mobile.png` (URLs do draft).

7. **featureGrid** — **sem** o título da stats; 4 cards: Comece rápido / Cresça com acompanhamento / Suporte humano / Comunidade (copy do draft). `title` omitido ou string vazia.

8. **ctaBanner** — “Descubra a solução ideal” + CTA planos (já existe).

9. **ctaForm** — `title: "Evolua sua empresa com nossas soluções"`; `formAction` HubSpot já usado em CCR/planos; `buttonLabel` alinhado ao WP (“Enviar” / label real do form no HTML); fields:

```ts
[
  { name: "nome", label: "Nome e sobrenome", type: "text", required: true },
  { name: "cargo", label: "Cargo", type: "select", required: true, options: ["CEO","Diretor","Gerente","Analista","Outro"] },
  { name: "email", label: "E-mail corporativo", type: "email", required: true },
  { name: "empresa", label: "Empresa", type: "text", required: true },
  { name: "telefone", label: "Telefone", type: "tel", required: true },
  { name: "solucao", label: "Solução buscada", type: "select", required: true, options: ["Atendimento Omnichannel","Automação de WhatsApp","Chatbot","Integrações","Outro"] },
]
```

- [ ] **Step 3: Rodar seed** (requer token de escrita)

```bash
npm run migrate:wp
# ou, se o runner permitir só marketing:
npx tsx scripts/migrate-wp/seed-marketing-pages.ts
```

Expected: log `✓ wp-page-home (N sections)` com N = 1 hero + 1 richText + 1 testimonials + 5 featureSplit + 1 stats + 1 mediaBlock + 1 featureGrid + 1 ctaBanner + 1 ctaForm = **13**.

- [ ] **Step 4: Commit do script** (não commit de secrets)

```bash
git commit -m "fix: reseed home sections to match Superdesign/WP order"
```

---

### Task 8: RichText lead tipografia + Footer “Siga a Omni”

**Files:**
- Modify: `components/sections/rich-text.tsx` (variante centralizada opcional **ou** estilo só via conteúdo — preferir prop `variant?: "lead"` no schema se necessário)
- Modify: `components/site/footer.tsx`
- Modify: `scripts/migrate-wp/site-settings.ts`

**Interfaces:**
- Produces: lead da home com `oc-h2`/`oc-body-lg` centralizado amarelo/ink conforme WP; footer com bloco social + colunas já seedadas

- [ ] **Step 1: Lead visual**

Opção mínima sem schema novo: no seed, o `richText` fica genérico; criar prop opcional `align: "center"` no schema `richText` **somente se** o lead ficar visualmente errado no styleguide. Preferência: adicionar `align?: "start" | "center"` + classes `text-center oc-h2` no primeiro bloco via CSS wrapper:

```tsx
// rich-text.tsx — se content for um único parágrafo curto, ainda render PortableText;
// melhor: campo opcional align no schema
<section className={`mx-auto max-w-oc-container px-6 py-oc-section ${align === "center" ? "text-center" : ""}`}>
```

- [ ] **Step 2: Footer social labels**

Trocar lista crua de platform strings por ícones/texto “Siga a Omni” (`oc-h5`) acima dos links; manter colunas do seed. Baixe o aplicativo: se não houver stores no seed, omitir (não inventar links).

- [ ] **Step 3: Gates + commit**

```bash
npm run lint && npm run typecheck && npm test
git commit -m "feat: home lead typography and footer social block"
```

---

### Task 9: Verificação visual e aceite

**Files:**
- Regenerate: `docs/superpowers/visual-review/home-novo.png` via `scripts/visual-compare.ts`
- (Opcional) anotar gaps restantes em comentário no final deste plano

**Interfaces:**
- Consumes: `npm run dev` + Playwright compare
- Produces: par `home-wp.png` / `home-novo.png` atualizado para review humano

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: sucesso.

- [ ] **Step 2: Visual compare**

```bash
npx tsx scripts/visual-compare.ts
# ou o comando documentado no script — garantir slug home
```

- [ ] **Step 3: Checklist manual (owner)**

Abrir lado a lado:

1. Hero black + highlight “IA especialista” + prompt
2. Lead centrado
3. Depoimentos com logos
4. 5 feature splits
5. Stats com título
6. Ecossistema
7. 4 cards informativos
8. CTA planos amarelo
9. Form escuro `#formulario`
10. Header Demo/Login + dropdowns
11. Footer amarelo

- [ ] **Step 4: Commit screenshots**

```bash
git add docs/superpowers/visual-review/home-novo.png
git commit -m "chore: refresh home visual review after Superdesign fidelity pass"
```

---

## Fora de escopo (fase 2)

- Swiper/carrossel animado de depoimentos e produtos
- Orb cósmico / partículas do hero (asset decorativo)
- Foto lateral do formulário
- Dropdown mobile polished drawer
- Cutover DNS / desligar WP

## Self-review

1. **Spec coverage:** todas as 9 seções do draft + header/footer têm task (1–8) + verificação (9).
2. **Placeholders:** nenhum TBD — URLs, copy e fields listados.
3. **Types:** `mediaBlock` entra no registry/teste; `NavItem.children`, `hero.agentPrompt`, `stats.title`, `ctaForm` select alinhados entre tasks.
4. **Não duplica** o plano `2026-07-27-wp-migration.md` — assume foundation já mergeada; foca só fidelidade da home vs Superdesign.
