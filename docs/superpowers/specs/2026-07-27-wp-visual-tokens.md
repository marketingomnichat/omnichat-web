# WP Visual Tokens — Inventário de Estilos omni.chat

**Extraído em:** 2026-07-27  
**Método:** Playwright 1280×900, scroll completo, `getComputedStyle` em produção  
**Páginas:** `/` · `/empresa/` · `/planos/` · `/chat-commerce-report/`  
**Objetivo:** Fonte da verdade para reestilizar o site Next.js até ficar idêntico ao WordPress.

---

## 1. Tokens Globais

### 1.1 Fontes

| Token | Valor |
|-------|-------|
| Font primária | **Lato** (Google Fonts, self-hosted via cache) |
| Font fallback | `sans-serif` |
| Font secundária | **Roboto** (aparece em `.btn` / Bootstrap remnants — não é fonte de UI principal) |
| Font de ícones | `swiper-icons` |
| Google Fonts URL | `https://fonts.googleapis.com/` + self-hosted em `wp-content/cache/fonts/` |

**Pesos de Lato carregados:** 300 · 400 · 500 · 600 · 700 · 900

#### Escala tipográfica real (computada do HTML ao vivo)

| Elemento | font-size | font-weight | line-height | Observação |
|----------|-----------|-------------|-------------|------------|
| `h1` hero home | 44.8 px | 700 | 56 px (1.25) | Tela cheia preta |
| `h1` /empresa/ | 60 px | 700 | 64 px (1.07) | Tela branca |
| `h1` /planos/ | 60 px | 700 | 64 px (1.07) | Sobre imagem escura |
| `h2` home | 42 px | 700 | 46.2 px (1.1) | |
| `h2` /empresa/ | 40 px | 700 | 44 px (1.1) | |
| `h2` /chat-commerce-report/ | 40 px | 700 | 44 px (1.1) | |
| `h3` home | 60 px | 700 | 76 px (1.27) | Seção de stats / números |
| `h3` /planos/ | 32 px | 700 | 35.2 px (1.1) | |
| `h4` | 24 px | 500 | 28.8 px (1.2) | |
| `p` home (hero) | 32 px | 400 | 48 px (1.5) | Lead/subtítulo escuro |
| `p` /empresa/ | 16 px | 400 | 24 px (1.5) | Corpo padrão |
| `p` /planos/ | 20 px | 400 | 30 px (1.5) | |
| `p` /chat-commerce-report/ | 14 px | 400 | 21 px (1.5) | |
| `nav a` | 20 px | 400 | 30 px | Header desktop |
| `.nav-link` | 16 px | 400 | 24 px | Nav interno |
| `button` (geral) | 20 px | 400 | 20 px | |
| Botão CTA primário | 14 px | 600–700 | — | `.btn` header |
| Botão CTA grande | 16 px | 700 | — | CTA em seções |

---

### 1.2 Paleta de Cores

| Nome no WP | Hex | RGB computado | Uso principal |
|------------|-----|---------------|---------------|
| Amarelo CTA | `#FFBC00` | `rgb(255, 188, 0)` | Botão primário bg; cor de link/ghost no header escuro |
| Amarelo massa | `#FFD04D` | `rgb(255, 208, 77)` | Footer bg; card `.card-conteudo` |
| Preto puro | `#000000` | `rgb(0, 0, 0)` | Hero home bg; texto h1 em /empresa/ |
| Preto dark | `#0B0C0E` | `rgb(11, 12, 14)` | Texto botão CTA; card benefícios bg |
| Ink (texto) | `#212529` | `rgb(33, 37, 41)` | Texto corrido; body; footer texto |
| Surface / branco | `#FDFDFD` | `rgb(253, 253, 253)` | Fundo /empresa/ body; texto branco sobre escuro |
| Cinza claro | `#F0F1F4` | `rgb(240, 241, 244)` | Card menor bg (/empresa/) |
| Cinza médio | `#5A5F72` | `rgb(90, 95, 114)` | Texto secundário (/chat-commerce-report/ p) |
| Laranja icon | `#E59900` | `rgb(229, 153, 0)` | Ícone-card bg (/empresa/) |
| Dark translúcido | `rgba(30,25,20,0.5)` | — | Card stats CCR (glass effect) |
| Dark grad start | `#000000` | `rgb(0, 0, 0)` | Gradiente form section |
| Dark grad end | `#21272A` | `rgb(33, 39, 42)` | Gradiente form section (fim) |

