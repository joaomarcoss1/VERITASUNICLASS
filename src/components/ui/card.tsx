import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card branco com cantos generosos; `fita` adiciona o marcador de página vinho (marca Veritas). */
export function Card({ className, fita, children, ...props }: HTMLAttributes<HTMLElement> & { fita?: boolean }) {
  return (
    <section className={cn("cartao-premium min-w-0 rounded-[20px] border border-borda/80 p-5 sm:p-6", className)} {...props}>
      {fita && <span className="fita-marcadora right-7" aria-hidden />}
      {children}
    </section>
  );
}

/** Cabeçalho: selo tinta com ícone em ouro, título e subtítulo opcionais, ação à direita. */
export function CardTitulo({ icone, children, subtitulo, acao }: { numero?: string; icone?: ReactNode; children: ReactNode; subtitulo?: ReactNode; acao?: ReactNode }) {
  return (
    <header className="mb-5 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        {icone && (
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[12px] bg-veritas-tinta text-veritas-ouro shadow-[0_6px_14px_-8px_rgba(14,27,46,.7)] dark:bg-superficie-alta [&_svg]:h-[18px] [&_svg]:w-[18px]" aria-hidden>
            {icone}
          </span>
        )}
        <div className="min-w-0">
          <h2 className="truncate text-[1.02rem] font-semibold leading-tight text-texto">{children}</h2>
          {subtitulo && <p className="mt-0.5 truncate text-xs text-texto-suave">{subtitulo}</p>}
        </div>
      </div>
      {acao && <div className="shrink-0 pt-1 text-xs font-semibold [&_a]:text-info [&_a:hover]:underline">{acao}</div>}
    </header>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[0.7rem] font-semibold", className)} {...props} />;
}
