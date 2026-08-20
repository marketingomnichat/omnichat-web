import Image from "next/image";
import { ConnectionHeroVideoGuard } from "@/components/connection/hero-video-guard";

// Seção hero do template Daevnt (node 44:18) — layout fluido responsivo.
// Em 2xl (~1920px) reproduz o design original do Figma; abaixo disso o
// conteúdo reflui com tipografia fluida (clamp) e grid/flex.
export function ConnectionHero() {
  return (
    <section
      className="relative flex min-h-[92svh] w-full flex-col overflow-hidden lg:min-h-[860px] 2xl:min-h-[1075.932px]"
      data-node-id="44:18"
    >
      {/* Vídeo de fundo — YouTube em loop, cobre o hero até o topo */}
      <div className="absolute inset-0 overflow-hidden bg-[#0b0c0e]" data-node-id="31:26">
        <iframe
          id="connection-hero-video"
          src="https://www.youtube.com/embed/LE7YP3giK0A?autoplay=1&mute=1&loop=1&playlist=LE7YP3giK0A&controls=0&rel=0&modestbranding=1&playsinline=1&disablekb=1&enablejsapi=1"
          title="Vídeo do OmniChat Connection"
          allow="autoplay; encrypted-media; picture-in-picture"
          tabIndex={-1}
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[56.25vw] min-h-full w-screen min-w-[177.78vh] -translate-x-1/2 -translate-y-1/2 border-0"
        />
        <ConnectionHeroVideoGuard iframeId="connection-hero-video" />
        {/* Scrim para legibilidade do conteúdo sobre o vídeo */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-black/60" />
        {/* Gradiente roxo → transparente do canto inferior esquerdo, dando visibilidade ao logotipo */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(83,38,115,0.9)_0%,rgba(83,38,115,0.45)_28%,transparent_62%)]" />
      </div>

      {/* Header translúcido sobre o vídeo */}
      <header className="absolute inset-x-0 top-0 z-20 border-b border-solid border-white/10 bg-black/25 backdrop-blur-md">
        <div className="mx-auto flex h-[72px] w-full max-w-[1920px] items-center justify-between gap-4 px-5 sm:px-8 lg:h-[100px] lg:px-[60px] 2xl:px-[100px]">
          <nav
            className="hidden items-center gap-[30px] whitespace-nowrap text-[16px] font-bold text-white lg:flex 2xl:gap-[50px] 2xl:text-[18px]"
            data-node-id="14:81"
          >
            <a href="#">Palestrantes</a>
            <a href="#">Trilhas</a>
            <a href="#">Programação</a>
            <a href="#ingresso">Ingresso</a>
            <a href="#faq">FAQ</a>
          </nav>

          <div className="flex items-center gap-3 lg:gap-4">
            <a href="#patrocinio" className="lp-btn lp-btn-secondary" data-node-id="26:15">
              Quero patrocinar
            </a>
            <a href="#ingresso" className="lp-btn lp-btn-primary hidden sm:inline-flex" data-node-id="26:14">
              Garantir ingresso
            </a>
          </div>
        </div>
      </header>

      {/* Conteúdo principal */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1920px] flex-1 flex-col justify-end px-5 pb-10 pt-[100px] sm:px-8 lg:px-[60px] lg:pb-[60px] lg:pt-[130px] 2xl:px-[100px]">
        {/* Texto decorativo UPCOMING — atrás do bloco do palestrante */}
        <p
          className="pointer-events-none absolute bottom-[220px] left-[210.29px] hidden whitespace-nowrap text-[80px] font-black tracking-[-0.02em] leading-none text-transparent opacity-15 [-webkit-text-stroke:1px_white] 2xl:block"
          data-node-id="44:17"
        >
          UPCOMING
        </p>

        <h1 className="max-w-[946.808px]" data-node-id="32:27">
          {/* Logotipo negativo (branco) — melhor leitura sobre o vídeo */}
          <Image
            src="/connection/connection-logo-negative.svg"
            alt="OmniChat Connection"
            width={1280}
            height={194}
            priority
            className="h-auto w-full"
          />
          <span className="sr-only">OmniChat Connection</span>
        </h1>

        {/* Local, data (BRT) e CTA */}
        <div className="mt-10 flex flex-wrap items-center gap-x-14 gap-y-7 lg:mt-[50px]">
          <div data-node-id="41:42">
            <p className="text-[12px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-white/70">Local</p>
            <p className="mt-2 text-[16px] font-bold leading-[1.3] text-white lg:text-[18px]">
              Welluci Gardens · Av. Queiroz Filho, 830, São Paulo
            </p>
          </div>
          <div data-node-id="41:43">
            <p className="text-[12px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-white/70">
              Data e horário
            </p>
            <p className="mt-2 text-[16px] font-bold leading-[1.3] text-white lg:text-[18px]">
              17 de setembro de 2026 · 09h–21h (BRT)
            </p>
          </div>
          <a href="#ingresso" className="lp-btn lp-btn-accent lp-btn-lg" data-node-id="44:11">
            Garanta sua vaga
          </a>
        </div>
      </div>
    </section>
  );
}
