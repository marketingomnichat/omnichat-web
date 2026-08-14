# Renovação visual v2 (product-led) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aplicar o sistema visual product-led (hero centro+UI, stack produto primeiro, header adaptativo, painéis, copy direta, densidade equilibrada) sobre o page builder Sanity, começando pela home e estendendo chrome às páginas de marketing/blog.

**Architecture:** Evoluir tokens `oc-*`, primitive `Panel`, variantes em seções existentes (`hero.layout`, shells de painel), `Header` com scroll + rotas de hero escuro, e reseed da home. Sem kit paralelo e sem tipos Sanity novos salvo se um bloco não couber em variante. Spec: `docs/superpowers/specs/2026-07-31-visual-renovation-v2-design.md`.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Sanity, vitest, Playwright (`scripts/visual-compare.ts`). Sem novas deps de UI/carrossel.

## Global Constraints

- Tokens `oc-*` em `app/globals.css`; Whizz (roxo/gradiente) **somente** em `components/whizz/`.
- `#FFBC00` nunca com tinta branca; `<Image>` nunca `<img>`.
- Labels schema/UI: pt-BR, sentence case, sem emoji.
- Seção nova (se inevitável) = schema + componente + `registry.ts` + `tests/registry.test.ts` (+ contagem em `CLAUDE.md`).
- Gate por task: `npm run lint && npm run typecheck && npm test`. Fechamento onda 1: `build` + `npx tsx scripts/visual-compare.ts` (home).
- Seed: `npx tsx scripts/migrate-wp/seed-marketing-pages.ts` (requer `.env.local` com token Sanity write).
- Branch: `feat/home-superdesign-fidelity` (ou branch dedicada `feat/visual-renovation-v2` a partir dela). Não push sem pedido.
- Onde layout WP conflitar com v2, vence v2.

## File map

| File | Responsibility |
|---|---|
| `app/globals.css` | Body bg cinza claro v2; tokens painel; `py-oc-section` ~96px; shadow painel |
| `components/ui/panel.tsx` | Bandeja branca (borda XOR sombra via `elevation`) |
| `components/site/header.tsx` | Modo escuro (rota) + sólido claro no scroll; `fixed`/`sticky` |
| `components/sections/hero.tsx` | `layout: "default" \| "productEmerge"` |
| `sanity/schemas/objects/sections.ts` | Campo `layout` no `hero` |
| `components/sections/feature-split.tsx` | Shell painel + fundo body |
| `components/sections/feature-carousel.tsx` | Shell painel por item / faixa |
| `components/sections/stats.tsx` | Shell painel |
| `components/sections/testimonials.tsx` | Shell painel (grid/carousel) |
| `components/sections/logo-cloud.tsx` | Shell painel + padding v2 |
| `components/sections/cta-form.tsx` | Contraste v2 sem violar amarelo+branco |
| `app/(site)/layout.tsx` | Body já herda `globals`; sem chrome LP |
| `scripts/migrate-wp/seed-marketing-pages.ts` | `buildHome` stack B + copy A |
| `docs/superpowers/visual-review/home-novo.png` | Aceite visual onda 1 |

## Ondas

| Tasks | Onda | Entrega |
|---|---|---|
| 1–7 | **1 — Home** | Tokens, Panel, Header, Hero, seções em painel, seed, motion, visual |
| 8 | **2 — Empresa / Planos / CCR** | Mesmos padrões + copy enxuta onde fizer sentido |
| 9 | **3 — Blog chrome** | Verificar header/footer; miolo de post intacto |
| — | **4 — LPs** | Fora deste plano (após aceite 1–3) |

---

### Task 1: Tokens de superfície + densidade + `Panel`

**Files:**
- Modify: `app/globals.css`
- Create: `components/ui/panel.tsx`
- Test: `tests/panel.test.tsx` (ou `.ts` com render se o projeto já usa RTL; senão teste de class contract puro exportando helper)

**Interfaces:**
- Consumes: padrão `Card` (`elevation?: "border" \| "shadow"`)
- Produces: `Panel({ elevation?: "border" \| "shadow"; className?; children; ...HTMLAttributes })` — `bg-oc-surface`, `rounded-oc-card`, padding interno, borda XOR sombra; **sem** `bg-oc-surface-gray` no próprio Panel (isso é card menor / grid)

