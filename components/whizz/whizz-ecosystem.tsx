import Link from "next/link";
import "./tokens.css";

const WHIZZ_GRADIENT =
  "linear-gradient(135deg, #6E3399 46%, #7B3CA3 57%, #A056BE 72%, #B46CBC 77%, #E8ADA1 86%, #FFD04D 93%)";

const JOURNEY_NODES = [
  {
    label: "Marketing",
    icon: "ri-megaphone-line",
    position: "left-0 top-[18%]",
  },
  {
    label: "Catálogo",
    icon: "ri-store-2-line",
    position: "right-0 top-[18%]",
  },
  {
    label: "Vendas",
    icon: "ri-shopping-bag-3-line",
    position: "left-0 bottom-[18%]",
  },
  {
    label: "Relacionamento",
    icon: "ri-heart-3-line",
    position: "right-0 bottom-[18%]",
  },
] as const;

function JourneyNode({
  label,
  icon,
  position,
}: (typeof JOURNEY_NODES)[number]) {
  return (
    <div
      className={`absolute ${position} flex w-[132px] items-center gap-2 rounded-[12px] border border-white/30 bg-white/15 p-3 shadow-oc-md backdrop-blur-md`}
    >
      <span className="flex size-9 shrink-0 items-center justify-center rounded-[8px] bg-white text-[#532673]">
        <i aria-hidden className={`${icon} text-[18px]`} />
      </span>
      <span className="text-[13px] font-bold text-white">{label}</span>
    </div>
  );
}

export function WhizzEcosystem() {
  return (
    <section className="bg-white px-6 py-20">
      <div
        data-testid="whizz-ecosystem"
        className="oc-whizz mx-auto max-w-[1200px] overflow-hidden rounded-[32px] px-6 py-12 text-white shadow-oc-lg md:px-14 md:py-16"
        style={{ background: WHIZZ_GRADIENT }}
      >
        <div className="grid items-center gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="max-w-[520px]">
            <div className="inline-flex items-center gap-2 rounded-[8px] border border-white/30 bg-white/15 px-3 py-2 backdrop-blur-md">
              <i aria-hidden className="ri-sparkling-line text-[18px]" />
              <span className="oc-overline text-white">Whizz + OmniChat</span>
            </div>

            <h2 className="mt-6 text-[42px] leading-[1.08] font-black tracking-[-0.02em] text-white md:text-[56px]">
              Tudo no WhatsApp, com IA que conhece seu negócio
            </h2>
            <p className="mt-5 max-w-[480px] text-[18px] leading-[28px] text-white">
              Catálogo, regras comerciais e tom de voz conectados à jornada completa — do clique no
              anúncio ao pedido entregue.
            </p>

            <div className="mt-8 grid gap-3">
              <div className="flex items-center gap-3 rounded-[12px] border border-white/30 bg-[#532673] p-4">
                <span className="flex size-10 items-center justify-center rounded-[8px] bg-white text-[#532673]">
                  <i aria-hidden className="ri-robot-2-line text-[20px]" />
                </span>
                <p className="text-[16px] font-bold text-white">
                  O Whizz Agent vende por você.
                </p>
              </div>
              <div className="flex items-center gap-3 rounded-[12px] border border-white/30 bg-[#532673] p-4">
                <span className="flex size-10 items-center justify-center rounded-[8px] bg-white text-[#532673]">
                  <i aria-hidden className="ri-sparkling-line text-[20px]" />
                </span>
                <p className="text-[16px] font-bold text-white">
                  O Copilot vende com você.
                </p>
              </div>
            </div>

            <Link
              href="#formulario"
              className="mt-8 inline-flex h-12 items-center gap-2 rounded-oc-button bg-white px-6 text-[14px] font-bold text-oc-ink transition-colors duration-150 hover:bg-oc-surface-alt"
            >
              Conhecer o Whizz
              <i aria-hidden className="ri-arrow-right-line text-[16px]" />
            </Link>
          </div>

          <div className="relative mx-auto hidden min-h-[520px] w-full max-w-[560px] sm:block">
            <div className="absolute inset-[8%] rounded-full border border-white/30" aria-hidden />
            <div className="absolute inset-[22%] rounded-full border border-white/30" aria-hidden />
            <div className="absolute inset-[36%] rounded-full border border-white/30" aria-hidden />

            {JOURNEY_NODES.map((node) => (
              <JourneyNode key={node.label} {...node} />
            ))}

            <div className="absolute top-1/2 left-1/2 flex size-[190px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-[28px] bg-oc-dark p-6 text-center shadow-oc-lg">
              <span className="flex size-12 items-center justify-center rounded-[12px] bg-oc-yellow-cta text-oc-ink">
                <i aria-hidden className="ri-whatsapp-line text-[26px]" />
              </span>
              <p className="mt-4 text-[22px] font-black text-white">WhatsApp</p>
              <p className="mt-1 text-[12px] font-medium text-white">
                Uma jornada. Todo o contexto.
              </p>
            </div>

            <div className="absolute top-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[12px] border border-white/30 bg-[#532673] px-4 py-3 shadow-oc-md">
              <i aria-hidden className="ri-robot-2-line text-[20px]" />
              <span className="text-[14px] font-bold text-white">Whizz Agent</span>
            </div>
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-[12px] border border-white/30 bg-[#532673] px-4 py-3 shadow-oc-md">
              <i aria-hidden className="ri-plug-line text-[20px]" />
              <span className="text-[14px] font-bold text-white">Integrações</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:hidden">
            {JOURNEY_NODES.map((node) => (
              <div
                key={node.label}
                className="flex items-center gap-2 rounded-[12px] border border-white/30 bg-[#532673] p-3"
              >
                <span className="flex size-9 items-center justify-center rounded-[8px] bg-white text-[#532673]">
                  <i aria-hidden className={`${node.icon} text-[18px]`} />
                </span>
                <span className="text-[13px] font-bold text-white">{node.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
