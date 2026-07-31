# Task 2 — Header adaptativo

## Entrega

- Adicionado `resolveHeaderAppearance`, com os estados `darkOverlay` e `lightSolid`, e o limiar de scroll de 24px.
- O header inicia de forma segura para SSR e observa o scroll no cliente, removendo o listener ao desmontar.
- Nas rotas `/`, `/planos` e `/chat-commerce-report`, o header é transparente e com navegação amarela no topo; após o limiar, passa a ser fixo, claro e com divisor.
- Rotas claras iniciam fixas e claras. O menu mobile continua como drawer escuro, como permitido no brief.
- A CTA Demo usa `bg-oc-yellow-cta text-oc-ink` nos modos desktop e mobile.
- Adicionados espaçadores de 76px às listagens e posts do blog e ao título de páginas sem hero, prevenindo conteúdo sob o header claro fixo.

## TDD

1. Criado `tests/header-appearance.test.ts` com as três resoluções exigidas.
2. Confirmado RED: o teste falhou porque `header-appearance` não existia.
3. Implementado o helper mínimo e confirmado GREEN: 3 testes aprovados.

## Validação

- `npm test -- tests/header-appearance.test.ts` — 3 testes aprovados.
- `npm run lint && npm run typecheck && npm test` — concluído com sucesso.
- A etapa de lint mantém 3 avisos preexistentes e não relacionados em `scripts/extract-wp-tokens.mjs` e `.claire/worktrees/wp-migration/scripts/migrate-wp/check-token.ts`; não há erros.
- `npm run lint:design` aprovou 54 arquivos.
