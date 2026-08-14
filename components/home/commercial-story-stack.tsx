import Image from "next/image";
import type { HomeMediaItem } from "@/shared/types";
import { MediaPlaceholder } from "./media-placeholder";

function StoryMedia({ item }: { item: HomeMediaItem }) {
  const image = item.image;

  if (!image?.url) {
    return (
      <MediaPlaceholder
        label={`Demonstração de ${item.overline ?? item.title}`}
        aspectClass="aspect-[1080/850]"
        className="h-full rounded-none"
      />
    );
  }

  return (
    <picture>
      {item.imageMobile?.url && (
        <source media="(max-width: 767px)" srcSet={item.imageMobile.url} />
      )}
      <Image
        src={image.url}
        alt={image.alt ?? item.title}
        width={image.width ?? 1080}
        height={image.height ?? 850}
        sizes="(max-width: 1023px) calc(100vw - 48px), 580px"
        placeholder={image.lqip ? "blur" : "empty"}
        blurDataURL={image.lqip}
        className="h-full w-full object-cover"
      />
    </picture>
  );
}

function CornerDots() {
  return (
    <>
      <span className="absolute -top-1 -left-1 size-2 rounded-full bg-oc-neutral-light" aria-hidden />
      <span className="absolute -top-1 -right-1 size-2 rounded-full bg-oc-neutral-light" aria-hidden />
      <span className="absolute -bottom-1 -left-1 size-2 rounded-full bg-oc-neutral-light" aria-hidden />
      <span className="absolute -right-1 -bottom-1 size-2 rounded-full bg-oc-neutral-light" aria-hidden />
    </>
  );
}

export function CommercialStoryStack({
  title,
  items,
}: {
  title?: string;
  items: HomeMediaItem[];
}) {
  return (
    <section className="bg-white py-24 md:py-40" aria-labelledby="stories-title">
      <div className="mx-auto max-w-[1160px] px-6 md:px-10">
        <h2
          id="stories-title"
          className="mx-auto max-w-[850px] text-center text-[40px] leading-[1.08] font-black text-oc-dark md:text-[56px]"
        >
          {title}
        </h2>

        <div className="mt-16 md:mt-20">
          {items.map((item, index) => {
            const mediaFirst = index % 2 === 1;

            return (
              <article
                key={item._key ?? item.title}
                className="relative grid border-b border-oc-divider lg:min-h-[425px] lg:grid-cols-2"
              >
                {index === 0 && (
                  <span className="absolute inset-x-0 top-0 h-px bg-[radial-gradient(circle,#DCDEE5_40%,transparent_100%)]" aria-hidden />
                )}
                <span className="absolute top-0 bottom-0 left-1/2 hidden w-px bg-oc-divider lg:block" aria-hidden />
                <CornerDots />

                <div
                  className={`flex flex-col justify-center px-0 py-12 lg:px-12 lg:py-14 ${
                    mediaFirst ? "lg:order-2" : ""
                  }`}
                >
                  <p className="oc-overline text-oc-yellow-ink">{item.overline}</p>
                  <h3 className="mt-3 max-w-[460px] text-[32px] leading-[1.08] font-black text-oc-dark md:text-[44px]">
                    {item.title}
                  </h3>
                  {item.text && (
                    <p className="mt-5 max-w-[480px] text-[18px] leading-7 text-oc-ink">
                      {item.text}
                    </p>
                  )}
                  <ul className="mt-7 space-y-3">
                    {item.benefits?.map((benefit) => (
                      <li key={benefit} className="flex gap-3 text-oc-ink">
                        <i className="ri-check-line mt-0.5 text-[20px] text-oc-yellow-ink" aria-hidden />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className={`min-h-[320px] overflow-hidden lg:min-h-0 ${mediaFirst ? "lg:order-1" : ""}`}>
                  <StoryMedia item={item} />
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
