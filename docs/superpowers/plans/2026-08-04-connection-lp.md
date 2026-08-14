# LP Connection 2026 (connection.omni.chat) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Portar a LP do evento Connection 2026 (`lps-from-hubspot/connection.html`) para componentes React servidos em `connection.omni.chat`, com fidelidade visual total ao HTML.

**Architecture:** Rota `app/connection/` fora do grupo `(site)` com layout e CSS próprios; seções em `components/connection/` com conteúdo centralizado em `content.ts`; host novo no `proxy.ts` seguindo o padrão do `LP_HOST`. Spec: `docs/superpowers/specs/2026-08-04-connection-lp-design.md`.

**Tech Stack:** Next.js 16 (App Router), React, Vitest + Testing Library (jsdom), Playwright, CSS puro portado do HTML (tokens `--lp-*`).

## Global Constraints

- Fonte da verdade visual: `lps-from-hubspot/connection.html` (na raiz do repo). Fidelidade total — não "melhorar" o design.
- Next.js deste repo tem breaking changes vs. training data: consultar `node_modules/next/dist/docs/` antes de usar qualquer API (AGENTS.md).
- `<Image>` de `next/image` sempre; `<img>` é bloqueado por ESLint + hook.
- `#FFBC00` nunca com texto branco (o HTML original já respeita — manter como está).
- Roxo Whizz só em `components/whizz/` — não usar nesta LP.
- Copy: maiúscula só no início de frase e nomes próprios; brand OmniChat BR.
- Commits: e-mail `joao.silva@omni.chat`, sem trailer de co-autoria de Claude.
- Gates antes de considerar qualquer task concluída: o teste da task passa e nada quebrou (`npm test`).

### Regras de conversão HTML → JSX (valem para todas as tasks de porte)

1. `class` → `className`; atributos SVG kebab-case → camelCase (`stroke-linecap` → `strokeLinecap`, `stroke-width` → `strokeWidth`, `fill-rule` → `fillRule`).
2. `<img>` → `<Image>` de `next/image` com o mesmo `width`/`height`/`alt` do HTML e `src` local `/connection/<arquivo>` (Task 1). SVGs decorativos inline permanecem inline.
3. Comentários HTML (`<!-- -->`) viram `{/* */}` ou são removidos; remover comentários `EDITAR:` do template HubSpot.
4. Entidades: manter texto UTF-8 literal (o arquivo já é UTF-8).
5. `style="visibility: hidden;"` e afins → `style={{ visibility: "hidden" }}`.
6. Não renomear classes CSS — o `connection.css` é portado com os mesmos seletores.
7. Textos, arrays e URLs vêm de `components/connection/content.ts` quando a seção for repetitiva (speakers, trilhas, FAQ, sponsors); markup único pode ficar inline no componente.

---

### Task 1: Assets locais em `public/connection/`

A LP referencia 12 assets no file manager do HubSpot (`20121735.fs1.hubspotusercontent-na1.net`). A LP não pode depender da conta HubSpot: baixar tudo para `public/connection/`.

**Files:**
- Create: `public/connection/*` (12 arquivos)

**Interfaces:**
- Produces: paths estáticos `/connection/<slug>.<ext>` usados por todos os componentes.

- [ ] **Step 1: Baixar os assets**

```bash
mkdir -p public/connection && cd public/connection
base="https://20121735.fs1.hubspotusercontent-na1.net/hubfs/20121735"
curl -fsSL -o favicon.svg "$base/MKT%20-%20Webinar%20FARM%20RIO%202026/favicon.svg"
curl -fsSL -o connection-logo-negative.svg "$base/Connection%20-%20set%202026/connection-logo-negative.svg"
curl -fsSL -o ricardo-amorim.png "$base/Connection%20-%20set%202026/Ricardo%20Amorim.png"
curl -fsSL -o bia-mori.png "$base/Connection%20-%20set%202026/Bia%20Mori.png"
curl -fsSL -o carla-fiorito.png "$base/Connection%20-%20set%202026/Carla%20Fiorito.png"
curl -fsSL -o enio-garbin.png "$base/Connection%20-%20set%202026/Enio%20Garbin.png"
curl -fsSL -o trezub.png "$base/Connection%20-%20set%202026/Trezub.png"
curl -fsSL -o grafismo-connection-gradient.svg "$base/Connection%20-%20set%202026/grafismo-connection-gradient.svg"
curl -fsSL -o grafismo-connection-yellow.svg "$base/Connection%20-%20set%202026/grafismo-connection-yellow.svg"
curl -fsSL -o wake.svg "$base/Connection%20-%20set%202026/wake.svg"
curl -fsSL -o meta.svg "$base/Connection%20-%20set%202026/meta.svg"
curl -fsSL -o logo-omnichat.svg "$base/Connection%20-%20set%202026/Logo%20OmniChat%20(1).svg"
cd -
```

