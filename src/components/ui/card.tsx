import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card: superfície branca, borda fina, cantos de 12px. */
export function Card({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  return (
    <section className={cn("cartao-premium min-w-0 rounded-xl border border-borda p-5 sm:p-6", className)} {...props}>
      {children}
    </section>
  );
}

/** Cabeçalho de card: título 15px, subtítulo discreto e ações à direita. Ícone opcional, em cinza. */
export function CardTitulo({ icone, children, subtitulo, acao }: { numero?: string; icone?: ReactNode; children: ReactNode; subtitulo?: ReactNode; acao?: ReactNode }) {
  return (
    <header className="mb-5 flex items-start justify-between gap-4">
      <div className="flex min-w-0 items-start gap-2.5">
        {icone && <span className="mt-0.5 text-texto-suave [&_svg]:h-4 [&_svg]:w-4" aria-hidden>{icone}</span>}
        <div className="min-w-0">
          <h2 className="truncate text-[0.9375rem] font-semibold leading-snug tracking-[-0.01em] text-texto">{children}</h2>
          {subtitulo && <p className="mt-0.5 truncate text-[0.8125rem] text-texto-suave">{subtitulo}</p>}
        </div>
      </div>
      {acao && <div className="shrink-0 text-[0.8125rem] font-medium [&_a]:text-info [&_a:hover]:underline">{acao}</div>}
    </header>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[0.6875rem] font-semibold", className)} {...props} />;
}

/** Chip de disciplina: fundo levemente tingido, ponto na cor da matéria, texto em tinta. */
export function ChipDisciplina({ cor, children, className }: { cor: string; children: ReactNode; className?: string }) {
  return (
    <span
      className={cn("inline-flex max-w-full items-center gap-1.5 rounded-md px-2 py-0.5 text-[0.75rem] font-medium text-texto", className)}
      style={{ background: `color-mix(in srgb, ${cor} 12%, transparent)` }}
    >
      <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: cor }} aria-hidden />
      <span className="truncate">{children}</span>
    </span>
  );
}

/** Cabeçalho de página: título, descrição e ações. */
export function CabecalhoPagina({ titulo, descricao, acoes, sobretitulo }: { titulo: ReactNode; descricao?: ReactNode; acoes?: ReactNode; sobretitulo?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="min-w-0">
        {sobretitulo && <p className="sobrelinha mb-1.5">{sobretitulo}</p>}
        <h1 className="titulo-institucional text-[1.625rem] leading-tight text-texto sm:text-[1.875rem]">{titulo}</h1>
        {descricao && <p className="mt-1.5 text-sm text-texto-suave">{descricao}</p>}
      </div>
      {acoes && <div className="flex flex-wrap items-center gap-2">{acoes}</div>}
    </div>
  );
}
