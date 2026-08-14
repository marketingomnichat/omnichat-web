"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { safeHref } from "@/lib/safe-href";
import type { Cta, HomeMediaItem, SanityImage } from "@/shared/types";
import "./tokens.css";

function WhizzImage({ image, mobile, alt, placeholderLabel }: { image?: SanityImage; mobile?: SanityImage; alt: string; placeholderLabel: string }) {
  if (!image?.url) {
    return (
      <div
        className="flex aspect-[3/2] items-center justify-center rounded-xl border border-white/30 bg-white/10 p-6 text-center"
        role="img"
        aria-label={placeholderLabel}
      >
        <div>
          <i className="ri-image-line text-[28px] text-white" aria-hidden />
          <p className="mt-2 text-[13px] font-medium text-white">{placeholderLabel}</p>
        </div>
      </div>
    );
  }
  return <picture>{mobile?.url && <source media="(max-width: 767px)" srcSet={mobile.url} />}<Image src={image.url} alt={image.alt ?? alt} width={image.width ?? 1200} height={image.height ?? 800} sizes="(max-width: 1023px) calc(100vw - 48px), 560px" placeholder={image.lqip ? "blur" : "empty"} blurDataURL={image.lqip} className="h-auto w-full rounded-xl object-cover shadow-oc-lg" /></picture>;
}

export function WhizzSwitcher({ items }: { items: HomeMediaItem[] }) {
  const [active, setActive] = useState(0);
  const item = items[active] ?? items[0];
  if (!item) return null;
  return <div><div className="flex gap-2" role="tablist" aria-label="Modos do Whizz">{items.map((option, index) => <button key={option._key ?? option.label ?? option.title} type="button" role="tab" aria-selected={index === active} onClick={() => setActive(index)} className={`rounded-[8px] px-5 py-3 text-[14px] font-bold transition-colors duration-200 ${index === active ? "bg-white text-[#532673]" : "bg-[#532673] text-white hover:bg-oc-new-dark"}`}>{option.label ?? option.title}</button>)}</div><div key={item._key ?? item.title} role="tabpanel" className="mt-8 grid items-center gap-10 animate-[oc-tab-enter_225ms_ease-in-out] motion-reduce:animate-none lg:grid-cols-2"><div><h3 className="text-[32px] leading-[1.15] font-bold text-white">{item.title}</h3>{item.text && <p className="mt-4 text-[18px] leading-7 text-white">{item.text}</p>}<ul className="mt-6 space-y-3">{item.benefits?.map((benefit) => <li key={benefit} className="flex gap-3 text-white"><i className="ri-check-line mt-0.5 text-[20px]" aria-hidden /><span>{benefit}</span></li>)}</ul></div><WhizzImage image={item.image} mobile={item.imageMobile} alt={`Demonstração do ${item.label ?? item.title}`} placeholderLabel={`Demonstração do ${item.label ?? item.title}`} /></div></div>;
}

export function WhizzHomeSection({ title, text, items }: { title?: string; text?: string; items: HomeMediaItem[] }) {
  return <section className="oc-whizz bg-(--oc-whizz-purple) py-24 text-white" aria-labelledby="whizz-title"><div className="mx-auto max-w-[1200px] px-6"><p className="oc-overline text-white">Whizz</p><h2 id="whizz-title" className="mt-3 max-w-[700px] text-[40px] leading-tight font-black text-white md:text-[52px]">{title}</h2><p className="mt-4 max-w-[700px] text-[18px] leading-7 text-white">{text}</p><div className="mt-10"><WhizzSwitcher items={items} /></div></div></section>;
}

export function WhizzProofHeading({ title, text }: { title?: string; text?: string }) {
  return (
    <div className="oc-whizz mx-auto max-w-[920px] text-center">
      <h2
        id="proof-title"
        className="bg-(image:--oc-whizz-gradient) bg-clip-text text-[42px] leading-[1.06] font-black text-transparent md:text-[60px]"
      >
        {title}
      </h2>
      {text && <p className="mx-auto mt-5 max-w-[680px] text-[18px] leading-7 text-oc-ink">{text}</p>}
    </div>
  );
}

