/**
 * Design tokens da Academia Veritas UniClass.
 *
 * Camada 1 — Paleta oficial Veritas Group (manual de marca, não alterar).
 * Camada 2 — Extensão acadêmica: cores funcionais derivadas da paleta oficial
 *            para feedback de estudo (acerto/erro/revisão), escala de domínio,
 *            cores por disciplina e o modo escuro "Biblioteca noturna".
 *
 * Todo par texto/fundo listado em `contrastPairs` é validado (WCAG AA) em
 * `tokens.test.ts`. Se mudar uma cor, rode `npm test`.
 */

/** Paleta oficial — proporção de uso: Tinta 60% · Pergaminho 25% · Ouro 10% · Vinho 5%. */
export const brand = {
  tinta: "#0E1B2E", // Azul Tinta — principal: fundos, textos, autoridade
  ouro: "#B8935A", // Ouro Veritas — destaque: símbolo, filetes, selos (nunca texto pequeno em fundo claro)
  ouroAntigo: "#7A5C2B", // Ouro Antigo — dourado para TEXTO em fundo claro
  pergaminho: "#F5F0E6", // Base — fundos claros e páginas
  vinho: "#5E1A28", // Vinho Editorial — secundária / coleção premium
  grafite: "#2A2D33", // Texto corrido
  nevoa: "#D9D2C3", // Linhas, divisores e bordas
} as const;

/** Extensão acadêmica — tons derivados, mesma temperatura editorial da marca. */
export const academic = {
  papel: "#FFFFFF", // fundo e cards no tema claro (branco editorial)
  superficieAlta: "#FAF8F4", // linhas e campos — pergaminho bem diluído
  tinta700: "#1E3150",
  tinta600: "#2B4166", // informação / links
  tinta100: "#E2E7EF",

  /** Feedback de questão — sempre acompanhado de ícone (✓ / ✕), nunca só cor. */
  acerto: "#2F6B3F", // "Louro"
  acertoSuave: "#E3EEDF",
  erro: "#A3262F", // "Lacre" — mais vivo que o Vinho, para não confundir erro com premium
  erroSuave: "#F6E1DF",
  revisar: "#7A5C2B", // Ouro Antigo — marcada para revisão / atenção
  revisarSuave: "#F1E6CF",

  /** Escala de domínio por assunto (0–100) — 5 passos, do Lacre ao Louro. */
  dominio: ["#A3262F", "#B8603A", "#B8935A", "#6E8A4A", "#2F6B3F"] as const,
} as const;

/**
 * Cores por disciplina — paleta categórica validada com o skill de dataviz
 * (faixa de luminosidade, croma, separação para daltonismo e visão normal).
 * Uso: marcas de gráfico e pontos de identificação. O TEXTO nunca usa a cor
 * da série (fica em tinta), por isso não há par "texto branco sobre a cor".
 * Ordem fixa por disciplina — a cor segue a matéria, nunca a posição.
 */
export const disciplinas: Record<string, string> = {
  portugues: "#2F6FDB",
  "direito-constitucional": "#D2504F",
  "raciocinio-logico": "#14968A",
  "direito-administrativo": "#E0A23A",
  informatica: "#7357D6",
  "direito-penal": "#3A9A4A",
  atualidades: "#C2558F",
  "legislacao-especifica": "#5B6B82",
};

/** Mesmas matérias, passos para o fundo escuro (validados contra #131C2B). */
export const disciplinasEscuro: Record<string, string> = {
  portugues: "#4D86EA",
  "direito-constitucional": "#E0625F",
  "raciocinio-logico": "#1FA898",
  "direito-administrativo": "#C08626",
  informatica: "#8B74E6",
  "direito-penal": "#3E9C4E",
  atualidades: "#D46FA4",
  "legislacao-especifica": "#7C8BA3",
};

/** Modo escuro "Biblioteca noturna" — tinta como fundo, pergaminho como texto. */
export const dark = {
  fundo: "#0B1524",
  superficie: "#13213A",
  superficieAlta: "#1B2C49",
  texto: "#EDE6D8",
  textoSuave: "#B9B2A4",
  ouro: "#D1AE74", // ouro clareado para texto em fundo escuro
  borda: "#2A3A57",
  acerto: "#7DBE8B",
  erro: "#EC8A8F",
  revisar: "#D1AE74",
} as const;

