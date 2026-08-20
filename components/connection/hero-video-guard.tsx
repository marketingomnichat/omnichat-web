"use client";

import { useEffect } from "react";

type YTPlayer = {
  playVideo: () => void;
  mute: () => void;
  destroy?: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    options: {
      events: {
        onReady?: (event: { target: YTPlayer }) => void;
        onStateChange?: (event: { data: number; target: YTPlayer }) => void;
      };
    },
  ) => YTPlayer;
  PlayerState: { PAUSED: number; ENDED: number };
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// Garante que o vídeo de fundo do hero nunca fique pausado: conecta a API do
// YouTube ao iframe existente (enablejsapi=1) e dá play sempre que o estado
// mudar para PAUSED/ENDED.
export function ConnectionHeroVideoGuard({ iframeId }: { iframeId: string }) {
  useEffect(() => {
    let player: YTPlayer | undefined;
    let cancelled = false;

    const attach = () => {
      if (cancelled || !window.YT?.Player || !document.getElementById(iframeId)) return;
      player = new window.YT.Player(iframeId, {
        events: {
          onReady: (event) => {
            event.target.mute();
            event.target.playVideo();
          },
          onStateChange: (event) => {
            const state = window.YT?.PlayerState;
            if (state && (event.data === state.PAUSED || event.data === state.ENDED)) {
              event.target.playVideo();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      attach();
    } else {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        attach();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    }

    return () => {
      cancelled = true;
      player?.destroy?.();
    };
  }, [iframeId]);

  return null;
}
