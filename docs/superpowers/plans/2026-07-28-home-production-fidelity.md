# Home Production Fidelity (fase 2) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deixar a home Next.js indistinguível de https://omni.chat (estrutura, mídia, interações), mantendo Sanity + design system `oc-*`.

**Architecture:** Evoluir seções do page builder e o chrome (`Header`/`Footer`). HubSpot via JSON no client; carrosséis com scroll-snap (sem Swiper); mídias WP sobem ao Sanity CDN pelo seed. Spec: `docs/superpowers/specs/2026-07-28-home-production-fidelity-design.md`.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Sanity, vitest, Playwright visual-compare. Sem novas deps de carrossel.

## Global Constraints

- Tokens `oc-*`; Whizz só em `components/whizz/`; `#FFBC00` nunca com tinta branca; `<Image>` nunca `<img>`.
- Schema/labels pt-BR, sentence case, sem emoji.
- Seção nova = schema + componente + registry + `tests/registry.test.ts` (+ `CLAUDE.md` contagem).
- Gate por task: `npm run lint && npm run typecheck && npm test`. Fechamento: `build` + visual-compare home.
- Seed idempotente `wp-page-home` / `siteSettings`; `npm run migrate` via `npx tsx scripts/migrate-wp/seed-marketing-pages.ts`.
- Branch atual: `feat/home-superdesign-fidelity`. Não push sem pedido.

## File map

| File | Responsibility |
|---|---|
| `components/sections/cta-form.tsx` | HubSpot JSON + asideImage layout |
| `components/sections/feature-grid.tsx` | Optional feature image |
| `components/sections/testimonials.tsx` + carousel UI | Grid/carousel variants |
| `components/sections/feature-carousel.tsx` | New product carousel section |
| `components/sections/cta-banner.tsx` | Optional side image |
| `components/sections/hero.tsx` | backgroundMedia video/image |
| `components/site/header.tsx` | Icon submenu + mobile drawer |
| `components/site/footer.tsx` | Store/ISO badge images |
| `sanity/schemas/objects/sections.ts` | Schema field extensions + `featureCarousel` |
| `sanity/schemas/documents/*` | Register new section; siteSettings icon/badge fields |
| `scripts/migrate-wp/seed-marketing-pages.ts` | Home seed order + assets |
| `scripts/migrate-wp/site-settings.ts` | Nav icons + footer badges |
| `components/sections/registry.ts` / `tests/registry.test.ts` | Parity 13→14 |

## Asset URLs (produção 2026-07-28)

Cards: `Home-coluna-1.jpg` … `Home-coluna-4.jpg` em `/wp-content/uploads/2026/01/`  
CTA: `Case-LaModa-Email-Img-4-2.png`  
Form: `SITE-Forms-1.jpg`  
Hero video: `https://omni.chat/wp-content/themes/omni.chat/assets/img/video-hero.mp4`  
Menu icons: `IA-intelligent-search.png`, `IA-specialist.png`, `IA-shopping-cart-line.png`, `IA-improve-message.png`

---

### Task 1: HubSpot JSON submit no CtaForm

**Files:**
- Modify: `components/sections/cta-form.tsx`
- Test: `tests/cta-form-hubspot.test.ts` (unit do builder de payload; mock fetch)

**Interfaces:**
- Consumes: props atuais `formAction`, `fields`, `buttonLabel`
- Produces: `onSubmit` async → `POST` JSON `{ fields: [{name,value}], context: { pageUri, pageName } }`; UI states `idle|loading|success|error`

- [ ] **Step 1: Teste do payload**

```ts
import { buildHubSpotPayload } from "../components/sections/cta-form";
// exportar helper pura do mesmo arquivo ou lib/hubspot-form.ts

it("monta fields a partir do FormData", () => {
  const fd = new FormData();
  fd.set("email", "a@b.com");
  fd.set("nome", "Ana");
  expect(buildHubSpotPayload(fd, "https://omni.chat/", "Home")).toEqual({
    fields: [
      { name: "email", value: "a@b.com" },
      { name: "nome", value: "Ana" },
    ],
    context: { pageUri: "https://omni.chat/", pageName: "Home" },
  });
});
```

- [ ] **Step 2: RED** — `npm test -- tests/cta-form-hubspot.test.ts` FAIL

- [ ] **Step 3: Implementar**

Preferir helper em `lib/hubspot-form.ts` (puro, testável):

