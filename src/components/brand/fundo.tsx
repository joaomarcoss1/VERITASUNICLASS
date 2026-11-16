import { cn } from "@/lib/utils";

const ESTRELA = "100.00,23.00 102.00,29.86 108.60,27.14 104.48,32.98 110.72,36.45 103.60,36.87 104.77,43.91 100.00,38.60 95.23,43.91 96.40,36.87 89.28,36.45 95.52,32.98 91.40,27.14 98.00,29.86";

/** A estrela de 8 pontas do símbolo Veritas, isolada (ornamento pontual, nunca espalhado). */
export function EstrelaVeritas({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="88 22 24 23" className={className} style={style} aria-hidden>
      <polygon points={ESTRELA} fill="currentColor" />
    </svg>
  );
}

/**
 * Símbolo Veritas em traço fino, como gravura (estrela + livro com as linhas
 * das páginas). Proporções oficiais, sem rotação nem distorção.
 */
export function SimboloMarcaDagua({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="16 18 168 160" className={className} style={style} fill="none" stroke="currentColor" strokeLinejoin="round" aria-hidden>
      <polygon points={ESTRELA} strokeWidth=".9" />
      <path d="M26 64 Q60 46 94 70 L100 172 Z" strokeWidth="1.1" />
      <path d="M174 64 Q140 46 106 70 L100 172 Z" strokeWidth="1.1" />
      <path d="M40 70 Q66 57 92 77" strokeWidth=".6" />
      <path d="M54 84 Q74 74 93 92" strokeWidth=".6" />
      <path d="M68 99 Q82 92 95 108" strokeWidth=".6" />
      <path d="M160 70 Q134 57 108 77" strokeWidth=".6" />
      <path d="M146 84 Q126 74 107 92" strokeWidth=".6" />
      <path d="M132 99 Q118 92 105 108" strokeWidth=".6" />
    </svg>
  );
}

/** Anéis finos de selo (filete duplo + régua de marcações), estáticos. */
function AneisSelo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 400 400" className={className} fill="none" stroke="currentColor" aria-hidden>
      <circle cx="200" cy="200" r="198" strokeWidth=".5" />
      <circle cx="200" cy="200" r="192" strokeWidth=".5" />
      <circle cx="200" cy="200" r="150" strokeWidth=".4" strokeDasharray="1 5" />
      {Array.from({ length: 72 }, (_, i) => (
        <line key={i} x1="200" y1="8" x2="200" y2={i % 6 === 0 ? 20 : 13} strokeWidth=".5" transform={`rotate(${i * 5} 200 200)`} />
      ))}
    </svg>
  );
}

/**
 * Símbolo oficial na versão "azul e ouro" (para fundo claro), em escala de
 * marca d'água: livro em azul tinta translúcido, contorno e linhas das
 * páginas em ouro, estrela em ouro mais presente.
 */
export function SimboloColorido({ className }: { className?: string }) {
  return (
    <svg viewBox="16 18 168 160" className={className} aria-hidden>
      <defs>
        <linearGradient id="vu-folha" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9BE8A" stopOpacity=".26" />
          <stop offset="1" stopColor="#B8935A" stopOpacity=".10" />
        </linearGradient>
      </defs>
      <polygon points={ESTRELA} fill="#B8935A" fillOpacity=".9" />
      <path d="M26 64 Q60 46 94 70 L100 172 Z" fill="url(#vu-folha)" stroke="#B8935A" strokeOpacity=".75" strokeWidth=".6" strokeLinejoin="round" />
      <path d="M174 64 Q140 46 106 70 L100 172 Z" fill="url(#vu-folha)" stroke="#B8935A" strokeOpacity=".75" strokeWidth=".6" strokeLinejoin="round" />
      <g fill="none" stroke="#9C7838" strokeOpacity=".5" strokeWidth=".45">
        <path d="M40 70 Q66 57 92 77" /><path d="M54 84 Q74 74 93 92" /><path d="M68 99 Q82 92 95 108" />
        <path d="M160 70 Q134 57 108 77" /><path d="M146 84 Q126 74 107 92" /><path d="M132 99 Q118 92 105 108" />
      </g>
    </svg>
  );
}

type Variante = "estudo" | "institucional";

/**
 * Fundo da plataforma.
 * - estudo: branco, com o símbolo Veritas colorido (azul e ouro) grande e
 *   centralizado na área de conteúdo, como marca d'água de papel timbrado.
 * - institucional: azul tinta com gravura em ouro (opcional).
 */
export function FundoVeritas({ variante = "estudo", className, fixo = true, gravura = true }: { variante?: Variante; className?: string; fixo?: boolean; gravura?: boolean }) {
  const inst = variante === "institucional";
  return (
    <div className={cn("pointer-events-none inset-0 -z-10 overflow-hidden", fixo ? "fixed" : "absolute", inst ? "bg-[linear-gradient(180deg,#10203A,#0E1B2E_55%,#0B1626)]" : "bg-fundo", className)} aria-hidden>
      {gravura && !inst && (
        <div className="absolute left-1/2 top-1/2 h-[min(78vmin,760px)] w-[min(78vmin,760px)] -translate-x-1/2 -translate-y-[46%] lg:left-[calc(50%+140px)] dark:opacity-60">
          <AneisSelo className="absolute inset-0 h-full w-full text-veritas-ouro/40" />
          <SimboloColorido className="absolute inset-[17%] h-[66%] w-[66%]" />
        </div>
      )}
      {gravura && inst && (
        <div className="absolute -right-[9rem] -top-[9rem] h-[26rem] w-[26rem] text-veritas-ouro/[.16]">
          <AneisSelo className="absolute inset-0 h-full w-full" />
          <SimboloMarcaDagua className="absolute inset-[24%] h-[52%] w-[52%]" />
        </div>
      )}
    </div>
  );
}
