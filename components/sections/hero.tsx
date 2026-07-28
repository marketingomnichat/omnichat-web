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
}: {
  overline?: string;
  title: string;
  highlightPhrase?: string;
  agentPrompt?: { prefix?: string; phrases?: string[] };
  subtitle?: string;
  ctas?: Cta[];
  theme?: "light" | "dark";
  backgroundMedia?: BackgroundMedia;
}) {
  const dark = theme === "dark";
  const highlightIndex = highlightPhrase ? title.indexOf(highlightPhrase) : -1;
  const hasHighlight = highlightIndex >= 0 && highlightPhrase;
  const beforeHighlight = hasHighlight ? title.slice(0, highlightIndex) : title;
  const afterHighlight = hasHighlight ? title.slice(highlightIndex + highlightPhrase.length) : "";

  return (
    <section className={`relative overflow-hidden ${dark ? "bg-black" : "bg-white"}`}>
      {backgroundMedia && <HeroBackgroundMedia media={backgroundMedia} />}
      <div className="relative z-10 mx-auto max-w-oc-container px-6 py-oc-hero">
        {overline && (
          <p className={`oc-overline ${dark ? "text-oc-yellow-mass" : "text-oc-yellow-ink"}`}>{overline}</p>
        )}
        <h1
          className={
            dark
              ? "oc-h1 mt-3 max-w-[800px] text-white text-[44.8px] leading-[56px] font-bold"
              : "mt-3 max-w-[800px] text-[60px] leading-[64px] font-bold"
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
            className={`mt-5 max-w-[640px] ${
              dark
                ? "text-white text-[32px] leading-[48px] font-normal"
                : "oc-body-lg text-oc-neutral-dark"
            }`}
          >
            {subtitle}
          </p>
        )}
        {ctas.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-4">
            {ctas.map((cta) =>
              dark && (cta.variant ?? "primary") === "primary" ? (
                <Link
                  key={cta.label}
                  href={safeHref(cta.href)}
                  className="rounded-oc-button bg-oc-yellow-cta px-[18px] py-3 text-[14px] font-semibold text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-yellow-hover active:bg-oc-yellow-press"
                >
                  {cta.label}
                </Link>
              ) : (
                <Link
                  key={cta.label}
                  href={safeHref(cta.href)}
                  className={`oc-button-label rounded-oc-button px-6 py-3 transition-colors duration-150 ease-oc ${CTA_CLASS[cta.variant ?? "primary"]}`}
                >
                  {cta.label}
                </Link>
              )
            )}
          </div>
        )}
      </div>
    </section>
  );
}