```ts
export function buildHubSpotPayload(formData: FormData, pageUri: string, pageName: string) {
  const fields = [...formData.entries()]
    .filter(([, v]) => typeof v === "string")
    .map(([name, value]) => ({ name, value: String(value) }));
  return { fields, context: { pageUri, pageName } };
}

export function isSafeFormAction(action: string) {
  return /^(https:\/\/|\/(?!\/))/.test(action);
}
```

Em `cta-form.tsx`: state status; `onSubmit` preventDefault; se `!isSafeFormAction` abort; `fetch(formAction, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(payload) })`; success → mensagem “Recebemos seu contato. Em breve um especialista fala com você.”; error → “Não foi possível enviar. Tente de novo.”; botão disabled em loading; `#FFBC00` com `text-oc-ink`.

- [ ] **Step 4: GREEN + gates + commit**

```bash
npm run lint && npm run typecheck && npm test
git commit -m "feat: submit ctaForm to HubSpot as JSON"
```

Se CORS falhar em runtime: criar `app/api/hubspot-form/route.ts` que repassa JSON (Task 1b só se necessário após teste manual).

---

### Task 2: featureGrid com imagem + seed cards

**Files:**
- Modify: `sanity/schemas/objects/sections.ts` (`featureGrid`)
- Modify: `components/sections/feature-grid.tsx`
- Modify: `scripts/migrate-wp/seed-marketing-pages.ts`
- Test: schema assert image field opcional

**Interfaces:**
- Produces: `features[].image?: { imageUrl: string; alt: string }`

- [ ] **Step 1: Schema** — object image com `imageUrl` + `alt` no feature member

- [ ] **Step 2: Componente** — se `image?.imageUrl`, `<Image width={600} height={360} className="mb-4 h-auto w-full rounded-oc-card object-cover" />`; senão ícone

- [ ] **Step 3: Seed** — 4 cards com imagens `Home-coluna-1..4.jpg` (upload `img()`); grid `md:grid-cols-2` quando todos têm image (ou sempre 2×2 na home via className se `features.length===4 && all have image`)

- [ ] **Step 4: Rodar seed home + gates + commit** `feat: featureGrid photo cards for home`

---

### Task 3: Testimonials carousel variant

**Files:**
- Modify: `sanity/schemas/objects/sections.ts` (`testimonials.variant`)
- Modify: `components/sections/testimonials.tsx`
- Create: `components/sections/carousel-controls.tsx` (setas/dots reutilizáveis) opcional
- Modify: seed `variant: "carousel"`

**Interfaces:**
- Produces: `variant?: "grid" | "carousel"` (default grid)

- [ ] **Step 1: Schema** `variant` list grid/carousel

- [ ] **Step 2: Carousel UI** — client subcomponent se necessário (`"use client"` só no carousel):

```tsx
// scroll-snap-x mandatory; flex; each slide min-w-full md:min-w-[calc(50%-12px)]
// buttons Anterior/Próximo; dots; prefers-reduced-motion: no autoplay
```

- [ ] **Step 3: Seed home testimonials `variant: "carousel"`**

- [ ] **Step 4: Gates + commit** `feat: testimonials carousel variant`

---

### Task 4: Seção featureCarousel

**Files:**
- Create: `components/sections/feature-carousel.tsx`
- Modify: `sections.ts`, `registry.ts`, `page.ts`, `landing-page.ts`, `tests/registry.test.ts`, `CLAUDE.md` (14 seções)
- Modify: seed — substituir 5 `featureSplit` por 1 `featureCarousel`

**Interfaces:**
- Produces: `featureCarousel { title?: string; items: Array<{ title, body?, image?, mediaSide?, cta?, dark? }> }`

- [ ] **Step 1: Test registry 14 tipos inclui `featureCarousel`** — RED

- [ ] **Step 2: Schema + componente** — reusa layout visual de `FeatureSplit` por slide; scroll-snap + dots; CTA `https://teste-agente-de-ia.omni.chat/`

- [ ] **Step 3: Seed** — um bloco com os 5 itens atuais

- [ ] **Step 4: Gates + commit** `feat: add featureCarousel section for home products`

---

### Task 5: ctaBanner image + ctaForm asideImage

**Files:**
- Modify: schemas + `cta-banner.tsx` + `cta-form.tsx`
- Modify: seed URLs CTA/form acima

**Interfaces:**
- `ctaBanner.image?`, `ctaForm.asideImage?`

