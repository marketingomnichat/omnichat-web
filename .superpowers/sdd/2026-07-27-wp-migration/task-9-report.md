# Task 9 Report — E2E ampliado + validação visual

**Status:** DONE  
**Data:** 2026-07-27  
**Branch:** worktree-wp-migration

---

## Artefatos criados/modificados

| Arquivo | Ação |
|---|---|
| `tests/e2e/content.spec.ts` | Criado |
| `tests/e2e/a11y.spec.ts` | Modificado (adicionadas /planos, /empresa, /chat-commerce-report) |
| `scripts/visual-compare.ts` | Criado |
| `app/(site)/[slug]/page.tsx` | Modificado (fix: h1 para páginas legais) |
| `docs/superpowers/visual-review/*.png` | Criados (8 PNGs) |

---

## Fix necessário: /lgpd sem h1

A página /lgpd usa a seção `richText` que renderiza conteúdo Portable Text — o WP original não tinha h1 explícito, só h2 no corpo. O teste exigia `page.locator("h1")`.

**Solução:** `app/(site)/[slug]/page.tsx` agora renderiza `page.title` como `<h1>` visível quando a primeira seção não é `hero`. Páginas de marketing conservam o h1 do próprio `HeroSection`. Páginas legais recebem um h1 com `page.title` (ex: "LGPD").

---

## Gates

| Gate | Resultado |
|---|---|
| `npm run lint` | ✓ PASS |
| `npm run typecheck` | ✓ PASS |
| `npm test` | ✓ 52 testes, 9 arquivos |
| `npm run build` | ✓ Build completo (201 posts SSG) |
| `npm run test:e2e` | ✓ **24 passed** (0 failed) |

---

## E2E — contagem

**Antes da task 9:** 18 testes  
**Depois da task 9:** 24 testes (+6 novos)

Novos testes:
- `content.spec.ts`: 5 páginas × `renderiza conteúdo migrado` + 1 `post migrado abre com corpo` = **6 testes**
- `a11y.spec.ts`: +3 páginas (/planos, /empresa, /chat-commerce-report) = **+3 testes** (total a11y: 6)

Total novo: 18 → 24 testes e2e.

---

## Screenshots gerados

Todos em `docs/superpowers/visual-review/`:

| Página | WP | Novo |
|---|---|---|
| home | `home-wp.png` | `home-novo.png` |
| empresa | `empresa-wp.png` | `empresa-novo.png` |
| planos | `planos-wp.png` | `planos-novo.png` |
| chat-commerce-report | `chat-commerce-report-wp.png` | `chat-commerce-report-novo.png` |

8 PNGs commitados, capturados a 1280px full-page com Chromium headless.

---

## a11y — resultado

Todos os 6 paths passaram no axe (sem violações críticas ou sérias):
- `/` — OK
- `/styleguide` — OK
- `/blog` — OK
- `/planos` — OK
- `/empresa` — OK
- `/chat-commerce-report` — OK

O débito conhecido (CTA ghost em background dark) não disparou porque as seções dark das páginas marketing estão seedadas sem botão ghost.

---

## Concerns

- O `/lgpd` não tinha `h1` no HTML gerado — era um débito de arquitetura (páginas legais sem seção hero não tinham `h1`). Fix aplicado no `[slug]/page.tsx` é minimal e reversível.
- `scripts/visual-compare.ts` requer servidor local rodando (`npm start`) — não faz parte do `test:e2e` (intencional: é ferramenta de revisão do owner, não CI).
- WP live aceita cookies/popups que podem aparecer nos screenshots WP — diferença esperada; os PNGs são para comparação visual de estrutura/layout.