/** Pares de texto/fundo efetivamente usados na interface (validados em teste). */
export const contrastPairs: Array<{ nome: string; texto: string; fundo: string; minimo: number }> = [
  { nome: "texto corrido no pergaminho", texto: brand.grafite, fundo: brand.pergaminho, minimo: 4.5 },
  { nome: "texto corrido no branco", texto: brand.grafite, fundo: academic.papel, minimo: 4.5 },
  { nome: "texto suave no branco", texto: "#5C5E63", fundo: academic.papel, minimo: 4.5 },
  { nome: "texto suave nas linhas", texto: "#5C5E63", fundo: academic.superficieAlta, minimo: 4.5 },
  { nome: "ouro antigo nas linhas", texto: brand.ouroAntigo, fundo: academic.superficieAlta, minimo: 4.5 },
  { nome: "título tinta no pergaminho", texto: brand.tinta, fundo: brand.pergaminho, minimo: 4.5 },
  { nome: "ouro antigo (texto) no papel", texto: brand.ouroAntigo, fundo: academic.papel, minimo: 4.5 },
  { nome: "ouro sobre tinta (destaque)", texto: brand.ouro, fundo: brand.tinta, minimo: 4.5 },
  { nome: "pergaminho sobre tinta", texto: brand.pergaminho, fundo: brand.tinta, minimo: 4.5 },
  { nome: "pergaminho sobre vinho", texto: brand.pergaminho, fundo: brand.vinho, minimo: 4.5 },
  { nome: "acerto no papel", texto: academic.acerto, fundo: academic.papel, minimo: 4.5 },
  { nome: "acerto no fundo suave", texto: academic.acerto, fundo: academic.acertoSuave, minimo: 4.5 },
  { nome: "erro no papel", texto: academic.erro, fundo: academic.papel, minimo: 4.5 },
  { nome: "erro no fundo suave", texto: academic.erro, fundo: academic.erroSuave, minimo: 4.5 },
  { nome: "revisar no fundo suave", texto: academic.revisar, fundo: academic.revisarSuave, minimo: 4.5 },
  { nome: "link/info no papel", texto: academic.tinta600, fundo: academic.papel, minimo: 4.5 },
  { nome: "texto no branco", texto: "#101828", fundo: "#FFFFFF", minimo: 4.5 },
  { nome: "texto suave no branco", texto: "#576376", fundo: "#FFFFFF", minimo: 4.5 },
  { nome: "texto suave na faixa", texto: "#576376", fundo: "#F6F7F9", minimo: 4.5 },
  { nome: "link no branco", texto: "#275EC4", fundo: "#FFFFFF", minimo: 4.5 },
  { nome: "[escuro] texto", texto: dark.texto, fundo: dark.superficie, minimo: 4.5 },
  { nome: "[escuro] texto suave", texto: dark.textoSuave, fundo: dark.superficie, minimo: 4.5 },
  { nome: "[escuro] ouro", texto: dark.ouro, fundo: dark.superficie, minimo: 4.5 },
  { nome: "[escuro] acerto", texto: dark.acerto, fundo: dark.superficie, minimo: 4.5 },
  { nome: "[escuro] erro", texto: dark.erro, fundo: dark.superficie, minimo: 4.5 },
];

function channel(c: number) {
  const s = c / 255;
  return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
}

export function luminance(hex: string) {
  const v = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(v.slice(i, i + 2), 16));
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

export function contrastRatio(a: string, b: string) {
  const [l1, l2] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (l1 + 0.05) / (l2 + 0.05);
}

/**
 * Cor da escala de domínio (0–100), alinhada à classificação:
 * Fraco < 50 (lacre/terracota) · Em evolução 50–74 (ouro/oliva) · Dominado ≥ 75 (louro).
 */
export const FAIXAS_DOMINIO = [35, 50, 62, 75] as const;
export function corDominio(indice: number) {
  const i = FAIXAS_DOMINIO.filter((limite) => indice >= limite).length;
  return academic.dominio[i];
}
