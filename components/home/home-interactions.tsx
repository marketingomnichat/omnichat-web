"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { HomeCase, SanityImage } from "@/shared/types";
import { MediaPlaceholder } from "./media-placeholder";

function EditableImage({ image, mobile, alt, className, placeholderLabel }: { image?: SanityImage; mobile?: SanityImage; alt: string; className?: string; placeholderLabel: string }) {
  if (!image?.url) {
    return <MediaPlaceholder label={placeholderLabel} aspectClass="h-full min-h-[300px]" className="rounded-none" />;
  }
  return (
    <picture>
      {mobile?.url && <source media="(max-width: 767px)" srcSet={mobile.url} />}
      <Image
        src={image.url}
        alt={image.alt ?? alt}
        width={image.width ?? 1200}
        height={image.height ?? 800}
        sizes="(max-width: 1023px) calc(100vw - 48px), 560px"
        placeholder={image.lqip ? "blur" : "empty"}
        blurDataURL={image.lqip}
        className={className}
      />
    </picture>
  );
}

export function CasesCarousel({ cases }: { cases: HomeCase[] }) {
  const [active, setActive] = useState(0);
  const item = cases[active] ?? cases[0];
  if (!item) return null;

  function move(delta: number) {
    setActive((current) => (current + delta + cases.length) % cases.length);
  }

  return (
    <div
      className="touch-pan-y"
      onTouchStart={(event) => event.currentTarget.dataset.touchX = String(event.touches[0]?.clientX ?? 0)}
      onTouchEnd={(event) => {
        const start = Number(event.currentTarget.dataset.touchX ?? 0);
        const end = event.changedTouches[0]?.clientX ?? start;
        if (Math.abs(start - end) > 45) move(start > end ? 1 : -1);
      }}
    >
      <article key={item._key ?? item.company} className="grid overflow-hidden rounded-[12px] bg-white shadow-oc-md animate-[oc-case-enter_275ms_ease-in-out] motion-reduce:animate-none lg:grid-cols-[1.1fr_.9fr]">
        <EditableImage image={item.image} mobile={item.imageMobile} alt={`Case ${item.company}`} placeholderLabel={`Imagem do case ${item.company}`} className="h-full min-h-[300px] w-full object-cover" />
        <div className="flex flex-col justify-center p-8 md:p-12">
          {item.logo?.url ? <Image src={item.logo.url} alt={item.logo.alt ?? item.company} width={item.logo.width ?? 160} height={item.logo.height ?? 56} className="h-10 w-auto self-start object-contain" /> : <p className="oc-overline text-oc-yellow-ink">{item.company}</p>}
          <blockquote className="mt-6 text-[22px] leading-8 font-bold text-oc-ink">“{item.quote}”</blockquote>
          {item.sourceUrl && <Link href={item.sourceUrl} className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-oc-ink underline decoration-oc-yellow-cta decoration-2 underline-offset-4">{item.sourceLabel ?? "Ver case completo"}<i className="ri-arrow-right-line" aria-hidden /></Link>}
        </div>
      </article>
      <div className="mt-6 flex items-center justify-between">
        <div className="flex gap-2" aria-label="Selecionar case">
          {cases.map((entry, index) => <button key={entry._key ?? entry.company} type="button" aria-label={`Mostrar case ${index + 1}: ${entry.company}`} aria-current={index === active} onClick={() => setActive(index)} className={`h-2.5 rounded-full transition-[width,background-color] duration-200 ${index === active ? "w-8 bg-oc-dark" : "w-2.5 bg-oc-neutral"}`} />)}
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => move(-1)} aria-label="Case anterior" className="flex size-11 items-center justify-center rounded-[8px] border border-oc-divider bg-white text-oc-ink hover:bg-oc-surface-alt"><i className="ri-arrow-left-line" aria-hidden /></button>
          <button type="button" onClick={() => move(1)} aria-label="Próximo case" className="flex size-11 items-center justify-center rounded-[8px] border border-oc-divider bg-white text-oc-ink hover:bg-oc-surface-alt"><i className="ri-arrow-right-line" aria-hidden /></button>
        </div>
      </div>
    </div>
  );
}