- [ ] **Step 1: Schemas**

- [ ] **Step 2: Layouts 2 colunas desktop**

CTA: foto esquerda / texto+botão direita dentro do card amarelo (ou ao lado conforme WP).  
Form: form esquerda / foto direita no gradiente escuro.

- [ ] **Step 3: Seed + gates + commit** `feat: side images on home ctaBanner and ctaForm`

---

### Task 6: Header ícones + mobile drawer

**Files:**
- Modify: `sanity/schemas/documents/site-settings.ts` (`children.iconUrl`, `iconAlt`)
- Modify: `scripts/migrate-wp/site-settings.ts`
- Modify: `components/site/header.tsx`
- Modify: `services/sanity/queries.ts` projection
- Modify: `app/(site)/layout.tsx` types

**Interfaces:**
- `NavItem.children?: { label, href, iconUrl?, iconAlt? }[]`

- [ ] **Step 1: Schema + seed icons** (4 URLs de menu)

- [ ] **Step 2: Desktop submenu** — painel absolute full container width, fundo `oc-surface`, ícones 20×20 via `<Image>`

- [ ] **Step 3: Mobile** — botão menu (amarelo); painel fixed full-screen `bg-oc-dark`; lista + submenus; Login/Demo no rodapé do drawer; Escape fecha

- [ ] **Step 4: Garantir `omni.chat` OU Sanity CDN em `next.config.ts` `images.remotePatterns` se ícones ficarem em WP URL temporariamente — preferir upload Sanity no seed

- [ ] **Step 5: Gates + commit** `feat: header submenu icons and mobile drawer`

---

### Task 7: Hero backgroundMedia (vídeo)

**Files:**
- Modify: `sections.ts` hero fields
- Modify: `components/sections/hero.tsx`
- Modify: seed + possivelmente `next.config` se video host externo
- Note: `<video>` é OK (não é `<img>`); hospedar no Sanity file ou manter URL tema WP temporariamente

**Interfaces:**
- `backgroundMedia?: { type: "video"|"image"; url: string; poster?: string }`

- [ ] **Step 1: Schema**

- [ ] **Step 2: Hero** — wrapper `relative overflow-hidden`; media absolute centrada atrás do conteúdo (`pointer-events-none`); conteúdo `relative z-10`; video `autoPlay muted loop playsInline`

- [ ] **Step 3: Seed** url `video-hero.mp4`

- [ ] **Step 4: Gates + commit** `feat: hero background video for home`

---

### Task 8: Footer badges (stores + ISO)

**Files:**
- Modify: site-settings schema (`appStoreLinks` já existe — adicionar `badgeImageUrl?` ou `footerBadges[]`)
- Modify: `footer.tsx`, seed, queries, layout

**Interfaces:**
- Prefer `footerBadges: { imageUrl, alt, href }[]` para App Store, Play, ISO27001, ISO27701, ISO27018

- [ ] **Step 1–4: schema + UI + seed URLs WP + gates + commit** `feat: footer store and ISO badges`

URLs ISO (do snapshot WP anterior):  
`/wp-content/uploads/2025/12/ISO27001.pt.jpg`, `ISO27701.pt.jpg`, `ISO27018.pt.jpg`  
Stores: já linkados; buscar imagens de badge no footer WP se existirem, senão manter texto + links.

---

### Task 9: Reseed completo + visual aceite

**Files:**
- Run seed
- Regenerate `docs/superpowers/visual-review/home-novo.png`
- Commit screenshot

- [ ] **Step 1:** `npx tsx scripts/migrate-wp/seed-marketing-pages.ts` → home sections coerentes (hero, richText, testimonials carousel, featureCarousel, stats, mediaBlock, featureGrid, ctaBanner, ctaForm) ≈ 9 blocos

- [ ] **Step 2:** `npm run build` + visual-compare home

- [ ] **Step 3:** Checklist manual vs https://omni.chat (dropdown ícones, carrosséis, HubSpot success, vídeo, form foto, footer)

- [ ] **Step 4:** Commit `chore: refresh home visual review after production fidelity phase 2`

---

## Self-review

1. Spec coverage: HubSpot, fotos cards, carrosséis, CTA/form images, header, hero video, footer badges, aceite — tasks 1–9.
2. Placeholders: asset URLs concretas; CORS fallback documentado.
3. Types: `featureCarousel` sobe registry para 14; queries projetam novos campos via `sections[]{...}`.
