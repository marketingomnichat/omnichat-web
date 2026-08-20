import Image from "next/image";

const USEFUL_LINKS = [
  { nodeId: "77:126", label: "Palestrantes", active: false },
  { nodeId: "77:127", label: "Programação", active: true },
  { nodeId: "77:128", label: "Trilhas", active: false },
  { nodeId: "77:129", label: "FAQ", active: false },
  { nodeId: "77:130", label: "Garantir ingresso", active: false },
] as const;

export function ConnectionFooter() {
  return (
    <footer className="relative w-full overflow-hidden" data-node-id="198:643" data-name="footer">
      {/* bg */}
      <div className="absolute inset-0" data-node-id="245:161" data-name="bg">
        <div className="absolute inset-0 bg-[#000006]" data-node-id="70:80" data-name="background" />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden opacity-25 mix-blend-hard-light"
          data-node-id="244:145"
          data-name="background"
        >
          <Image
            src="/connection/footer-bg.jpg"
            alt=""
            width={1920}
            height={640}
            className="absolute max-w-none"
            style={{
              left: "-16.19%",
              top: "-119.96%",
              width: "170.95%",
              height: "341.94%",
            }}
          />
          {/* Filtro de cor — roxo Whizz da OmniChat sobre o flare */}
          <div className="absolute inset-0 bg-(--lp-purple) mix-blend-color" />
        </div>
      </div>

      <div className="relative mx-auto grid w-full max-w-[1920px] grid-cols-1 gap-x-12 gap-y-12 px-5 pb-16 pt-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto_auto] lg:gap-x-[100px] lg:px-[60px] lg:pb-[100px] lg:pt-[152px] 2xl:gap-x-[190px] 2xl:px-[300px]">
        {/* about company + newsletter */}
        <div className="sm:col-span-2 lg:col-span-1" data-node-id="200:667" data-name="about company">
          <div className="flex items-center" data-node-id="245:159" data-name="logo">
            <Image
              src="/connection/logo-omnichat-negative.svg"
              alt="OmniChat"
              width={1152}
              height={450}
              className="-ml-[14px] h-[64px] w-auto lg:h-[76px]"
              data-node-id="200:675"
            />
          </div>
          <p
            className="mt-5 max-w-[400.97px] text-[16px] font-normal leading-[1.5] text-(--lp-white) [word-break:break-word] lg:text-[18px]"
            data-node-id="80:2"
          >
            Connection 2026: o primeiro evento proprietário da OmniChat aberto
            ao mercado. IA conversacional com execução que gera resultado.
          </p>

          {/* newsletter */}
          <form className="mt-8 max-w-[400px] lg:mt-[45px]" data-node-id="200:666" data-name="newsletter">
            <div className="flex items-center justify-between gap-4">
              <input
                type="email"
                placeholder="Receba as atualizações do evento"
                className="h-[42px] w-full min-w-0 bg-transparent text-[16px] font-normal leading-[1.1] text-(--lp-white) placeholder:text-(--lp-white) focus:outline-none"
                data-node-id="77:141"
              />
              <button type="submit" className="flex shrink-0 items-center" data-node-id="77:136" data-name="btn">
                <span className="whitespace-nowrap text-[16px] font-normal leading-[1.1] text-(--lp-white)">
                  Inscrever
                </span>
                <Image src="/connection/footer-subscribe-arrow.svg" alt="" width={20} height={20} data-node-id="77:138" />
              </button>
            </div>
            <div className="mt-[10px] h-px w-full bg-(--lp-accent) opacity-20" data-node-id="77:135" data-name="border" />
          </form>
        </div>

        {/* useful links */}
        <div data-node-id="200:668" data-name="useful links">
          <p className="whitespace-nowrap text-[20px] font-bold leading-[1.1] text-(--lp-white)" data-node-id="77:124">
            Links úteis
          </p>
          <div
            className="mt-6 flex flex-col items-start justify-center gap-[20px] text-[16px] font-normal leading-[1.1] lg:mt-[42px]"
            data-node-id="77:125"
            data-name="menu list"
          >
            {USEFUL_LINKS.map((link) => (
              <p
                key={link.nodeId}
                data-node-id={link.nodeId}
                className={
                  link.active
                    ? "whitespace-nowrap text-(--lp-white) underline [text-underline-position:from-font]"
                    : "whitespace-nowrap text-[#d4d4d4]"
                }
              >
                {link.label}
              </p>
            ))}
          </div>
        </div>

        {/* contact info */}
        <div data-node-id="299:191" data-name="contact info">
          <div data-node-id="299:192" data-name="address">
            <p className="whitespace-nowrap text-[20px] font-bold leading-[1.1] text-(--lp-white)" data-node-id="299:193">
              Local:
            </p>
            <p className="mt-3 max-w-[220px] text-[16px] font-normal leading-[1.25] text-[#d4d4d4] [word-break:break-word]" data-node-id="299:194">
              Welluci Gardens — Av. Queiroz Filho, 830, Vila Hamburguesa, São Paulo, SP
            </p>
          </div>
          <div className="mt-8 lg:mt-[35px]" data-node-id="299:195" data-name="phone">
            <p className="whitespace-nowrap text-[20px] font-normal leading-[1.1] text-[#d4d4d4]" data-node-id="299:196">
              Data:
            </p>
            <p className="mt-2 text-[20px] font-normal leading-[1.2] text-(--lp-white) lg:whitespace-nowrap lg:text-[24px]" data-node-id="299:197">
              17 de setembro de 2026 · 09h–21h
            </p>
          </div>
          <div className="mt-8 lg:mt-[35px]" data-node-id="299:198" data-name="email">
            <p className="whitespace-nowrap text-[20px] font-normal leading-[1.1] text-[#d4d4d4]" data-node-id="299:199">
              E-mail:
            </p>
            <p className="mt-2 whitespace-nowrap text-[20px] font-normal leading-[1.1] text-(--lp-white) underline [text-underline-position:from-font] lg:text-[24px]" data-node-id="299:200">
              marketing@omni.chat
            </p>
          </div>
        </div>
      </div>

      {/* copyright */}
      <div className="relative" data-node-id="200:669" data-name="copyright">
        <div className="h-px w-full bg-(--lp-accent) opacity-20" data-node-id="77:120" data-name="border" />
        <div className="mx-auto flex w-full max-w-[1920px] items-center px-5 py-8 sm:px-8 lg:px-[60px] lg:py-[30px] 2xl:px-[300px]">
          <p className="text-[14px] font-normal leading-[1.4] text-(--lp-white) sm:text-[16px] sm:leading-[1.1]" data-node-id="73:97">
            © 2026 OmniChat · Connection 2026 · Todos os direitos reservados
          </p>
        </div>
      </div>

      {/* to top */}
      <a
        href="#top"
        aria-label="Back to top"
        className="absolute bottom-[110px] right-5 hidden size-[56px] md:block lg:bottom-[65px] lg:right-[50px] lg:size-[70px]"
        data-node-id="244:149"
        data-name="to top"
      >
        <Image src="/connection/footer-to-top.svg" alt="" width={70} height={70} className="block size-full" />
      </a>
    </footer>
  );
}