- [ ] **Step 2: Verificar que os 12 baixaram e não são páginas de erro**

Run: `ls -la public/connection/ && file public/connection/* | grep -v "SVG\|PNG" || true`
Expected: 12 arquivos, todos `SVG` ou `PNG image data`. Se algum vier como HTML/erro, parar e reportar.

- [ ] **Step 3: Commit**

```bash
git add public/connection
git commit -m "feat: assets locais da LP Connection 2026"
```

---

### Task 2: Host connection.omni.chat no proxy

**Files:**
- Modify: `proxy.ts` (após o bloco `isLpHost`, linhas 45-64)
- Modify: `.env.example` (adicionar `NEXT_PUBLIC_CONNECTION_HOST`)
- Test: `tests/proxy-connection.test.ts`
- Modify: `tests/e2e/proxy.spec.ts` (casos do host novo)

**Interfaces:**
- Consumes: `proxy(request: NextRequest)` existente em `proxy.ts`.
- Produces: host `connection.omni.chat` (env `NEXT_PUBLIC_CONNECTION_HOST`, dev `connection.localhost`) com `/` reescrito para `/connection`; outros paths 404 nesse host; `/connection` no host principal redireciona 301 para `https://connection.omni.chat/`.

- [ ] **Step 1: Escrever os testes que falham**

Criar `tests/proxy-connection.test.ts`:

```ts
import { describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import { proxy } from "../proxy";

function makeRequest(url: string, host: string): NextRequest {
  return new NextRequest(url, { headers: { host } });
}

describe("proxy — host connection.omni.chat", () => {
  it("reescreve a raiz do host connection para /connection", async () => {
    const res = await proxy(makeRequest("https://connection.omni.chat/", "connection.omni.chat"));
    const rewrite = res?.headers.get("x-middleware-rewrite");
    expect(rewrite).toContain("/connection");
  });

  it("reescreve também em connection.localhost (dev)", async () => {
    const res = await proxy(
      makeRequest("http://connection.localhost:3000/", "connection.localhost:3000")
    );
    expect(res?.headers.get("x-middleware-rewrite")).toContain("/connection");
  });

  it("responde 404 para qualquer outro path no host connection", async () => {
    const res = await proxy(
      makeRequest("https://connection.omni.chat/qualquer-coisa", "connection.omni.chat")
    );
    expect(res?.status).toBe(404);
  });

  it("bloqueia /studio no host connection", async () => {
    const res = await proxy(makeRequest("https://connection.omni.chat/studio", "connection.omni.chat"));
    expect(res?.status).toBe(404);
  });

  it("redireciona /connection no host principal para o domínio próprio", async () => {
    const res = await proxy(makeRequest("https://omni.chat/connection", "omni.chat"));
    expect(res?.status).toBe(301);
    expect(res?.headers.get("location")).toBe("https://connection.omni.chat/");
  });

  it("redireciona /connection/sub no host principal para a raiz do domínio próprio", async () => {
    const res = await proxy(makeRequest("https://omni.chat/connection/sub", "omni.chat"));
    expect(res?.status).toBe(301);
    expect(res?.headers.get("location")).toBe("https://connection.omni.chat/");
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/proxy-connection.test.ts`
Expected: FAIL — rewrite ausente / status diferente (o host cai no fluxo de redirects do Sanity).

- [ ] **Step 3: Implementar no proxy.ts**

Logo abaixo de `const LP_HOST ...` (linha 7):

```ts
const CONNECTION_HOST = process.env.NEXT_PUBLIC_CONNECTION_HOST ?? "connection.omni.chat";
```

Dentro de `proxy()`, logo após o bloco `if (isLpHost) { ... }` e ANTES do bloco de redirects do Sanity:

```ts
  // 1b. Host da LP Connection: só a raiz existe; o resto (inclusive /studio) é 404.
  const isConnectionHost = host === CONNECTION_HOST || host.startsWith("connection.localhost");
  if (isConnectionHost) {
    if (pathname === "/") {
      const url = request.nextUrl.clone();
      url.pathname = "/connection";
      return NextResponse.rewrite(url);
    }
    return new NextResponse(null, { status: 404 });
  }
```