- [ ] **Step 1: Teste do contrato elevation**

```ts
import { describe, expect, it } from "vitest";
import { panelElevationClass } from "../components/ui/panel";

describe("panelElevationClass", () => {
  it("border e shadow são exclusivos", () => {
    expect(panelElevationClass("border")).toContain("border");
    expect(panelElevationClass("border")).not.toContain("shadow-oc");
    expect(panelElevationClass("shadow")).toContain("shadow-oc");
    expect(panelElevationClass("shadow")).not.toContain("border-oc-divider");
  });
});
```

- [ ] **Step 2: RED** — `npm test -- tests/panel.test.ts` FAIL (módulo inexistente)

- [ ] **Step 3: Tokens em `app/globals.css`**

No `@theme`, após `--color-oc-surface-gray`:

```css
--color-oc-body: #F4F5F8;          /* body claro v2 — atrás dos painéis */
--shadow-oc-panel: 0 8px 28px rgba(11, 12, 14, 0.08);
--space-oc-section: 96px;          /* densidade equilibrada ~80–112px (substitui 64px) */
--radius-oc-panel: 24px;           /* bandeja; cards grandes podem manter 32px */
```

Em `body { background: ... }` trocar para `var(--color-oc-body)`.

Adicionar utility:

```css
@utility shadow-oc-panel {
  box-shadow: var(--shadow-oc-panel);
}
```

Manter `--color-oc-surface: #FDFDFD` como branco dos painéis/header claro.

- [ ] **Step 4: Implementar `components/ui/panel.tsx`**

```tsx
import type { HTMLAttributes } from "react";

export function panelElevationClass(elevation: "border" | "shadow" = "border") {
  return elevation === "border"
    ? "border border-oc-divider"
    : "shadow-oc-panel";
}

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  elevation?: "border" | "shadow";
};

export function Panel({
  elevation = "border",
  className = "",
  children,
  ...props
}: PanelProps) {
  return (
    <div
      className={`bg-oc-surface rounded-[var(--radius-oc-panel)] p-6 md:p-10 ${panelElevationClass(elevation)} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

Não colocar Whizz tokens aqui. `Card` permanece para unidades interativas pequenas (featureGrid items).

- [ ] **Step 5: GREEN + gates + commit**

```bash
npm test -- tests/panel.test.ts
npm run lint && npm run typecheck && npm test
git add app/globals.css components/ui/panel.tsx tests/panel.test.ts
git commit -m "feat: panel primitive and v2 surface density tokens"
```

---

### Task 2: Header adaptativo (rota escura + scroll → claro)

**Files:**
- Modify: `components/site/header.tsx`
- Test: `tests/header-appearance.test.ts` (helper pura de estado)

**Interfaces:**
- Consumes: `nav?: NavItem[]`, `usePathname()`, `DARK_HERO_ROUTES` existente (`"/"`, `"/planos"`, `"/chat-commerce-report"`)
- Produces: `resolveHeaderAppearance({ onDarkHeroRoute: boolean; scrolled: boolean }): "darkOverlay" \| "lightSolid"`
  - `darkOverlay` só se `onDarkHeroRoute && !scrolled`
  - caso contrário `lightSolid`
- Blog e `/empresa` começam `lightSolid` (não estão em `DARK_HERO_ROUTES`)

- [ ] **Step 1: Teste da resolução**

```ts
import { describe, expect, it } from "vitest";
import { resolveHeaderAppearance } from "../components/site/header-appearance";

describe("resolveHeaderAppearance", () => {
  it("hero home no topo fica overlay escuro", () => {
    expect(resolveHeaderAppearance({ onDarkHeroRoute: true, scrolled: false })).toBe("darkOverlay");
  });
  it("após scroll vira sólido claro mesmo na home", () => {
    expect(resolveHeaderAppearance({ onDarkHeroRoute: true, scrolled: true })).toBe("lightSolid");
  });
  it("blog sempre sólido claro", () => {
    expect(resolveHeaderAppearance({ onDarkHeroRoute: false, scrolled: false })).toBe("lightSolid");
  });
});
```

- [ ] **Step 2: RED** — `npm test -- tests/header-appearance.test.ts` FAIL

- [ ] **Step 3: Helper `components/site/header-appearance.ts`**

