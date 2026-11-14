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

type Variante = "estudo" | "institucional";

/**
 * Fundo da plataforma.
 * - estudo: branco limpo, com o símbolo gravado em traço fino num canto,
 *   dentro de anéis de selo, como papel timbrado.
 * - institucional: azul tinta sólido com a mesma gravura em ouro.
 * Sem desfoques, partículas ou animação ambiente: só a marca, bem desenhada.
 */
export function FundoVeritas({ variante = "estudo", className, fixo = true, gravura = true }: { variante?: Variante; className?: string; fixo?: boolean; gravura?: boolean }) {
  const inst = variante === "institucional";
  return (
    <div className={cn("pointer-events-none inset-0 -z-10 overflow-hidden", fixo ? "fixed" : "absolute", inst ? "bg-[linear-gradient(180deg,#10203A,#0E1B2E_55%,#0B1626)]" : "bg-fundo", className)} aria-hidden>
      {gravura && (
        // Como papel timbrado: gravura no canto superior direito, acima da área de conteúdo
        <div className={cn("absolute -right-[9rem] -top-[9rem] h-[26rem] w-[26rem]", inst ? "text-veritas-ouro/[.16]" : "text-veritas-ouro/[.30] dark:text-veritas-ouro/[.14]")}>
          <AneisSelo className="absolute inset-0 h-full w-full" />
          <SimboloMarcaDagua className="absolute inset-[24%] h-[52%] w-[52%]" />
        </div>
      )}
      {!inst && <div className="absolute inset-x-0 top-0 h-px bg-[linear-gradient(90deg,transparent,rgb(var(--destaque)/.35),transparent)]" />}
    </div>
  );
}
