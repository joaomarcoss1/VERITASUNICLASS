import Link from "next/link";
import { CalendarCheck2, Gauge, Target } from "lucide-react";
import { LogoUniClass } from "@/components/brand/logo";
import { SeloUniClass } from "@/components/brand/selo";
import { botaoClasses } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-dvh bg-veritas-tinta text-veritas-pergaminho">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <LogoUniClass invertido />
        <Link href="/login" className="text-sm font-semibold text-veritas-ouro hover:underline">Entrar</Link>
      </header>
      <main className="textura-pergaminho mx-auto grid max-w-6xl items-center gap-10 px-5 pb-20 pt-10 md:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-veritas-ouro">Academia Veritas UniClass</p>
          <h1 className="titulo-institucional text-4xl leading-tight text-veritas-pergaminho sm:text-6xl">
            Todo dia, um passo<br />mais perto da aprovação.
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-veritas-pergaminho/80">
            Rotina que se reajusta sozinha, questões comentadas por professores e um termômetro honesto de onde você está — em menos de 5 segundos por dia.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/cadastro" className={botaoClasses("ouro", "h-12 px-6 text-base")}>Começar grátis</Link>
            <Link href="/login" className={botaoClasses("fantasma", "h-12 px-6 text-base text-veritas-pergaminho hover:bg-white/10")}>Já sou aluno</Link>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-3">
            {[
              { i: Target, t: "Missão do dia", d: "O que estudar hoje, no tempo que você tem." },
              { i: Gauge, t: "Onde você erra", d: "Domínio por assunto, não só % de acerto." },
              { i: CalendarCheck2, t: "Hábito", d: "Sequência, escudos e metas realistas." },
            ].map(({ i: Icon, t, d }) => (
              <li key={t} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <Icon className="mb-2 h-5 w-5 text-veritas-ouro" />
                <p className="font-semibold">{t}</p>
                <p className="mt-1 text-sm text-veritas-pergaminho/70">{d}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden justify-center md:flex"><SeloUniClass className="w-72 drop-shadow-2xl" /></div>
      </main>
      <footer className="border-t border-white/10 py-6 text-center text-xs text-veritas-pergaminho/60">
        Veritas Group — Conteúdo de valor. Conhecimento de verdade. · Cursos livres, nos termos da legislação vigente.
      </footer>
    </div>
  );
}
