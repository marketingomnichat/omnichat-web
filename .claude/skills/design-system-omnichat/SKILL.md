---
name: design-system-omnichat
description: >
  Aplica o Design System oficial da OmniChat em qualquer entrega visual ou textual da empresa.
  Use SEMPRE que o usuário mencionar "design system da Omnichat", "padrão visual da Omnichat",
  "identidade da Omnichat", ou pedir para criar/formatar qualquer um dos seguintes artefatos
  seguindo a marca: apresentações (PPTX), e-mails para clientes, dashboards, landing pages,
  componentes de UI, propostas comerciais, documentos internos com identidade visual, posts e
  materiais de marketing, ou qualquer conteúdo onde a identidade OmniChat deve ser aplicada.
  Também use quando o usuário disser "use o design system" sem especificar qual — dentro do
  contexto OmniChat, essa skill é a referência correta.
---

# OmniChat — Design System

Documento de referência completo para criação de materiais visuais e textuais alinhados à
identidade da OmniChat. Atualizado em 18 de maio de 2026 por @Vanessa Botega.

---

## 1. Identidade e Positioning

**O que é a OmniChat:**
Plataforma de jornada conversacional no WhatsApp com três camadas:
- **Infraestrutura**: API Meta oficial, LGPD, multi-loja, integrações VTEX / Shopify / Lynx / Magento / Wake / RD Station / Salesforce
- **IA em dois modos**:
  - *Whizz Agent* (autônomo) — vende, qualifica, recomenda, recupera carrinho, responde áudio
  - *Whizz Copilot* (assistivo) — sugere resposta, corrige texto, resume, busca produto por imagem, transcreve áudio
- **Orquestração**: marketing, vendas e relacionamento num único canal

**Positioning:**
> "IA com profundidade de negócio (catálogo, regras, voz) rodando a jornada completa dentro do WhatsApp, com integração nativa e dados que provam resultado."

**Não é:** ferramenta genérica de IA, chatbot de fluxo, plataforma de suporte/ticketing.

---

## 2. Voz e Tom

- **Público-alvo:** gestores e diretores de varejo, 30+
- **Tom:** formal, maduro, confiante, orientado a resultado
- **Idioma primário:** Português brasileiro
- **Pronomes:** "você" (cliente) e "nós/nossa" (OmniChat)
- **Proibido:** gírias, exclamação, emoji em copy de produto, clichê motivacional

### Termos proibidos → substituições obrigatórias

| ❌ Evitar | ✅ Usar |
|---|---|
| atendimento, suporte | vendas, atendimento de vendas |
| atendentes | vendedores, consultores de vendas |
| ROI | ROAS |
| bot, bot Whizz | Whizz, IA generativa, agente |
| HSM | template, mensagem ativa |
| "inteligência" (sozinho) | IA generativa / IA com profundidade de negócio |
| automação (como sinônimo de IA) | manter separados — automação ≠ IA |
| "fluídas" (com acento) | "fluidas" |

### Casing
- **Títulos e botões:** sentence case → "Enviar mensagem", não "ENVIAR MENSAGEM"
- **ALL-CAPS:** apenas em overlines pequenos e tags

### Bons exemplos de copy
- "Do clique no anúncio ao pedido entregue."
- "IA com profundidade do seu negócio — catálogo, regras, tom de voz."
- "O Whizz Agent vende por você. O Copilot vende com você."
- "Recupere carrinhos abandonados sem depender de e-mail."

### Exemplos a evitar
- ~~"Automatize seu atendimento com nosso bot inteligente! 🚀"~~
- ~~"Aumente seu ROI no WhatsApp"~~

---

## 3. Paleta de Cores

### Cores principais

| Papel | Hex | Uso |
|---|---|---|
| Amarelo primário | `#FFD04D` | Massa dominante — campos grandes, acento tipográfico em fundo escuro |
| Amarelo CTA sólido | `#FFBC00` | Botões primários, CTAs |
| Preto/quase-preto | `#0B0C0E` | Superfícies escuras |
| Texto principal | `#21232C` | Texto sobre fundos claros |
| Branco | `#FDFDFD` | Fundo de página, superfícies |
| Roxo Whizz | `#532673` | **Exclusivo para momentos Whizz/IA** |
| Roxo tint | `#EEE0FF` | Background leve para blocos de IA |

