# Task 8 Report: Seed das 4 Páginas de Marketing

**Data:** 2026-07-27
**Status:** CONCLUÍDO — todos os gates passam

---

## Commit

```
bc188b0  feat: seed 4 marketing pages from WP (home, empresa, planos, chat-commerce-report)
```

**Arquivo criado:**
`scripts/migrate-wp/seed-marketing-pages.ts` (672 linhas)

---

## Resumo de Testes

| Gate | Resultado |
|------|-----------|
| `npm run lint` | PASS (0 erros) |
| `npm run typecheck` | PASS |
| `npm run test` | PASS — 52 testes em 9 suítes |
| `npm run build` | PASS — 218 páginas geradas |
| `npm run test:e2e` | PASS — 15 testes (Playwright) |

---

## Verificação GROQ

Query: `*[_type == "page" && _id in ["wp-page-home", "wp-page-empresa", "wp-page-planos", "wp-page-chat-commerce-report"]]`

Resultado confirmado via `writeClient.fetch`:
- `wp-page-home` — slug: "home" — 10 seções
- `wp-page-empresa` — slug: "empresa" — 8 seções
- `wp-page-planos` — slug: "planos" — 4 seções
- `wp-page-chat-commerce-report` — slug: "chat-commerce-report" — 8 seções

---

## H1s verificados no Build

| Rota | H1 no HTML gerado |
|------|-------------------|
| `/` (home) | "Domine marketing e vendas no WhatsApp com uma IA especialista em experiências que realmente convertem" |
| `/empresa` | "Criamos tecnologia para aproximar marcas e consumidores com conversas que geram valor." |
| `/planos` | "Escolha o plano ideal para aumentar as vendas da sua empresa" |
| `/chat-commerce-report` | "Um retrato em dados da jornada conversacional e o impacto da IA no Brasil" |

---

## Contagem de Seções por Página

### home (10 seções)
1. `hero` — "Domine marketing e vendas no WhatsApp…" + 2 CTAs
2. `featureSplit` — "Converta com agentes de IA especialistas em vendas" (mediaSide: right)
3. `featureSplit` — "Empodere seu time para entregar experiências melhores com IA" (mediaSide: left)
4. `featureSplit` — "Pós-venda que antecipa, resolve e fideliza" (mediaSide: right)
5. `featureSplit` — "Gerencie conversas com clareza e consistência" (mediaSide: left)
6. `featureSplit` — "Crie campanhas de marketing com resultados reais" (mediaSide: right)
7. `stats` — 3 indicadores: 12,5%, 27x, 60%
8. `featureGrid` — "Por que o canal conversacional é o canal que vende?" — 4 cards
9. `ctaBanner` — "Descubra a solução ideal"
10. `featureGrid` — "Evolua sua empresa com nossas soluções" — 4 cards

### empresa (8 seções)
1. `hero` — "Criamos tecnologia para aproximar marcas e consumidores…"
2. `richText` — manifesto (parágrafo único)
3. `featureSplit` — "Mais de 500 marcas transformando suas operações" (mediaSide: right)
4. `featureSplit` — "Recuperação de carrinhos e crescimento em receita" (mediaSide: left)
5. `featureSplit` dark — "Seja um Omnier…" (mediaSide: right, dark: true)
6. `featureGrid` — "Benefícios de ser um Omnier" — 10 cards
7. `logoCloud` — "A OmniChat está no radar das maiores empresas…" — 2 logos
8. `latestPosts` — limit: 4

### planos (4 seções)
1. `hero` — "Escolha o plano ideal para aumentar as vendas da sua empresa"
2. `pricingTable` — 5 planos: Marketing Studio, Sales Studio Essential, Sales Studio PRO (highlight), Sales Studio Enterprise, combo Marketing+Sales+Whizz (highlight)
3. `ctaBanner` — "Pronto para transformar seu WhatsApp no principal canal de vendas com IA?"
4. `ctaBanner` — "Descubra o plano ideal para o seu negócio" (quiz)

### chat-commerce-report (8 seções)
1. `hero` — "Um retrato em dados da jornada conversacional e o impacto da IA no Brasil" (dark)
2. `ctaForm` — formAction HubSpot (`https://api.hsforms.com/submissions/v3/integration/submit/20121735/4b6b3796-b24c-4786-ba60-39e2bba014b0`) — 5 campos
3. `logoCloud` — "Grandes marcas no Chat-Commerce Report 2026" — 20 logos
4. `featureSplit` — "O consumidor já está comprando pelo WhatsApp…" (mediaSide: right)
5. `featureGrid` — "O que você vai encontrar no relatório" — 4 cards
6. `testimonials` — "Depoimentos" — 3 depoimentos (Bruna Canani/Hering, Thiago Belisário/Mobly, Júlia Cavalcanti/Farm)
7. `ctaBanner` — "Os padrões já estão mapeados. Sua operação está preparada para 2026?"
8. `richText` — "Quem somos nós?" — 5 parágrafos