E logo após o bloco existente do `/lp` no host principal (item 2, linhas 60-64):

```ts
  // 2b. Host principal não serve /connection (conteúdo duplicado entre hosts).
  if (pathname === "/connection" || pathname.startsWith("/connection/")) {
    return NextResponse.redirect(new URL(`https://${CONNECTION_HOST}/`), 301);
  }
```

Em `.env.example`, junto do `NEXT_PUBLIC_LP_HOST`:

```
NEXT_PUBLIC_CONNECTION_HOST=connection.omni.chat
```

- [ ] **Step 4: Rodar e ver passar (novos + regressão)**

Run: `npx vitest run tests/proxy-connection.test.ts && npm test`
Expected: PASS em tudo (55 testes existentes + 6 novos).

- [ ] **Step 5: Estender o e2e do proxy**

Adicionar em `tests/e2e/proxy.spec.ts`, dentro do describe existente:

```ts
const CONNECTION_HOST = process.env.NEXT_PUBLIC_CONNECTION_HOST ?? "connection.omni.chat";

test("raiz do host connection serve a LP", async ({ request }) => {
  const response = await request.get("/", {
    headers: { host: CONNECTION_HOST },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(200);
});

test("path desconhecido no host connection responde 404", async ({ request }) => {
  const response = await request.get("/nao-existe", {
    headers: { host: CONNECTION_HOST },
    maxRedirects: 0,
  });
  expect(response.status()).toBe(404);
});

test("/connection no host principal redireciona para o domínio próprio", async ({ request }) => {
  const response = await request.get("/connection", { maxRedirects: 0 });
  expect(response.status()).toBe(301);
  expect(response.headers()["location"]).toBe(`https://${CONNECTION_HOST}/`);
});
```

(O e2e roda no gate final da Task 8, quando a rota `/connection` existir.)

- [ ] **Step 6: Commit**

```bash
git add proxy.ts .env.example tests/proxy-connection.test.ts tests/e2e/proxy.spec.ts
git commit -m "feat: host connection.omni.chat no proxy"
```

---

### Task 3: Rota /connection — layout, CSS portado e página vazia

**Files:**
- Create: `app/connection/layout.tsx`
- Create: `app/connection/page.tsx` (esqueleto; seções entram nas Tasks 4-7)
- Create: `components/connection/connection.css`
- Modify: `vitest.config.ts` e `package.json` (tooling de teste de componente — usado a partir da Task 4)

**Interfaces:**
- Produces: rota `/connection` renderizável; classe raiz `.connection-root` que escopa o CSS; fonte Lato via variável `--font-lato`.

- [ ] **Step 1: Portar o CSS**

Copiar o conteúdo do `<style>` de `lps-from-hubspot/connection.html` (linha 38 até o `</style>` correspondente, ~linha 1848) para `components/connection/connection.css`, com estas substituições e mais nenhuma:

1. Seletor `body` → `.connection-root` (o CSS não pode vazar para o resto do app).
2. Seletor `html` → remover o bloco `scroll-behavior` (o layout aplica via style) OU trocar por `.connection-root { scroll-behavior: smooth; }` — manter o comportamento do `prefers-reduced-motion` correspondente.
3. `--font-sans: 'Lato', sans-serif;` → `--font-sans: var(--font-lato), sans-serif;` e o mesmo para `--font-display` (linhas 356-357 do HTML).

- [ ] **Step 2: Criar o layout**

`app/connection/layout.tsx`:

```tsx
import { Lato } from "next/font/google";
import "@/components/connection/connection.css";

// Mesmos pesos/estilos que a LP original carregava do Google Fonts CDN.
const lato = Lato({
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-lato",
});

// LP de evento: chrome-free por design, mesmo padrão de app/lp/layout.tsx.
export default function ConnectionLayout({ children }: { children: React.ReactNode }) {
  return <div className={`${lato.variable} connection-root`}>{children}</div>;
}
```

Antes de escrever, conferir a API atual de `next/font` em `node_modules/next/dist/docs/` (constraint global do repo).

- [ ] **Step 3: Criar a página com metadata (seções entram depois)**

`app/connection/page.tsx`:

```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "OmniChat Connection 2026 · IA conversacional para marketing, vendas e pós venda",
  description:
    "17 de setembro de 2026 · Welluci Gardens, São Paulo. Uma agenda executiva sobre IA no WhatsApp com Big Techs, especialistas e empresas que já operam resultado real.",
  alternates: { canonical: "https://connection.omni.chat/" },
  icons: { icon: "/connection/favicon.svg" },
};

export default function ConnectionPage() {
  return (
    <>
      <a className="skip-link" href="#main">
        Pular para o conteúdo principal
      </a>
      <main id="main">{/* seções nas Tasks 4-7 */}</main>
    </>
  );
}
```

- [ ] **Step 4: Instalar tooling de teste de componente**

```bash
npm install -D @testing-library/react @testing-library/user-event @vitejs/plugin-react jsdom
```

Atualizar `vitest.config.ts` para aceitar `.tsx` e o plugin React:

```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
  test: {
    include: ["tests/**/*.test.ts", "tests/**/*.test.tsx"],
  },
});
```

(Os testes de componente declaram `// @vitest-environment jsdom` no topo do arquivo; os unit existentes continuam em node.)

