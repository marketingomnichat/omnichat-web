# Renovação visual v2 — sistema de site (product-led)

Data: 2026-07-31 · Status: aprovado pelo owner  
Branch base: `feat/home-superdesign-fidelity` (ou main após merge da fidelidade)  
Inspiração: ClickUp / Intercom (product-forward), **não** clone WP  
Abordagem: evoluir o page builder Sanity + tokens `oc-*` (kit visual v2 nas seções/chrome existentes)

## Objetivo

Renovar a linguagem visual do site de marketing OmniChat para um look **product-led SaaS**: hero cinematográfico com UI do produto, body claro com painéis contidos, copy curta e direta — mantendo identidade OmniChat (amarelo CTA, tipografia/tokens `oc-*`, Whizz só no namespace de IA).

Sucesso = owner reconhece o sistema como “novo OmniChat product-forward” na home e nas páginas de chrome compartilhadas, sem regressão de CMS editável nem das gates de design.

## Fora de escopo

- Cutover DNS / desligar WordPress
- Kit visual paralelo (segunda lib de componentes) ou home 100% hardcoded fora do Sanity
- Landing pages de campanha (`lp.omni.chat`) na primeira onda (recebem o sistema depois)
- Novos assets fotográficos/vídeo (reutilizar mídia atual / Sanity / CDN OmniChat)
- Backend de marketing novo; HubSpot e fluxos da fase de fidelidade permanecem
- Pixel-perfect clone de ClickUp/Intercom (inspiração de composição, não de marca deles)

## Decisões trancadas

| Tópico | Escolha |
|---|---|
| Escopo | Sistema de site: home + empresa + planos + chrome do blog |
| Direção | Product-forward (UI grande, show-don’t-tell) |
| Conteúdo | Posicionamento atual; headlines/CTAs reescritas mais curtas |
| Superfícies | Hero escuro · body claro |
| Mídia | Reutilizar assets atuais |
| Implementação | Evoluir page builder / seções existentes (não kit paralelo) |
| Hero home | **B** — headline central + UI emergindo sob o fold |
| Stack home | **B** — produto primeiro (Whizz cedo → módulos → prova → CTA) |
| Header | **A** — adaptativo (escuro/transparente no hero → claro no scroll) |
| Linguagem de seção | **B** — painéis/bandejas brancas sobre fundo cinza |
| Tom de copy | **A** — direta & benefit |
| Densidade | **B** — equilibrada (~80–112px de respiro vertical entre blocos) |

## Arquitetura

Continuar o pipeline atual:

```
Sanity page.sections[] → SectionRenderer (registry) → components/sections/*
siteSettings → Header / Footer
tokens oc-* → app/globals.css
Whizz → components/whizz/* apenas
```

**Camadas do v2:**

1. **Tokens / primitives** — ajustes de densidade, superfícies de painel (`oc-surface-*`), sombras suaves para bandejas; sem nova paleta fora do DS.
2. **Chrome** — `Header` adaptativo; `Footer` alinhado ao body claro (badges/stores já existentes).
3. **Seções** — variantes visuais (props/`variant`) nos tipos atuais (`hero`, `featureSplit`, `featureCarousel`, `featureGrid`, `testimonials`, `stats`, `ctaBanner`, `ctaForm`, `logoCloud`, `mediaBlock`, etc.) em vez de tipos paralelos sempre que possível.
4. **Conteúdo** — seed/CMS com copy reescrita (sentence case, pt-BR, sem emoji); estrutura de seções da home conforme stack B.

Seção nova só quando um bloco v2 não couber em variante de tipo existente (mesmo contrato: schema + componente + `registry.ts` + `tests/registry.test.ts`).

## Home — composição

### Hero (escuro)

- Headline central, uma frase de suporte, um grupo de CTA (primário amarelo `#FFBC00` com tinta escura).
- UI do produto **full-bleed / emergindo** sob a headline (vídeo ou stills atuais reaproveitados como plano de produto, não como “card inset” solto).
- Brand OmniChat como sinal forte no primeiro viewport (logo + nome); Whizz só como acento de IA (highlight/prompt se mantidos).
- Sem overlays tipo badge flutuante, chips soltos ou stat strips no hero.

### Stack abaixo do hero (produto primeiro)

Ordem canônica:

