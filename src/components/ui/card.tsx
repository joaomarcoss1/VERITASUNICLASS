import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLElement>) {
  return <section className={cn("min-w-0 rounded-xl2 border border-borda/80 bg-superficie p-5 shadow-card", className)} {...props} />;
}

export function CardTitulo({ icone, children, acao }: { icone?: ReactNode; children: ReactNode; acao?: ReactNode }) {
  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-texto-suave">
        {icone && <span className="text-destaque-texto" aria-hidden>{icone}</span>}
        {children}
      </h2>
      {acao}
    </header>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", className)} {...props} />;
}
