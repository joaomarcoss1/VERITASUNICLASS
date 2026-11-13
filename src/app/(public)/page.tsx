import Link from "next/link";
import { ArrowRight, CalendarCheck2, Gauge, Target } from "lucide-react";
import { LogoUniClass } from "@/components/brand/logo";
import { FundoVeritas, EstrelaVeritas } from "@/components/brand/fundo";
import { SeloUniClass } from "@/components/brand/selo";
import { botaoClasses } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="sobre-tinta relative isolate min-h-dvh overflow-hidden text-veritas-pergaminho">
      <FundoVeritas variante="institucional" />
      <header className="relative mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <LogoUniClass invertido />
        <Link href="/login" className="group inline-flex items-center gap-1.5 rounded-full border border-veritas-ouro/30 px-4 py-2 text-sm font-semibold text-veritas-ouro transition hover:bg-veritas-ouro/10">
          Entrar <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
        </Link>
      </header>
      <main className="relative mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-8 md:grid-cols-[1.2fr_1fr] md:pt-16">
        <div className="escalonado">
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-veritas-ouro/30 bg-veritas-ouro/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-veritas-ouro">
            <EstrelaVeritas className="h-3 w-3 animate-cintila" /> Academia Veritas UniClass
          </p>
          <h1 className="titulo-institucional text-[2.6rem] leading-[1.05] text-veritas-pergaminho sm:text-7xl">
            Todo dia, um passo<br />mais perto da <span className="texto-ouro">aprovação</span>.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-veritas-pergaminho/75 sm:text-lg">
            Rotina que se reajusta sozinha, questões comentadas por professores e um termômetro honesto de onde você está — em menos de 5 segundos por dia.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/cadastro" className={botaoClasses("ouro", "h-12 px-7 text-base")}>Começar grátis <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/login" className={botaoClasses("fantasma", "h-12 px-6 text-base text-veritas-pergaminho hover:bg-white/10")}>Já sou aluno</Link>
          </div>
          <ul className="escalonado mt-14 grid gap-4 sm:grid-cols-3">
            {[
              { i: Target, t: "Missão do dia", d: "O que estudar hoje, no tempo que você tem." },
              { i: Gauge, t: "Onde você erra", d: "Domínio por assunto, não só % de acerto." },
              { i: CalendarCheck2, t: "Hábito", d: "Sequência, escudos e metas realistas." },
            ].map(({ i: Icon, t, d }) => (
              <li key={t} className="group reflexo rounded-2xl border border-white/10 bg-white/[.04] p-5 backdrop-blur transition duration-300 ease-premium hover:-translate-y-1 hover:border-veritas-ouro/40 hover:bg-white/[.07]">
                <span className="mb-3 grid h-10 w-10 place-items-center rounded-xl bg-veritas-ouro/15 ring-1 ring-veritas-ouro/30 transition group-hover:scale-110"><Icon className="h-5 w-5 text-veritas-ouro" /></span>
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-sm text-veritas-pergaminho/65">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative hidden place-items-center md:grid">
          <div className="absolute h-[30rem] w-[30rem] animate-gira-medio rounded-full border border-dashed border-veritas-ouro/20" />
          <div className="absolute h-[23rem] w-[23rem] animate-gira-reverso rounded-full border border-veritas-ouro/15">
            <EstrelaVeritas className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 text-veritas-ouro" />
          </div>
          <div className="absolute h-64 w-64 animate-respira rounded-full bg-veritas-ouro/25 blur-3xl" />
          <div className="animate-flutua"><SeloUniClass className="w-72 drop-shadow-[0_40px_50px_rgba(0,0,0,.5)]" /></div>
        </div>
      </main>
      <footer className="relative border-t border-white/10 py-6 text-center text-xs text-veritas-pergaminho/55">
        Veritas Group — Conteúdo de valor. Conhecimento de verdade. · Cursos livres, nos termos da legislação vigente.
      </footer>
    </div>
  );
}
