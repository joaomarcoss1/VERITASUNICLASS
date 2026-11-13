"use client";
import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Card de vidro com holofote dourado que acompanha o cursor. */
export function Card({ className, onMouseMove, ...props }: HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  return (
    <section
      ref={ref}
      onMouseMove={(e) => {
        const el = ref.current;
        if (el) {
          const r = el.getBoundingClientRect();
          el.style.setProperty("--mx", `${e.clientX - r.left}px`);
          el.style.setProperty("--my", `${e.clientY - r.top}px`);
        }
        onMouseMove?.(e);
      }}
      className={cn("cartao-premium min-w-0 rounded-xl2 border border-borda/70 p-5 shadow-card", className)}
      {...props}
    />
  );
}

export function CardTitulo({ icone, children, acao }: { icone?: ReactNode; children: ReactNode; acao?: ReactNode }) {
  return (
    <header className="mb-4 flex items-center justify-between gap-3">
      <h2 className="flex items-center gap-2.5 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-texto-suave">
        {icone && (
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-destaque/25 to-destaque/5 text-destaque-texto ring-1 ring-destaque/25" aria-hidden>
            {icone}
          </span>
        )}
        {children}
      </h2>
      {acao}
    </header>
  );
}

export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", className)} {...props} />;
}