- [ ] **Step 5: Verificar que a rota renderiza e nada quebrou**

Run: `npm test && npm run dev` (em background) e `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/connection`
Expected: testes PASS; HTTP 200. Encerrar o dev server.

- [ ] **Step 6: Commit**

```bash
git add app/connection components/connection/connection.css vitest.config.ts package.json package-lock.json
git commit -m "feat: rota /connection com layout e css da LP"
```

---

### Task 4: content.ts + seções estáticas (navbar, hero, footer)

**Files:**
- Create: `components/connection/content.ts`
- Create: `components/connection/navbar.tsx`
- Create: `components/connection/hero.tsx`
- Create: `components/connection/page-footer.tsx`
- Modify: `app/connection/page.tsx`
- Test: `tests/connection-sections.test.tsx`

**Interfaces:**
- Consumes: assets `/connection/*` (Task 1), classes de `connection.css` (Task 3).
- Produces: `content.ts` exporta `EVENT` (`{ date: string; venue: string; capacity: string; ticketUrl: string }`); componentes `ConnectionNavbar` (prop `onSponsorClick?: () => void` — usada na Task 7), `ConnectionHero`, `ConnectionPageFooter`, todos sem props obrigatórias além dessa.

- [ ] **Step 1: Teste de render que falha**

Criar `tests/connection-sections.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { ConnectionNavbar } from "@/components/connection/navbar";
import { ConnectionHero } from "@/components/connection/hero";
import { ConnectionPageFooter } from "@/components/connection/page-footer";

describe("seções estáticas da LP Connection", () => {
  it("navbar tem as duas ações", () => {
    render(<ConnectionNavbar />);
    expect(screen.getByText("Patrocinar o evento")).toBeDefined();
    expect(screen.getByText("Garantir ingresso")).toBeDefined();
  });

  it("hero tem o headline e o meta do evento", () => {
    render(<ConnectionHero />);
    expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(
      "O mercado já decidiu usar IA conversacional."
    );
    expect(screen.getByText(/17 set 2026/)).toBeDefined();
  });

  it("footer tem o copyright", () => {
    render(<ConnectionPageFooter />);
    expect(screen.getByText(/© 2026 OmniChat/)).toBeDefined();
  });
});
```

- [ ] **Step 2: Rodar e ver falhar**

Run: `npx vitest run tests/connection-sections.test.tsx`
Expected: FAIL — módulos inexistentes.

- [ ] **Step 3: Implementar**

`components/connection/content.ts` (dados compartilhados; as listas de speakers/trilhas/faq entram nas Tasks 5-6):

```ts
export const EVENT = {
  date: "17 set 2026",
  venue: "Welluci Gardens · São Paulo",
  capacity: "250 vagas",
  ticketUrl: "https://www.sympla.com.br/evento/omnichat-connection/3445039",
};
```

Portar o markup seguindo as regras globais de conversão, a partir de `lps-from-hubspot/connection.html`:

- `navbar.tsx` ← linhas 1855-1877 (skip-link fica na page, já criado na Task 3). O `<a id="btn-patrocinar">` vira `<button type="button" className="navbar-link" onClick={onSponsorClick}>` (era `<a href="#">` com preventDefault — botão é o elemento correto). Componente client? Não: recebe `onSponsorClick` e é usado dentro de um client component na Task 7 — declarar `"use client"` aqui para simplificar.
- `hero.tsx` ← linhas 1883-1973, incluindo o iframe do YouTube (manter `aria-hidden`, `tabIndex={-1}`) e o `<div className="divider" />` que segue a seção. Logo do hero: `<Image src="/connection/connection-logo-negative.svg" width={640} height={96} alt="OmniChat Connection 2026" />`. Manter o `style={{ visibility: "hidden" }}` do CTA (estado atual da LP publicada).
- `page-footer.tsx` ← linhas 2650-2659, logo `/connection/logo-omnichat.svg` (160×32). Remover `{{ standard_footer_includes }}` (HubL, não se aplica).

