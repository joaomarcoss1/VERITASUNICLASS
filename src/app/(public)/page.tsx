import Link from "next/link";
import { ArrowRight, BarChart3, BookOpenCheck, CalendarCheck2, Check, GraduationCap, ShieldCheck } from "lucide-react";
import { LogoUniClass, SimboloVeritas } from "@/components/brand/logo";
import { botaoClasses } from "@/components/ui/button";

const RECURSOS = [
  { i: CalendarCheck2, t: "Rotina que se ajusta", d: "Plano semanal gerado pelo edital e pelo seu tempo; se você atrasar, ele replaneja sozinho." },
  { i: BarChart3, t: "Domínio por assunto", d: "Mais que % de acerto: veja onde você erra e o que pesa mais na prova." },
  { i: BookOpenCheck, t: "Questões comentadas", d: "Banco filtrável por banca, órgão e assunto, com comentário revisado por professor." },
  { i: GraduationCap, t: "Cursos e certificados", d: "Trilhas com vídeo, PDF, mapa mental e exercícios; certificado com validação pública." },
];

/** Prévia do produto montada com os mesmos padrões da interface (não é imagem). */
function PreviaProduto() {
  const tarefas = [
    { t: "Revisar 12 cartões", c: "#14968A", f: true },
    { t: "Aula de Direito Constitucional", c: "#D2504F", f: false },
    { t: "20 questões de Português", c: "#2F6FDB", f: false },
  ];
  return (
    <div className="relative rounded-2xl border border-white/10 bg-white/[.04] p-3 shadow-2xl">
      <div className="rounded-xl bg-white p-5 text-[#101828]">
        <div className="grid grid-cols-3 gap-3">
          {[{ r: "Horas na semana", v: "10h 30m" }, { r: "Acerto geral", v: "62%" }, { r: "Sequência", v: "56 dias" }].map((k) => (
            <div key={k.r} className="rounded-lg border border-[#E4E7EC] p-3">
              <p className="text-[0.6875rem] text-[#576376]">{k.r}</p>
              <p className="mt-1 text-lg font-semibold tracking-tight">{k.v}</p>
            </div>
          ))}
        </div>
        <div className="mt-3 rounded-lg border border-[#E4E7EC] p-4">
          <p className="text-sm font-semibold">Missão do dia</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#F6F7F9]"><div className="h-full w-1/3 bg-[#16804A]" /></div>
          <ul className="mt-3 space-y-2.5">
            {tarefas.map((x) => (
              <li key={x.t} className="flex items-center gap-2.5 text-[0.8125rem]">
                <span className={`grid h-5 w-5 place-items-center rounded-full border-2 ${x.f ? "border-[#16804A] bg-[#16804A] text-white" : "border-[#D0D5DD]"}`}>{x.f && <Check className="h-3 w-3" strokeWidth={3} />}</span>
                <span className={x.f ? "text-[#576376] line-through" : ""}>{x.t}</span>
                <span className="ml-auto h-2 w-2 rounded-full" style={{ background: x.c }} />
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-3 flex h-20 items-end gap-2 rounded-lg border border-[#E4E7EC] p-3">
          {[60, 35, 70, 80, 55, 25, 45].map((h, i) => (
            <span key={i} className={`flex-1 rounded-t-[4px] ${i === 6 ? "bg-[#0E1B2E]" : "bg-[#D0D5DD]"}`} style={{ height: `${h}%` }} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-dvh bg-fundo">
      <section className="sobre-tinta relative isolate overflow-hidden bg-veritas-tinta text-white">
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(70%_80%_at_85%_10%,rgba(184,147,90,.18),transparent_60%)]" aria-hidden />
        <SimboloVeritas className="pointer-events-none absolute -left-24 -top-24 -z-10 h-[28rem] w-[28rem] opacity-[.05]" cor="ouro" />
        <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
          <LogoUniClass invertido />
          <nav className="flex items-center gap-2">
            <Link href="/login" className="rounded-lg px-3 py-2 text-sm font-medium text-slate-200 transition hover:text-white">Entrar</Link>
            <Link href="/cadastro" className={botaoClasses("ouro", "h-9 px-3.5 text-[0.8125rem]")}>Criar conta</Link>
          </nav>
        </header>
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-5 pb-20 pt-10 lg:grid-cols-[1.05fr_1fr] lg:pb-24 lg:pt-16">
          <div className="escalonado">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-veritas-ouro" /> Concursos · ENEM · Cursos livres
            </p>
            <h1 className="titulo-marca mt-6 text-[2.75rem] leading-[1.04] sm:text-[4rem]">Todo dia, um passo mais perto da aprovação.</h1>
            <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-slate-300">
              A plataforma que organiza o seu estudo: o que estudar hoje, quanto você avançou e onde está errando — em menos de 5 segundos.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/cadastro" className={botaoClasses("ouro", "h-11 px-5 text-[0.9375rem]")}>Começar grátis <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/inicio" className="inline-flex h-11 items-center rounded-lg border border-white/20 px-5 text-[0.9375rem] font-semibold text-white transition hover:bg-white/[.06]">Ver demonstração</Link>
            </div>
            <p className="mt-6 flex items-center gap-2 text-xs text-slate-400"><ShieldCheck className="h-4 w-4 text-veritas-ouro" /> Sem cartão de crédito · LGPD · Certificados com validação pública</p>
          </div>
          <div className="hidden lg:block"><PreviaProduto /></div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <p className="sobrelinha">Por que a Veritas</p>
        <h2 className="titulo-institucional mt-2 max-w-2xl text-[1.875rem] leading-tight">Método de estudo, não só conteúdo.</h2>
        <div className="escalonado mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {RECURSOS.map(({ i: Icon, t, d }) => (
            <article key={t} className="cartao-premium rounded-xl border border-borda p-5">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-superficie-alta text-texto ring-1 ring-borda"><Icon className="h-[18px] w-[18px]" /></span>
              <h3 className="mt-4 text-[0.9375rem] font-semibold">{t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-texto-suave">{d}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="border-t border-borda py-8 text-center text-xs text-texto-suave">
        Veritas Group — Conteúdo de valor. Conhecimento de verdade. · Cursos livres, nos termos da legislação vigente.
      </footer>
    </div>
  );
}
