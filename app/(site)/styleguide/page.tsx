import type { Metadata } from "next";
import { Card } from "@/components/ui/card";
import { WhizzBlock } from "@/components/whizz/whizz-block";

export const metadata: Metadata = {
  title: "Styleguide — OmniChat",
  robots: { index: false },
};

const BRAND_COLORS = [
  ["Amarelo massa", "bg-oc-yellow-mass"],
  ["Amarelo CTA", "bg-oc-yellow-cta"],
  ["Amarelo ink", "bg-oc-yellow-ink"],
  ["Ink", "bg-oc-ink"],
  ["Dark", "bg-oc-dark"],
  ["Surface alt", "bg-oc-surface-alt"],
] as const;

const SEMANTIC = [
  ["Success", "bg-oc-success", "bg-oc-success-dark", "bg-oc-success-light"],
  ["Attention", "bg-oc-attention", "bg-oc-attention-dark", "bg-oc-attention-light"],
  ["Danger", "bg-oc-danger", "bg-oc-danger-dark", "bg-oc-danger-light"],
  ["Info", "bg-oc-info", "bg-oc-info-dark", "bg-oc-info-light"],
  ["New", "bg-oc-new", "bg-oc-new-dark", "bg-oc-new-light"],
  ["Beta", "bg-oc-beta", "bg-oc-beta-dark", "bg-oc-beta-light"],
  ["Neutral", "bg-oc-neutral", "bg-oc-neutral-dark", "bg-oc-neutral-light"],
  ["Initial", "bg-oc-initial", "bg-oc-initial-dark", "bg-oc-initial-light"],
  ["Progress", "bg-oc-progress", "bg-oc-progress-dark", "bg-oc-progress-light"],
] as const;

export default function StyleguidePage() {
  return (
    <main className="mx-auto w-full max-w-[1280px] px-6 py-14 flex flex-col gap-14">
      <header>
        <p className="oc-overline text-oc-yellow-ink">Design system</p>
        <h1 className="oc-display mt-2">OmniChat</h1>
        <p className="oc-body-lg mt-4 max-w-[640px]">
          IA com profundidade do seu negócio — catálogo, regras, tom de voz.
          Esta página é o styleguide vivo dos tokens.
        </p>
      </header>

      <section>
        <h2 className="oc-h3 mb-6">Tipografia</h2>
        <div className="flex flex-col gap-3">
          <p className="oc-h1">Título h1 — Lato 900</p>
          <p className="oc-h2">Título h2 — Lato 700</p>
          <p className="oc-h3">Título h3 — Lato 700</p>
          <p className="oc-body">
            Corpo de texto — do clique no anúncio ao pedido entregue.
          </p>
          <p className="oc-caption text-oc-neutral-dark">Caption 500 / 12px</p>
          <p className="oc-overline">Overline em caps</p>
        </div>
      </section>

      <section>
        <h2 className="oc-h3 mb-6">Cores da marca</h2>
        <div className="flex flex-wrap gap-4">
          {BRAND_COLORS.map(([name, bg]) => (
            <div key={name} className="w-40">
              <div className={`${bg} h-20 rounded-oc-button border border-oc-divider`} />
              <p className="oc-caption mt-2">{name}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="oc-h3 mb-6">Paleta semântica</h2>
        <div className="flex flex-col gap-2">
          {SEMANTIC.map(([name, main, dark, light]) => (
            <div key={name} className="flex items-center gap-2">
              <span className="oc-label w-24">{name}</span>
              <div className={`${main} h-8 w-24 rounded-oc-button`} />
              <div className={`${dark} h-8 w-24 rounded-oc-button`} />
              <div className={`${light} h-8 w-24 rounded-oc-button border border-oc-divider`} />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="oc-h3 mb-6">Botões</h2>
        <div className="flex flex-wrap items-center gap-4">
          <button className="oc-button-label bg-oc-yellow-cta text-oc-ink rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover active:bg-oc-yellow-press">
            Enviar mensagem
          </button>
          <button className="oc-button-label bg-oc-neutral-light text-oc-ink rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc hover:bg-oc-secondary-hover active:bg-oc-secondary-press">
            Ação secundária
          </button>
          <button className="oc-button-label text-oc-ink rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc hover:oc-ghost-hover active:oc-ghost-press">
            Ghost
          </button>
          <button className="oc-button-label bg-oc-delete text-white rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc hover:bg-oc-delete-hover">
            Excluir
          </button>
        </div>
      </section>

      <section>
        <h2 className="oc-h3 mb-6">Cards — borda ou sombra, nunca os dois</h2>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 max-w-[720px]">
          <Card elevation="border">
            <p className="oc-h5">Card com borda</p>
            <p className="oc-body-sm mt-2 text-oc-neutral-dark">
              Variante padrão, divider sutil.
            </p>
          </Card>
          <Card elevation="shadow">
            <p className="oc-h5">Card com sombra</p>
            <p className="oc-body-sm mt-2 text-oc-neutral-dark">
              Elevação sm em repouso.
            </p>
          </Card>
        </div>
      </section>

      <section>
        <h2 className="oc-h3 mb-6">Momento Whizz (exclusivo IA)</h2>
        <div className="max-w-[720px]">
          <WhizzBlock title="Whizz Agent">
            O Whizz Agent vende por você. O Copilot vende com você.
          </WhizzBlock>
        </div>
      </section>

      <section className="bg-oc-dark rounded-oc-modal p-10">
        <p className="oc-overline text-oc-yellow-mass">Superfície escura</p>
        <p className="oc-h2 text-oc-surface mt-2">
          Recupere carrinhos abandonados sem depender de e-mail.
        </p>
      </section>
    </main>
  );
}
