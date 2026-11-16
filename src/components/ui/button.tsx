import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variante = "primaria" | "secundaria" | "fantasma" | "ouro";

const base = "reflexo inline-flex items-center justify-center gap-2 rounded-[4px] font-semibold tracking-wide transition duration-300 ease-premium active:scale-[.97] disabled:pointer-events-none disabled:opacity-50";

const estilos: Record<Variante, string> = {
  primaria: "bg-primaria text-primaria-texto shadow-[inset_0_0_0_1px_rgba(184,147,90,.35),inset_0_0_0_3px_rgb(var(--primaria)),inset_0_0_0_4px_rgba(184,147,90,.25)] hover:bg-primaria/90",
  secundaria: "border border-borda bg-superficie text-texto hover:border-destaque/50 hover:bg-superficie-alta",
  fantasma: "text-texto hover:bg-borda/40",
  ouro: "bg-veritas-ouro text-veritas-tinta hover:bg-[#A9844C]",
};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; tamanho?: "sm" | "md" | "lg" }>(
  function Button({ className, variante = "primaria", tamanho = "md", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(base, tamanho === "sm" && "h-9 px-3 text-sm", tamanho === "md" && "h-11 px-4 text-sm", tamanho === "lg" && "h-12 px-6 text-base", estilos[variante], className)}
        {...props}
      />
    );
  },
);

export function botaoClasses(variante: Variante = "primaria", extra?: string) {
  return cn(base, "h-11 px-4 text-sm", estilos[variante], extra);
}
