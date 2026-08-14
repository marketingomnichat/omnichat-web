import Image from "next/image";
import { isSvgUrl } from "@/components/ui/image-utils";
import type { SanityImage } from "@/shared/types";

const CDN = "https://storage.googleapis.com/omnichat-cdn-assets";

/** Logos coloridos oficiais (CDN OmniChat). */
export const CLIENT_LOGOS = [
  { name: "Hering", imageUrl: `${CDN}/logos/cases/varejo/colorida/hering.svg` },
  { name: "iPlace", imageUrl: `${CDN}/logos/cases/varejo/colorida/iplace.svg` },
  { name: "Natura", imageUrl: `${CDN}/logos/cases/varejo/colorida/natura.svg` },
  { name: "Asics", imageUrl: `${CDN}/logos/cases/varejo/colorida/asics.svg` },
  { name: "Decathlon", imageUrl: `${CDN}/logos/cases/varejo/colorida/decathlon.svg` },
  { name: "Crocs", imageUrl: `${CDN}/logos/cases/varejo/colorida/crocs.svg` },
  { name: "Granado", imageUrl: `${CDN}/logos/cases/varejo/colorida/granado.svg` },
  { name: "Acer", imageUrl: `${CDN}/logos/cases/varejo/colorida/acer.svg` },
] as const;

type LogoItem = { _key?: string; name: string; image?: SanityImage; imageUrl?: string };

/** Grade estática no desktop e trilho manual com scroll-snap no mobile. */
export function ClientLogoStrip({
  title = "Mais de 500 marcas confiam na OmniChat para vender no WhatsApp.",
  logos = CLIENT_LOGOS,
}: {
  title?: string;
  logos?: readonly LogoItem[];
}) {
  return (
    <section className="bg-oc-yellow-mass py-14" aria-labelledby="client-logos-title">
      <div className="mx-auto max-w-[1280px] px-6">
        <h2 id="client-logos-title" className="mx-auto max-w-[720px] text-center text-[18px] leading-[27px] font-bold text-oc-ink">
          {title}
        </h2>
      </div>

      <div className="mx-auto mt-9 flex max-w-[1280px] snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-3 md:grid md:grid-cols-4 md:overflow-visible md:pb-0 lg:grid-cols-8" aria-label="Clientes OmniChat">
        {logos.map((logo) => {
          const src = logo.image?.url ?? logo.imageUrl;
          if (!src) return null;
          return (
            <div key={logo._key ?? logo.name} data-client-logo className="flex h-20 min-w-[160px] snap-center items-center justify-center rounded-[8px] bg-white px-5 transition-colors duration-200 hover:bg-oc-surface-alt focus-within:bg-oc-surface-alt md:min-w-0">
              <Image
                src={src}
                alt={logo.image?.alt ?? logo.name}
                width={logo.image?.width ?? 160}
                height={logo.image?.height ?? 56}
                className="max-h-12 w-auto object-contain"
                unoptimized={isSvgUrl(src)}
              />
            </div>
          );
        })}
        </div>
    </section>
  );
}
