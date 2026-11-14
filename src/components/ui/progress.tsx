"use client";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/** Valor que parte de 0 e anima até o alvo depois de montar (respeita reduced-motion via CSS). */
function useAnimado(alvo: number) {
  const [v, setV] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setV(alvo));
    return () => cancelAnimationFrame(id);
  }, [alvo]);
  return v;
}

export function Anel({ valor, tamanho = 112, espessura = 10, cor, children, rotulo }: {
  valor: number; tamanho?: number; espessura?: number; cor?: string; children?: React.ReactNode; rotulo: string;
}) {
  const r = (tamanho - espessura) / 2;
  const c = 2 * Math.PI * r;
  const v = useAnimado(Math.max(0, Math.min(1, valor)));
  const id = `anel-${tamanho}-${espessura}-${Math.round(valor * 1000)}`;
  return (
    <div className="relative inline-grid shrink-0 place-items-center" style={{ width: tamanho, height: tamanho }} role="img" aria-label={rotulo}>
      <svg width={tamanho} height={tamanho} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor={cor ?? "rgb(var(--destaque))"} />
            <stop offset="1" stopColor={cor ?? "rgb(var(--destaque))"} />
          </linearGradient>
        </defs>
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke="rgb(var(--borda))" strokeOpacity=".7" strokeWidth={espessura} />
        <circle cx={tamanho / 2} cy={tamanho / 2} r={r + espessura / 2 + 3} fill="none" stroke="rgb(var(--destaque))" strokeOpacity=".25" strokeWidth=".75" strokeDasharray="1.5 4" />
        <circle
          cx={tamanho / 2} cy={tamanho / 2} r={r} fill="none" stroke={`url(#${id})`} strokeWidth={espessura} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c * (1 - v)}
          className="transition-[stroke-dashoffset] duration-[1400ms] ease-premium"
        />
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">{children}</div>
    </div>
  );
}

export function Barra({ valor, className, cor, rotulo }: { valor: number; className?: string; cor?: string; rotulo: string }) {
  const alvo = Math.max(0, Math.min(1, valor));
  const v = useAnimado(alvo);
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-borda/60", className)} role="progressbar" aria-label={rotulo} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(alvo * 100)}>
      <div
        className="h-full rounded-full transition-[width] duration-[1200ms] ease-premium"
        style={{ width: `${v * 100}%`, background: cor ?? "rgb(var(--destaque))" }}
      />
    </div>
  );
}

/** Número que conta de 0 até o valor (easing suave). */
export function Contador({ valor, sufixo = "", prefixo = "", duracao = 1200, className }: { valor: number; sufixo?: string; prefixo?: string; duracao?: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(valor); return; }
    let raf = 0;
    const t0 = performance.now();
    const passo = (t: number) => {
      const p = Math.min(1, (t - t0) / duracao);
      setN(Math.round(valor * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(passo);
    };
    raf = requestAnimationFrame(passo);
    return () => cancelAnimationFrame(raf);
  }, [valor, duracao]);
  return <span className={cn("num", className)}>{prefixo}{n.toLocaleString("pt-BR")}{sufixo}</span>;
}
