/**
 * Catálogo inicial (espelha supabase/seed.sql). Em produção, o onboarding lê
 * estes dados das tabelas `areas`, `subjects` e `exams_catalog`.
 */
export type Area = { id: string; nome: string; descricao: string };
export type Edital = {
  id: string;
  nome: string;
  orgao: string;
  banca: "Cebraspe" | "FGV" | "FCC" | "Vunesp" | "Cesgranrio";
  areaId: string;
  nivel: "médio" | "superior";
  status: "publicado" | "previsto" | "autorizado";
  /** disciplina → peso (nº de questões na prova). */
  pesos: Record<string, number>;
  notaCorte: number;
};

export const AREAS: Area[] = [
  { id: "tribunais", nome: "Tribunais", descricao: "TJs, TRTs, TREs e TRFs" },
  { id: "policial", nome: "Policial", descricao: "PF, PRF, PC e PM" },
  { id: "fiscal", nome: "Fiscal", descricao: "Receita, SEFAZ e auditorias" },
  { id: "saude", nome: "Saúde", descricao: "EBSERH, secretarias e hospitais" },
  { id: "educacao", nome: "Educação", descricao: "Professores e técnicos" },
  { id: "enem", nome: "ENEM / Vestibular", descricao: "Ensino médio e acesso à universidade" },
];

export const DISCIPLINAS = [
  { id: "portugues", nome: "Língua Portuguesa", curto: "Português" },
  { id: "direito-constitucional", nome: "Direito Constitucional", curto: "Constitucional" },
  { id: "direito-administrativo", nome: "Direito Administrativo", curto: "Administrativo" },
  { id: "raciocinio-logico", nome: "Raciocínio Lógico", curto: "Rac. Lógico" },
  { id: "informatica", nome: "Informática", curto: "Informática" },
  { id: "direito-penal", nome: "Direito Penal", curto: "Penal" },
] as const;

export type DisciplinaId = (typeof DISCIPLINAS)[number]["id"];

export function nomeDisciplina(id: string, curto = false) {
  const d = DISCIPLINAS.find((x) => x.id === id);
  return d ? (curto ? d.curto : d.nome) : id;
}

export const EDITAIS: Edital[] = [
  {
    id: "trt-tecnico-2027",
    nome: "TRT — Técnico Judiciário (Área Administrativa)",
    orgao: "Tribunal Regional do Trabalho",
    banca: "FCC",
    areaId: "tribunais",
    nivel: "médio",
    status: "previsto",
    pesos: { portugues: 15, "direito-constitucional": 10, "direito-administrativo": 10, "raciocinio-logico": 5, informatica: 5 },
    notaCorte: 68,
  },
  {
    id: "pf-agente-2027",
    nome: "Polícia Federal — Agente",
    orgao: "Polícia Federal",
    banca: "Cebraspe",
    areaId: "policial",
    nivel: "superior",
    status: "autorizado",
    pesos: { portugues: 24, "direito-constitucional": 12, "direito-administrativo": 12, "direito-penal": 18, informatica: 14, "raciocinio-logico": 10 },
    notaCorte: 72,
  },
  {
    id: "inss-tecnico-2027",
    nome: "INSS — Técnico do Seguro Social",
    orgao: "INSS",
    banca: "Cebraspe",
    areaId: "tribunais",
    nivel: "médio",
    status: "previsto",
    pesos: { portugues: 20, "direito-constitucional": 10, "direito-administrativo": 10, "raciocinio-logico": 10, informatica: 10 },
    notaCorte: 70,
  },
];

/** Pesos padrão quando o aluno ainda não escolheu edital ("ainda não sei"). */
export function pesosPorArea(areaId: string): Record<string, number> {
  const e = EDITAIS.find((x) => x.areaId === areaId);
  if (e) return e.pesos;
  return Object.fromEntries(DISCIPLINAS.slice(0, 5).map((d) => [d.id, 1]));
}