```ts
export type HeaderAppearance = "darkOverlay" | "lightSolid";

export function resolveHeaderAppearance(input: {
  onDarkHeroRoute: boolean;
  scrolled: boolean;
}): HeaderAppearance {
  if (input.onDarkHeroRoute && !input.scrolled) return "darkOverlay";
  return "lightSolid";
}

export const HEADER_SCROLL_THRESHOLD_PX = 24;
```

- [ ] **Step 4: Wiring em `header.tsx`**

- `useState(false)` para `scrolled`; `useEffect` com `scroll` listener (`window.scrollY > HEADER_SCROLL_THRESHOLD_PX`); cleanup; respeitar SSR (inicial `false`).
- `appearance = resolveHeaderAppearance({ onDarkHeroRoute: DARK_HERO_ROUTES.has(pathname), scrolled })`.
- `darkOverlay`: `fixed`/`absolute` top, `bg-transparent`, links `#FFBC00` / logo branco (comportamento atual `onDark`).
- `lightSolid`: `fixed top-0 … bg-oc-surface border-b border-oc-divider` (ou sombra leve `shadow-oc-sm`), links `text-oc-ink`, logo `text-oc-ink`.
- Transição: `transition-colors duration-200 ease-oc` no `<header>` (um dos motions intencionais).
- CTA Demo permanece `bg-oc-yellow-cta text-oc-ink` nos dois modos.
- Submenu desktop: fundo `bg-oc-surface` (já claro) — ok nos dois modos.
- Drawer mobile: manter escuro full-viewport **ou** alinhar ao appearance; se dual-mode for complexo nesta task, drawer pode ficar sempre `bg-oc-dark` (documentar). Preferir: drawer sempre escuro (já existe) para não regressar.
- Páginas com header `fixed` + `lightSolid`: garantir que o conteúdo não fique sob o header — hero já tem `py-oc-hero` generoso; páginas claras (blog) podem precisar de `pt` no layout **somente se** o header deixar de ser `absolute`. Solução: header sempre `fixed`; em `(site)/layout.tsx` adicionar spacer `h-[76px]` **apenas quando** a primeira seção não for hero dark — **mais simples:** manter `absolute` no `darkOverlay` e `fixed` no `lightSolid`, e no blog o primeiro conteúdo já tem `py-14`. Verificar visualmente `/blog` e `/empresa` após a mudança; se overlap, adicionar `pt-[76px]` em `app/(site)/blog/page.tsx` e no main de `[slug]` quando não houver hero.

Implementação mínima recomendada:

```tsx
const appearance = resolveHeaderAppearance({
  onDarkHeroRoute: DARK_HERO_ROUTES.has(pathname),
  scrolled,
});
const isDark = appearance === "darkOverlay";
// header className:
// isDark
//   ? "absolute top-0 … bg-transparent"
//   : "fixed top-0 … bg-oc-surface/95 backdrop-blur-sm border-b border-oc-divider"
```

- [ ] **Step 5: GREEN + gates + commit**

```bash
npm test -- tests/header-appearance.test.ts
npm run lint && npm run typecheck && npm test
git add components/site/header.tsx components/site/header-appearance.ts tests/header-appearance.test.ts
git commit -m "feat: adaptive header overlay and solid scroll state"
```

---

### Task 3: Hero `layout: productEmerge`

**Files:**
- Modify: `components/sections/hero.tsx`
- Modify: `sanity/schemas/objects/sections.ts` (bloco `hero`)
- Test: `tests/hero-layout.test.ts` (helper de classes ou smoke de prop)

**Interfaces:**
- Consumes: props atuais + `layout?: "default" \| "productEmerge"` (default `"default"` — não quebra empresa/planos)
- Produces: com `productEmerge` + `theme: "dark"`: stack vertical centrado (title, subtitle curto, CTAs) e mídia/`backgroundMedia` **abaixo** do bloco de texto (UI emergindo), não só como fundo absoluto atrás do H1
- Whizz: `highlightPhrase` / `agentPrompt` opcionais; no seed v2 preferir subtitle curto sem prompt longo (copy A)

- [ ] **Step 1: Schema**

Em `hero` fields (após `theme` / `backgroundMedia`), adicionar:

