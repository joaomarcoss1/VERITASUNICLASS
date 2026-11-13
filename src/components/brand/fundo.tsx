import { cn } from "@/lib/utils";

const ESTRELA = "100.00,23.00 102.00,29.86 108.60,27.14 104.48,32.98 110.72,36.45 103.60,36.87 104.77,43.91 100.00,38.60 95.23,43.91 96.40,36.87 89.28,36.45 95.52,32.98 91.40,27.14 98.00,29.86";

/** A estrela de 8 pontas do símbolo Veritas, isolada (ornamento). */
export function EstrelaVeritas({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="88 22 24 23" className={className} style={style} aria-hidden>
      <polygon points={ESTRELA} fill="currentColor" />
    </svg>
  );
}

/** Símbolo completo (estrela + livro) em uma cor, para marca d'água. Proporções oficiais, sem rotação. */
export function SimboloMarcaDagua({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="16 18 168 160" className={className} style={style} aria-hidden>
      <polygon points={ESTRELA} fill="currentColor" />
      <path d="M26 64 Q60 46 94 70 L100 172 Z" fill="currentColor" />
      <path d="M174 64 Q140 46 106 70 L100 172 Z" fill="currentColor" />
    </svg>
  );
}

// Posições determinísticas (sem Math.random para não divergir entre servidor e cliente)
const CONSTELACAO = [
  [8, 14, 10, 0], [18, 72, 7, 1.2], [27, 34, 6, 2.6], [36, 88, 9, .6], [44, 8, 6, 3.1], [52, 58, 7, 1.8],
  [61, 22, 11, .3], [68, 80, 6, 2.2], [76, 42, 8, 3.6], [84, 12, 7, 1.1], [91, 66, 10, 2.9], [96, 30, 6, .9],
  [13, 48, 6, 3.3], [57, 94, 8, 1.5], [72, 4, 6, 2.4], [4, 90, 7, .2], [33, 60, 5, 3.9], [88, 90, 6, 1.7],
] as const;

type Variante = "estudo" | "institucional";

/**
 * Fundo da plataforma: brilhos suaves em ouro e tinta, grão de papel,
 * anéis concêntricos girando devagar, constelação de estrelas Veritas
 * cintilando e o símbolo oficial como marca d'água flutuante.
 * Tudo em CSS (sem JS) e desligado com prefers-reduced-motion.
 */
export function FundoVeritas({ variante = "estudo", className, fixo = true }: { variante?: Variante; className?: string; fixo?: boolean }) {
  const inst = variante === "institucional";
  return (
    <div className={cn("pointer-events-none inset-0 -z-10 overflow-hidden", fixo ? "fixed" : "absolute", inst ? "bg-veritas-tinta" : "bg-fundo", className)} aria-hidden>
      {/* Auroras */}
      <div
        className="absolute -left-[20%] -top-[30%] h-[80vmax] w-[80vmax] animate-aurora rounded-full blur-3xl"
        style={{ background: `radial-gradient(closest-side, rgb(${inst ? "184 147 90" : "var(--brilho-fundo-1)"} / ${inst ? ".22" : ".16"}), transparent)` }}
      />
      <div
        className="absolute -bottom-[35%] -right-[25%] h-[85vmax] w-[85vmax] animate-aurora rounded-full blur-3xl [animation-delay:-12s]"
        style={{ background: `radial-gradient(closest-side, rgb(${inst ? "43 65 102" : "var(--brilho-fundo-2)"} / ${inst ? ".55" : ".10"}), transparent)` }}
      />
      {inst && (
        <div className="absolute left-1/2 top-0 h-[70vh] w-[60vw] -translate-x-1/2 opacity-60" style={{ background: "conic-gradient(from 180deg at 50% 0%, transparent 42%, rgba(212,178,122,.10) 50%, transparent 58%)" }} />
      )}

      {/* Anéis concêntricos (heráldica) atrás da marca d'água */}
      <svg className={cn("absolute -right-[18vmin] bottom-[-22vmin] h-[110vmin] w-[110vmin] animate-gira-lento", inst ? "text-veritas-ouro/25" : "text-destaque/20")} viewBox="0 0 400 400">
        <circle cx="200" cy="200" r="196" fill="none" stroke="currentColor" strokeWidth=".6" />
        <circle cx="200" cy="200" r="170" fill="none" stroke="currentColor" strokeWidth=".6" strokeDasharray="2 7" />
        <circle cx="200" cy="200" r="140" fill="none" stroke="currentColor" strokeWidth=".4" />
        {Array.from({ length: 24 }, (_, i) => (
          <line key={i} x1="200" y1="6" x2="200" y2="18" stroke="currentColor" strokeWidth=".8" transform={`rotate(${i * 15} 200 200)`} />
        ))}
      </svg>

      {/* Marca d'água: símbolo oficial */}
      <div className="absolute -right-[6vmin] bottom-[-4vmin] animate-flutua-lento">
        <SimboloMarcaDagua
          className={cn("h-[78vmin] w-[78vmin]", inst ? "text-veritas-ouro" : "text-veritas-tinta dark:text-veritas-ouro")}
          style={{ opacity: inst ? 0.07 : "var(--marca-dagua)" }}
        />
      </div>

      {/* Constelação */}
      {CONSTELACAO.map(([x, y, s, d], i) => (
        <EstrelaVeritas
          key={i}
          className={cn("absolute animate-cintila", inst ? "text-veritas-ouro" : "text-destaque/70")}
          style={{ left: `${x}%`, top: `${y}%`, width: s * (inst ? 1.6 : 1.2), height: s * (inst ? 1.6 : 1.2), animationDelay: `${d}s`, animationDuration: `${3.5 + (i % 4)}s` }}
        />
      ))}

      {/* Grão de papel + vinheta */}
      <div className={cn("grao absolute inset-0", inst ? "opacity-[.10] mix-blend-screen" : "opacity-[.22] mix-blend-multiply dark:opacity-[.08] dark:mix-blend-screen")} />
      <div className="absolute inset-0" style={{ background: inst ? "radial-gradient(ellipse at center, transparent 40%, rgba(5,10,20,.55))" : "radial-gradient(ellipse at 30% 0%, transparent 55%, rgb(var(--texto) / .05))" }} />
    </div>
  );
}
