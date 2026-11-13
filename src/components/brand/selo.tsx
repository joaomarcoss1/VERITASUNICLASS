import { cn } from "@/lib/utils";

/**
 * Selo heráldico da Academia (certificados, conquistas, login).
 * Escudo "heater" com filete duplo dourado; no campo, o símbolo oficial Veritas
 * inalterado; no listel, o lema. O logo em si não é redesenhado — o escudo é
 * moldura institucional, como pede o manual (não distorcer/recolorir o logo).
 */
export function SeloUniClass({ className, lema = true }: { className?: string; lema?: boolean }) {
  return (
    <svg viewBox="0 0 240 300" className={cn("shrink-0", className)} role="img" aria-label="Selo Academia Veritas UniClass">
      <defs>
        <linearGradient id="ouro-g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#D4B27A" />
          <stop offset=".5" stopColor="#B8935A" />
          <stop offset="1" stopColor="#7A5C2B" />
        </linearGradient>
      </defs>
      {/* coroa mural */}
      <path d="M78 34 h84 v-14 h-12 v7 h-12 v-7 h-12 v7 h-12 v-7 h-12 v7 h-12 v-7 h-12 z" fill="url(#ouro-g)" />
      {/* escudo */}
      <path d="M30 42 H210 V140 C210 200 168 236 120 256 C72 236 30 200 30 140 Z" fill="#0E1B2E" stroke="url(#ouro-g)" strokeWidth="6" />
      <path d="M42 54 H198 V140 C198 193 162 224 120 242 C78 224 42 193 42 140 Z" fill="none" stroke="#B8935A" strokeOpacity=".55" strokeWidth="1.5" />
      {/* símbolo oficial */}
      <g transform="translate(58 62) scale(0.62)">
        <polygon points="100.00,23.00 102.00,29.86 108.60,27.14 104.48,32.98 110.72,36.45 103.60,36.87 104.77,43.91 100.00,38.60 95.23,43.91 96.40,36.87 89.28,36.45 95.52,32.98 91.40,27.14 98.00,29.86" fill="#B8935A" />
        <path d="M26 64 Q60 46 94 70 L100 172 Z" fill="#B8935A" />
        <path d="M174 64 Q140 46 106 70 L100 172 Z" fill="#B8935A" />
      </g>
      <text x="120" y="210" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600" fontSize="26" letterSpacing="5" fill="#F5F0E6">VU</text>
      {lema && (
        <g>
          <path d="M2 271 L18 262 V256 H222 V262 L238 271 L222 280 V290 H18 V280 Z" fill="#5E1A28" stroke="url(#ouro-g)" strokeWidth="2" />
          <text x="120" y="278" textAnchor="middle" fontFamily="Cormorant Garamond, Georgia, serif" fontWeight="600" fontSize="12" textLength="188" lengthAdjust="spacingAndGlyphs" fill="#F5F0E6">VERITAS · SCIENTIA · VICTORIA</text>
        </g>
      )}
    </svg>
  );
}
