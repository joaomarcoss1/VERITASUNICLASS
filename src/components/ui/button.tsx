import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type Variante = "primaria" | "secundaria" | "fantasma" | "ouro";

const estilos: Record<Variante, string> = {
  primaria: "bg-primaria text-primaria-texto hover:opacity-90",
  secundaria: "border border-borda bg-superficie text-texto hover:bg-superficie-alta",
  fantasma: "text-texto hover:bg-borda/40",
  ouro: "bg-veritas-ouro text-veritas-tinta hover:brightness-105",
};

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement> & { variante?: Variante; tamanho?: "sm" | "md" | "lg" }>(
  function Button({ className, variante = "primaria", tamanho = "md", ...props }, ref) {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition disabled:pointer-events-none disabled:opacity-50",
          tamanho === "sm" && "h-9 px-3 text-sm",
          tamanho === "md" && "h-11 px-4 text-sm",
          tamanho === "lg" && "h-12 px-6 text-base",
          estilos[variante],
          className,
        )}
        {...props}
      />
    );
  },
);

export function botaoClasses(variante: Variante = "primaria", extra?: string) {
  return cn("inline-flex h-11 items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition", estilos[variante], extra);
}