---

## Concerns e Notas

1. **Home como `○ (Static)` no build:** A home (`/`) é pré-renderizada como Static pelo Next.js (não SSG via generateStaticParams). Na primeira execução do build após o seed, o fetch-cache do Next.js tinha um resultado nulo em cache (CDN ainda não havia propagado). Resolvido limpando `.next/cache/fetch-cache/`. Em produção, o revalidate por tags resolve automaticamente.

2. **Imagens WP (featureSplit):** A função `uploadImageFromUrl` só faz upload de imagens de `omni.chat`. Como as imagens dos featureSplits são do WP, o `imageUrl` fica com a URL original do WP (`omni.chat/wp-content/...`). Nas seções da home, empresa e CCR, os campos `imageUrl` dos featureSplits apontam para URLs de WP — funciona no componente desde que o `next.config.ts` remotePatterns inclua `omni.chat` (ou via upload futuro).

3. **Seção "Evolua sua empresa com nossas soluções" (home):** O WP original renderiza um formulário inline nessa seção. A seção mais próxima disponível é `featureGrid`. Alternativa mais precisa seria `ctaForm`, mas o formulário renderizado no WP é de captura de leads sem action direto (usa JS). Usado `featureGrid` com as 4 soluções da OmniChat conforme o rendered text.

4. **logoCloud imprensa (empresa):** O WP usa imagens de logos de mídia/imprensa não-identificadas (sem alt text). Foram incluídas apenas 2 logos identificadas (Vector-2.svg: "Logo Marketing", Vector-1.svg: "Logo Vendas"). Task 9 pode expandir com scraping mais detalhado.

5. **Copy literal:** Todo texto foi extraído via `curl -sL` das páginas renderizadas, decodificando entities HTML. Nenhum texto foi inventado ou parafraseado.

6. **CTA variant dark:** Cumprido — nenhuma seção `dark` usa CTA `ghost`.

---

## Adendo (fix pós-auditoria): upload das 22 URLs de logo restantes

**Commit:** `0009bd9` — `fix: upload logoCloud images to Sanity assets (empresa + ccr, 22 urls)`

Correção do concern 2 acima (leitura invertida do filtro): `uploadImageFromUrl` FAZ upload de URLs `omni.chat` (só pula hosts externos). As 22 URLs restantes (20 logos do CCR + 2 SVGs Vector-*.svg da empresa) agora passam pelo mesmo pipeline (`img()` → `uploadImageFromUrl` → URL `cdn.sanity.io`), via novo helper `buildLogos()`.

**Evidências:**
- Seed re-executado (idempotente, createOrReplace): OK, sem nenhum fallback de upload — os 2 SVGs subiram normalmente.
- GROQ (audit): **31 URLs de imagem no total nas 4 páginas, 100% `cdn.sanity.io`, 0 não-CDN.**
- Todas as 31 URLs CDN verificadas por curl: **HTTP 200** (incl. os 2 SVGs 20x20).
- Build + `next start` + curl das 4 rotas: **200 + H1 correto** em `/`, `/empresa`, `/planos`, `/chat-commerce-report`.
- HTML gerado das 4 rotas: 0 URLs de imagem WP nas seções (84 refs `cdn.sanity.io` no CCR via `_next/image`).
- Gates completos: lint PASS, typecheck PASS, test PASS (52), build PASS, test:e2e PASS (15).

**Exceção conhecida (fora do escopo desta task):** `https://omni.chat/wp-content/uploads/2025/12/Conteudo.svg` aparece no HTML de todas as rotas — vem do `siteSettings` (logo da Organization no JSON-LD do layout), seedado na Task 7, não das seções das páginas. Se desejado, migrar no ajuste do siteSettings.

**Nota operacional:** após cada re-seed, o build local precisa de `rm -rf .next/cache/fetch-cache/` e eventualmente aguardar a propagação do CDN do Sanity (`apicdn.sanity.io`) — houve um build intermediário com documento stale do CDN. Em produção o revalidate por tags cobre isso.
