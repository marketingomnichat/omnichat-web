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
