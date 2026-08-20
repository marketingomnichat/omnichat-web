"use client";

import { useEffect } from "react";

// Anima a entrada de todas as seções da página (fade + translate) e dispara
// o itálico dos textos marcados com .lp-italic (via CSS em connection.css).
// O atributo data-reveal só é adicionado com JS ativo — sem JS nada fica oculto.
export function ConnectionScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>(".connection-main > section, .connection-main > footer"),
    );

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-reveal", "in");
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );

    for (const [index, section] of sections.entries()) {
      // O hero permanece visível de imediato (LCP), mas ativa o itálico.
      if (index === 0) {
        section.setAttribute("data-reveal", "in");
        continue;
      }
      section.setAttribute("data-reveal", "");
      observer.observe(section);
    }

    return () => observer.disconnect();
  }, []);

  return null;
}
