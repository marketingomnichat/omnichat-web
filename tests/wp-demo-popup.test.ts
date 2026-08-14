// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type CapturedEvent = { name: string; props: Record<string, unknown> };

declare global {
  interface Window {
    __ocdpLoaded?: boolean;
    __OCDP_FORCE_PATH__?: string;
    posthog?: unknown;
  }
}

function stubPosthog(variant: string | undefined, events: CapturedEvent[]) {
  window.posthog = {
    onFeatureFlags: (cb: () => void) => cb(),
    getFeatureFlag: (key: string) =>
      key === "demo-popup-ab" ? variant : undefined,
    capture: (name: string, props: Record<string, unknown>) => {
      events.push({ name, props });
    },
  };
}

function setupDom() {
  document.body.innerHTML = `
    <a id="cta" href="https://omni.chat/#formulario" target="_blank">Demo</a>
    <section class="formulario py-5" id="formulario">
      <div class="wpcf7" id="wpcf7-f98-o1"><form class="wpcf7-form"></form></div>
    </section>
  `;
}

async function loadSnippet(path: string) {
  window.__OCDP_FORCE_PATH__ = path;
  vi.resetModules();
  // @ts-expect-error — IIFE sem exports, importado só pelos efeitos colaterais
  await import("../scripts/wp-demo-popup/wp-demo-popup-ab.js");
}

function inlineSectionHidden() {
  return [...document.head.querySelectorAll("style")].some((s) =>
    s.textContent?.includes("#formulario{"),
  );
}