Montar na `page.tsx` (ordem do HTML): `<ConnectionNavbar />` antes do `<main>`, `<ConnectionHero />` dentro, `<ConnectionPageFooter />` depois do `<main>`. O wire do `onSponsorClick` real acontece na Task 7; até lá a page passa `undefined`.

- [ ] **Step 4: Rodar e ver passar**

Run: `npx vitest run tests/connection-sections.test.tsx && npm test`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add components/connection app/connection/page.tsx tests/connection-sections.test.tsx
git commit -m "feat: navbar, hero e footer da LP Connection"
```

---

### Task 5: Seções de conteúdo (speakers, trilhas, ingresso, omni, sponsors, footer-cta)

**Files:**
- Create: `components/connection/speakers.tsx`, `trilhas.tsx`, `ingresso.tsx`, `omni.tsx`, `sponsors.tsx`, `footer-cta.tsx`
- Modify: `components/connection/content.ts` (arrays `SPEAKERS`, `SPONSORS`)
- Modify: `app/connection/page.tsx`
- Test: `tests/connection-sections.test.tsx` (ampliar)

**Interfaces:**
- Consumes: `EVENT` de `content.ts`; assets `/connection/*`.
- Produces: componentes `ConnectionSpeakers`, `ConnectionTrilhas`, `ConnectionIngresso`, `ConnectionOmni`, `ConnectionSponsors`, `ConnectionFooterCta` — todos server components sem props. `content.ts` exporta `SPEAKERS: { name: string; role: string; photo: string }[]` e `SPONSORS: { name: string; logo: string; width: number; height: number }[]`.

- [ ] **Step 1: Ampliar o teste e ver falhar**

Adicionar em `tests/connection-sections.test.tsx`:

```tsx
import { ConnectionSpeakers } from "@/components/connection/speakers";
import { ConnectionSponsors } from "@/components/connection/sponsors";
import { ConnectionIngresso } from "@/components/connection/ingresso";

it("speakers renderiza os nomes vindos do content.ts", () => {
  render(<ConnectionSpeakers />);
  expect(screen.getByText("Ricardo Amorim")).toBeDefined();
});

it("sponsors renderiza o rótulo e as logos", () => {
  render(<ConnectionSponsors />);
  expect(screen.getByText("Patrocinadores e apoiadores")).toBeDefined();
  expect(screen.getByAltText(/wake/i)).toBeDefined();
});

it("ingresso tem a âncora #ingresso apontada pelo CTA da navbar", () => {
  const { container } = render(<ConnectionIngresso />);
  expect(container.querySelector("#ingresso")).not.toBeNull();
});
```

Run: `npx vitest run tests/connection-sections.test.tsx` — Expected: FAIL (módulos inexistentes).

- [ ] **Step 2: Implementar os seis componentes**

Portar de `lps-from-hubspot/connection.html` seguindo as regras globais de conversão:

- `speakers.tsx` ← linhas 1974-2081. Fotos dos speakers e demais imagens da seção: `SPEAKERS` em `content.ts` com `photo: "/connection/ricardo-amorim.png"` etc. (Ricardo Amorim, Bia Mori, Carla Fiorito, Enio Garbin, Trezub — nomes/roles exatamente como no HTML). Grafismo: `/connection/grafismo-connection-gradient.svg`.
- `trilhas.tsx` ← linhas 2082-2155.
- `ingresso.tsx` ← linhas 2156-2280, mantendo `id="ingresso"` na section e `EVENT.ticketUrl` nos CTAs.
- `omni.tsx` ← linhas 2281-2313.
- `sponsors.tsx` ← linhas 2314-2336, `SPONSORS` com `/connection/wake.svg` e `/connection/meta.svg` (width/height do HTML).
- `footer-cta.tsx` ← linhas 2337-2365, grafismos `/connection/grafismo-connection-yellow.svg`.

Montar na `page.tsx` na ordem do HTML: hero → speakers → trilhas → ingresso → omni → sponsors → footer-cta (FAQ entra na Task 6).

- [ ] **Step 3: Rodar e ver passar**

Run: `npx vitest run tests/connection-sections.test.tsx && npm test`
Expected: PASS.

- [ ] **Step 4: Conferência visual rápida**

Run: `npm run dev` em background; abrir `http://localhost:3000/connection` e comparar seção a seção com o HTML aberto de `lps-from-hubspot/connection.html`. Corrigir divergências óbvias (espaçamento, ordem, texto). Encerrar o dev server.

- [ ] **Step 5: Commit**

```bash
git add components/connection app/connection/page.tsx tests/connection-sections.test.tsx
git commit -m "feat: seções de conteúdo da LP Connection"
```

---

### Task 6: FAQ (client component)

**Files:**
- Create: `components/connection/faq.tsx`
- Modify: `components/connection/content.ts` (array `FAQ`)
- Modify: `app/connection/page.tsx`
- Test: `tests/connection-faq.test.tsx`

**Interfaces:**
- Consumes: `FAQ: { question: string; answer: string }[]` de `content.ts`.
- Produces: `ConnectionFaq` (client component, sem props), acordeão com `aria-expanded`/`aria-controls` como no HTML original.

- [ ] **Step 1: Teste que falha**

Criar `tests/connection-faq.test.tsx`:

```tsx
// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ConnectionFaq } from "@/components/connection/faq";

describe("FAQ da LP Connection", () => {
  it("inicia com todas as perguntas fechadas", () => {
    render(<ConnectionFaq />);
    for (const btn of screen.getAllByRole("button")) {
      expect(btn.getAttribute("aria-expanded")).toBe("false");
    }
  });

  it("clique abre e fecha a pergunta, refletindo em aria-expanded", async () => {
    const user = userEvent.setup();
    render(<ConnectionFaq />);
    const [first] = screen.getAllByRole("button");
    await user.click(first);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    await user.click(first);
    expect(first.getAttribute("aria-expanded")).toBe("false");
  });

  it("abrir uma pergunta não fecha outra (comportamento do HTML original)", async () => {
    const user = userEvent.setup();
    render(<ConnectionFaq />);
    const [first, second] = screen.getAllByRole("button");
    await user.click(first);
    await user.click(second);
    expect(first.getAttribute("aria-expanded")).toBe("true");
    expect(second.getAttribute("aria-expanded")).toBe("true");
  });
});
```

Run: `npx vitest run tests/connection-faq.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Implementar**

Portar as 16 perguntas/respostas das linhas 2366-2583 do HTML para `FAQ` em `content.ts` (respostas com markup simples podem ser string com quebras ou JSX inline — manter o texto idêntico, na ordem do HTML, que exibe o item 15 antes do 14).

`components/connection/faq.tsx` (estrutura; classes e markup interno idênticos ao HTML):

```tsx
"use client";

import { useState } from "react";
import { FAQ } from "./content";

export function ConnectionFaq() {
  const [open, setOpen] = useState<Set<number>>(new Set());

  function toggle(i: number) {
    setOpen((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  }

  return (
    <section className="section faq-section" aria-labelledby="faq-heading">
      {/* wrapper interno idêntico às linhas 2366-2387 do HTML */}
      <h2 className="section-title" id="faq-heading">Perguntas frequentes</h2>
      {FAQ.map((item, i) => (
        <div key={item.question} className={`faq-item${open.has(i) ? " open" : ""}`}>
          <button
            type="button"
            className="faq-q"
            aria-expanded={open.has(i)}
            aria-controls={`faq-a-${i + 1}`}
            onClick={() => toggle(i)}
          >
            {item.question}
            {/* ícone chevron do HTML original */}
          </button>
          <div className="faq-a" id={`faq-a-${i + 1}`} role="region">
            {item.answer}
          </div>
        </div>
      ))}
    </section>
  );
}
```

Adicionar `<ConnectionFaq />` na `page.tsx` após o footer-cta (ordem do HTML).

- [ ] **Step 3: Rodar e ver passar**

Run: `npx vitest run tests/connection-faq.test.tsx && npm test`
Expected: PASS.

- [ ] **Step 4: Commit**

```bash
git add components/connection tests/connection-faq.test.tsx app/connection/page.tsx
git commit -m "feat: faq da LP Connection"
```

---

### Task 7: Modal de patrocínio com formulário HubSpot

**Files:**
- Create: `components/connection/sponsor-modal.tsx`
- Create: `components/connection/connection-page-client.tsx` (liga navbar → modal)
- Modify: `app/connection/page.tsx`
- Test: `tests/connection-sponsor-modal.test.tsx`

**Interfaces:**
- Consumes: `ConnectionNavbar` com `onSponsorClick` (Task 4).
- Produces: `SponsorModal({ open, onClose }: { open: boolean; onClose: () => void })`; `ConnectionPageClient({ children })` que renderiza navbar + children + modal e segura o estado `open`.

Constantes do formulário (do HTML original, linhas 2605-2610): `portalId: "20121735"`, `formId: "6e6ca101-b224-4dd7-ab57-84c61fcf55c1"`, `region: "na1"`, script `https://js.hsforms.net/forms/embed/v2.js`.