### Regras de contraste (obrigatórias)
- `#FFBC00` só carrega tinta escura (`#21232C`) — **nunca branca**
- `#532673` carrega texto branco
- Em fundos claros (branco, `#F6F7F8`), usar `#996300` para tipo/KPIs/ícones amarelos (AA 4.99:1; o antigo `#E59900` reprovava com 2.32:1)
- Alvo: **WCAG AA**

### Gradient Whizz (exclusivo IA)
```css
linear-gradient(135deg, #6E3399 46%, #7B3CA3 57%, #A056BE 72%, #B46CBC 77%, #E8ADA1 86%, #FFD04D 93%)
```

### Paleta semântica

| Estado | Main | Dark | Light |
|---|---|---|---|
| Success | `#1FAD66` | `#176A40` | `#E0F7D4` |
| Attention | `#FFBC00` | `#995900` | `#FFF1CC` |
| Danger | `#CC3628` | `#6C2314` | `#F1E1E7` |
| Info | `#1735FF` | `#0F23A6` | `#E7F1FE` |
| New (violet) | `#6F3399` | `#381A4D` | `#E0D3F5` |
| Beta | `#775C8A` | `#412334` | `#E6E0E9` |
| Neutral | `#C4C8D4` | `#414658` | `#DCDEE5` |
| Initial (teal) | `#33B2CB` | `#1A5966` | `#ADE0EB` |
| Progress (pink) | `#E095CA` | `#7A1F64` | `#FFD6ED` |

### Regras de composição
- Fundo de página: sempre `#FFFFFF` ou `#FDFDFD` — amarelo como campo cheio, nunca como fundo de página
- Sem gradiente (exceto proteção sutil em overlay de imagem e o gradient Whizz)
- Sem padrão repetido, sem textura, sem ruído

---

## 4. Tipografia

**Fonte:** Lato (única em todo o sistema)

| Peso | Uso |
|---|---|
| 900 | Display e abertura de seção |
| 700 | Títulos, botões |
| 500 | Labels, captions |
| 400 | Corpo de texto |
| 300 light | Apenas headline editorial gigante |
| ~~100 Thin~~ | **Proibido** — compromete legibilidade |

**Itálico:** raro — apenas caption ou citação

### Classes de tipografia

| Classe | Peso / Tamanho |
|---|---|
| `.oc-display` | 900 / 72px |
| `.oc-h1` | 900 / 40px |
| `.oc-h2` | 700 / 32px |
| `.oc-h3` | 700 / 28px |
| `.oc-h4` | 700 / 24px |
| `.oc-h5` | 700 / 20px |
| `.oc-body-lg` | 400 / 18px |
| `.oc-body` | 400 / 16px |
| `.oc-body-sm` | 400 / 14px |
| `.oc-caption` | 500 / 12px |
| `.oc-overline` | 700 / 12px caps, tracking 0.08em |
| `.oc-label` | 500 / 14px |
| `.oc-button-label` | 700 / 14px |

---

## 5. Espaçamento e Raios

**Grade base:** 4px → escala: 4 / 8 / 12 / 16 / 24 / 32 / 40 / 56 / 64 / 80

### Padding interno por componente
| Componente | Padding |
|---|---|
| Chips | 8px / 16px |
| Botões | 12px / 24px |
| Cards | 16px / 24px |
| Modais | 24px / 32px |
| Frames de documentação | 56px top |

### Raios de borda
| Componente | Raio |
|---|---|
| Botões | 8px |
| Cards | 8–12px |
| Modais / shells de documentação | 24–32px |
| Botão flutuante Whizz | 16px (mais suave, sinaliza IA) |

---

## 6. Layout

- **Desktop:** 12 colunas, margem externa 80px, gutter 24–32px
- **Conteúdo máximo:** 1280px (exceto hero amarelo full-bleed)
- **Sidebar do produto:** fixa 240–280px em coluna escura

---

## 7. Elevação e Bordas

### Sombras
Base: `rgba(13,13,13, α)`

| Nível | α | Uso |
|---|---|---|
| xs / hairline | 1px | Bordas sutis |
| sm | 0.08 | Card em repouso |
| md | 0.16 | Card elevado / popover |
| lg | 0.24 | Modal |
| xl | — | Toast / floating |

**Focus ring:** amarelo 3px `rgba(255,188,0,0.35)`, offset 2px (em fundos não-amarelos)

