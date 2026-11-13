import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variante = "primaria" | "secundaria" | "fantasma" | "ouro";

const base = "reflexo inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-300 ease-premium active:scale-[.97] disabled:pointer-events-none disabled:opacity-50";

const estilos: Record<Variante, string> = {
  primaria: "bg-primaria text-primaria-texto shadow-[0_8px_20px_-8px_rgba(14,27,46,.55)] ring-1 ring-inset ring-white/10 hover:-translate-y-px hover:shadow-[0_14px_28px_-10px_rgba(14,27,46,.6)] dark:shadow-[0_8px_24px_-10px_rgba(209,174,116,.55)]",
  secundaria: "border border-borda bg-superficie/80 text-texto backdrop-blur hover:-translate-y-px hover:border-destaque/50 hover:bg-superficie-alta",
  fantasma: "text-texto hover:bg-borda/40",
  ouro: "bg-[linear-gradient(135deg,#E2C68E,#B8935A_45%,#9C7838)] text-veritas-tinta shadow-[0_10px_26px_-10px_rgba(184,147,90,.8)] ring-1 ring-inset ring-white/30 hover:-translate-y-px hover:brightness-105",
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
