import type { ItemMissao } from "@/lib/services/habit";
import type { DiaPlano } from "@/lib/services/study-plan";

export type Tendencia = "subindo" | "estavel" | "caindo";

export type DesempenhoDisciplina = {
  disciplinaId: string;
  nome: string;
  acerto: number; // 0–100
  questoes: number;
  dominio: number; // 0–100
  tendencia: Tendencia;
};

export type Noticia = { id: string; titulo: string; resumo: string; tag: string; data: string; fonteUrl: string };

export type PainelData = {
  demo: boolean;
  aluno: { nome: string; primeiroNome: string; xpTotal: number; xpSemana: number };
  objetivo: {
    titulo: string;
    banca: string;
    dataProva: string | null;
    diasRestantes: number | null;
    coberturaEdital: number; // 0–100
    assuntosEstudados: number;
    assuntosTotal: number;
  } | null;
  missao: ItemMissao[];
  streak: { atual: number; recorde: number; escudos: number; emRisco: boolean; hojeCumprido: boolean };
  semana: { minutos: number; metaMinutos: number; dias: { data: string; minutos: number }[] };
  continuar: { tipo: "aula" | "caderno" | "simulado"; titulo: string; subtitulo: string; progresso: number; href: string } | null;
  desempenho: { acertoGeral: number; tendencia: Tendencia; deltaPontos: number; disciplinas: DesempenhoDisciplina[] };
  revisoesPendentes: number;
  proximoSimulado: { titulo: string; quando: string; questoes: number } | null;
  plano: DiaPlano[];
  insights: Noticia[];
};
