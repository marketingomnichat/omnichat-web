# Pivot: Home OmniChat na composição ClickUp (DS + copy nossos)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir a home de marketing para **parecer product-led como o ClickUp** (composição, ritmo, UI do produto como âncora), usando **só tokens OmniChat `oc-*`**, Whizz só em IA, e **copy/produto OmniChat** — não polir o layout legado do WordPress.

**Architecture:** Esqueleto de seções inspirado no draft Superdesign ClickUp `7a9e7ebf-05d5-4f34-938b-ffb9932453a8` + `content-structure` de clickup.com. Implementação continua no page builder Sanity (`SectionRenderer`), mas a home seed e os layouts das seções mudam o suficiente para a página **não** lembrar o WP. Marca ClickUp (roxo `#7612FA`, pills, tipografia Jakarta) **não** entra no CSS — mapeamos padrões → `oc-*`.

**Tech Stack:** Next.js 16, React 19, Tailwind v4, Sanity, Superdesign (referência visual), vitest.

## Por que o site “parece igual”

A renovação v2 anterior evoluiu o layout **WP/OmniChat existente** (mesma ordem de blocos, mesmos padrões de seção). ClickUp exige **outra composição**: hero product-forward com UI dominante, features alternadas com screenshots grandes, trust + CTA final limpos — não “fidelidade WP com painéis”.

Este plano **substitui** essa direção para a home. Trabalho v2 útil (HubSpot, carrosséis, header drawer, `Panel`) pode ser reaproveitado; a **home seed + layouts hero/feature** são o pivô.

## Resposta à pergunta do owner

**Sim.** Usamos o DS OmniChat + clonamos a *composição* ClickUp + trocamos copy e produto:

| Camada | Fonte da verdade |
|---|---|
| Ritmo / hierarquia / tipo de bloco | Draft ClickUp Superdesign + `content-structure.md` |
| Cores, tipografia, botões, Whizz | Tokens `oc-*` + `components/whizz/` |
| Textos / CTAs / posicionamento | OmniChat (pt-BR, benefit curto) |
| Mídia | Screenshots/UI OmniChat + Whizz (reuso CDN/Sanity; não boards ClickUp) |

**Não** copiamos CSS/HTML do ClickUp nem a marca roxa deles.

## Referências

