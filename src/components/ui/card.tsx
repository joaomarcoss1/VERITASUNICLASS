import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Prancha: papel branco com moldura dupla em ouro. `fita` adiciona o marcador de página vinho. */
export function Card({ className, fita, children, ...props }: HTMLAttributes<HTMLElement> & { fita?: boolean }) {
  return (
    <section className={cn("cartao-premium min-w-0 rounded-[6px] border border-borda p-6", className)} {...props}>
      {fita && <span className="fita-marcadora right-6" aria-hidden />}
      {children}
    </section>
  );
}

/**
 * Cabeçalho de prancha: numeral romano em ouro, título em serifa e filete
 * (curto em ouro + longo em névoa). Ícones genéricos foram abandonados.
 */
export function CardTitulo({ numero, children, acao }: { numero?: string; icone?: ReactNode; children: ReactNode; acao?: ReactNode }) {
  return (
    <header className="mb-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="flex min-w-0 items-baseline gap-2.5">
          {numero && <span className="font-titulo text-[0.95rem] font-semibold tracking-[0.18em] text-destaque-texto">{numero}.</span>}
          <span className="truncate font-titulo text-[1.5rem] font-semibold leading-none text-texto">{children}</span>
        </h2>
        {acao && <div className="shrink-0 text-[0.7rem] font-semibold uppercase tracking-[0.16em] [&_a]:text-info">{acao}</div>}
      </div>
      <div className="mt-3 flex items-center gap-1.5" aria-hidden>
        <span className="h-[2px] w-8 bg-destaque" />
        <span className="h-px flex-1 bg-borda" />
      </div>
    </header>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-[3px] px-2 py-0.5 text-[0.7rem] font-semibold uppercase tracking-wider", className)} {...props} />;
}
