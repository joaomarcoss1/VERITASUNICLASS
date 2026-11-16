import { FundoVeritas } from "@/components/brand/fundo";
import { SimboloVeritas } from "@/components/brand/logo";
import { Contador } from "@/components/ui/progress";
import { InicioRapido } from "./estudo/inicio-rapido";

/**
 * Abertura do painel como a capa de um livro encadernado: azul tinta, moldura
 * dupla dourada com cantoneiras, data em versalete e o símbolo em ouro.
 */
export function HeroPainel({ saudacao, nome, nivel, dias, streak, proximo, sugestao }: { saudacao: string; nome: string; nivel: string; dias: number | null; streak: number; proximo: string | null; sugestao?: string | null }) {
  const data = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Sao_Paulo" }).format(new Date());
  return (
    <section className="sobre-tinta relative isolate overflow-hidden rounded-[24px] px-6 py-7 text-veritas-pergaminho shadow-[0_24px_44px_-30px_rgba(14,27,46,.9)] sm:px-12 sm:py-10">
      <FundoVeritas variante="institucional" fixo={false} gravura={false} className="-z-10" />
      {/* Moldura dupla dourada + cantoneiras */}
      <div className="pointer-events-none absolute inset-2.5 rounded-[18px] border border-veritas-ouro/45" aria-hidden />
      <div className="pointer-events-none absolute inset-[15px] rounded-[14px] border border-veritas-ouro/20" aria-hidden />

      {/* Símbolo em ouro, com filetes de selo */}
      <div className="pointer-events-none absolute right-10 top-10 hidden h-44 w-44 md:block" aria-hidden>
        <div className="absolute inset-0 rounded-full border border-veritas-ouro/35" />
        <div className="absolute inset-[7px] rounded-full border border-veritas-ouro/15" />
        <div className="absolute inset-0 grid place-items-center">
          <SimboloVeritas className="h-20 w-20" cor="ouro" />
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
              <dd className="text-3xl font-semibold leading-tight tracking-tight"><Contador valor={dias} /> <span className="text-base font-medium text-veritas-pergaminho/70">dias</span></dd>
            </div>
          )}
          <div className="border-l border-veritas-ouro/30 pl-10">
            <dt className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-veritas-pergaminho/60">Sequência</dt>
            <dd className="text-3xl font-semibold leading-tight tracking-tight"><Contador valor={streak} /> <span className="text-base font-medium text-veritas-pergaminho/70">dias</span></dd>
          </div>
        </dl>
      </div>

      <div className="relative mt-8 rounded-[18px] border border-white/10 bg-white/[.04] p-3 sm:p-4">
        <p className="mb-2.5 px-1 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-veritas-ouro">Começar agora</p>
        <InicioRapido sugestao={sugestao} />
      </div>
    </section>
  );
}
