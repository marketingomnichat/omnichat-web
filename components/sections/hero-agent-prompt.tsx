"use client";

import { useEffect, useState } from "react";

type HeroAgentPromptProps = {
  prefix: string;
  phrases: string[];
};

export function HeroAgentPrompt({ prefix, phrases }: HeroAgentPromptProps) {
  const [activePhrase, setActivePhrase] = useState(0);
  const availablePhrases = phrases.filter(Boolean);

  useEffect(() => {
    if (availablePhrases.length < 2) return;

    const interval = window.setInterval(() => {
      setActivePhrase((current) => (current + 1) % availablePhrases.length);
    }, 3000);

    return () => window.clearInterval(interval);
  }, [availablePhrases.length]);

  if (!prefix || availablePhrases.length === 0) return null;

  return (
    <a
      href="#formulario"
      className="mt-6 inline-flex max-w-full rounded-oc-button bg-white px-4 py-3 text-left text-oc-ink transition-colors duration-150 ease-oc hover:bg-oc-surface-alt"
    >
      <span className="oc-body-sm font-bold">{prefix}</span>
      <span className="oc-body-sm ml-1">{availablePhrases[activePhrase]}</span>
    </a>
  );
}
