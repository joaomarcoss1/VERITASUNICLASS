import { BarChart3, CalendarCheck2, ShieldCheck } from "lucide-react";
import { LogoUniClass, SimboloVeritas } from "@/components/brand/logo";
import { FraseRotativa } from "./frase-rotativa";

/** Lado institucional do login: marca, proposta de valor e prova social — sem enfeites. */
export function PainelInstitucional() {
  return (
    <aside className="sobre-tinta relative isolate hidden flex-col justify-between overflow-hidden bg-veritas-tinta p-10 text-white lg:flex xl:p-14">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(90%_70%_at_100%_0%,rgba(184,147,90,.16),transparent_60%)]" aria-hidden />
      <SimboloVeritas className="pointer-events-none absolute -bottom-24 -right-24 -z-10 h-[30rem] w-[30rem] opacity-[.06]" cor="ouro" />
      <LogoUniClass invertido />
      <div className="max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-veritas-ouro">Academia Veritas UniClass</p>
        <h2 className="titulo-marca mt-4 text-[2.75rem] leading-[1.05] text-white">Estudo com método.<br />Aprovação com constância.</h2>
        <ul className="mt-8 space-y-4 text-sm text-slate-300">
          {[
            { i: CalendarCheck2, t: "Rotina que se ajusta ao seu tempo e ao edital-alvo" },
            { i: BarChart3, t: "Domínio por assunto, não só porcentagem de acerto" },
            { i: ShieldCheck, t: "Questões comentadas e revisadas por professores" },
          ].map(({ i: Icon, t }) => (
            <li key={t} className="flex items-start gap-3"><span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white/[.06] ring-1 ring-white/10"><Icon className="h-4 w-4 text-veritas-ouro" /></span><span className="pt-1">{t}</span></li>
          ))}
        </ul>
      </div>
      <div className="border-t border-white/10 pt-6"><FraseRotativa /></div>
    </aside>
  );
}
