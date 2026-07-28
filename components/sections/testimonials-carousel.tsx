"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type TestimonialsCarouselProps = {
  children: ReactNode;
  itemCount: number;
};

export function TestimonialsCarousel({ children, itemCount }: TestimonialsCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReduceMotion(mediaQuery.matches);

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  function scrollToItem(index: number) {
    const item = trackRef.current?.children[index] as HTMLElement | undefined;
    item?.scrollIntoView({
      behavior: reduceMotion ? "auto" : "smooth",
      block: "nearest",
      inline: "start",
    });
  }

  function updateActiveItem() {
    const track = trackRef.current;
    if (!track) return;

    const items = Array.from(track.children) as HTMLElement[];
    const trackLeft = track.getBoundingClientRect().left;
    const closestIndex = items.reduce((currentClosest, item, index) => {
      const currentDistance = Math.abs(items[currentClosest].getBoundingClientRect().left - trackLeft);
      const nextDistance = Math.abs(item.getBoundingClientRect().left - trackLeft);
      return nextDistance < currentDistance ? index : currentClosest;
    }, 0);

    setActiveIndex(closestIndex);
  }

  if (itemCount === 0) return null;

  return (
    <div role="region" aria-roledescription="carousel" aria-label="Depoimentos de clientes">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
        onScroll={updateActiveItem}
      >
        {children}
      </div>
      {itemCount > 1 && (
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => scrollToItem(Math.max(activeIndex - 1, 0))}
            disabled={activeIndex === 0}
            className="rounded-oc-button px-3 py-2 text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Depoimento anterior"
          >
            ←
          </button>
          <div className="flex gap-2" aria-label="Navegação dos depoimentos">
            {Array.from({ length: itemCount }, (_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => scrollToItem(index)}
                className="h-2.5 w-2.5 rounded-full bg-oc-neutral-dark transition-opacity duration-150 ease-oc aria-[current=true]:bg-oc-ink aria-[current=true]:opacity-100"
                aria-label={`Ir para o depoimento ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => scrollToItem(Math.min(activeIndex + 1, itemCount - 1))}
            disabled={activeIndex === itemCount - 1}
            className="rounded-oc-button px-3 py-2 text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-surface-alt disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Próximo depoimento"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
}
