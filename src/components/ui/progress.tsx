import { cn } from "@/lib/utils";

export function Anel({ valor, tamanho = 112, espessura = 10, cor = "rgb(var(--destaque))", children, rotulo }: {
  valor: number; tamanho?: number; espessura?: number; cor?: string; children?: React.ReactNode; rotulo: string;
}) {
  const r = (tamanho - espessura) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(1, valor));
  return (
    <div className="relative inline-grid place-items-center" style={{ width: tamanho, height: tamanho }} role="img" aria-label={rotulo}>
      <svg width={tamanho} height={tamanho} className="-rotate-90">
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke="rgb(var(--borda))" strokeWidth={espessura} />
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke={cor} strokeWidth={espessura} strokeLinecap="round" strokeDasharray={c} strokeDashoffset={c * (1 - v)} className="transition-[stroke-dashoffset] duration-700" />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export function Barra({ valor, className, cor, rotulo }: { valor: number; className?: string; cor?: string; rotulo: string }) {
  const v = Math.max(0, Math.min(1, valor));
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-borda/60", className)} role="progressbar" aria-label={rotulo} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(v * 100)}>
      <div className="h-full rounded-full bg-destaque transition-[width] duration-700" style={{ width: `${v * 100}%`, ...(cor ? { background: cor } : {}) }} />
    </div>
  );
}
