@AGENTS.md

# omni.chat — Next.js 16 + Sanity

## Comandos
- `npm run dev` / `npm run build` / `npm run lint` (ESLint + guardrails DS) / `npm run typecheck` / `npm test` (vitest) / `npm run test:e2e` (Playwright)
- `npm run migrate:wp` — migra WordPress → Sanity (idempotente; exige `SANITY_API_DEVELOPMENT_TOKEN` com permissão de escrita)

## Estrutura
- `services/` = I/O e APIs externas (Sanity, PostHog). `lib/` = lógica pura sem I/O (seo, llms, redirects, revalidate). `shared/` = tipos usados por 2+ camadas. `app/` = só rotas/layouts. `sanity/schemas/` = schema do CMS.

## Convenções
- Design system: tokens `oc-*` em `app/globals.css`; skill `design-system-omnichat` é a fonte da verdade de marca/copy.
- Roxo Whizz só em `components/whizz/`. Card: borda XOR sombra (prop `elevation`). `#FFBC00` nunca com texto branco. Gate: `npm run lint:design`.
- Seção nova = schema em `sanity/schemas/objects/sections.ts` + componente em `components/sections/` + entrada no `registry.ts`. Teste `tests/registry.test.ts` força a paridade. Seções disponíveis (12): `hero`, `richText`, `ctaBanner`, `stats`, `featureGrid`, `testimonials`, `logoCloud`, `faq`, `featureSplit`, `pricingTable`, `ctaForm`, `latestPosts`.
- Conteúdo: Sanity (site/blog) com tags de cache `page`/`page:slug`, `post`/`post:slug`, `siteSettings`, `redirect`; webhook `/api/revalidate?secret=` revalida.
- LPs de campanha: tipo `landingPage` no Sanity; host `lp.omni.chat` → middleware reescreve para `app/lp/[slug]`. Tags de cache: `landingPage`/`landingPage:slug`. Sem builder externo.
- Env: ver `.env.example`. Nunca commitar credencial.
- Boas práticas Next.js sempre pela doc em `node_modules/next/dist/docs/`: `<Image>` (nunca `<img>`; ESLint `no-img-element` = error + hook PreToolUse bloqueiam), `next/font`, `next/link`. Hosts remotos de imagem em `images.remotePatterns` (`NEXT_PUBLIC_ASSET_CDN_HOST` para o CDN OmniChat).
- Revisão visual pós-migração: screenshots em `docs/superpowers/visual-review/` (gerados por `scripts/visual-compare.ts`); comparar pares `-wp.png` vs `-novo.png` antes de qualquer cutover de DNS.
