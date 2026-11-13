/**
 * Mecânicas de hábito: sequência (streak) com Escudo Protetor, XP e níveis,
 * índice de domínio por assunto e missão do dia.
 */

// ---------- Streak ----------

export type DiaEstudo = { data: string; minutos: number; questoes: number };
export type MetaMinima = { minutos: number; questoes: number };

export const META_PADRAO: MetaMinima = { minutos: 25, questoes: 10 };
export const ESCUDOS_MAX = 2;
/** A cada N dias seguidos cumprindo a meta, ganha-se 1 escudo. */
export const DIAS_POR_ESCUDO = 7;

export function cumpriuMeta(d: DiaEstudo | undefined, meta: MetaMinima = META_PADRAO) {
  return !!d && (d.minutos >= meta.minutos || d.questoes >= meta.questoes);
}

function addDias(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/**
 * Calcula a sequência atual percorrendo o histórico do mais antigo ao mais novo.
 * Um dia sem meta consome um escudo (se houver); sem escudo, a sequência zera.
 * O dia de hoje ainda incompleto não quebra a sequência ("em risco").
 */
export function calcularStreak(historico: DiaEstudo[], hoje: string, meta: MetaMinima = META_PADRAO) {
  const porData = new Map(historico.map((d) => [d.data, d]));
  const datas = historico.map((d) => d.data).sort();
  if (datas.length === 0) return { atual: 0, recorde: 0, escudos: 0, escudosUsados: 0, emRisco: false, hojeCumprido: false };

  let atual = 0, recorde = 0, escudos = 0, escudosUsados = 0, consecutivos = 0;
  for (let dia = datas[0]; dia < hoje; dia = addDias(dia, 1)) {
    if (cumpriuMeta(porData.get(dia), meta)) {
      atual++;
      consecutivos++;
      if (consecutivos % DIAS_POR_ESCUDO === 0) escudos = Math.min(ESCUDOS_MAX, escudos + 1);
    } else if (atual > 0 && escudos > 0) {
      escudos--;
      escudosUsados++;
      consecutivos = 0; // protegido, mas o ciclo para ganhar escudo recomeça
    } else {
      atual = 0;
      consecutivos = 0;
    }
    recorde = Math.max(recorde, atual);
  }
  const hojeCumprido = cumpriuMeta(porData.get(hoje), meta);
  if (hojeCumprido) atual++;
  recorde = Math.max(recorde, atual);
  return { atual, recorde, escudos, escudosUsados, emRisco: !hojeCumprido && atual > 0, hojeCumprido };
}

// ---------- XP e níveis ----------

export const NIVEIS = [
  { nome: "Aprendiz", xp: 0 },
  { nome: "Escudeiro", xp: 1_000 },
  { nome: "Cavaleiro", xp: 4_000 },
  { nome: "Guardião", xp: 10_000 },
  { nome: "Mestre", xp: 25_000 },
  { nome: "Grão-Mestre Veritas", xp: 60_000 },
] as const;

export const XP = { questaoCerta: 10, questaoErrada: 3, aulaConcluida: 50, minutoEstudo: 1, missaoCompleta: 100 } as const;

export function nivelPorXp(xp: number) {
  let i = 0;
  while (i + 1 < NIVEIS.length && xp >= NIVEIS[i + 1].xp) i++;
  const atual = NIVEIS[i];
  const proximo = NIVEIS[i + 1] ?? null;
  const progresso = proximo ? (xp - atual.xp) / (proximo.xp - atual.xp) : 1;
  return { indice: i, nome: atual.nome, proximo: proximo?.nome ?? null, faltam: proximo ? proximo.xp - xp : 0, progresso };
}

// ---------- Índice de domínio ----------

export type Resposta = { acertou: boolean; dificuldade: 1 | 2 | 3 | 4 | 5; diasAtras: number };

/** Meia-vida (dias) do peso de uma resposta: respostas antigas pesam menos. */
export const MEIA_VIDA_DIAS = 30;
/** Mínimo de respostas para classificar com confiança. */
export const MIN_RESPOSTAS = 5;

/**
 * Domínio 0–100: média ponderada de acertos, com peso = dificuldade × decaimento
 * por recência. Acertar questão difícil vale mais; errar questão fácil pesa mais.
 */
export function indiceDominio(respostas: Resposta[]) {
  if (respostas.length === 0) return { indice: 0, classe: "Sem dados" as const, confianca: 0 };
  let num = 0, den = 0;
  for (const r of respostas) {
    const recencia = Math.pow(0.5, Math.max(0, r.diasAtras) / MEIA_VIDA_DIAS);
    const pesoAcerto = 0.6 + r.dificuldade * 0.2; // 0.8 … 1.6
    const pesoErro = 2.2 - r.dificuldade * 0.2; // 2.0 … 1.2
    const w = (r.acertou ? pesoAcerto : pesoErro) * recencia;
    num += (r.acertou ? 1 : 0) * w;
    den += w;
  }
  const indice = Math.round((num / den) * 100);
  return { indice, classe: classificar(indice), confianca: Math.min(1, respostas.length / (MIN_RESPOSTAS * 4)) };
}

export function classificar(indice: number) {
  if (indice >= 75) return "Dominado" as const;
  if (indice >= 50) return "Em evolução" as const;
  return "Fraco" as const;
}

// ---------- Missão do dia ----------

export type ItemMissao = {
  id: string;
  tipo: "aula" | "questoes" | "revisao" | "simulado";
  titulo: string;
  detalhe: string;
  minutos: number;
  disciplinaId?: string;
  feito: boolean;
  href: string;
};

/**
 * Monta a missão a partir das sessões planejadas do dia e das revisões vencidas,
 * respeitando o tempo disponível (a missão precisa ser realista).
 */
export function montarMissao(opts: {
  sessoes: { disciplinaId: string; disciplina: string; tipo: "aula" | "questoes" | "revisao"; minutos: number }[];
  revisoesVencidas: number;
  limiteRevisoes: number;
  minutosDisponiveis: number;
  concluidos?: Set<string>;
}): ItemMissao[] {
  const itens: ItemMissao[] = [];
  const revisoes = Math.min(opts.revisoesVencidas, opts.limiteRevisoes);
  if (revisoes > 0) {
    itens.push({
      id: "revisao-srs",
      tipo: "revisao",
      titulo: `Revisar ${revisoes} cartões`,
      detalhe: "Repetição espaçada",
      minutos: Math.max(5, Math.ceil(revisoes * 0.75)),
      feito: false,
      href: "/fixacao",
    });
  }
  for (const s of opts.sessoes) {
    if (s.tipo === "revisao") continue; // revisões já entram pelo SRS
    const id = `${s.tipo}-${s.disciplinaId}`;
    if (itens.some((i) => i.id === id)) continue;
    itens.push(
      s.tipo === "aula"
        ? { id, tipo: "aula", titulo: `Aula de ${s.disciplina}`, detalhe: "Próxima aula da trilha", minutos: s.minutos, disciplinaId: s.disciplinaId, feito: false, href: "/cursos" }
        : { id, tipo: "questoes", titulo: `${Math.round(s.minutos / 2.5)} questões de ${s.disciplina}`, detalhe: "Caderno do dia", minutos: s.minutos, disciplinaId: s.disciplinaId, feito: false, href: "/questoes" },
    );
  }
  // Corta pelo tempo disponível, mantendo sempre ao menos 1 item
  let soma = 0;
  const cabem = itens.filter((i, idx) => {
    soma += i.minutos;
    return idx === 0 || soma <= opts.minutosDisponiveis;
  });
  return cabem.map((i) => ({ ...i, feito: opts.concluidos?.has(i.id) ?? false }));
}