```ts
defineField({
  name: "layout",
  title: "Layout",
  type: "string",
  options: {
    list: [
      { title: "Padrão", value: "default" },
      { title: "Produto emergindo", value: "productEmerge" },
    ],
    layout: "radio",
  },
  initialValue: "default",
}),
```

- [ ] **Step 2: Teste**

```ts
import { describe, expect, it } from "vitest";
import { heroContentAlignClass } from "../components/sections/hero";

describe("heroContentAlignClass", () => {
  it("productEmerge centraliza", () => {
    expect(heroContentAlignClass("productEmerge")).toContain("text-center");
    expect(heroContentAlignClass("productEmerge")).toContain("items-center");
  });
  it("default alinha início", () => {
    expect(heroContentAlignClass("default")).not.toContain("text-center");
  });
});
```

- [ ] **Step 3: RED** — fail

- [ ] **Step 4: Implementar layout em `hero.tsx`**

Exportar:

```ts
export function heroContentAlignClass(layout: "default" | "productEmerge" = "default") {
  return layout === "productEmerge"
    ? "flex flex-col items-center text-center mx-auto"
    : "";
}
```

Comportamento `productEmerge`:

1. Seção `relative overflow-hidden bg-oc-dark` (ou black).
2. Bloco texto em `relative z-10 … py-oc-hero pb-10` com `heroContentAlignClass`, `max-w-[720px]` no H1/subtitle.
3. CTAs centralizados (`justify-center`).
4. Faixa de produto abaixo: se `backgroundMedia`, renderizar **não** full-bleed atrás do título; renderizar em container inferior full-width com altura ~40–50vh, `rounded-t-oc-panel` opcional, sombra para cima — vídeo/`Image` com `object-cover` / `object-top`. Overlay gradient do dark para a mídia se necessário para legibilidade.
5. `layout === "default"`: manter comportamento atual (mídia absolute inset-0).

Sem badges flutuantes, chips ou stats no hero.

Ghost CTA em dark: garantir contraste (amarelo ou branco), nunca `#FFBC00` + branco.

- [ ] **Step 5: GREEN + gates + commit**

```bash
npm test -- tests/hero-layout.test.ts
npm run lint && npm run typecheck && npm test
git add components/sections/hero.tsx sanity/schemas/objects/sections.ts tests/hero-layout.test.ts
git commit -m "feat: hero productEmerge layout for product-led home"
```

---

### Task 4: Seções de produto/prova em `Panel`

**Files:**
- Modify: `components/sections/feature-split.tsx`
- Modify: `components/sections/feature-carousel.tsx`
- Modify: `components/sections/stats.tsx`
- Modify: `components/sections/testimonials.tsx`
- Modify: `components/sections/logo-cloud.tsx`
- Optional prop: `framed?: boolean` default `true` nas que precisam de escape hatch — **YAGNI:** aplicar painel sempre nestas seções no marketing; se `dark` no featureSplit, painel pode ser `bg-oc-dark` com texto claro **ou** manter faixa dark full-bleed sem Panel branco (Whizz deep-dive pode usar `dark: true` + componentes whizz no media — não forçar bandeja branca sobre bloco Whizz dark).

**Interfaces:**
- Consumes: `Panel` da Task 1
- Produces: seções com outer `bg-oc-body` (ou transparente herdando body) + inner `max-w-oc-container px-6 py-oc-section` + `<Panel>` envolvendo conteúdo; **uma** bandeja por seção (sem Card envolvendo o Panel)

Regras por seção:

| Seção | Tratamento |
|---|---|
| `featureSplit` | Se `dark`: faixa `bg-oc-dark` full-bleed (Whizz), sem Panel branco. Se claro: Panel com grid texto+imagem |
| `featureCarousel` | Faixa `bg-oc-body`; cada slide em Panel **ou** um Panel envolvendo o carousel track — preferir **um Panel por slide visível** sem card-on-card |
| `stats` | Panel único com grid de KPIs |
| `testimonials` | Panel único; items internos podem usar tipografia sem `Card` shadow se ficar card-on-card — se `Card` dentro de `Panel`, remover Card e usar divider/spacing |
| `logoCloud` | Panel ou faixa simples com `py-oc-section`; preferir Panel leve |

- [ ] **Step 1:** Em `feature-split.tsx` (claro), envolver o grid interno:

