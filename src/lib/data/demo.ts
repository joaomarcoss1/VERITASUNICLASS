/**
 * Aluno de demonstração com 60 dias de histórico, gerado de forma determinística.
 * Usado quando o Supabase não está configurado (e como referência do formato
 * que os agregados `daily_stats` / `topic_mastery` devem ter).
 */
import { DISCIPLINAS, EDITAIS, nomeDisciplina } from "@/lib/catalog";
import { calcularStreak, montarMissao, XP } from "@/lib/services/habit";
import { gerarPlanoSemanal } from "@/lib/services/study-plan";
import { diaLocal } from "@/lib/utils";
import type { DesempenhoDisciplina, PainelData } from "./types";

function rng(seed: number) {
  return () => {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  };
}

function addDias(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

export function demoHistorico(hoje = diaLocal()) {
  const r = rng(42);
  return Array.from({ length: 60 }, (_, i) => {
    const data = addDias(hoje, i - 59);
    const isHoje = i === 59;
    const falta = !isHoje && (i === 12 || i === 31 || r() < 0.04);
    const minutos = isHoje ? 35 : falta ? 0 : Math.round(40 + r() * 110);
    const questoes = isHoje ? 12 : falta ? 0 : Math.round(minutos / 3 + r() * 10);
    const acertoBase = 0.55 + (i / 60) * 0.15; // evolução ao longo dos 60 dias
    const acertos = Math.round(questoes * Math.min(0.95, acertoBase + (r() - 0.5) * 0.12));
    return { data, minutos, questoes, acertos };
  });
}

const DOMINIO_DEMO: Record<string, { dominio: number; acerto: number; antes: number; questoes: number }> = {
  portugues: { dominio: 78, acerto: 79, antes: 74, questoes: 612 },
  "direito-constitucional": { dominio: 46, acerto: 52, antes: 48, questoes: 388 },
  "direito-administrativo": { dominio: 58, acerto: 61, antes: 63, questoes: 341 },
  "raciocinio-logico": { dominio: 39, acerto: 44, antes: 44, questoes: 205 },
  informatica: { dominio: 71, acerto: 73, antes: 66, questoes: 254 },
};

export function getPainelDemo(): PainelData {
  const hoje = diaLocal();
  const historico = demoHistorico(hoje);
  const edital = EDITAIS[0];
  const streak = calcularStreak(historico, hoje);

  const disciplinas: DesempenhoDisciplina[] = Object.entries(DOMINIO_DEMO).map(([id, d]) => ({
    disciplinaId: id,
    nome: nomeDisciplina(id),
    acerto: d.acerto,
    questoes: d.questoes,
    dominio: d.dominio,
    tendencia: d.acerto - d.antes >= 2 ? "subindo" : d.antes - d.acerto >= 2 ? "caindo" : "estavel",
  }));

  const plano = gerarPlanoSemanal(
    Object.entries(edital.pesos).map(([id, peso]) => ({ id, nome: nomeDisciplina(id, true), peso, dominio: DOMINIO_DEMO[id]?.dominio ?? 0 })),
    { dias: [1, 2, 3, 4, 5, 6], minutosPorDia: 100 },
  );
  const diaSemana = new Date(`${hoje}T12:00:00Z`).getUTCDay();
  const planoHoje = plano.find((d) => d.diaSemana === diaSemana) ?? plano[0];

  const missao = montarMissao({
    sessoes: planoHoje.sessoes,
    revisoesVencidas: 12,
    limiteRevisoes: 30,
    minutosDisponiveis: 100,
    concluidos: new Set(["revisao-srs"]),
  });

  const ultimos7 = historico.slice(-7);
  const totalQuestoes = historico.reduce((s, d) => s + d.questoes, 0);
  const totalAcertos = historico.reduce((s, d) => s + d.acertos, 0);
  const rec = historico.slice(-30), ant = historico.slice(0, 30);
  const taxa = (xs: typeof historico) => (100 * xs.reduce((s, d) => s + d.acertos, 0)) / Math.max(1, xs.reduce((s, d) => s + d.questoes, 0));
  const delta = Math.round(taxa(rec) - taxa(ant));

  const xpTotal = historico.reduce((s, d) => s + d.acertos * XP.questaoCerta + (d.questoes - d.acertos) * XP.questaoErrada + d.minutos * XP.minutoEstudo, 0);
  const xpSemana = ultimos7.reduce((s, d) => s + d.acertos * XP.questaoCerta + (d.questoes - d.acertos) * XP.questaoErrada + d.minutos * XP.minutoEstudo, 0);
  const dataProva = addDias(hoje, 87);

  return {
    demo: true,
    aluno: { nome: "Marina Albuquerque", primeiroNome: "Marina", xpTotal, xpSemana },
    objetivo: {
      titulo: edital.nome,
      banca: edital.banca,
      dataProva,
      diasRestantes: 87,
      coberturaEdital: 46,
      assuntosEstudados: 37,
      assuntosTotal: 80,
    },
    missao,
    streak: { atual: streak.atual, recorde: streak.recorde, escudos: streak.escudos, emRisco: streak.emRisco, hojeCumprido: streak.hojeCumprido },
    semana: { minutos: ultimos7.reduce((s, d) => s + d.minutos, 0), metaMinutos: 600, dias: ultimos7.map((d) => ({ data: d.data, minutos: d.minutos })) },
    continuar: {
      tipo: "aula",
      titulo: "Aula 4 · Direitos e garantias fundamentais",
      subtitulo: "Direito Constitucional — Trilha Tribunais (Técnico)",
      progresso: 0.62,
      href: "/cursos",
    },
    desempenho: {
      acertoGeral: Math.round((100 * totalAcertos) / Math.max(1, totalQuestoes)),
      tendencia: delta > 1 ? "subindo" : delta < -1 ? "caindo" : "estavel",
      deltaPontos: delta,
      disciplinas,
    },
    revisoesPendentes: 12,
    proximoSimulado: { titulo: "Simulado semanal — TRT Técnico", quando: "segunda-feira", questoes: 45 },
    plano,
    estudo: historico.map((d, i) => {
      // Distribui os minutos do dia entre as disciplinas do plano (determinístico)
      const ids = Object.keys(DOMINIO_DEMO);
      const pesos = ids.map((id, k) => 1 + ((i * 7 + k * 13) % 5) + (100 - DOMINIO_DEMO[id].dominio) / 25);
      const soma = pesos.reduce((a, b) => a + b, 0);
      const porDisciplina: Record<string, number> = {};
      let resto = d.minutos;
      ids.forEach((id, k) => {
        const m = k === ids.length - 1 ? resto : Math.round((d.minutos * pesos[k]) / soma);
        porDisciplina[id] = Math.max(0, Math.min(resto, m));
        resto -= porDisciplina[id];
      });
      return { data: d.data, minutos: d.minutos, porDisciplina };
    }),
    metaDiariaMinutos: 100,
    atividades: [
      { id: "a1", quando: `${hoje}T09:40:00-03:00`, disciplinaId: "portugues", tipo: "questoes", minutos: 25, questoes: 12, acertos: 10 },
      { id: "a2", quando: `${hoje}T08:55:00-03:00`, disciplinaId: null, tipo: "revisao", minutos: 10 },
      { id: "a3", quando: `${addDias(hoje, -1)}T21:10:00-03:00`, disciplinaId: "direito-constitucional", tipo: "aula", minutos: 19 },
      { id: "a4", quando: `${addDias(hoje, -1)}T20:30:00-03:00`, disciplinaId: "raciocinio-logico", tipo: "questoes", minutos: 40, questoes: 18, acertos: 8 },
      { id: "a5", quando: `${addDias(hoje, -3)}T19:05:00-03:00`, disciplinaId: "direito-administrativo", tipo: "simulado", minutos: 55, questoes: 30, acertos: 19 },
      { id: "a6", quando: `${addDias(hoje, -3)}T07:15:00-03:00`, disciplinaId: "informatica", tipo: "aula", minutos: 16 },
    ],
    insights: [
      { id: "1", titulo: "TRT-2 tem concurso autorizado com 120 vagas para técnico", resumo: "Comissão formada; a banca deve ser definida nas próximas semanas. Conteúdo deve seguir o último edital.", tag: "Tribunais", data: addDias(hoje, -1), fonteUrl: "https://www.gov.br" },
      { id: "2", titulo: "Nova súmula vinculante altera tema de concurso público", resumo: "Entendimento sobre nomeação de aprovados fora das vagas já foi incorporado ao comentário das questões afetadas.", tag: "Legislação", data: addDias(hoje, -3), fonteUrl: "https://portal.stf.jus.br" },
      { id: "3", titulo: "FCC divulga cronograma de provas do 1º semestre", resumo: "Datas confirmadas para três tribunais; confira se a sua prova coincide com outras da área.", tag: "Bancas", data: addDias(hoje, -5), fonteUrl: "https://www.concursosfcc.com.br" },
    ],
  };
}

export { DISCIPLINAS };