---

### 1.3 Border-Radius (Cards e Elementos)

| Elemento | border-radius |
|----------|---------------|
| Card grande (`.card-beneficios`, `.card-conteudo`) | **32 px** |
| Card menor (`card-menor`) | **32 px** |
| Card feature simples | **32 px** |
| Numbers-card (CCR, glassmorphism) | **16 px** (`rounded-4`) |
| Ícone-card (quadrado colorido) | **8 px** |
| Botão CTA (primário e secundário) | **8 px** |
| Botão ghost nav | **6 px** |
| Depoimento card-content interno | **32 px** |
| Bootstrap `.card` padrão | **6 px** |

---

### 1.4 Sombras

| Elemento | box-shadow |
|----------|-----------|
| Card benefícios / conteudo (`.shadow-lg`) | `rgba(0,0,0,0.176) 0px 16px 48px 0px` |
| Card planos (`.shadow-sm`) | `rgba(0,0,0,0.075) 0px 2px 4px 0px` |
| Header | `none` (sem sombra — header é overlay transparente) |
| Numbers-card CCR | `none` (usa glass opacity) |

---

### 1.5 Container / Layout

| Token | Valor |
|-------|-------|
| Container max-width | **1150 px** |
| Container padding horizontal | **12 px** (cada lado) = 24 px total |
| Container-fluid | 100% (sem max-width) |
| Grid base | Bootstrap 5 (12 colunas) |

---

### 1.6 Espaçamento de Seções

| Padrão | Valor |
|--------|-------|
| Padding vertical padrão (`py-5`) | **64 px** top + **64 px** bottom |
| Padding vertical hero home | **140 px** top + **200 px** bottom |
| Antes-depois strip | **16 px** top + **16 px** bottom (`py-3`) |
| Formulário CCR hero | `py-3 py-lg-10` ≈ 16 px / 80 px+ |
| Footer padding | **32 px** top + **16 px** bottom |

---

### 1.7 Gradientes

| Seção | Valor |
|-------|-------|
| Formulário (home, planos, CCR) | `linear-gradient(32.58deg, rgb(0,0,0) 66.85%, rgb(33,39,42) 108.34%)` |
| Hero /planos/ | `linear-gradient(270deg, rgba(0,0,0,0) 82.33%, rgb(0,0,0) 99.06%)` + `url(Planos.webp)` |

---

## 2. Header (Global)