```tsx
<section className="bg-oc-body">
  <div className="mx-auto max-w-oc-container px-6 py-oc-section">
    <Panel elevation="border">
      {/* grid md:grid-cols-2 existente */}
    </Panel>
  </div>
</section>
```

- [ ] **Step 2:** Repetir padrão em `stats`, `logo-cloud`, `testimonials` (remover `Card` externo dos items se estiver dentro de Panel — items podem ser só tipografia + aspas).

- [ ] **Step 3:** `feature-carousel.tsx` — background da section `bg-oc-body`; conteúdo do slide dentro de `Panel`.

- [ ] **Step 4:** Gates + commit

```bash
npm run lint && npm run typecheck && npm test
git add components/sections/feature-split.tsx components/sections/feature-carousel.tsx components/sections/stats.tsx components/sections/testimonials.tsx components/sections/logo-cloud.tsx
git commit -m "feat: wrap marketing sections in v2 panels"
```

---

### Task 5: Reseed home — stack B + copy A

**Files:**
- Modify: `scripts/migrate-wp/seed-marketing-pages.ts` (`buildHome` only)

**Interfaces:**
- Consumes: assets/`img()` já existentes no seed (Whizz, produtos, logos, hero video, form aside)
- Produces: ordem canônica da spec:

1. `hero` — `theme: "dark"`, `layout: "productEmerge"`, `backgroundMedia` video atual, copy A, CTA curto
2. `featureSplit` **dark** — Whizz Agent deep-dive (`dark: true`, mediaSide adequado, CTA “Ver Whizz” → URL produto existente ou `#formulario`)
3. `featureCarousel` — módulos Marketing / Vendas / Atendimento (reusar itens do carousel atual; enxugar body)
4. `logoCloud` — logos de clientes (extrair das logos dos testimonials ou lista existente; se não houver asset list separado, criar `logoCloud` com logos já baixados no seed de depoimentos)
5. `stats` — KPIs atuais com title curto
6. `testimonials` — `variant: "carousel"` (prova depois do produto)
7. `ctaForm` — manter HubSpot/`asideImage`; title/button copy curtos (“Agendar demo”)

Remover da home seed (onda 1): lead `richText` longo WP, `mediaBlock` ecossistema, `featureGrid` 4 colunas, `ctaBanner` planos — conteúdo pode permanecer em outras páginas; não deletar helpers.

Copy norte (ajustar sentence case):

```ts
// hero
title: "Venda no WhatsApp com IA que conhece seu negócio",
subtitle: "Whizz Agent qualifica e fecha. Seu time escala.",
ctas: [{ label: "Agendar demo", href: "#formulario", variant: "primary" }],
layout: "productEmerge",
theme: "dark",
// opcional: highlightPhrase omitido ou "IA" se couber naturalmente
```

Whizz split title exemplo: `"IA com profundidade de negócio"`.

- [ ] **Step 1:** Reescrever array `sections` em `buildHome()` na ordem acima; `_key` estáveis via `key("s", n)`.

- [ ] **Step 2:** Rodar seed local:

```bash
npx tsx scripts/migrate-wp/seed-marketing-pages.ts
```

Expected: log de replace `wp-page-home` sem erro.

- [ ] **Step 3:** Smoke visual em `npm run dev` — `/` mostra hero centro, Whizz, carousel, logos, stats, depoimentos, form.

- [ ] **Step 4: Commit**

```bash
git add scripts/migrate-wp/seed-marketing-pages.ts
git commit -m "feat: reseed home for product-led v2 stack and copy"
```

---

### Task 6: Motion intencional + reduced motion

**Files:**
- Modify: `components/site/header.tsx` (já tem transition — completar se faltou)
- Modify: `components/sections/hero.tsx` (entrada da faixa de produto)
- Modify: `components/ui/panel.tsx` (hover sutil opcional)
- Optional: `app/globals.css` `@media (prefers-reduced-motion: reduce)`

**Interfaces:**
- Produces: exatamente 2–3 motions:
  1. Header color/background transition
  2. Hero product band: `animate` fade/slide-up leve no mount (`motion-safe:`)
  3. Panel: `transition-shadow` no hover (`hover:shadow-oc-panel` se elevation border)

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

Escopo mínimo: preferir utilities Tailwind `motion-safe:animate-…` / `motion-reduce:transition-none` em vez do reset global agressivo se o reset já existir no projeto — **não duplicar**.

