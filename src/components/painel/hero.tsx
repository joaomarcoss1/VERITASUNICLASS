import { CalendarDays, Crown, Flame } from "lucide-react";
import { FundoVeritas } from "@/components/brand/fundo";
import { SimboloVeritas } from "@/components/brand/logo";
import { Contador } from "@/components/ui/progress";

/** Faixa de abertura do painel: saudação institucional sobre tinta, com símbolo e órbitas. */
export function HeroPainel({ saudacao, nome, nivel, dias, streak, proximo }: { saudacao: string; nome: string; nivel: string; dias: number | null; streak: number; proximo: string | null }) {
  return (
    <section className="sobre-tinta relative isolate overflow-hidden rounded-[1.5rem] border border-veritas-ouro/25 px-6 py-7 text-veritas-pergaminho  sm:px-9 sm:py-9">
      <FundoVeritas variante="institucional" fixo={false} gravura={false} className="-z-10" />
      {/* Símbolo gravado dentro de anéis de selo */}
      <div className="pointer-events-none absolute -right-10 top-1/2 hidden h-72 w-72 -translate-y-1/2 sm:block" aria-hidden>
        <div className="absolute inset-0 rounded-full border border-veritas-ouro/20" />
        <div className="absolute inset-[6px] rounded-full border border-veritas-ouro/15" />
        <div className="absolute inset-0 grid place-items-center">
          <SimboloVeritas className="h-24 w-24 opacity-90" cor="ouro" />
        </div>
      </div>

      <div className="relative max-w-xl">
        <p className="mb-2 inline-flex items-center gap-2 rounded-full border border-veritas-ouro/30 bg-veritas-ouro/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-veritas-ouro">
          <Crown className="h-3.5 w-3.5" /> {nivel}
        </p>
        <h1 className="titulo-institucional text-4xl leading-tight text-veritas-pergaminho sm:text-5xl">
          {saudacao}, <span className="texto-ouro">{nome}</span>.
        </h1>
        <p className="mt-2 text-sm text-veritas-pergaminho/70">Sua missão de hoje está pronta. Um passo de cada vez.</p>
        <div className="mt-6 flex flex-wrap gap-3">
          {dias != null && (
            <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3.5 py-2 text-sm">
              <CalendarDays className="h-4 w-4 text-veritas-ouro" />
              <Contador valor={dias} className="font-semibold text-veritas-pergaminho" /> <span className="text-veritas-pergaminho/70">dias até a prova</span>
            </span>
          )}
          <span className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[.05] px-3.5 py-2 text-sm">
            <Flame className="h-4 w-4 text-veritas-ouro" />
            <Contador valor={streak} className="font-semibold text-veritas-pergaminho" /> <span className="text-veritas-pergaminho/70">dias seguidos</span>
          </span>
          {proximo && <span className="inline-flex items-center gap-2 rounded-xl px-1 py-2 text-xs text-veritas-pergaminho/60">Próximo nível: <strong className="text-veritas-ouro">{proximo}</strong></span>}
        </div>
      </div>
    </section>
  );
}