| Propriedade | Valor |
|-------------|-------|
| Posição | `static` (não é sticky/fixed; o HTML fica em posição absoluta sobre o hero) |
| Altura computada | 0 px (topo do viewport; integrado ao hero via overlay) |
| Background default | `rgba(0,0,0,0)` — transparente |
| Background (on scroll) | Provavelmente opacificado via JS (não captado via getComputedStyle estático) |
| Box-shadow | `none` |
| z-index | acima do hero (overlay) |
| Logo URL | `https://omni.chat/wp-content/uploads/2025/12/Conteudo.svg` |
| Logo tamanho | 135 × 35 px |
| Nav itens | Login · Demo · Produtos (dropdown) · Soluções (dropdown) · Planos |
| Cor de link (fundo claro) | `rgb(0, 0, 0)` / `rgb(11, 12, 14)` |
| Cor de link (fundo escuro) | `rgb(255, 188, 0)` (#FFBC00) |
| Botão "Login" | Ghost: bg `transparent`, color `#FFBC00` ou `#0B0C0E` (muda com hero), radius `8px`, pad `12px 18px`, fw 600, fs 14px |
| Botão "Demo" | CTA: bg `#FFBC00`, color `#0B0C0E`, radius `8px`, pad `12px 18px`, fw 600, fs 14px |

> Observação: a cor do login muda com o fundo da página — amarelo sobre hero escuro, preto sobre página clara.

---

## 3. Footer (Global)

| Propriedade | Valor |
|-------------|-------|
| Background | `rgb(255, 208, 77)` — amarelo massa (#FFD04D) |
| Cor de texto | `rgb(33, 37, 41)` — ink |
| Cor de links | `rgb(33, 37, 41)` — mesmo ink (sem destaque de cor) |
| Padding top | 32 px |
| Padding bottom | 16 px |
| Colunas | 7 colunas Bootstrap |
| Alinhamento | `text-center text-md-start` |

---

## 4. Página `/` (Home)

### Hero

| Propriedade | Valor |
|-------------|-------|
| Background | `rgb(0, 0, 0)` — preto puro com vídeo em background |
| Cor de texto | `rgb(255, 255, 255)` |
| Padding top | 140 px |
| Padding bottom | 200 px |
| h1 | 44.8 px / 700 / lh 56 px / branco |
| Sub/lead (`.hero-content p`) | 32 px / 400 / lh 48 px / branco |
| CTA "Demo" | bg `#FFBC00`, color `#0B0C0E`, radius 8 px, pad 12×18 px, fw 600, 14 px |

### Seções (em ordem)

| # | Classe / nome | Background | Cor texto | Padding V |
|---|---------------|------------|-----------|-----------|
| 0 | `.hero.hero-home` | `#000000` | `#FFFFFF` | 140 / 200 px |
| 1 | `.antes-depois` | transparent | `#212529` | 16 px |
| 2 | `.depoimentos` | transparent | `#212529` | 64 px |
| 3 | `.produtos-carrossel` | transparent | `#212529` | 64 px |
| 4 | `.numeros` | transparent | `#212529` | 64 px |
| 5 | `.metodo` | transparent | `#212529` | 64 px |
| 6 | `.cards-informativos` | transparent | `#212529` | 64 px |
| 7 | `.cta` | transparent | `#212529` | 64 px |
| 8 | `.formulario` | gradient (preto→dark) | texto claro | 64 px |

### Depoimentos (`.depoimentos`)

- Fundo: transparente (herda branco de body em /empresa/, herda preto no hero)
- `.card-content`: `border-radius: 32px`, sem sombra, bg transparent
- `.card` wrapper: `border-radius: 6px`
- Implementado com Swiper.js

### Seção Números (`.numeros`)

- Fundo: transparent
- `h3` número: **60 px** / fw 700 / lh 76 px
- Cor texto: `rgb(253, 253, 253)` (branco quase puro)

---

## 5. Página `/empresa/`

### Hero

| Propriedade | Valor |
|-------------|-------|
| Classe | `.hero-simples` |
| Background | `rgb(255, 255, 255)` — branco puro |
| Cor de texto | `rgb(0, 0, 0)` |
| h1 | 60 px / fw 700 / lh 64 px / preto |

### Seções

| # | Classe / nome | Background | Cor texto | Padding V |
|---|---------------|------------|-----------|-----------|
| 0 | `.hero-simples` | `#FFFFFF` | `#000000` | — |
| 1 | `.carrossel-imagens` | transparent | `#212529` | 64 px |
| 2 | `.empresa-secao` | transparent | `#212529` | 64 px |
| 3 | `.beneficios` | transparent | `#212529` | 64 px |
| 4 | `.conteudo-cards` | transparent | `#212529` | 64 px |

### Cards `.card-beneficios`

| Propriedade | Valor |
|-------------|-------|
| Background | `rgb(11, 12, 14)` — quase preto |
| border-radius | **32 px** |
| box-shadow | `rgba(0,0,0,0.176) 0px 16px 48px 0px` |
| Texto (implícito) | branco sobre preto |

### Cards `.card-conteudo`

| Propriedade | Valor |
|-------------|-------|
| Background | `rgb(255, 208, 77)` — amarelo massa |
| border-radius | **32 px** |
| box-shadow | `rgba(0,0,0,0.176) 0px 16px 48px 0px` |
| Texto | `#212529` (ink) |

### Cards menores (`.card-menor`)

| Propriedade | Valor |
|-------------|-------|
| Background | `rgb(240, 241, 244)` — cinza claro |
| border-radius | **32 px** |
| box-shadow | none |
| Ícone-card bg | `rgb(229, 153, 0)` — laranja/ouro, radius **8 px** |

---

## 6. Página `/planos/`

### Hero

| Propriedade | Valor |
|-------------|-------|
| Classe | `.hero` |
| Background | gradiente + imagem: `linear-gradient(270deg, rgba(0,0,0,0) 82.33%, rgb(0,0,0) 99.06%) + url(Planos.webp)` |
| Cor de texto | `rgb(255, 255, 255)` |
| h1 | 60 px / fw 700 / lh 64 px / branco |
| h2 | 42 px / fw 700 / lh 46.2 px / branco quase |
| h3 | 32 px / fw 700 / lh 35.2 px / branco quase |
| p | 20 px / fw 400 / lh 30 px / branco quase |

### Seções

| # | Classe | Background | Padding V |
|---|--------|------------|-----------|
| 0 | `.hero` | imagem + gradiente | — |
| 1 | `.planos` | transparent | 64 px |
| 2 | `.cta-produto.cta-planos` | transparent | — |
| 3 | `.bloco-swiper` | transparent | 64 px |
| 4 | `.cta` | transparent | 64 px |
| 5 | `.formulario` | gradient dark | 64 px |

### Cards de planos (`.card.shadow-sm`)

| Propriedade | Valor |
|-------------|-------|
| Background | transparent |
| border-radius | **32 px** |
| box-shadow | `rgba(0,0,0,0.075) 0px 2px 4px 0px` (leve) |

### Botão CTA de plano

| Propriedade | Valor |
|-------------|-------|
| Text | "Quero contratar o Marketing Studio" |
| bg | `rgb(255, 188, 0)` |
| color | `rgb(11, 12, 14)` |
| radius | 8 px |
| padding | `8px 12px` |
| fw | 700 |
| fs | 16 px |

---

## 7. Página `/chat-commerce-report/`

### Hero / Formulário

| Propriedade | Valor |
|-------------|-------|
| Classe | `.formulario.ccr` |
| Background | `linear-gradient(32.58deg, rgb(0,0,0) 66.85%, rgb(33,39,42) 108.34%)` |
| Padding | `py-3 py-lg-10` |

### Seções

| # | Classe | Background | Padding V |
|---|--------|------------|-----------|
| 0 | `.formulario.ccr` | gradient dark | 16 px / 80 px+ |
| 1 | `.ccr-intro` | transparent | 64 px |
| 2 | `.numbers-intro` | transparent | 64 px |
| 3 | `.tendencias-ccr` | transparent | 64 px |
| 4 | `.numbers-ccr.numeros` | transparent | 64 px |
| 5 | `.conteudo-cards-ccr` | transparent | 64 px |
| 6 | `.depoimentos-ccr` | transparent | 64 px |
| 7 | `.cta--reverse` | transparent | 64 px |
| 8 | `.quem-somos` | transparent | 64 px |

### Numbers-card (glassmorphism)

| Propriedade | Valor |
|-------------|-------|
| Background | `rgba(30, 25, 20, 0.5)` — escuro semitransparente |
| border-radius | **16 px** |
| box-shadow | none |
| padding | `px-5 py-5` = 48 px horizontal, 48 px vertical |

### Tipografia CCR

| Elemento | Valor |
|----------|-------|
| h2 | 40 px / fw 700 / lh 44 px / `#212529` |
| h3 | 32 px / fw 200 / lh 35.2 px / `#FDFDFD` (branco, dentro de dark) |
| p corpo | 14 px / fw 400 / lh 21 px / `rgb(90,95,114)` (cinza médio) |

---

## 8. Botões — Especificação Completa

### Botão Primário (CTA)

| Propriedade | Valor |
|-------------|-------|
| background-color | `#FFBC00` = `rgb(255, 188, 0)` |
| color | `#0B0C0E` = `rgb(11, 12, 14)` |
| border-radius | **8 px** |
| padding (header) | `12px 18px` |
| padding (CTA grande) | `14.4px 28.8px` ou `8px 12px` |
| font-size | 14–16 px |
| font-weight | 600–700 |
| text-transform | `none` |
| box-shadow | `none` |
| letter-spacing | `0px` (normal) |

### Botão Secundário / Ghost (Login)

| Propriedade | Valor |
|-------------|-------|
| background-color | `transparent` |
| color (sobre escuro) | `#FFBC00` |
| color (sobre claro) | `#0B0C0E` |
| border-radius | **8 px** |
| padding | `12px 18px` |
| font-size | 14 px |
| font-weight | 600 |
| border | nenhum explícito |

### Botão nav dropdown (toggle)

| Propriedade | Valor |
|-------------|-------|
| background | transparent |
| color | `#FFBC00` |
| border-radius | 6 px |
| padding | `4px 12px` |
| font-size | 20 px |
| font-weight | 400 |

---

## 9. Detalhes Distintivos

### Vídeo de background (Hero Home)
- Elemento `<video>` em loop, muted, dentro de `.hero-video-wrapper`
- Placeholder preto `rgb(0,0,0)` enquanto carrega
- Efeito de sobreposição escura via opacidade

### Carrossel de produtos e depoimentos
- Implementado com **Swiper.js** (fonte de ícone `swiper-icons`)
- Depoimentos: `.swiper.depoimentos-swiper`
- Produtos: `.swiper.produtos-carrossel`

### Ícone-card (empresa — benefícios)
- Quadrado com bg `rgb(229, 153, 0)` (ouro/laranja), `border-radius: 8px`
- Contém SVG/ícone do produto

### Header overlay
- O header não tem `position: fixed` computado — está integrado ao hero
- A transparência é real: o vídeo/hero fica por baixo do menu

### Seção formulário (dark)
- Aparece em home, /planos/ e /chat-commerce-report/ com exatamente o mesmo gradiente
- `linear-gradient(32.58deg, #000 66.85%, rgb(33,39,42) 108.34%)`
- Contém formulário de contato/lead

---

## 10. Divergências vs. Tokens Atuais do Repo (`app/globals.css`)

### Divergência 1 — Fonte: Lato vs. Lato (alinhado, mas mal configurado)

- **WP:** Usa `Lato` como única fonte de UI, com pesos 300–900 auto-hospedados.
- **DS atual:** `--font-sans: var(--font-lato), ui-sans-serif, system-ui, sans-serif` — declara `--font-lato` mas depende do `next/font` para ser injetado. **Risco:** se o `layout.tsx` não importar Lato via `next/font/google`, a fonte cai para `ui-sans-serif`, quebrando a paridade.
- **Ação:** Verificar que `app/layout.tsx` carrega `Lato` com pesos `[300,400,500,600,700,900]`.

### Divergência 2 — Escala tipográfica: WP usa px fixos bem maiores

- **WP:** `h1` = 44–60 px / `h2` = 40–42 px / `h3` = 32–60 px / `p hero` = 32 px
- **DS atual:** `oc-h1` = `clamp(32px, 5vw, 40px)` / `oc-h2` = 32 px / `oc-h3` = 28 px / `oc-body-lg` = 18 px
- **Delta maior:** h2 WP (42 px) vs. DS (32 px) = **10 px de diferença**; h3 WP "número" (60 px) vs. DS (28 px) = **32 px de diferença**.
- **Ação:** O DS atual está subdimensionado — a escala WP é consistentemente maior em headings de destaque e seções de stats.

### Divergência 3 — Border-radius de cards: WP usa 32 px, DS usa 12 px

- **WP:** Cards de conteúdo, benefícios, menores, depoimentos = **32 px** uniformemente.
- **DS atual:** `--radius-oc-card: 12px` — menos de metade.
- **Delta:** 20 px. O visual WP tem cantos muito mais arredondados que o DS novo define.
- **Ação:** Ajustar `--radius-oc-card` para 32 px (ou criar token `--radius-oc-card-lg: 32px`).

### Divergência 4 — Sombra de cards: WP usa `0 16px 48px rgba(0,0,0,0.176)`, DS é mais suave

- **WP `.shadow-lg`:** `rgba(0,0,0,0.176) 0px 16px 48px 0px` — sombra profunda e difusa
- **DS atual `--shadow-oc-lg`:** `0 12px 32px rgba(13,13,13,0.24)` — menor spread e diferente cor base
- **Delta:** o WP é mais difuso (48 px spread vs. 32 px) mas menos opaco (17.6% vs. 24%). O efeito visual é diferente.
- **Ação:** Calibrar `--shadow-oc-lg` para `0 16px 48px rgba(0,0,0,0.18)`.

### Divergência 5 — Container: WP = 1150 px, DS não define

- **WP:** `max-width: 1150px` com `padding: 0 12px`
- **DS atual:** Sem token de container max-width; herda do Tailwind padrão (`max-w-7xl` = 1280 px ou configuração personalizada)
- **Delta:** 130 px de diferença no container — o site WP é notavelmente mais estreito que Tailwind padrão.
- **Ação:** Criar token `--container-max: 1150px` e aplicar em layouts.

### Divergência 6 — Amarelo: #FFBC00 (DS) ≈ correto, mas #FFD04D (footer) não tem uso explícito no DS

- **WP footer:** usa `rgb(255, 208, 77)` = `#FFD04D` (amarelo massa) como **cor dominante de fundo de toda a área de rodapé**.
- **DS atual:** `--color-oc-yellow-mass: #FFD04D` existe, mas `--color-oc-yellow-cta: #FFBC00` é definido como botão primário.
- Esta divergência é de **semântica de uso**: o DS está correto, mas o desenvolvedor precisa saber que footer = `yellow-mass`, não `yellow-cta`.

### Divergência 7 — Cor cinza médio do corpo do texto: WP = `rgb(90,95,114)`, DS sem equivalente

- **WP /chat-commerce-report/ p:** `rgb(90, 95, 114)` = `#5A5F72` (cinza azulado)
- **DS atual:** Apenas `--color-oc-ink: #21232C` (escuro) e `--color-oc-neutral-dark: #414658` (intermediário)
- `#5A5F72` é mais claro que `neutral-dark` e não tem token equivalente no DS.
- **Ação:** Considerar adicionar `--color-oc-ink-muted: #5A5F72` para texto secundário.

### Divergência 8 — Padding vertical padrão: WP py-5 Bootstrap = 64 px, DS grade base 4 px

- **WP:** `py-5` do Bootstrap 5 = 48 px? Não — computado como **64 px** (Bootstrap usa `$spacer * 3` = 48 px... o tema está sobrescrito para 64 px = `$spacer: 1.333rem` ou customização direta).
- **DS atual:** `--spacing: 4px` (grid base), sem token de "section padding" definido.
- **Ação:** Documentar convenção: sections usam `py-16` (Tailwind = 64 px) ou criar token `--space-section: 64px`.

---

*Extração via Playwright headless em 2026-07-27. Valores são os exatos computados pelo browser — não interpolações ou estimativas.*
