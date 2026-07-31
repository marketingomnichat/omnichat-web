import Image from "next/image";
import Link from "next/link";
import { safeHref } from "@/lib/safe-href";
import type { Cta } from "@/shared/types";
import { HeroHighlight } from "@/components/whizz/hero-highlight";
import { HeroAgentPrompt } from "./hero-agent-prompt";

const CTA_CLASS: Record<NonNullable<Cta["variant"]>, string> = {
  primary:
    "bg-oc-yellow-cta text-oc-ink hover:bg-oc-yellow-hover active:bg-oc-yellow-press",
  secondary:
    "bg-oc-neutral-light text-oc-ink hover:bg-oc-secondary-hover active:bg-oc-secondary-press",
  ghost: "text-oc-ink hover:oc-ghost-hover active:oc-ghost-press",
};

type BackgroundMedia = {
  type: "video" | "image";
  url: string;
  poster?: string;
};

export function heroContentAlignClass(layout: "default" | "productEmerge" = "default") {
  return layout === "productEmerge" ? "flex flex-col items-center text-center mx-auto" : "";
}

function HeroBackgroundMedia({ media }: { media: BackgroundMedia }) {
  if (media.type === "video") {
    return (
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-black">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={media.poster}
          className="absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
        >
          <source src={media.url} type="video/mp4" />
        </video>
      </div>
    );
  }

  return (
    <div className="pointer-events-none absolute inset-0">
      <Image src={media.url} alt="" fill className="object-cover" priority sizes="100vw" />
    </div>
  );
}

export function Hero({
  overline,
  title,
  highlightPhrase,
  agentPrompt,
  subtitle,
  ctas = [],
  theme = "light",
  backgroundMedia,
  layout = "default",
}: {
  overline?: string;
  title: string;
  highlightPhrase?: string;
  agentPrompt?: { prefix?: string; phrases?: string[] };
  subtitle?: string;
  ctas?: Cta[];
  theme?: "light" | "dark";
  backgroundMedia?: BackgroundMedia;
  layout?: "default" | "productEmerge";
}) {
  const dark = theme === "dark";
  const productEmerge = layout === "productEmerge";
  const highlightIndex = highlightPhrase ? title.indexOf(highlightPhrase) : -1;
  const hasHighlight = highlightIndex >= 0 && highlightPhrase;
  const beforeHighlight = hasHighlight ? title.slice(0, highlightIndex) : title;
  const afterHighlight = hasHighlight ? title.slice(highlightIndex + highlightPhrase.length) : "";

  return (
    <section className={`relative overflow-hidden ${dark ? "bg-black" : "bg-white"}`}>
      {backgroundMedia && !productEmerge && <HeroBackgroundMedia media={backgroundMedia} />}
      <div
        className={`relative z-10 mx-auto max-w-oc-container px-6 py-oc-hero ${
          productEmerge ? `pb-10 ${heroContentAlignClass(layout)}` : ""
        }`}
      >
        {overline && (
          <p className={`oc-overline ${dark ? "text-oc-yellow-mass" : "text-oc-yellow-ink"}`}>{overline}</p>
        )}
        <h1
          className={
            dark
              ? `oc-h1 mt-3 max-w-[800px] text-white text-[44.8px] leading-[56px] font-bold ${
                  productEmerge ? "mx-auto" : ""
                }`
              : `mt-3 max-w-[800px] text-[60px] leading-[64px] font-bold ${productEmerge ? "mx-auto" : ""}`
          }
        >
          {hasHighlight ? (
            <>
              {beforeHighlight}
              <HeroHighlight>{highlightPhrase}</HeroHighlight>
              {afterHighlight}
            </>
          ) : (
            title
          )}
        </h1>
        {agentPrompt?.prefix && agentPrompt.phrases && (
          <HeroAgentPrompt prefix={agentPrompt.prefix} phrases={agentPrompt.phrases} />
        )}
        {subtitle && (
          <p
            className={`mt-5 max-w-[640px] ${productEmerge ? "mx-auto" : ""} ${
              dark
                ? "text-white text-[32px] leading-[48px] font-normal"
                : "oc-body-lg text-oc-neutral-dark"
            }`}
          >
            {subtitle}
          </p>
        )}
        {ctas.length > 0 && (
          <div className={`mt-8 flex flex-wrap gap-4 ${productEmerge ? "justify-center" : ""}`}>
            {ctas.map((cta) => {
              const variant = cta.variant ?? "primary";

              return dark && variant === "primary" ? (
                <Link
                  key={cta.label}
                  href={safeHref(cta.href)}
                  className="rounded-oc-button bg-oc-yellow-cta px-[18px] py-3 text-[14px] font-semibold text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover active:bg-oc-yellow-press"
                >
                  {cta.label}
                </Link>
              ) : dark && variant === "ghost" ? (
                <Link
                  key={cta.label}
                  href={safeHref(cta.href)}
                  className="oc-button-label rounded-oc-button px-6 py-3 text-white transition-colors duration-150 ease-oc hover:bg-white/10 active:bg-white/20"
                >
                  {cta.label}
                </Link>
              ) : (
                <Link
                  key={cta.label}
                  href={safeHref(cta.href)}
                  className={`oc-button-label rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc ${CTA_CLASS[variant]}`}
                >
                  {cta.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
      {productEmerge && backgroundMedia && (
        <div className="relative h-[42vh] min-h-[320px] overflow-hidden rounded-t-oc-panel shadow-oc-lg">
          <HeroBackgroundMedia media={backgroundMedia} />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-oc-dark/80 via-oc-dark/10 to-transparent" />
        </div>
      )}
    </section>
  );
}
