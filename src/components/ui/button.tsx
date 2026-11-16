import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variante = "primaria" | "secundaria" | "fantasma" | "ouro";

const base = "inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition duration-150 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50";

const estilos: Record<Variante, string> = {
  primaria: "bg-primaria text-primaria-texto shadow-[0_1px_2px_rgba(16,24,40,.12)] hover:bg-primaria/90",
  secundaria: "border border-borda bg-superficie text-texto shadow-[0_1px_2px_rgba(16,24,40,.05)] hover:bg-superficie-alta hover:border-borda-forte",
  fantasma: "text-texto hover:bg-superficie-alta",
  ouro: "reflexo bg-veritas-ouro text-veritas-tinta shadow-[0_1px_2px_rgba(16,24,40,.12)] hover:bg-[#AB8650]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; tamanho?: "sm" | "md" | "lg" }>(
  function Button({ className, variante = "primaria", tamanho = "md", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(base, tamanho === "sm" && "h-8 px-3 text-[0.8125rem]", tamanho === "md" && "h-10 px-4 text-sm", tamanho === "lg" && "h-11 px-5 text-[0.9375rem]", estilos[variante], className)}
        {...props}
      />
    );
  },
);

export function botaoClasses(variante: Variante = "primaria", extra?: string) {
  return cn(base, "h-10 px-4 text-sm", estilos[variante], extra);
}
