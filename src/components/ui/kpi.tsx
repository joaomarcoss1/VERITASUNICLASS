import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Indicador-chave: rótulo, valor grande, variação e um complemento visual (barra, sparkline). */
export function Kpi({ rotulo, valor, unidade, variacao, nota, icone, children, className }: {
  rotulo: string; valor: ReactNode; unidade?: string; variacao?: { texto: string; tom: "bom" | "ruim" | "neutro" }; nota?: ReactNode; icone?: ReactNode; children?: ReactNode; className?: string;
}) {
  return (
    <div className={cn("cartao-premium flex min-w-0 flex-col rounded-xl border border-borda p-4 sm:p-5", className)}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-[0.8125rem] font-medium text-texto-suave">{rotulo}</p>
        {icone && <span className="text-texto-suave/80 [&_svg]:h-4 [&_svg]:w-4" aria-hidden>{icone}</span>}
      </div>
      <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-1">
        <span className="num text-[1.375rem] font-semibold leading-none tracking-[-0.02em] text-texto sm:text-[1.75rem]">{valor}</span>
        {unidade && <span className="text-sm text-texto-suave">{unidade}</span>}
        {variacao && (
          <span className={cn("rounded-md px-1.5 py-0.5 sm:ml-auto text-[0.6875rem] font-semibold",
            variacao.tom === "bom" ? "bg-acerto-suave text-acerto" : variacao.tom === "ruim" ? "bg-erro-suave text-erro" : "bg-superficie-alta text-texto-suave")}>
            {variacao.texto}
          </span>
        )}
      </div>
      {children && <div className="mt-4">{children}</div>}
      {nota && <p className="mt-auto truncate pt-3 text-xs text-texto-suave">{nota}</p>}
    </div>
  );
}

/** Mini-série de colunas para dentro de um KPI (um só tom; o último ponto em destaque). */
export function MiniColunas({ valores, rotulo }: { valores: number[]; rotulo: string }) {
  const max = Math.max(1, ...valores);
  return (
    <div className="flex h-9 items-end gap-[3px]" role="img" aria-label={rotulo}>
      {valores.map((v, i) => (
        <span key={i} className={cn("flex-1 origin-bottom animate-cresce rounded-md", i === valores.length - 1 ? "bg-primaria" : "bg-borda-forte")}
          style={{ height: `${Math.max(6, (v / max) * 100)}%`, animationDelay: `${i * 40}ms` }} />
      ))}
    </div>
  );
}
