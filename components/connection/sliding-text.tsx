import Image from "next/image";

// Seção sliding text do template Daevnt (node 198:644) — marquee animado
// com o logo oficial do OmniChat Connection (loop infinito via CSS,
// keyframes em app/connection/connection.css).
const REPEATS = [0, 1, 2, 3] as const;

function MarqueeGroup({ ariaHidden }: { ariaHidden?: boolean }) {
  return (
    <div
      className="flex shrink-0 items-center gap-[clamp(30px,3.5vw,66px)] pr-[clamp(30px,3.5vw,66px)]"
      aria-hidden={ariaHidden}
    >
      {REPEATS.map((i) => (
        <div key={i} className="flex shrink-0 items-center gap-[clamp(30px,3.5vw,66px)]">
          <Image
            src="/connection/connection-logo-negative.svg"
            alt={ariaHidden || i > 0 ? "" : "OmniChat Connection"}
            width={1280}
            height={194}
            className="h-[clamp(36px,4.5vw,86px)] w-auto max-w-none"
            data-node-id="111:221"
          />
          <Image
            src="/connection/sliding-text-divider.svg"
            alt=""
            width={25}
            height={25}
            className="size-[clamp(14px,1.3vw,25px)] shrink-0"
            data-node-id="111:220"
          />
        </div>
      ))}
    </div>
  );
}

export function ConnectionSlidingText() {
  return (
    <section
      className="relative flex h-[140px] w-full items-center overflow-hidden sm:h-[200px] lg:h-[300px]"
      data-node-id="198:644"
    >
      <div className="connection-marquee-track flex w-max items-center">
        <MarqueeGroup />
        <MarqueeGroup ariaHidden />
      </div>
    </section>
  );
}
