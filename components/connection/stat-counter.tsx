"use client";

import { useEffect, useRef, useState } from "react";

// Cor do contador: começa num amarelo fraco e termina no amarelo Omni
// (--lp-accent #ffbc00) conforme a animação de contagem avança.
const COLOR_WEAK = [255, 238, 192] as const; // amarelo fraco
const COLOR_FULL = [255, 188, 0] as const; // oc-yellow-600 (--lp-accent)

function lerpColor(progress: number): string {
  const channel = (i: number) => Math.round(COLOR_WEAK[i] + (COLOR_FULL[i] - COLOR_WEAK[i]) * progress);
  return `rgb(${channel(0)}, ${channel(1)}, ${channel(2)})`;
}

// Contador animado (count-up) disparado quando o elemento entra na viewport.
// Respeita prefers-reduced-motion (mostra o valor final direto).
export function StatCounter({
  value,
  prefix = "",
  suffix = "",
  smallSuffix,
  duration = 2200,
  className,
  smallClassName,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  smallSuffix?: string;
  duration?: number;
  className?: string;
  smallClassName?: string;
}) {
  const ref = useRef<HTMLParagraphElement>(null);
  const [display, setDisplay] = useState(0);
  const [progress, setProgress] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        if (reducedMotion) {
          setDisplay(value);
          setProgress(1);
          return;
        }

        const t0 = performance.now();
        const tick = (t: number) => {
          const p = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
          setDisplay(Math.round(eased * value));
          setProgress(eased);
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [value, duration]);

  return (
    <p ref={ref} className={className} style={{ color: lerpColor(progress) }}>
      {prefix}
      {display.toLocaleString("pt-BR")}
      {suffix}
      {smallSuffix ? <span className={smallClassName}>{smallSuffix}</span> : null}
    </p>
  );
}