- [ ] **Step 1:** Implementar as 3 motions sem libs novas.
- [ ] **Step 2:** Gates + commit

```bash
npm run lint && npm run typecheck && npm test
git add components/site/header.tsx components/sections/hero.tsx components/ui/panel.tsx app/globals.css
git commit -m "feat: intentional motion for header hero and panels"
```

---

### Task 7: Aceite visual onda 1 (home)

**Files:**
- Regenerate: `docs/superpowers/visual-review/home-novo.png`
- Optional note: `docs/superpowers/visual-review/README.md` só se já existir padrão — **não criar markdown novo** se não houver pedido

- [ ] **Step 1:** Gates completos

```bash
npm run lint && npm run typecheck && npm test && npm run build
```

- [ ] **Step 2:** Subir app (`npm run start` ou dev) e rodar:

```bash
npx tsx scripts/visual-compare.ts
```

(Ajustar se o script exigir lista de páginas — garantir pelo menos home.)

- [ ] **Step 3:** Owner compara `home-novo.png` com a direção da spec (não com WP como verdade). Checklist:
  - [ ] Hero centro + UI emergindo
  - [ ] Whizz cedo
  - [ ] Painéis no body cinza
  - [ ] Header overlay → sólido no scroll
  - [ ] Copy curta
  - [ ] Form/`#formulario` ok

- [ ] **Step 4: Commit screenshot**

```bash
git add docs/superpowers/visual-review/home-novo.png
git commit -m "chore: refresh home visual review for renovation v2"
```

---

### Task 8: Onda 2 — Empresa, Planos, CCR

**Files:**
- Modify: `scripts/migrate-wp/seed-marketing-pages.ts` (`buildEmpresa`, `buildPlanos`, e builder CCR se existir no mesmo arquivo)
- Modify seções só se alguma página quebrar com Panel/header (preferir zero mudança de componente)

**Interfaces:**
- Consumes: Header adaptativo + Panel nas seções já alteradas
- Produces: heroes com copy mais curta; `layout: "default"` (não productEmerge) salvo se a página tiver UI de produto forte; planos mantém `pricingTable`; garantir `/planos` e `/chat-commerce-report` continuam em `DARK_HERO_ROUTES`

- [ ] **Step 1:** Enxugar titles/subtitles dos heroes empresa/planos/ccr (voz A).
- [ ] **Step 2:** Seed + smoke nas três rotas.
- [ ] **Step 3:** Gates + commit

```bash
git add scripts/migrate-wp/seed-marketing-pages.ts
git commit -m "feat: apply v2 copy density on empresa planos ccr"
```

---

### Task 9: Onda 3 — Blog chrome

**Files:**
- Verify: `app/(site)/blog/page.tsx`, `app/(site)/blog/[slug]/page.tsx`, `components/site/header.tsx`, `components/site/footer.tsx`
- Modify only if overlap/header gap: spacer `pt-[76px]` no wrapper do blog

- [ ] **Step 1:** Abrir `/blog` e um post — header `lightSolid`, footer sem roxo Whizz, miolo editorial intacto.
- [ ] **Step 2:** Se texto sob header, adicionar padding no layout do blog (não no root LP).
- [ ] **Step 3:** Commit só se houver diff

```bash
git commit -m "fix: blog chrome spacing under fixed light header"
```

---

## Self-review (plan vs spec)

| Spec requirement | Task |
|---|---|
| Hero B centro + UI emergindo | 3, 5 |
| Stack produto primeiro | 5 |
| Header adaptativo | 2 |
| Painéis contidos | 1, 4 |
| Copy direta & benefit | 5, 8 |
| Densidade ~80–112px | 1 (`96px`) |
| Dark hero / light body | 1, 3, 5 |
| Reuse assets | 5 |
| Evolve builder (no parallel kit) | all |
| Motion 2–3 + reduced motion | 6 |
| Rollout home → marketing → blog | 7, 8, 9 |
| LPs fora | explicit |
| Gates + visual review | 7 |
| Whizz só em `components/whizz/` | 4 (dark split), 5 |
| `#FFBC00` + tinta escura | 2, 3, 5 |

Sem TBD. Nomes estáveis: `productEmerge`, `resolveHeaderAppearance`, `Panel`, `panelElevationClass`.
