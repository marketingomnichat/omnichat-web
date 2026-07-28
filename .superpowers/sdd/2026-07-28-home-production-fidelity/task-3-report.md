# Task 3 — Testimonials carousel variant

## Entregue

- Adicionado ao schema Sanity o campo `variant` com opções `grid` e `carousel`, padrão `grid`.
- Preservada a grade existente e incluído carrossel client-side para a variante `carousel`.
- Carrossel tem scroll snap, botões anterior/próximo, indicadores, região acessível com `aria-roledescription="carousel"` e navegação sem animação quando `prefers-reduced-motion` está ativo.
- O seed da home define os depoimentos como `variant: "carousel"`.

## Verificação

- `npm run typecheck`
- `npm run lint` (3 avisos preexistentes em arquivos não relacionados)
- `npm test` (64 testes aprovados)
- `npm run build` (aprovado; avisos preexistentes de depreciação de `@sanity/image-url`)
