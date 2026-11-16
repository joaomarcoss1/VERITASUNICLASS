import type { DiaEstudo } from "@/lib/data/types";

export type Periodo = "hoje" | "semana" | "mes";
export const DIAS_PERIODO: Record<Periodo, number> = { hoje: 1, semana: 7, mes: 30 };

export type TotalDisciplina = { disciplinaId: string; minutos: number; fatia: number; mediaDia: number; diasEstudados: number };

/** Soma os minutos por disciplina nos últimos `dias` (o array termina em hoje). */
export function totaisPorDisciplina(estudo: DiaEstudo[], dias: number): { total: number; disciplinas: TotalDisciplina[] } {
  const janela = estudo.slice(-dias);
  const soma = new Map<string, { minutos: number; dias: number }>();
  for (const d of janela) {
    for (const [id, m] of Object.entries(d.porDisciplina)) {
      if (!m) continue;
      const e = soma.get(id) ?? { minutos: 0, dias: 0 };
      e.minutos += m;
      e.dias += 1;
      soma.set(id, e);
    }
  }
  const total = [...soma.values()].reduce((s, e) => s + e.minutos, 0);
  const disciplinas = [...soma.entries()]
    .map(([disciplinaId, e]) => ({ disciplinaId, minutos: e.minutos, fatia: total ? e.minutos / total : 0, mediaDia: e.minutos / Math.max(1, janela.length), diasEstudados: e.dias }))
    .sort((a, b) => b.minutos - a.minutos);
  return { total, disciplinas };
}

/**
 * Janela de `tamanho` dias terminando `deslocamento` janelas atrás
 * (0 = a mais recente). Usada na Linha do tempo com as setas ‹ ›.
 */
export function janela(estudo: DiaEstudo[], tamanho: number, deslocamento: number) {
  const fim = estudo.length - deslocamento * tamanho;
  const inicio = Math.max(0, fim - tamanho);
  return { dias: estudo.slice(inicio, Math.max(inicio, fim)), temAnterior: inicio > 0, temProxima: deslocamento > 0 };
}

/** Variação do total da janela atual contra a anterior de mesmo tamanho. */
export function comparativo(estudo: DiaEstudo[], tamanho: number) {
  const atual = estudo.slice(-tamanho).reduce((s, d) => s + d.minutos, 0);
  const anterior = estudo.slice(-2 * tamanho, -tamanho).reduce((s, d) => s + d.minutos, 0);
  return { atual, anterior, variacao: anterior ? (atual - anterior) / anterior : null };
}
