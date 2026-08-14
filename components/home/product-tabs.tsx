"use client";

import Image from "next/image";
import { useId, useRef, useState } from "react";
import type { HomeTab } from "@/shared/types";
import { MediaPlaceholder } from "./media-placeholder";

export function ProductTabs({ tabs }: { tabs: HomeTab[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const buttons = useRef<Array<HTMLButtonElement | null>>([]);
  const uid = useId();
  const current = tabs[activeIndex] ?? tabs[0];

  if (!current) return null;

  function select(index: number, focus = false) {
    const next = (index + tabs.length) % tabs.length;
    setActiveIndex(next);
    if (focus) buttons.current[next]?.focus();
  }

  return (
    <div className="mx-auto w-full max-w-[1200px] px-6">
      <div role="tablist" aria-label="Demonstrações do produto" className="mx-auto grid max-w-[720px] grid-cols-3 gap-2 rounded-[12px] bg-oc-surface-alt p-1.5">
        {tabs.map((tab, index) => {
          const selected = index === activeIndex;
          return (
            <button
              key={tab._key ?? tab.id ?? tab.label}
              ref={(node) => { buttons.current[index] = node; }}
              id={`${uid}-tab-${index}`}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls={`${uid}-panel-${index}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => select(index)}
              onKeyDown={(event) => {
                if (event.key === "ArrowRight") { event.preventDefault(); select(activeIndex + 1, true); }
                if (event.key === "ArrowLeft") { event.preventDefault(); select(activeIndex - 1, true); }
                if (event.key === "Home") { event.preventDefault(); select(0, true); }
                if (event.key === "End") { event.preventDefault(); select(tabs.length - 1, true); }
              }}
              className={`min-h-12 rounded-[8px] px-2 py-3 text-[13px] font-bold transition-colors duration-200 sm:px-4 sm:text-[15px] ${selected ? "bg-oc-dark text-white" : "text-oc-neutral-dark hover:bg-white"}`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div
        id={`${uid}-panel-${activeIndex}`}
        role="tabpanel"
        aria-labelledby={`${uid}-tab-${activeIndex}`}
        tabIndex={0}
        key={current._key ?? current.id ?? current.label}
        className="mt-8 animate-[oc-tab-enter_225ms_ease-in-out] motion-reduce:animate-none"
      >
        {current.image?.url ? (
          <picture>
            {current.imageMobile?.url && <source media="(max-width: 767px)" srcSet={current.imageMobile.url} />}
            <Image
              src={current.image.url}
              alt={current.image.alt ?? current.description ?? `Demonstração de ${current.label} na OmniChat`}
              width={current.image.width ?? 1200}
              height={current.image.height ?? 675}
              sizes="(max-width: 767px) calc(100vw - 48px), 1120px"
              placeholder={current.image.lqip ? "blur" : "empty"}
              blurDataURL={current.image.lqip}
              className="mx-auto h-auto w-full max-w-[1120px] rounded-[12px] shadow-oc-lg"
              priority={activeIndex === 0}
            />
          </picture>
        ) : (
          <MediaPlaceholder
            label={current.description ?? `Demonstração de ${current.label}`}
            aspectClass="aspect-[1120/623]"
            className="mx-auto max-w-[1120px] rounded-[12px] shadow-oc-lg"
          />
        )}
      </div>
    </div>
  );
}