1. **Whizz Agent deep-dive** — painel contido; UI/frame do agente; CTA “Ver Whizz” / equivalente curto.
2. **Módulos plataforma** — Marketing / Vendas / Atendimento (carousel ou grid em painéis).
3. **Logo cloud + stats** — prova social quantitativa, densidade equilibrada.
4. **Testimonials** — carousel ou grid em painel; logos de clientes se existirem no CMS.
5. **CTA form** — conversão; pode usar superfície contrastante (escura ou amarela controlada pelo DS), sem violar `#FFBC00` + texto branco.

Lead/richText longo estilo WP fica opcional ou enxuto — preferir benefício numa linha.

## Chrome

### Header adaptativo

- Sobre hero escuro: fundo transparente ou tint escuro, links claros, CTA Demo amarelo.
- Após scroll (e páginas sem hero escuro): fundo claro + borda/sombra leve, links escuros, mesmo CTA.
- Nav e CTAs existentes (Produtos, Soluções, Login → app, Demo → âncora do form) permanecem; polish de submenu/drawer da fase de fidelidade é base, não regressão.
- Mobile: drawer; estados de cor coerentes com o modo atual (escuro vs claro).

### Footer

- Body claro: footer claro ou superfície cinza do sistema de painéis; badges store/ISO já previstos na fidelidade.
- Sem introduzir roxo Whizz no footer.

### Blog chrome

- Mesmo header adaptativo (modo claro por default no blog) e footer do sistema.
- Templates de post não são redesign editorial completo nesta onda — só chrome compartilhado.

## Linguagem visual das seções

- **Painéis contidos:** bloco de conteúdo em superfície branca, raio consistente, borda `oc` sutil, sobre fundo cinza claro do body.
- Texto do painel **não** precisa de card interno extra; a bandeja *é* o container.
- UI de produto dentro do painel: frame escuro ou screenshot, sombra suave — produto como âncora visual.
- Cards “soltos” só quando forem unidade interativa (ex.: item clicável de grid); evitar card-on-card.
- Whizz: acentos roxos/gradiente **somente** via `components/whizz/` (deep-dive Agent/Copilot).

## Copy

- Voz **direta & benefit**: afirmação clara + benefício; escanável.
- Exemplos de norte (não literais obrigatórios no CMS — seed deve aproximar):
  - Hero: “Venda no WhatsApp com IA que conhece seu negócio”
  - Suporte: “Whizz Agent qualifica e fecha. Seu time escala.”
  - Seção: “IA com profundidade de negócio”
- Labels de schema e UI: pt-BR, sentence case, sem emoji.
- CTAs curtos: “Ver produto”, “Ver Whizz”, “Agendar demo” (alinhar ao form existente).

## Densidade e motion

- Respiro vertical entre seções/painéis na faixa **~80–112px** (desktop); mobile proporcionalmente menor.
- Tipografia: hierarquia expressiva já do DS; headlines curtas (1 linha preferível, 2 no máximo).
- Motion: 2–3 movimentos intencionais (ex.: transição do header, entrada suave da UI do hero, hover em painéis) — respeitar `prefers-reduced-motion`. Sem glow/purple haze genérico.

## Rollout

| Onda | Superfície | Nota |
|---|---|---|
| 1 | Home | Hero B + stack B + seções v2 + seed copy |
| 2 | Empresa, Planos, CCR | Mesmos padrões de painel/header; reseed copy onde fizer sentido |
| 3 | Blog chrome | Header/footer/sistema; posts intactos no miolo |
| 4 | LPs | Depois do aceite das ondas 1–3 |

## Relação com a fase de fidelidade WP

A fase de fidelidade à produção (HubSpot, carrosséis, mídia, header drawer, etc.) é **infraestrutura e paridade de capacidade**. Esta renovação **recompõe** visual e copy em cima dessa base — não exige desfazer integrações. Onde o layout WP conflitar com product-led v2, vence o v2.

## Gates e verificação

- `npm run lint` (inclui `lint:design`) · `typecheck` · `test` · `build`
- Visual review: screenshots `docs/superpowers/visual-review/` (home-novo vs direção aprovada; não vs WP como verdade absoluta)
- Aceite owner por onda (home primeiro)

## Riscos

| Risco | Mitigação |
|---|---|
| Header adaptativo quebrar páginas sem hero escuro | Modo claro default; modo escuro só com flag/contexto de hero |
| Painéis demais = visual “cardy” | Uma bandeja por seção; sem card interno no texto |
| Copy seed vs CMS já editado | Seed idempotente documentado; owner valida textos na onda 1 |
| Escopo expandir para LPs | Explicitamente onda 4 |
