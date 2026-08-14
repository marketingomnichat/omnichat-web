# Popup de demonstração com teste A/B (WordPress + PostHog)

Snippet standalone que roda o teste A/B `demo-popup-ab` no site WordPress omni.chat. Spec completa em `docs/superpowers/specs/2026-08-07-wp-demo-popup-ab-design.md`.

## Arquivos

- `wp-demo-popup-ab.js` — o snippet (vanilla JS, CSS embutido, sem dependências).
- `test-harness.html` — simulação local do WordPress (stub de PostHog, CF7 fake, mock do HubSpot).

## Teste local

```sh
cd scripts/wp-demo-popup
python3 -m http.server 8787
# abrir http://localhost:8787/test-harness.html
```

O harness permite trocar variante (`popup`, `control`, timeout), simular cada uma das 5 páginas (muda o carrossel de cases) e ver os eventos PostHog capturados. O envio ao HubSpot é mockado por padrão; `&real=1` envia de verdade e cria lead no portal 20121735.

## Destino dos leads

- Variante `popup`: form HubSpot "MKT | SIte - Popup | Variante B" (GUID `0d0d61df-8014-4b0d-b2e9-aafb5f71a595`), via Forms API. Campos: `email`, `firstname`, `company`, `phone`, `cargo`, `segmentorevisado`, `qual_o_nmero_de_atendentesvendedores_da_empesa`. Os valores de `cargo` e `segmentorevisado` devem ser os valores internos das propriedades no CRM.
- Variante `control`: Contact Form 7 (form 98) capturado pelo HubSpot como formulário não HubSpot "MKT | OmniChat - Site" (Collected Forms, identificadores `.wpcf7-form, .submitting`).
- Antes de lançar 50/50: incluir o form da variante B nos mesmos workflows que disparam com "MKT | OmniChat - Site" (rotação de lead, notificações, lifecycle).

## Deploy no WordPress

1. **WPCode**: criar snippet do tipo JavaScript, local "Site Wide Footer", colar o conteúdo de `wp-demo-popup-ab.js` (sem as tags `<script>`; o WPCode as adiciona).
2. **WP Rocket**: em Otimização de arquivos, excluir o snippet do "Atrasar execução de JavaScript" e da minificação/combinação (adicionar `wpcode` ou o identificador do inline script às exclusões). Sem isso, usuários da variante popup podem clicar no CTA antes do interceptador existir.
3. Limpar o cache do WP Rocket após publicar.

O snippet só atua nestes paths (allowlist interna): `/`, `/produto/marketing-studio`, `/produto/sales-studio`, `/solucao/varejo`, `/solucao/educacional`.

## PostHog

- Feature flag multivariante `demo-popup-ab` com variantes `control` e `popup` (50/50).
- Eventos capturados (todos com `variant` e `page_path`):
  - `demo_form_submitted` — conversão primária (CF7 `wpcf7mailsent` no control; sucesso do POST HubSpot no popup)
  - `demo_popup_opened` — só popup
  - `demo_form_error` — falha de envio nos dois braços
- Comportamento fail-open: se a flag não resolver em 2s, o form embutido reaparece e o usuário fica fora do experimento (nenhum evento capturado).

## QA no site (forçar variante só pra você)

Abra qualquer página do teste com `?ocdp-variant=popup` (ou `control`). O override vale pra aba inteira (sessionStorage), ignora o PostHog e não captura evento — não contamina o experimento. `?ocdp-variant=off` desliga. Exemplo:

```
https://omni.chat/?ocdp-variant=popup
```

Funciona mesmo com a flag desligada e o experimento em rascunho.

## Gates antes de ativar 50/50

1. Confirmar que lead do CF7 (form 98) e lead do HubSpot form `4b6b3796` caem no mesmo pipeline comercial.
2. Validar nas 5 páginas em desktop e mobile com a flag em rollout condicional (só distinct_id de teste).
3. Conferir lead de teste chegando no HubSpot e eventos no PostHog.
