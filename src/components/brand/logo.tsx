import { cn } from "@/lib/utils";

/** Símbolo oficial Veritas (estrela + livro). Cores e proporções do manual — não alterar. */
export function SimboloVeritas({ className, cor = "ouro" }: { className?: string; cor?: "ouro" | "tinta" | "branco" | "auto" }) {
  // "auto": livro em tinta no claro e em ouro no escuro (versão azul e ouro / versão para fundo escuro)
  const fill = cor === "ouro" ? "#B8935A" : cor === "tinta" ? "#0E1B2E" : cor === "auto" ? "currentColor" : "#FFFFFF";
  return (
    <svg viewBox="16 18 168 160" className={cn("shrink-0", cor === "auto" && "text-veritas-tinta dark:text-veritas-ouro", className)} role="img" aria-label="Veritas">
      <polygon points="100.00,23.00 102.00,29.86 108.60,27.14 104.48,32.98 110.72,36.45 103.60,36.87 104.77,43.91 100.00,38.60 95.23,43.91 96.40,36.87 89.28,36.45 95.52,32.98 91.40,27.14 98.00,29.86" fill={cor === "branco" ? fill : "#B8935A"} />
      <path d="M26 64 Q60 46 94 70 L100 172 Z" fill={fill} />
      <path d="M174 64 Q140 46 106 70 L100 172 Z" fill={fill} />
    </svg>
  );
}

/** Assinatura do produto: símbolo + "Veritas UniClass" (tamanho mínimo do símbolo: 24px). */
export function LogoUniClass({ className, invertido = false }: { className?: string; invertido?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <SimboloVeritas className="h-8 w-8" cor={invertido ? "ouro" : "auto"} />
      <span className="flex flex-col leading-none">
        <span className={cn("titulo-institucional text-[1.35rem] tracking-[0.14em]", invertido ? "text-veritas-pergaminho" : "text-texto")}>VERITAS</span>
        <span className={cn("text-[0.6rem] font-semibold uppercase tracking-[0.42em]", invertido ? "text-veritas-ouro" : "text-destaque-texto")}>UniClass</span>
      </span>
    </span>
  );
}
