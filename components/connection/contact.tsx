import Image from "next/image";

export function ConnectionContact() {
  return (
    <section id="patrocinio" className="relative flex w-full scroll-mt-[100px] flex-col lg:min-h-[780.42px] lg:flex-row" data-node-id="198:640" data-name="contact">
      {/* imagem — atendimento OmniChat */}
      <div
        className="relative h-[280px] w-full overflow-hidden sm:h-[380px] lg:h-auto lg:w-[49.2%] lg:self-stretch"
        data-node-id="198:642"
        data-name="map"
      >
        <Image
          src="/connection/omnichat-support.png"
          alt="Atendimento OmniChat"
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover"
        />
      </div>

      {/* formulário */}
      <div className="w-full px-5 py-12 sm:px-8 lg:w-[50.8%] lg:px-[60px] lg:py-[91.62px] 2xl:pl-[113px] 2xl:pr-[300px]" data-node-id="7883:5" data-name="countdown">
        <h2
          className="text-[clamp(30px,2.6vw,50px)] font-normal leading-none text-(--lp-white)"
          data-node-id="7883:29"
        >
          Patrocine o Connection 2026
        </h2>
        <p
          className="mt-4 max-w-[562px] text-[18px] font-normal leading-[1.5] text-(--lp-white) lg:mt-[30px] lg:text-[20px]"
          data-node-id="7883:30"
        >
          Espaço disponível para marcas que definem esse mercado. Fale com nosso time.
        </p>

        <form className="mt-8 grid max-w-[562px] grid-cols-1 gap-[20px] sm:grid-cols-2 lg:mt-[50px]" data-node-id="7883:10" data-name="all fields">
          <input
            type="text"
            placeholder="Seu nome..."
            className="h-[60px] w-full rounded-[8px] border border-solid border-(--lp-accent) bg-transparent px-[20px] text-[16px] font-normal leading-[1.1] text-(--lp-white) placeholder:text-(--lp-white) focus:outline-none"
            data-node-id="7883:23"
          />
          <input
            type="text"
            placeholder="Sua empresa..."
            className="h-[60px] w-full rounded-[8px] border border-solid border-white/20 bg-transparent px-[20px] text-[16px] font-normal leading-[1.1] text-(--lp-white) placeholder:text-(--lp-white) focus:outline-none"
            data-node-id="7883:26"
          />
          <input
            type="email"
            placeholder="Seu e-mail corporativo..."
            className="h-[60px] w-full rounded-[8px] border border-solid border-white/20 bg-transparent px-[20px] text-[16px] font-normal leading-[1.1] text-(--lp-white) placeholder:text-(--lp-white) focus:outline-none"
            data-node-id="7883:14"
          />
          <input
            type="tel"
            placeholder="Seu telefone..."
            className="h-[60px] w-full rounded-[8px] border border-solid border-white/20 bg-transparent px-[20px] text-[16px] font-normal leading-[1.1] text-(--lp-white) placeholder:text-(--lp-white) focus:outline-none"
            data-node-id="7883:11"
          />

          <div className="relative h-[60px] w-full sm:col-span-2" data-node-id="7883:17" data-name="fields">
            <select
              className="size-full appearance-none rounded-[8px] border border-solid border-white/20 bg-transparent px-[20px] text-[16px] font-normal leading-[1.1] text-(--lp-white) focus:outline-none"
              defaultValue=""
              aria-label="Interesse de patrocínio"
            >
              <option value="" disabled className="text-(--lp-ink)">
                Interesse de patrocínio
              </option>
              <option value="patrocinio" className="text-(--lp-ink)">
                Quero patrocinar o evento
              </option>
              <option value="apoio" className="text-(--lp-ink)">
                Quero ser apoiador
              </option>
            </select>
            <Image
              src="/connection/contact-down-arrow.svg"
              alt=""
              width={19.879}
              height={11.265}
              className="pointer-events-none absolute right-[19.88px] top-[24.37px]"
              data-node-id="7883:32"
            />
          </div>

          <textarea
            placeholder="Conte sobre sua marca e objetivo no evento..."
            className="h-[100px] w-full resize-none rounded-[8px] border border-solid border-white/20 bg-transparent px-[20px] py-[16px] text-[16px] font-normal leading-[1.1] text-(--lp-white) placeholder:text-(--lp-white) focus:outline-none sm:col-span-2"
            data-node-id="7883:20"
          />

          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center rounded-[8px] bg-(--lp-white) px-[40px] py-[22px] sm:col-span-2 lg:mt-[25px]"
            data-node-id="7883:8"
            data-name="btn"
          >
            <span className="whitespace-nowrap text-[16px] font-bold leading-[1.1] text-(--lp-ink)">
              ENVIAR MENSAGEM
            </span>
          </button>
        </form>
      </div>
    </section>
  );
}
