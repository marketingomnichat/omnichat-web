import Link from "next/link";

export function CircularCallout() {
  return (
    <section className="relative h-[760px] overflow-hidden bg-white">
      <div className="absolute left-1/2 top-1/2 size-[1040px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-oc-yellow-cta/35" />
      <div className="absolute left-1/2 top-1/2 size-[940px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-oc-yellow-cta/55" />
      <div className="absolute left-1/2 top-1/2 size-[860px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-oc-yellow-mass/30 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 flex size-[690px] -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full bg-white/90 px-12 text-center backdrop-blur-sm">
        <h2 className="text-[47px] leading-[60px] font-black text-oc-yellow-ink">Conecte times e vendas</h2>
        <p className="mt-4 max-w-[560px] text-[20px] leading-[27px] font-bold text-oc-ink">Elimine ferramentas dispersas. Una marketing, vendas e relacionamento em uma jornada no WhatsApp.</p>
        <Link href="#formulario" className="mt-9 inline-flex h-[63px] w-full max-w-[341px] items-center justify-center rounded-xl bg-oc-yellow-cta text-[20px] font-bold text-oc-ink shadow-oc-md hover:bg-oc-yellow-hover">Agendar demo</Link>
        <p className="mt-4 text-[14px] leading-[22px] text-oc-ink-muted">API Meta oficial. IA com profundidade de negócio.<br />Mais de 500 marcas já conectadas.</p>
      </div>
    </section>
  );
}

export function DarkPotentialCallout() {
  return (
    <section className="relative min-h-[700px] overflow-hidden bg-oc-dark text-white">
      <div className="absolute -left-[15%] top-1/2 size-[680px] -translate-y-1/2 rounded-full bg-oc-yellow-cta/15 blur-[100px]" />
      <div className="absolute -right-[15%] top-1/2 size-[680px] -translate-y-1/2 rounded-full bg-oc-yellow-mass/10 blur-[100px]" />
      <div className="absolute left-1/2 top-1/2 size-[970px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/10" />
      <div className="absolute left-1/2 top-1/2 size-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-oc-yellow-mass/20" />
      <div className="relative mx-auto flex min-h-[700px] max-w-[760px] flex-col items-center justify-center px-6 text-center">
        <h2 className="text-[47px] leading-[60px] font-black text-white">Pronto para liberar o potencial de vendas do seu time?</h2>
        <div className="mt-9 flex flex-col gap-4 sm:flex-row">
          <Link href="#formulario" className="inline-flex h-[63px] min-w-[276px] items-center justify-center rounded-[14px] bg-white px-8 text-[18px] font-extrabold text-oc-ink shadow-oc-md hover:bg-oc-surface-alt">Sim, quero avançar</Link>
          <Link href="/planos" className="inline-flex h-[63px] min-w-[228px] items-center justify-center rounded-xl border border-white/70 bg-white/10 px-8 text-[18px] font-medium text-white hover:bg-white/15">Ver mais</Link>
        </div>
        <p className="mt-6 text-[18px] leading-[29px] text-oc-neutral">Jornada completa no WhatsApp.<br /><span className="text-oc-yellow-mass">IA que conhece seu negócio.</span></p>
      </div>
    </section>
  );
}