- [ ] **Step 1: Teste que falha**

Criar `tests/connection-sponsor-modal.test.tsx`:

```tsx
// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SponsorModal } from "@/components/connection/sponsor-modal";

describe("modal de patrocínio", () => {
  beforeEach(() => {
    // hbspt global simulado — o script externo não roda em jsdom
    (window as unknown as { hbspt: unknown }).hbspt = {
      forms: { create: vi.fn() },
    };
  });

  it("não renderiza nada fechado", () => {
    render(<SponsorModal open={false} onClose={() => {}} />);
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("aberto, mostra o dialog com título e bloqueia o scroll do body", () => {
    render(<SponsorModal open onClose={() => {}} />);
    expect(screen.getByRole("dialog")).toBeDefined();
    expect(screen.getByText("Patrocine o Connection 2026")).toBeDefined();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("fecha no botão, no overlay e no Escape", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SponsorModal open onClose={onClose} />);
    await user.click(screen.getByRole("button", { name: "Fechar" }));
    await user.click(screen.getByRole("dialog")); // clique no overlay (e.target === overlay)
    await user.keyboard("{Escape}");
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it("cria o formulário HubSpot no alvo ao abrir", () => {
    render(<SponsorModal open onClose={() => {}} />);
    const create = (window as unknown as { hbspt: { forms: { create: ReturnType<typeof vi.fn> } } })
      .hbspt.forms.create;
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        portalId: "20121735",
        formId: "6e6ca101-b224-4dd7-ab57-84c61fcf55c1",
        region: "na1",
        target: "#hubspot-form-patrocinio",
      })
    );
  });
});
```