type CalloutLogo = { _key?: string; name: string; image?: SanityImage };

export function WhizzFinalCallout({
  title,
  text,
  primary,
  secondary,
  logos,
  image,
}: {
  title?: string;
  text?: string;
  primary?: Cta;
  secondary?: Cta;
  logos: CalloutLogo[];
  image?: SanityImage;
}) {
  return (
    <section className="oc-whizz bg-white px-6 py-24 md:py-40" aria-labelledby="final-cta-title">
      <div className="mx-auto max-w-[1440px] overflow-hidden rounded-[32px] bg-(--oc-whizz-purple) text-white shadow-oc-lg">
        <div className="relative overflow-hidden px-6 pt-12 md:px-14 md:pt-16">
          <div className="pointer-events-none absolute inset-0 bg-(image:--oc-whizz-gradient) opacity-45" aria-hidden />
          <div className="relative grid items-end gap-8 md:grid-cols-[1fr_auto]">
            <div className="max-w-[760px]">
              <p className="oc-overline text-white">OmniChat + Whizz</p>
              <h2 id="final-cta-title" className="mt-3 text-[40px] leading-[1.06] font-black text-white md:text-[58px]">
                {title}
              </h2>
              {text && <p className="mt-5 max-w-[680px] text-[18px] leading-7 text-white">{text}</p>}
            </div>
            <div className="flex flex-col gap-3 md:items-end">
              {primary && (
                <Link
                  href={safeHref(primary.href)}
                  data-demo-modal-trigger={primary.href === "#formulario" || undefined}
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-oc-button bg-oc-yellow-cta px-6 text-[15px] font-bold text-oc-ink hover:bg-oc-yellow-hover"
                >
                  {primary.label}<i className="ri-arrow-right-line" aria-hidden />
                </Link>
              )}
              {secondary && (
                <Link href={safeHref(secondary.href)} className="text-[14px] font-bold text-white underline underline-offset-4">
                  {secondary.label}
                </Link>
              )}
            </div>
          </div>

          <div className="relative mt-12 overflow-hidden border-y border-white/25 py-5" aria-label="Marcas que confiam na OmniChat">
            <div className="flex w-max items-center gap-12 motion-safe:animate-oc-logo-marquee">
              {[0, 1].map((copy) => (
                <div key={copy} className="flex shrink-0 items-center gap-12" aria-hidden={copy === 1}>
                  {logos.map((logo) => logo.image?.url ? (
                    <Image
                      key={`${copy}-${logo._key ?? logo.name}`}
                      src={logo.image.url}
                      alt={copy === 0 ? (logo.image.alt ?? logo.name) : ""}
                      width={logo.image.width ?? 120}
                      height={logo.image.height ?? 40}
                      className="h-8 w-[120px] object-contain brightness-0 invert"
                    />
                  ) : null)}
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto mt-10 max-w-[1080px]">
            <div className="pointer-events-none absolute inset-x-[12%] bottom-0 h-36 bg-white/30 blur-[70px]" aria-hidden />
            {image?.url ? (
              <Image
                src={image.url}
                alt={image.alt ?? "Demonstração da plataforma OmniChat"}
                width={image.width ?? 1200}
                height={image.height ?? 700}
                sizes="(max-width: 1200px) calc(100vw - 80px), 1080px"
                placeholder={image.lqip ? "blur" : "empty"}
                blurDataURL={image.lqip}
                className="relative h-auto w-full rounded-t-[16px] shadow-oc-lg"
              />
            ) : (
              <div className="relative flex aspect-[16/8] items-center justify-center rounded-t-[16px] border border-b-0 border-white/30 bg-white/10 text-center">
                <div><i className="ri-image-line text-[30px]" aria-hidden /><p className="mt-2 text-[13px] font-medium text-white">Demonstração da plataforma</p></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}