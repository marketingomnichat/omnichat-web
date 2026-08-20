import Image from "next/image";

// Seção de palestrantes no template do banner oficial (OmniChat Banner from Juliana):
// grafismos de balões nas laterais da página, palestrantes entrando com animação
// escalonada (foto PNG + nome/cargo aparecendo na sequência).
type CompanyLogo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  className: string;
};

const SPEAKERS: readonly {
  nodeId: string;
  name: string;
  role: string;
  company: string | null;
  companyLogo: CompanyLogo | null;
  image: string;
  aspect: string;
}[] = [
  {
    nodeId: "198:649",
    name: "Ricardo Amorim",
    role: "Economista · Forbes Top 100 BR",
    company: "Ricam Consultoria",
    companyLogo: null,
    image: "/connection/speaker-ricardo-amorim.jpg",
    aspect: "aspect-[420/455]",
  },
  {
    nodeId: "198:650",
    name: "Ana Beatris Mori",
    role: "Gerente de parcerias",
    company: null,
    companyLogo: {
      src: "/connection/logo-google-negative.svg",
      width: 272,
      height: 92,
      alt: "Google",
      className: "h-[20px] w-auto",
    },
    image: "/connection/speaker-ana-beatris-mori.jpg",
    aspect: "aspect-[420/455]",
  },
  {
    nodeId: "198:651",
    name: "Carla Fiorito",
    role: "Mestre de Cerimônias",
    company: null,
    companyLogo: null,
    image: "/connection/speaker-carla-fiorito.jpg",
    aspect: "aspect-[420/455]",
  },
  {
    nodeId: "198:655",
    name: "Ênio Garbin",
    role: "Líder LATAM de Desenvolvimento de Negócios do Setor de Consumo",
    company: null,
    companyLogo: {
      src: "/connection/logo-amazon.svg",
      width: 603,
      height: 182,
      alt: "Amazon",
      className: "h-[20px] w-auto",
    },
    image: "/connection/speaker-enio-garbin.jpg",
    aspect: "aspect-[420/455]",
  },
  {
    nodeId: "198:652",
    name: "Maurício Trezub",
    role: "CEO & Fundador · Abertura e moderação",
    company: null,
    companyLogo: {
      src: "/connection/logo-omnichat-negative.svg",
      width: 1152,
      height: 450,
      alt: "OmniChat",
      className: "-ml-[8px] h-[37px] w-auto",
    },
    image: "/connection/speaker-mauricio-trezub.png",
    aspect: "aspect-[420/455]",
  },
] as const;

const STAGGER_STEP = 150;

export function ConnectionSpeakers() {
  return (
    <section className="relative w-full overflow-hidden py-16 lg:py-[120px]" data-node-id="198:645" data-name="speaker">
      <div className="relative mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-[60px] 2xl:px-[300px]">
        {/* Cabeçalho */}
        <div className="text-center" data-node-id="103:184">
          <p className="text-[14px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-(--lp-accent)">
            Palestrantes
          </p>
          <h2 className="mx-auto mt-5 max-w-[900px] text-[clamp(32px,3.8vw,60px)] font-black tracking-[-0.02em] leading-[1.08] text-(--lp-white) [text-wrap:balance]">
            O palco é de quem <span className="lp-italic text-(--lp-accent)">faz acontecer</span>
          </h2>
          <p className="mx-auto mt-6 max-w-[720px] text-[17px] font-bold leading-[1.5] text-(--lp-white) lg:text-[22px]">
            Três trilhas. Palestrantes de peso. Cases reais.{" "}
            <span className="lp-italic text-(--lp-accent)">Zero teoria vazia</span>.
          </p>
        </div>

        {/* Palestrantes — entrada escalonada */}
        <div className="mt-12 grid grid-cols-1 gap-x-[30px] gap-y-12 sm:grid-cols-2 lg:mt-[80px] lg:grid-cols-3 lg:gap-y-[60px]" data-node-id="198:653" data-name="all speakers">
          {SPEAKERS.map((speaker, i) => (
            <div
              key={speaker.nodeId}
              className="lp-stagger w-full max-w-[420px] justify-self-center"
              style={{ "--lp-stagger-delay": `${i * STAGGER_STEP}ms` } as React.CSSProperties}
              data-node-id={speaker.nodeId}
              data-name="speaker"
            >
              <div className={`relative w-full ${speaker.aspect} overflow-hidden rounded-[16px] bg-[#101116]`}>
                <Image
                  src={speaker.image}
                  alt={`Retrato de ${speaker.name}`}
                  fill
                  sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw"
                  className="object-cover object-top"
                />
              </div>
              <div
                className="lp-stagger"
                style={{ "--lp-stagger-delay": `${i * STAGGER_STEP + 250}ms` } as React.CSSProperties}
              >
                <div className="mt-6 flex items-center gap-[8px]">
                  <Image
                    src="/connection/speakbaloon-icon.svg"
                    alt=""
                    width={18}
                    height={18}
                    className="block size-[18px]"
                    data-name="dot"
                  />
                  <p className="whitespace-nowrap text-[20px] font-bold leading-[1.1] text-(--lp-white) lg:text-[24px]">
                    {speaker.name}
                  </p>
                </div>
                <p className="mt-[10px] text-[16px] font-normal leading-[1.2] text-[#d4d4d4] lg:text-[18px]">
                  {speaker.role}
                </p>
                {speaker.companyLogo ? (
                  <div className="mt-[8px] flex items-center">
                    <Image
                      src={speaker.companyLogo.src}
                      alt={speaker.companyLogo.alt}
                      width={speaker.companyLogo.width}
                      height={speaker.companyLogo.height}
                      className={speaker.companyLogo.className}
                    />
                  </div>
                ) : speaker.company ? (
                  <p className="mt-[6px] text-[14px] font-bold tracking-[0.08em] uppercase leading-[1.2] text-(--lp-white)">
                    {speaker.company}
                  </p>
                ) : null}
              </div>
            </div>
          ))}

          {/* Próximo palestrante a confirmar */}
          <div
            className="lp-stagger w-full max-w-[420px] justify-self-center"
            style={{ "--lp-stagger-delay": `${SPEAKERS.length * STAGGER_STEP}ms` } as React.CSSProperties}
            aria-label="Próximo palestrante a confirmar"
            data-name="speaker tbd"
          >
            <div className="relative flex aspect-[420/455] w-full items-center justify-center overflow-hidden rounded-[16px] bg-[#d9d9d9]/10">
              <p className="text-[clamp(40px,4.2vw,80px)] font-black tracking-[-0.02em] leading-none text-transparent opacity-40 [-webkit-text-stroke:1px_var(--lp-accent)]">
                ?
              </p>
            </div>
            <div className="mt-6 flex items-center gap-[8px]">
              <Image
                src="/connection/speakbaloon-icon.svg"
                alt=""
                width={18}
                height={18}
                className="block size-[18px]"
                data-name="dot"
              />
              <p className="whitespace-nowrap text-[20px] font-bold leading-[1.1] text-(--lp-white) lg:text-[24px]">
                Mais em breve
              </p>
            </div>
            <p className="mt-[10px] text-[16px] font-normal leading-[1.2] text-[#d4d4d4] lg:text-[18px]">
              Acompanhe as atualizações
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