Run: `npx vitest run tests/connection-sponsor-modal.test.tsx` — Expected: FAIL.

- [ ] **Step 2: Implementar o modal**

`components/connection/sponsor-modal.tsx`:

```tsx
"use client";

import { useEffect, useRef } from "react";

const HUBSPOT_SCRIPT = "https://js.hsforms.net/forms/embed/v2.js";
const FORM = {
  portalId: "20121735",
  formId: "6e6ca101-b224-4dd7-ab57-84c61fcf55c1",
  region: "na1",
  target: "#hubspot-form-patrocinio",
};

type Hbspt = { forms: { create: (opts: typeof FORM) => void } };

function loadHubspotForm() {
  const w = window as unknown as { hbspt?: Hbspt };
  if (w.hbspt) {
    w.hbspt.forms.create(FORM);
    return;
  }
  const existing = document.querySelector(`script[src="${HUBSPOT_SCRIPT}"]`);
  const script = existing ?? document.createElement("script");
  script.addEventListener("load", () => w.hbspt?.forms.create(FORM), { once: true });
  if (!existing) {
    (script as HTMLScriptElement).src = HUBSPOT_SCRIPT;
    (script as HTMLScriptElement).charset = "utf-8";
    document.body.appendChild(script);
  }
}

export function SponsorModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const formCreated = useRef(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    if (!formCreated.current) {
      formCreated.current = true;
      loadHubspotForm();
    }
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-patrocinio-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-box">
        <button ref={closeRef} type="button" className="modal-close" aria-label="Fechar" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
        <h2 className="modal-title" id="modal-patrocinio-title">Patrocine o Connection 2026</h2>
        <p className="modal-sub">Preencha o formulário e retornaremos com as cotas disponíveis:</p>
        <div id="hubspot-form-patrocinio" />
      </div>
    </div>
  );
}
```

Nota de fidelidade: o HTML esconde o modal com `hidden` e o mantém no DOM; aqui desmontamos ao fechar. O `formCreated` evita recriar o formulário; se recriar ao reabrir causar duplicação visível, trocar por manter o modal montado com `hidden` — validar no Step 4.

`components/connection/connection-page-client.tsx`:

```tsx
"use client";

import { useState } from "react";
import { ConnectionNavbar } from "./navbar";
import { SponsorModal } from "./sponsor-modal";

export function ConnectionPageClient({ children }: { children: React.ReactNode }) {
  const [sponsorOpen, setSponsorOpen] = useState(false);
  return (
    <>
      <ConnectionNavbar onSponsorClick={() => setSponsorOpen(true)} />
      {children}
      <SponsorModal open={sponsorOpen} onClose={() => setSponsorOpen(false)} />
    </>
  );
}
```

