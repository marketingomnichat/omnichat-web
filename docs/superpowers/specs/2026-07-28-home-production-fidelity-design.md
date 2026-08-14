# Home omni.chat — Fidelidade à Produção (fase 2)

Data: 2026-07-28 · Status: aguardando review do owner  
Base: branch `feat/home-superdesign-fidelity` · Alvo: [https://omni.chat](https://omni.chat)  
Abordagem: aprimorar o page builder Sanity + tokens `oc-*` (não clonar CSS WP).

## Objetivo

Deixar a home Next.js **indistinguível** da home WP em produção (estrutura, copy, mídia, interações principais), mantendo CMS editável, design system OmniChat e integração Sanity. Outras páginas (`/empresa`, `/planos`, `/chat-commerce-report`) ficam para depois do aceite visual da home.

## Fora de escopo

- Cutover DNS / desligar WP
- Clone estático do tema WP / iframe
- Páginas além de `/` nesta entrega
- Backend de marketing próprio (usa HubSpot Forms v3 existente)
- Count-up animado dos stats (nice-to-have pós-aceite)

## Princípios

- Tokens `oc-*` em `app/globals.css`; roxo/gradiente Whizz **somente** em `components/whizz/`
- `#FFBC00` nunca com tinta branca; `<Image>` nunca `<img>`
- Copy fiel ao WP (conteúdo); labels de schema em pt-BR, sentence case, sem emoji
- Seção nova = schema + componente + `registry.ts` + `tests/registry.test.ts`
- Gate: `npm run lint` (inclui `lint:design`) + `typecheck` + `test` (+ `build` / visual-compare no fechamento)

## Mapa da home (ordem WP)

| # | Bloco WP | Seção / chrome | Trabalho fase 2 |
|---|---|---|---|
| 0 | Header | `siteSettings.nav` + `Header` | Ícones no submenu; painel full-width desktop; drawer mobile |
| 1 | Hero | `hero` | `backgroundMedia` (vídeo/imagem); highlight Whizz + prompt já existem |
| 2 | Lead | `richText` align center | Já ok |
| 3 | Depoimentos | `testimonials` | `variant: carousel` (scroll-snap + setas/dots) |
| 4 | Produtos ×5 | novo `featureCarousel` | Carrossel de itens no formato featureSplit |
| 5 | Stats | `stats` + title | Já ok |
| 6 | Ecossistema | `mediaBlock` | Já ok |
| 7 | Cards info | `featureGrid` | `image` opcional por feature; seed com fotos WP |
| 8 | CTA planos | `ctaBanner` | `image` lateral |
| 9 | Form | `ctaForm` | HubSpot JSON + `asideImage` |
| 10 | Footer | `Footer` + `siteSettings` | Badges App Store / Play / ISO (imagens) |

## Ordem de implementação

1. HubSpot JSON submit em `CtaForm`
2. Fotos em `featureGrid` + seed
3. Carrosséis (`testimonials` carousel + `featureCarousel`)
4. Layout CTA/form com imagens laterais
5. Header polish (ícones + mobile drawer)
6. Hero `backgroundMedia`
7. Footer badges ISO/stores
8. Visual compare home + aceite owner

## Detalhe: HubSpot

- Cliente intercepta submit: `preventDefault` → `fetch(formAction, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fields: [{ name, value }], context: { pageUri, pageName } }) })`
- Estados UI: idle / loading / success / error (copy formal, sentence case)
- Manter validação de `formAction` (`https://` ou path `/`); sem server route nesta fase
- Endpoint: o já seedado no HubSpot Forms v3 Integration API

## Detalhe: carrosséis

- Sem dependência Swiper se scroll-snap + controles forem suficientes
- Acessibilidade: `aria-roledescription="carousel"`, botões prev/next com labels, dots; autoplay só se pausável e prefer-reduced-motion respeitado
- `testimonials.variant`: `"grid"` (default) | `"carousel"`
- Novo tipo `featureCarousel`: `{ title?: string; items: FeatureSplitLike[] }` registrado no schema/registry (sobe contagem de seções)
- Seed home: depoimentos em carousel; cinco produtos viram um único `featureCarousel` (remove os 5 `featureSplit` empilhados)

## Detalhe: mídia nos blocos

- `featureGrid.features[]`: `image?: { imageUrl, alt }` — se presente, renderiza imagem; senão ícone Remix
- `ctaBanner.image?`, `ctaForm.asideImage?` — layout 2 colunas desktop, stack mobile
- Seed: upload via `img()` → CDN Sanity (mesmo padrão do seed atual)

## Detalhe: header

- `nav[].children[]`: `iconUrl?` (+ `iconAlt?`)
- Desktop: submenu full-width claro com ícone + label (como WP)
- Mobile: drawer escuro full-viewport (hamburger), sem lib nova
- CTAs: Login → `https://app.omni.chat/`; Demo → `#formulario` (já corretos)

## Detalhe: hero media

- `hero.backgroundMedia?: { type: "video" | "image"; url: string; poster?: string }`
- Vídeo: `autoPlay` `muted` `loop` `playsInline`; não bloqueia interação do prompt/CTA
- Highlight “IA especialista” permanece em componente Whizz

## Aceite

- Regenerar `docs/superpowers/visual-review/home-{wp,novo}.png`
- Checklist manual: dropdowns com ícones, carrosséis, submit HubSpot (success), form/CTA com foto, hero media, footer badges, mobile drawer
- Owner aprova antes de partir para outras páginas

## Riscos

- CORS no POST direto ao HubSpot no browser — se bloquear, fallback: Route Handler Next que repassa JSON (só se necessário após teste)
- Vídeo do hero: host deve estar em `images.remotePatterns` / permitir media remota; preferir asset no Sanity/CDN OmniChat
- Contagem de seções no registry sobe com `featureCarousel` (atualizar teste + `CLAUDE.md`)
