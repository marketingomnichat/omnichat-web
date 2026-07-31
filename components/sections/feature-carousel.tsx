"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Panel } from "@/components/ui/panel";
import { safeHref } from "@/lib/safe-href";
import type { Cta } from "@/shared/types";

const CTA_CLASS: Record<NonNullable<Cta["variant"]>, string> = {
  primary:
    "bg-oc-yellow-cta text-oc-ink hover:bg-oc-yellow-hover active:bg-oc-yellow-press",
  secondary:
    "bg-oc-neutral-light text-oc-ink hover:bg-oc-secondary-hover active:bg-oc-secondary-press",
  ghost: "text-oc-ink hover:oc-ghost-hover active:oc-ghost-press",
};

type FeatureCarouselItem = {
  title: string;
  body?: string;
  image?: { imageUrl: string; alt: string };
  mediaSide?: "left" | "right";
  cta?: Cta;
  dark?: boolean;
};

export function FeatureCarousel({
  title,
  items = [],
}: {
  title?: string;
  items?: FeatureCarouselItem[];
}) {
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

  if (items.length === 0) return null;

  return (
    <section className="bg-oc-body" aria-label={title ?? "Produtos OmniChat"}>
      {title && <h2 className="oc-h2 mx-auto mb-8 max-w-oc-container px-6 text-center">{title}</h2>}
      <div role="region" aria-roledescription="carousel" aria-label={title ?? "Produtos OmniChat"}>
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory overflow-x-auto"
          onScroll={updateActiveItem}
        >
          {items.map((item, index) => (
            <article
              key={item.title}
              className="min-w-full shrink-0 snap-start"
              aria-label={`${item.title} (${index + 1} de ${items.length})`}
            >
              <div className="mx-auto max-w-oc-container px-6 py-oc-section">
                <Panel elevation="border" className={item.dark ? "bg-oc-dark" : ""}>
                  <div className="grid items-center gap-12 md:grid-cols-2">
                    <div className={item.mediaSide === "left" ? "md:order-last" : ""}>
                      <h3 className={`oc-h2 ${item.dark ? "text-oc-surface" : ""}`}>{item.title}</h3>
                      {item.body && (
                        <p className={`oc-body-lg mt-5 ${item.dark ? "text-oc-neutral" : "text-oc-neutral-dark"}`}>
                          {item.body}
                        </p>
                      )}
                      {item.cta && (
                        <div className="mt-8">
                          <Link
                            href={safeHref(item.cta.href)}
                            className={`oc-button-label rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc ${
                              CTA_CLASS[item.cta.variant ?? "primary"]
                            }`}
                          >
                            {item.cta.label}
                          </Link>
                        </div>
                      )}
                    </div>
                    {item.image?.imageUrl && (
                      <div className={item.mediaSide === "left" ? "md:order-first" : ""}>
                        <Image
                          src={item.image.imageUrl}
                          alt={item.image.alt ?? ""}
                          width={600}
                          height={400}
                          className="h-auto w-full rounded-lg object-cover"
                        />
                      </div>
                    )}
                  </div>
                </Panel>
              </div>
            </article>
          ))}
        </div>
        {items.length > 1 && (
          <div className="mx-auto mt-6 flex justify-center gap-2" aria-label="Navegação dos produtos">
            {items.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => scrollToItem(index)}
                className="h-2.5 w-2.5 rounded-full bg-oc-neutral-dark transition-opacity duration-150 ease-oc aria-[current=true]:bg-oc-ink aria-[current=true]:opacity-100"
                aria-label={`Ir para ${item.title}`}
                aria-current={activeIndex === index ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