Na `page.tsx`, envolver o conteúdo com `<ConnectionPageClient>` (as seções continuam server components passadas como children — não perder SSR).

- [ ] **Step 3: Rodar e ver passar**

Run: `npx vitest run tests/connection-sponsor-modal.test.tsx && npm test`
Expected: PASS.

- [ ] **Step 4: Validar o formulário real no browser**

Run: `npm run dev` em background; abrir `http://localhost:3000/connection`, clicar em "Patrocinar o evento" e confirmar que o formulário HubSpot carrega dentro do modal (rede real). Fechar e reabrir para confirmar que não duplica. Encerrar o dev server.

Se o formulário não carregar por restrição de domínio no portal HubSpot, registrar: o domínio `connection.omni.chat` (e `localhost` para dev) precisa estar autorizado no portal 20121735 — ação no HubSpot, não no código.

- [ ] **Step 5: Commit**

```bash
git add components/connection tests/connection-sponsor-modal.test.tsx app/connection/page.tsx
git commit -m "feat: modal de patrocinio com formulario hubspot"
```

---

### Task 8: E2E, gates e build

**Files:**
- Create: `tests/e2e/connection.spec.ts`
- Test: suíte completa

- [ ] **Step 1: Escrever o e2e**

`tests/e2e/connection.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const CONNECTION_HOST = process.env.NEXT_PUBLIC_CONNECTION_HOST ?? "connection.omni.chat";

test.describe("LP Connection", () => {
  test.use({ extraHTTPHeaders: { host: CONNECTION_HOST } });

  test("página renderiza as seções principais", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      "O mercado já decidiu usar IA conversacional."
    );
    await expect(page.locator("#ingresso")).toBeAttached();
    await expect(page.getByText("Perguntas frequentes")).toBeVisible();
  });

  test("modal de patrocínio abre e fecha", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Patrocinar o evento" }).click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("dialog")).toHaveCount(0);
  });

  test("faq abre uma resposta", async ({ page }) => {
    await page.goto("/");
    const first = page.locator(".faq-q").first();
    await first.click();
    await expect(first).toHaveAttribute("aria-expanded", "true");
  });
});
```

(Se `test.use` com header `host` conflitar com o dev server do Playwright config, usar `page.goto("http://connection.localhost:3000/")` — conferir o `playwright.config.ts` do repo antes.)

- [ ] **Step 2: Rodar todos os gates**

Run, nesta ordem, e todos devem passar:

```bash
npm run lint
npm run lint:design
npm run typecheck
npm test
npm run build
npm run test:e2e
```

Expected: tudo PASS. Corrigir o que falhar antes de seguir.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/connection.spec.ts
git commit -m "test: e2e da LP Connection"
```

---

### Task 9: Comparação visual e limpeza

- [ ] **Step 1: Gerar os pares de screenshot**

Seguir o padrão de `scripts/visual-compare.ts` / `docs/superpowers/visual-review/`: capturar o HTML original (abrir `lps-from-hubspot/connection.html` via `file://` ou servidor estático) e `http://localhost:3000/connection` (build de produção: `npm run build && npm start`), desktop 1440px e mobile 390px, página inteira. Salvar como `docs/superpowers/visual-review/connection-original.png` / `connection-novo.png` (+ sufixo `-mobile`).

- [ ] **Step 2: Comparar e corrigir**

Comparar os pares. Divergência de layout/tipografia/espaçamento = bug de fidelidade: corrigir no CSS/componente e recapturar até os pares baterem.

- [ ] **Step 3: Gate de revisão do usuário**

Apresentar os pares ao usuário e aguardar aprovação explícita antes do Step 4.

- [ ] **Step 4: Remover o HTML de referência e commitar**

```bash
git rm lps-from-hubspot/connection.html
git add docs/superpowers/visual-review
git commit -m "chore: revisao visual da LP Connection e remocao do html de referencia"
```

---

## Go-live (fora do repo — checklist operacional)

1. Criar o projeto na Vercel apontando para este repo, env vars do `.env.example` (incluindo `NEXT_PUBLIC_CONNECTION_HOST=connection.omni.chat`).
2. Atachar somente o domínio `connection.omni.chat` ao projeto.
3. DNS: CNAME `connection` → Vercel.
4. HubSpot: autorizar o domínio `connection.omni.chat` para o formulário do portal 20121735, se necessário.
5. omni.chat principal permanece no WordPress até o cutover planejado.
