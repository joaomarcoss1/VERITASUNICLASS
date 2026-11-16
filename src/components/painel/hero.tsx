import { FundoVeritas } from "@/components/brand/fundo";
import { SimboloVeritas } from "@/components/brand/logo";
import { Contador } from "@/components/ui/progress";

/** Cantoneira dourada (ornamento de encadernação) — gira só a moldura, nunca o logo. */
function Cantoneira({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} fill="none" stroke="#B8935A" strokeWidth="1" aria-hidden>
      <path d="M2 38 V2 H38" />
      <path d="M6 38 V6 H38" strokeOpacity=".5" />
      <path d="M2 14 Q14 14 14 2" strokeOpacity=".7" />
      <circle cx="10" cy="10" r="1.6" fill="#B8935A" stroke="none" />
    </svg>
  );
}

/**
 * Abertura do painel como a capa de um livro encadernado: azul tinta, moldura
 * dupla dourada com cantoneiras, data em versalete e o símbolo em ouro.
 */
export function HeroPainel({ saudacao, nome, nivel, dias, streak, proximo }: { saudacao: string; nome: string; nivel: string; dias: number | null; streak: number; proximo: string | null }) {
  const data = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Sao_Paulo" }).format(new Date());
  return (
    <section className="sobre-tinta relative isolate overflow-hidden rounded-[6px] px-7 py-8 text-veritas-pergaminho shadow-[0_24px_44px_-30px_rgba(14,27,46,.9)] sm:px-12 sm:py-10">
      <FundoVeritas variante="institucional" fixo={false} gravura={false} className="-z-10" />
      {/* Moldura dupla dourada + cantoneiras */}
      <div className="pointer-events-none absolute inset-2.5 rounded-[3px] border border-veritas-ouro/45" aria-hidden />
      <div className="pointer-events-none absolute inset-[15px] rounded-[2px] border border-veritas-ouro/20" aria-hidden />
      <Cantoneira className="absolute left-2.5 top-2.5 h-9 w-9" />
      <Cantoneira className="absolute right-2.5 top-2.5 h-9 w-9 rotate-90" />
      <Cantoneira className="absolute bottom-2.5 right-2.5 h-9 w-9 rotate-180" />
      <Cantoneira className="absolute bottom-2.5 left-2.5 h-9 w-9 -rotate-90" />

      {/* Símbolo em ouro, com filetes de selo */}
      <div className="pointer-events-none absolute right-10 top-1/2 hidden h-52 w-52 -translate-y-1/2 md:block" aria-hidden>
        <div className="absolute inset-0 rounded-full border border-veritas-ouro/35" />
        <div className="absolute inset-[7px] rounded-full border border-veritas-ouro/15" />
        <div className="absolute inset-0 grid place-items-center">
          <SimboloVeritas className="h-24 w-24" cor="ouro" />
        </div>
      </div>

      <div className="relative max-w-xl">
        <p className="font-titulo text-sm font-semibold uppercase tracking-[0.28em] text-veritas-ouro">{data}</p>
        <h1 className="titulo-institucional mt-3 text-[2.4rem] leading-[1.05] text-veritas-pergaminho sm:text-[3.4rem]">
          {saudacao}, <span className="texto-ouro italic">{nome}</span>.
        </h1>
        <div className="mt-4 flex items-center gap-3 text-sm text-veritas-pergaminho/75">
          <span className="h-px w-8 bg-veritas-ouro" aria-hidden />
          <span>Grau atual: <strong className="font-titulo text-base font-semibold text-veritas-ouro">{nivel}</strong>{proximo && <> · próximo, {proximo}</>}</span>
        </div>
        <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
          {dias != null && (
            <div>
              <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-veritas-pergaminho/60">Até a prova</dt>
              <dd className="font-titulo text-4xl font-semibold leading-tight"><Contador valor={dias} /> <span className="text-lg font-medium text-veritas-pergaminho/70">dias</span></dd>
            </div>
          )}
          <div className="border-l border-veritas-ouro/30 pl-10">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-veritas-pergaminho/60">Sequência</dt>
            <dd className="font-titulo text-4xl font-semibold leading-tight"><Contador valor={streak} /> <span className="text-lg font-medium text-veritas-pergaminho/70">dias</span></dd>
          </div>
        </dl>
      </div>
    </section>
  );
}