| Artefato | Path / ID |
|---|---|
| Draft ClickUp (fonte) | Project `981c7be0-…` · draft `7a9e7ebf-05d5-4f34-938b-ffb9932453a8` |
| Draft OmniChat (alvo visual) | draft `37893a8e-abe7-47af-a527-70e61b19f11a` · [canvas](https://superdesign.dev/teams/da19cb6e-3eb9-4755-bfc4-6fc4bf79da60/projects/981c7be0-ef20-427c-b1f3-0ec4daa76fcf?node=draft-variant-37893a8e-abe7-47af-a527-70e61b19f11a) · [preview](https://p.superdesign.dev/draft/37893a8e-abe7-47af-a527-70e61b19f11a) |
| HTML ClickUp | `docs/superpowers/design-refs/clickup-superdesign-7a9e7ebf.html` |
| HTML OmniChat | `docs/superpowers/design-refs/omnichat-clickup-composition-37893a8e.html` |
| Content structure | `.superdesign/website/clickup.com/content-structure.md` |
| Design DNA ClickUp (só referência) | `.superdesign/website/clickup.com/design.md` |
| Tokens OmniChat | `app/globals.css` · `.superdesign/init/theme.md` |
| Spec v2 (parcialmente obsoleta p/ home) | `docs/superpowers/specs/2026-07-31-visual-renovation-v2-design.md` — home stack deste plan **vence** |

## Global Constraints

- Tokens `oc-*`; Whizz roxo **só** em `components/whizz/`.
- `#FFBC00` nunca com tinta branca; `<Image>` nunca `<img>`.
- Sem clonar CSS ClickUp; sem `#7612FA` / pink ClickUp no chrome.
- Schema labels pt-BR, sentence case, sem emoji.
- Seção nova = schema + componente + `registry.ts` + `tests/registry.test.ts`.
- Gate: `npm run lint && npm run typecheck && npm test`; fechamento: `build` + screenshot `home-novo.png` vs draft OmniChat (não vs WP).
- Seed: `npx tsx scripts/migrate-wp/seed-marketing-pages.ts`.
- LPs fora da onda 1.

## Mapa ClickUp → Home OmniChat

Estrutura do draft `7a9e7ebf` (headings):

| # | Bloco ClickUp (estrutura) | OmniChat (composição) | Seção / chrome |
|---|---|---|---|
| 0 | Sticky nav + Sign Up | Header claro sticky + Login + Demo amarelo | `Header` (preferir `lightSolid`/sticky na home ClickUp-like; overlay escuro opcional) |
| 1 | H1 centrado/forte + CTA + UI produto | Hero product-led: headline curta + CTA + **screenshot/produto full-bleed abaixo** | `hero` `layout: productEmerge` (reforçar UI produto real, não vídeo abstrato) |
| 2 | “Bring structure…” + feature | Whizz Agent deep-dive (texto + UI agente) | `featureSplit` dark **ou** Whizz panel |
| 3–N | Alternating product features + Get started | Marketing / Vendas / Atendimento (UI grande, body curto, CTA) | `featureCarousel` **ou** 3× `featureSplit` (preferir splits grandes estilo ClickUp) |
| N+1 | Trusted by… logos | Logo cloud clientes | `logoCloud` (logos escuros em fundo claro) |
| N+2 | Start managing… CTA | CTA final / form demo | `ctaForm` ou `ctaBanner` + form |
| F | Footer multi-coluna | Footer OmniChat existente | `Footer` |

Copy norte (voz direta):

- Hero H1: `Venda no WhatsApp com IA que conhece seu negócio`
- Sub: `Whizz Agent qualifica e fecha. Seu time escala.`
- CTA: `Agendar demo` → `#formulario`
- Features: frases curtas benefit; CTAs `Ver Whizz` / `Conhecer Marketing Studio` etc.

## File map

| File | Responsibility |
|---|---|
| `scripts/migrate-wp/seed-marketing-pages.ts` | `buildHome()` nova ordem ClickUp-like + copy |
| `components/sections/hero.tsx` | productEmerge = UI produto dominante (imagem), tipografia mais “display” |
| `components/sections/feature-split.tsx` | Layout mais próximo ClickUp: tipografia maior, mídia bleed, menos “card” |
| `components/sections/feature-carousel.tsx` | Ou aposentar na home em favor de splits (decisão Task 2) |
| `components/site/header.tsx` | Sticky claro product-marketing (ClickUp sticky white/light) |
| `components/ui/panel.tsx` / `globals.css` | Densidade; evitar bandejas que “parecer WP” |
| `docs/superpowers/visual-review/home-novo.png` | Aceite vs direção ClickUp-composition |
| Superdesign draft OmniChat (branch) | Referência visual aprovável antes/durante código |

## Ondas

1. **Draft Superdesign OmniChat** (branch do ClickUp) — owner aprova visual  
2. **Código home** — hero + features + seed + header sticky  
3. **Chrome secundário** — empresa/planos só se home aceita  

---

### Task 0: Draft Superdesign OmniChat (gate visual)

**Files:**
- Superdesign project `981c7be0-…` · branch a partir de `7a9e7ebf-…`
- Save HTML: `docs/superpowers/design-refs/omnichat-clickup-composition-<draftId>.html`

- [x] **Step 1:** Draft OmniChat criado: `37893a8e-abe7-47af-a527-70e61b19f11a` (compose ClickUp + tokens OmniChat)
- [ ] **Step 2:** Owner abre preview/canvas e valida: “parece ClickUp em composição, OmniChat em marca”
- [x] **Step 3:** HTML em `docs/superpowers/design-refs/omnichat-clickup-composition-37893a8e.html`
- [ ] **Step 4:** Se precisar ajuste visual: `iterate-design-draft --draft-id 37893a8e-… --mode replace -p "…"`. Só então código (Tasks 1+)

**Done when:** Owner aprova o draft (ou lista 3 ajustes máximos no draft antes do código).

---

### Task 1: Hero product-forward (ClickUp rhythm)

**Files:**
- Modify: `components/sections/hero.tsx`
- Modify: `sanity/schemas/objects/sections.ts` se precisar `productMedia`
- Test: `tests/hero-layout.test.ts`

**Interfaces:**
- `layout: "productEmerge"` obrigatório na home
- Faixa inferior = **screenshot de produto** (inbox/Whizz/campanha), nunca vídeo abstrato roxo
- Headline curta, CTA amarelo centrado, tipografia display

- [ ] **Step 1:** Teste — productEmerge exige image band (helper ou render contract)
- [ ] **Step 2:** RED
- [ ] **Step 3:** Implementar band com `Image` full-bleed / object-top; seed usa asset produto existente
- [ ] **Step 4:** GREEN + commit `feat: clickup-like product hero band`

---

### Task 2: Feature blocks estilo ClickUp (splits grandes)

**Files:**
- Modify: `components/sections/feature-split.tsx`
- Optionally reduce home use of `featureCarousel` (seed usa 3–4 splits em vez de carousel apertado)
- Test: structural test que dark split não usa Panel branco; light split tipografia/h2 grande

**Interfaces:**
- Alternância `mediaSide` left/right
- CTA ghost/amarelo curto por bloco
- Whizz deep-dive: `dark: true` + `components/whizz` accents only

- [ ] **Step 1:** Ajustar layout split (menos padding de “card WP”, mais mídia)
- [ ] **Step 2:** Gates + commit `feat: feature-split clickup-like product blocks`

---

### Task 3: Header sticky product-marketing

**Files:**
- Modify: `components/site/header.tsx` / `header-appearance.ts`

**Interfaces:**
- Home ClickUp-like: preferir **sempre `lightSolid` sticky** (como ClickUp) *ou* dark overlay só se hero dark absoluto — decidir no Task 0 com o draft aprovado
- CTA Demo amarelo + `text-oc-ink`
- Manter nav Sanity

- [ ] **Step 1:** Atualizar testes de appearance se home sair de `DARK_HERO_ROUTES` ou ganhar flag
- [ ] **Step 2:** Implementar + commit `feat: sticky marketing header for clickup-like home`

---

### Task 4: Reseed home na ordem ClickUp-composition

**Files:**
- Modify: `scripts/migrate-wp/seed-marketing-pages.ts` (`buildHome` only)

Ordem canônica:

1. `hero` productEmerge + product image + copy A  
2. `featureSplit` Whizz dark  
3. `featureSplit` Marketing  
4. `featureSplit` Vendas  
5. `featureSplit` Atendimento (ou 3 se mídia faltar)  
6. `logoCloud` (logos **escuros**/legíveis em fundo claro)  
7. `stats` (opcional — se poluir ritmo ClickUp, omitir)  
8. `testimonials` carousel **ou** omitir se draft OmniChat não tiver  
9. `ctaForm`  

- [ ] **Step 1:** Reescrever `buildHome`
- [ ] **Step 2:** Seed + smoke `localhost:3000` (cache `.next` limpo)
- [ ] **Step 3:** Commit `feat: reseed home to clickup composition`

---

### Task 5: Logos legíveis + âncora form

**Files:**
- `components/sections/logo-cloud.tsx` / seed assets
- `components/sections/cta-form.tsx` ou `globals.css` (`scroll-mt` no `#formulario`)

- [ ] **Step 1:** Logos com contraste em painel claro (assets escuros ou filtro CSS controlado)
- [ ] **Step 2:** `scroll-mt` ≥ altura header no `#formulario`
- [ ] **Step 3:** Commit `fix: logo contrast and form anchor under sticky header`

---

### Task 6: Aceite visual (não vs WP)

**Files:**
- `docs/superpowers/visual-review/home-novo.png`
- Comparar com draft Superdesign OmniChat aprovado

Checklist owner:

- [ ] Primeira dobra parece product-led (UI dominante), não WP  
- [ ] Amarelo OmniChat / sem roxo ClickUp no chrome  
- [ ] Copy curta pt-BR  
- [ ] Whizz só no bloco de IA  
- [ ] Form/#formulario ok  

```bash
rm -rf .next && npm run build && npm run start
npx tsx scripts/visual-compare.ts
```

- [ ] Commit screenshot `chore: home visual review clickup-composition pivot`

---

## Self-review (plan)

| Owner ask | Task |
|---|---|
| Fetch ClickUp Superdesign | Done (refs) + Task 0 branch OmniChat |
| DS OmniChat + clone composition + our copy | All tasks |
| Site leaves WP look | Tasks 1–4 (structure change, not polish) |
| Residual v2 (logos, form anchor, product UI) | Task 1, 5 |

## Fora de escopo (onda 1)

- Pixel-perfect clone HTML ClickUp  
- LPs (`lp.omni.chat`)  
- Redesign editorial do blog  
- Trocar fonte do site para Plus Jakarta (fica Lato / `oc-*`)  
