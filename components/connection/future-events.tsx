import Image from "next/image";

const EVENTS = [
  {
    nodeId: "110:130",
    title: "Credenciamento e abertura oficial",
    location: "Welluci Gardens, Av. Queiroz Filho, 830, São Paulo",
    date: "17 set, 2026",
    time: "À confirmar",
  },
  {
    nodeId: "110:152",
    title: "Keynotes, cases e demos nas três trilhas",
    location: "Palco principal e centro de exposição",
    date: "17 set, 2026",
    time: "À confirmar",
  },
  {
    nodeId: "110:171",
    title: "Happy hour e mesas de networking",
    location: "Área de networking, Welluci Gardens",
    date: "17 set, 2026",
    time: "À confirmar",
  },
] as const;

export function ConnectionFutureEvents() {
  return (
    <section className="relative w-full pb-16 lg:pb-[150px]" data-node-id="198:648" data-name="future events">
      <div className="mx-auto w-full max-w-[1920px] px-5 sm:px-8 lg:px-[60px] 2xl:px-[300px]">
        {/* Cabeçalho */}
        <h2
          className="text-[clamp(40px,4.2vw,80px)] font-black tracking-[-0.02em] leading-none text-(--lp-white)"
          data-node-id="110:57"
        >
          Programação <span className="lp-italic">do dia</span>
        </h2>

        {/* Lista de eventos */}
        <div className="mt-10 lg:mt-[130px]" data-node-id="110:216" data-name="all events">
          {EVENTS.map((event) => (
            <div
              key={event.nodeId}
              className="grid grid-cols-1 items-center gap-x-10 gap-y-6 border-b border-white/[0.23] py-8 first:pt-0 md:grid-cols-[minmax(0,1fr)_auto] lg:gap-x-[54px] lg:py-[40px] lg:first:pt-0"
              data-node-id={event.nodeId}
              data-name="event item"
            >
              {/* title and location */}
              <div className="max-w-[560px]">
                <p className="text-[22px] font-bold leading-[1.1] text-(--lp-white) [word-break:break-word] lg:text-[27px]">
                  {event.title}
                </p>
                <p className="mt-4 max-w-[460px] text-(--lp-white) lg:mt-[26px]">
                  <span className="text-[17px] font-normal leading-[1.5] lg:text-[19px]">Local:</span>
                  <span className="text-[16px] font-normal leading-[1.5]"> {event.location}</span>
                </p>
              </div>

              {/* date & time */}
              <div className="lg:w-[180px]">
                <p className="whitespace-nowrap text-[16px] font-normal uppercase leading-[1.1] text-(--lp-white) opacity-80">
                  Data
                </p>
                <p className="mt-2 whitespace-nowrap text-[16px] font-normal leading-[1.1] text-(--lp-white)">
                  {event.date}
                </p>
                <p className="mt-5 whitespace-nowrap text-[16px] font-normal uppercase leading-[1.1] text-(--lp-white) opacity-80">
                  HORÁRIO
                </p>
                <div className="mt-2 flex items-center gap-[5px]">
                  <Image
                    src="/connection/future-events-dot.svg"
                    alt=""
                    width={10}
                    height={10}
                    className="block size-[10px]"
                    data-name="dot"
                  />
                  <p className="whitespace-nowrap text-[16px] font-normal leading-[1.1] text-(--lp-white)">
                    {event.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA único */}
        <div className="mt-12 flex justify-center lg:mt-[70px]">
          <a
            href="https://www.sympla.com.br/evento/omnichat-connection/3445039"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center rounded-[8px] bg-(--lp-accent) px-[40px] py-[22px]"
            data-name="btn"
          >
            <p className="whitespace-nowrap text-[16px] font-bold tracking-[0.08em] uppercase leading-[1.1] text-(--lp-ink-on-accent)">
              GARANTIR INGRESSO
            </p>
          </a>
        </div>
      </div>
    </section>
  );
}