### Cores de borda
| Papel | Cor |
|---|---|
| Divider sutil | `#DCDEE5` |
| Input default | `#ABAEBA` |
| Focus / active | `#21232C` |
| Scaffold Figma (não vai pra produção) | Dashed roxo `#9747FF` |

### Cards
- Background: `#FFFFFF`, raio 8–12px
- **Borda OU sombra-sm** (nunca os dois juntos)
- Padding 16–24px
- Sem listra de acento na borda esquerda

---

## 8. Estados de Botão

| Botão | Estado | Cor |
|---|---|---|
| Primary amarelo | hover | `#F0B000` (-6%) |
| Primary amarelo | press | -12% |
| Secondary cinza | hover | `#BFC3CF` |
| Secondary cinza | press | `#A8ADBB` |
| Tertiary ghost | hover | `rgba(33,35,44,0.06)` |
| Tertiary ghost | press | `rgba(33,35,44,0.12)` |
| Delete | base | `#C63944` |
| Delete | hover | `#B33340` |
| Active / danger | — | `#CC3628` |
| Whizz | hover | gradiente roxo aprofunda |

> **Regra:** sem scale/squeeze no press. Apenas mudança de cor.

---

## 9. Movimento e Animação

- **Hover:** 150–200ms ease-out
- **Transição de estado:** 200–300ms ease-in-out
- **Proibido:** bounce, spring
- **Permitido:** fade e translate pequeno (4–8px)
- **Loading:** skeleton ou spinner — nunca lottie de marca
- **Indicador Whizz:** dot-pulse customizado

---

## 10. Iconografia

**Biblioteca:** Remix Icon (contorno preferido)
CDN: `https://cdn.jsdelivr.net/npm/remixicon@4.5.0/fonts/remixicon.css`

| Contexto | Tamanho |
|---|---|
| Inline / botão | 16px |
| Menu | 20px |
| Toolbar / tab | 24px |
| Empty-state / CTA grande | 32px |

- Stroke: 1.5px; fill apenas em estado ativo ou badge minúsculo
- Swap para fill só em item de nav selecionado
- Ícone em botão: 8px da borda do label
- Cor do ícone: segue cor do texto — exceto quando o ícone É o sinal semântico (danger `#C63944`, success `#1FAD66`)
- Ícone em callout/feature block: envolver em chip rounded-square (40–48px, raio 8–12px, bg yellow-100 ou grey-100)
- **Unicode como substituto de ícone: proibido.** Sempre SVG Remix.

---

## 11. Imagem e Ilustração

### Fotografia
- Tratamento quente, enquadramento íntimo, expressão genuína
- Diversidade brasileira real, recorte que captura movimento
- Blur de primeiro plano encorajado
- Presença de amarelo na foto deve equilibrar com amarelo do layout

**Evitar:** filtro amarelo artificial, gradação fria/pálida, sombra cinza-preto, cena corporativa vazia, modelo over-maquiada

### Ilustração
- unDraw recolorido para `#FFD04D`
- Papel de suporte — nunca hero principal

### Emoji
- Nunca em UI de produto, decks, marketing ou chrome
- Aceito apenas em conteúdo autoral de cliente dentro de chat-bubble mock

---

## 12. Transparência

- **Nunca em texto**
- Backdrop de modal: `rgba(11,12,14,0.48)`
- Scrim de popover e gradiente de proteção em foto: permitidos

---

## 13. Tokens CSS e Assets

```css
/* Baseline — aplicar .oc-root no app root */
.oc-root {
  font-family: 'Lato', sans-serif;
  font-size: 16px;
  line-height: 1.5;
  color: #21232C;
  background: #FDFDFD;
  -webkit-font-smoothing: antialiased;
}
```

**Logos disponíveis em `assets/`:**
- Preferencial: amarelo sobre fundo escuro
- Positivo: amarelo escuro sobre fundo claro
- Negativo: fundo preto
- Altura canônica: 100px (1.04in em print)

---

## Checklist rápido antes de entregar qualquer material

- [ ] Usou Lato? Sem Thin 100?
- [ ] Títulos em sentence case?
- [ ] Nenhum termo proibido no texto?
- [ ] Amarelo `#FFBC00` só com tinta escura?
- [ ] Roxo usado apenas para momentos Whizz/IA?
- [ ] Cards com borda OU sombra, nunca os dois?
- [ ] Sem emoji fora de chat-bubble mock?
- [ ] Ícones Remix Icon, nunca unicode?
- [ ] Fundo de página branco/`#FDFDFD`, não amarelo?