describe("wp-demo-popup-ab", () => {
  let events: CapturedEvent[];

  beforeEach(() => {
    events = [];
    setupDom();
  });

  afterEach(() => {
    (window as unknown as { __ocdpTeardown?: () => void }).__ocdpTeardown?.();
    delete window.__ocdpLoaded;
    delete window.__OCDP_FORCE_PATH__;
    delete window.posthog;
    document.head.querySelectorAll("style").forEach((s) => s.remove());
    document.documentElement.className = "";
    document.body.className = "";
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.useRealTimers();
  });

  it("não faz nada fora da allowlist", async () => {
    stubPosthog("popup", events);
    await loadSnippet("/blog/qualquer-artigo");
    expect(inlineSectionHidden()).toBe(false);
    document.getElementById("cta")!.click();
    expect(document.querySelector(".ocdp-overlay")).toBeNull();
    expect(events).toHaveLength(0);
  });

  it("normaliza barra final da URL", async () => {
    stubPosthog("popup", events);
    await loadSnippet("/produto/marketing-studio/");
    expect(inlineSectionHidden()).toBe(true);
  });

  describe("variante popup", () => {
    it("esconde o form embutido e abre o popup no clique do CTA", async () => {
      stubPosthog("popup", events);
      await loadSnippet("/");

      expect(inlineSectionHidden()).toBe(true);

      document.getElementById("cta")!.click();
      const overlay = document.querySelector(".ocdp-overlay");
      expect(overlay).not.toBeNull();
      expect(overlay!.querySelector('[role="dialog"]')).not.toBeNull();
      expect(
        events.some((e) => e.name === "demo_popup_opened"),
      ).toBe(true);
      const opened = events.find((e) => e.name === "demo_popup_opened")!;
      expect(opened.props.variant).toBe("popup");
      expect(opened.props.page_path).toBe("/");
    });

    it("mostra os cases da página (educacional abre com Grupo Gavinho)", async () => {
      stubPosthog("popup", events);
      await loadSnippet("/solucao/educacional");
      document.getElementById("cta")!.click();
      const panel = document.querySelector(".ocdp-case-slot")!;
      expect(panel.textContent).toContain("Grupo Gavinho");
      expect(panel.textContent).toContain("100%");
    });

    it("usa logo do CDN no lugar do avatar e iniciais quando não há logo", async () => {
      stubPosthog("popup", events);
      await loadSnippet("/produto/marketing-studio");
      document.getElementById("cta")!.click();

      // Hering (1º case) tem logo no CDN
      const logo = document.querySelector<HTMLImageElement>(
        ".ocdp-brand-chip img",
      )!;
      expect(logo.src).toContain(
        "omnichat-cdn-assets/logos/cases/varejo/cinza/hering.svg",
      );

      // Karsten (2º case) não tem logo no CDN — cai nas iniciais
      document
        .querySelector<HTMLButtonElement>("[data-ocdp-next]")!
        .click();
      const slot = document.querySelector(".ocdp-case-slot")!;
      expect(slot.querySelector(".ocdp-brand-chip")).toBeNull();
      expect(slot.querySelector(".ocdp-avatar")!.textContent).toBe("VB");
    });

    it("envia payload correto ao HubSpot e captura conversão", async () => {
      stubPosthog("popup", events);
      const fetchMock = vi
        .fn()
        .mockResolvedValue(new Response("{}", { status: 200 }));
      vi.stubGlobal("fetch", fetchMock);

      await loadSnippet("/");
      document.getElementById("cta")!.click();

      const form = document.querySelector<HTMLFormElement>(".ocdp-form")!;
      (form.elements.namedItem("firstname") as HTMLInputElement).value =
        "Ana";
      (form.elements.namedItem("email") as HTMLInputElement).value =
        "ana@empresa.com";
      (form.elements.namedItem("company") as HTMLInputElement).value = "Acme";
      (form.elements.namedItem("phone") as HTMLInputElement).value =
        "41999990000";
      (form.elements.namedItem("cargo") as HTMLSelectElement).value =
        "Diretor/VP";
      form.querySelector<HTMLSelectElement>(
        'select[aria-label="Segmento"]',
      )!.value = "Varejo";
      form
        .querySelector<HTMLInputElement>('input[value="11–50"]')!
        .click();

      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
      await vi.waitFor(() =>
        expect(
          events.some((e) => e.name === "demo_form_submitted"),
        ).toBe(true),
      );

      expect(fetchMock).toHaveBeenCalledOnce();
      const [url, init] = fetchMock.mock.calls[0];
      expect(String(url)).toContain(
        "api.hsforms.com/submissions/v3/integration/submit/20121735",
      );
      const payload = JSON.parse(String(init.body));
      const byName = Object.fromEntries(
        payload.fields.map((f: { name: string; value: string }) => [
          f.name,
          f.value,
        ]),
      );
      expect(byName.firstname).toBe("Ana");
      expect(byName.phone).toBe("+55 41999990000");
      expect(byName.cargo).toBe("Diretor/VP");
      expect(byName.pais).toBeUndefined();
      expect(byName._hp_field).toBeUndefined();
      const values = payload.fields.map(
        (f: { name: string; value: string }) => f.value,
      );
      expect(byName.segmentorevisado).toBe("Varejo");
      expect(
        byName.qual_o_nmero_de_atendentesvendedores_da_empesa,
      ).toBe("11–50");
      expect(values.length).toBeGreaterThan(0);
      expect(payload.context.pageUri).toBeTruthy();

      const submitted = events.find(
        (e) => e.name === "demo_form_submitted",
      )!;
      expect(submitted.props.variant).toBe("popup");
      expect(document.querySelector(".ocdp-success")).not.toBeNull();
    });

    it("não envia quando o honeypot está preenchido", async () => {
      stubPosthog("popup", events);
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);

      await loadSnippet("/");
      document.getElementById("cta")!.click();
      const form = document.querySelector<HTMLFormElement>(".ocdp-form")!;
      (form.elements.namedItem("_hp_field") as HTMLInputElement).value =
        "bot";
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
      expect(fetchMock).not.toHaveBeenCalled();
    });

    it("mostra erro e captura demo_form_error em falha HTTP", async () => {
      stubPosthog("popup", events);
      vi.stubGlobal(
        "fetch",
        vi.fn().mockResolvedValue(new Response("", { status: 500 })),
      );

      await loadSnippet("/");
      document.getElementById("cta")!.click();
      const form = document.querySelector<HTMLFormElement>(".ocdp-form")!;
      form.dispatchEvent(
        new Event("submit", { bubbles: true, cancelable: true }),
      );
      await vi.waitFor(() =>
        expect(
          events.some((e) => e.name === "demo_form_error"),
        ).toBe(true),
      );
      const errorEl = form.querySelector<HTMLElement>(".ocdp-error")!;
      expect(errorEl.hidden).toBe(false);
      expect(
        events.find((e) => e.name === "demo_form_error")!.props.reason,
      ).toBe("http_500");
    });

    it("fecha com Escape e devolve o foco ao CTA", async () => {
      stubPosthog("popup", events);
      vi.useFakeTimers();
      await loadSnippet("/");
      document.getElementById("cta")!.click();
      expect(document.querySelector(".ocdp-overlay")).not.toBeNull();

      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      );
      expect(document.querySelector(".ocdp-overlay")).toBeNull();
      vi.runAllTimers();
      expect(document.activeElement).toBe(document.getElementById("cta"));
    });
  });

  describe("variante control", () => {
    it("não esconde o form e rastreia wpcf7mailsent como conversão", async () => {
      stubPosthog("control", events);
      await loadSnippet("/solucao/varejo");

      expect(inlineSectionHidden()).toBe(false);
      document.getElementById("cta")!.click();
      expect(document.querySelector(".ocdp-overlay")).toBeNull();

      document
        .querySelector("#wpcf7-f98-o1")!
        .dispatchEvent(new CustomEvent("wpcf7mailsent", { bubbles: true }));

      const submitted = events.find(
        (e) => e.name === "demo_form_submitted",
      );
      expect(submitted).toBeDefined();
      expect(submitted!.props.variant).toBe("control");
      expect(submitted!.props.page_path).toBe("/solucao/varejo");
    });
  });

  describe("override de QA (?ocdp-variant=)", () => {
    afterEach(() => {
      sessionStorage.removeItem("ocdp-variant");
      history.replaceState(null, "", "/");
    });

    it("força a variante popup sem PostHog e não captura eventos", async () => {
      history.replaceState(null, "", "/?ocdp-variant=popup");
      // sem stub de posthog: override não depende da flag
      await loadSnippet("/");

      expect(inlineSectionHidden()).toBe(true);
      document.getElementById("cta")!.click();
      expect(document.querySelector(".ocdp-overlay")).not.toBeNull();
      expect(events).toHaveLength(0);
      // persiste na aba
      expect(sessionStorage.getItem("ocdp-variant")).toBe("popup");
    });

    it("?ocdp-variant=off remove o override", async () => {
      sessionStorage.setItem("ocdp-variant", "popup");
      history.replaceState(null, "", "/?ocdp-variant=off");
      stubPosthog("control", events);
      await loadSnippet("/");

      expect(sessionStorage.getItem("ocdp-variant")).toBeNull();
      document.getElementById("cta")!.click();
      expect(document.querySelector(".ocdp-overlay")).toBeNull();
    });
  });

  describe("timeout do PostHog", () => {
    it("libera o form embutido após 2s sem flag e não captura eventos", async () => {
      vi.useFakeTimers();
      // posthog nunca resolve as flags
      window.posthog = {
        onFeatureFlags: () => {},
        getFeatureFlag: () => undefined,
        capture: (name: string, props: Record<string, unknown>) => {
          events.push({ name, props });
        },
      };

      await loadSnippet("/");
      expect(inlineSectionHidden()).toBe(true);

      vi.advanceTimersByTime(2000);
      expect(inlineSectionHidden()).toBe(false);

      document
        .querySelector("#wpcf7-f98-o1")!
        .dispatchEvent(new CustomEvent("wpcf7mailsent", { bubbles: true }));
      expect(events).toHaveLength(0);
    });
  });
});
