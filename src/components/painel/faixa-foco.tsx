import Link from "next/link";
import { ArrowRight, PlayCircle } from "lucide-react";
import type { PainelData } from "@/lib/data/types";
import { SimboloVeritas } from "@/components/brand/logo";
import { Barra } from "@/components/ui/progress";
import { InicioRapido } from "./estudo/inicio-rapido";

/** Faixa de foco: retomar a última aula ou começar uma sessão nova — a decisão mais frequente do dia. */
export function FaixaFoco({ continuar, sugestao }: { continuar: PainelData["continuar"]; sugestao?: string | null }) {
  return (
    <section className="sobre-tinta relative isolate overflow-hidden rounded-xl bg-veritas-tinta text-white">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_100%_0%,rgba(184,147,90,.18),transparent_55%)]" aria-hidden />
      <SimboloVeritas className="pointer-events-none absolute -right-10 -top-6 -z-10 h-56 w-56 opacity-[.07]" cor="ouro" />
      <div className="grid lg:grid-cols-[1fr_1.35fr]">
        <div className="border-b border-white/10 p-5 sm:p-6 lg:border-b-0 lg:border-r">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-veritas-ouro">Continuar de onde parei</p>
          {continuar ? (
            <>
              <p className="mt-2 text-[1.0625rem] font-semibold leading-snug">{continuar.titulo}</p>
              <p className="mt-1 text-[0.8125rem] text-slate-300">{continuar.subtitulo}</p>
              <div className="mt-4 flex items-center gap-3">
                <Barra valor={continuar.progresso} rotulo="Progresso da aula" className="h-1.5 bg-white/15" cor="#D8B478" />
                <span className="num text-xs font-semibold text-slate-200">{Math.round(continuar.progresso * 100)}%</span>
              </div>
              <Link href={continuar.href} className="mt-5 inline-flex h-9 items-center gap-2 rounded-lg bg-white px-3.5 text-[0.8125rem] font-semibold text-veritas-tinta transition hover:bg-slate-100">
                <PlayCircle className="h-4 w-4" /> Retomar aula
              </Link>
            </>
          ) : (
            <Link href="/cursos" className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-veritas-ouro hover:underline">Escolher um curso <ArrowRight className="h-4 w-4" /></Link>
          )}
        </div>
        <div className="p-5 sm:p-6">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-veritas-ouro">Começar uma sessão</p>
          <p className="mb-4 mt-2 text-[0.8125rem] text-slate-300">Escolha a matéria e o conteúdo; o cronômetro Pomodoro abre pronto e registra o tempo líquido.</p>
          <InicioRapido sugestao={sugestao} />
        </div>
      </div>
    </section>
  );
}
