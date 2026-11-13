import "server-only";
import { isDemoMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { calcularStreak, montarMissao, type MetaMinima } from "@/lib/services/habit";
import type { DiaPlano } from "@/lib/services/study-plan";
import { diaLocal } from "@/lib/utils";
import { getPainelDemo } from "./demo";
import type { DesempenhoDisciplina, PainelData, Tendencia } from "./types";

function addDias(iso: string, n: number) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

function tendencia(delta: number): Tendencia {
  return delta >= 2 ? "subindo" : delta <= -2 ? "caindo" : "estavel";
}

/**
 * Lê o painel a partir das tabelas AGREGADAS (daily_stats, daily_subject_stats,
 * topic_mastery) — nunca dos eventos brutos. Todas as consultas passam pela RLS.
 */
export async function getPainel(): Promise<PainelData | { precisaOnboarding: true }> {
  if (isDemoMode) return getPainelDemo();

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  const user = auth.user;
  if (!user) throw new Error("Sessão expirada");

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, timezone, onboarding_completed_at, daily_goal_minutes, daily_goal_questions, review_daily_limit")
    .eq("id", user.id)
    .single();
  if (!profile?.onboarding_completed_at) return { precisaOnboarding: true };

  const hoje = diaLocal(new Date(), profile.timezone ?? "America/Sao_Paulo");
  const desde = addDias(hoje, -59);
  const meta: MetaMinima = { minutos: profile.daily_goal_minutes ?? 25, questoes: profile.daily_goal_questions ?? 10 };

  const [goalQ, statsQ, subjQ, masteryQ, planQ, srsQ, xpQ, progressQ, newsQ] = await Promise.all([
    supabase.from("goals").select("exam_date, minutes_per_day, weekdays, area_id, exams_catalog(name, board, id)").eq("user_id", user.id).eq("active", true).maybeSingle(),
    supabase.from("daily_stats").select("day, minutes, questions, correct").eq("user_id", user.id).gte("day", desde).order("day"),
    supabase.from("daily_subject_stats").select("day, subject_id, questions, correct, subjects(name)").eq("user_id", user.id).gte("day", desde),
    supabase.from("topic_mastery").select("subject_id, mastery, studied").eq("user_id", user.id),
    supabase.from("study_plans").select("plan").eq("user_id", user.id).order("week_start", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("srs_cards").select("id", { count: "exact", head: true }).eq("user_id", user.id).lte("due_at", new Date().toISOString()),
    supabase.from("xp_ledger").select("amount, created_at").eq("user_id", user.id),
    supabase.from("lesson_progress").select("watched_ratio, lessons(title, modules(title, courses(title)))").eq("user_id", user.id).is("completed_at", null).order("updated_at", { ascending: false }).limit(1).maybeSingle(),
    supabase.from("news_posts").select("id, title, summary, tag, published_at, source_url").eq("status", "published").order("published_at", { ascending: false }).limit(3),
  ]);

  const stats = (statsQ.data ?? []).map((d) => ({ data: d.day as string, minutos: d.minutes ?? 0, questoes: d.questions ?? 0, acertos: d.correct ?? 0 }));
  const streak = calcularStreak(stats, hoje, meta);
  const ult7 = Array.from({ length: 7 }, (_, i) => addDias(hoje, i - 6)).map((data) => ({ data, minutos: stats.find((s) => s.data === data)?.minutos ?? 0 }));

  // Desempenho por disciplina: 30 dias recentes × 30 anteriores
  const corte = addDias(hoje, -29);
  const porDisc = new Map<string, { nome: string; q: number; c: number; qAnt: number; cAnt: number }>();
  for (const r of subjQ.data ?? []) {
    const nome = (r.subjects as unknown as { name: string } | null)?.name ?? r.subject_id;
    const e = porDisc.get(r.subject_id) ?? { nome, q: 0, c: 0, qAnt: 0, cAnt: 0 };
    if (r.day >= corte) { e.q += r.questions; e.c += r.correct; } else { e.qAnt += r.questions; e.cAnt += r.correct; }
    porDisc.set(r.subject_id, e);
  }
  const dominioDisc = new Map<string, { soma: number; n: number }>();
  let estudados = 0;
  for (const m of masteryQ.data ?? []) {
    const e = dominioDisc.get(m.subject_id) ?? { soma: 0, n: 0 };
    e.soma += m.mastery; e.n++;
    dominioDisc.set(m.subject_id, e);
    if (m.studied) estudados++;
  }
  const disciplinas: DesempenhoDisciplina[] = [...porDisc.entries()].map(([id, e]) => {
    const acerto = e.q ? (100 * e.c) / e.q : 0;
    const antes = e.qAnt ? (100 * e.cAnt) / e.qAnt : acerto;
    const dm = dominioDisc.get(id);
    return { disciplinaId: id, nome: e.nome, acerto: Math.round(acerto), questoes: e.q + e.qAnt, dominio: dm ? Math.round(dm.soma / dm.n) : 0, tendencia: tendencia(acerto - antes) };
  });
  const totQ = stats.reduce((s, d) => s + d.questoes, 0), totC = stats.reduce((s, d) => s + d.acertos, 0);
  const rec = stats.filter((s) => s.data >= corte), ant = stats.filter((s) => s.data < corte);
  const taxa = (xs: typeof stats) => (100 * xs.reduce((s, d) => s + d.acertos, 0)) / Math.max(1, xs.reduce((s, d) => s + d.questoes, 0));
  const delta = ant.length ? Math.round(taxa(rec) - taxa(ant)) : 0;

  const plano = ((planQ.data?.plan ?? []) as DiaPlano[]);
  const diaSemana = new Date(`${hoje}T12:00:00Z`).getUTCDay();
  const planoHoje = plano.find((d) => d.diaSemana === diaSemana);
  const goal = goalQ.data;
  const exam = goal?.exams_catalog as unknown as { name: string; board: string } | null;
  const revisoes = srsQ.count ?? 0;

  const xpRows = xpQ.data ?? [];
  const semanaIso = new Date(Date.now() - 7 * 864e5).toISOString();
  const lp = progressQ.data as unknown as { watched_ratio: number; lessons: { title: string; modules: { title: string; courses: { title: string } } } } | null;
  const diasRestantes = goal?.exam_date ? Math.max(0, Math.round((Date.parse(goal.exam_date) - Date.parse(hoje)) / 864e5)) : null;

  return {
    demo: false,
    aluno: {
      nome: profile.full_name ?? "Aluno",
      primeiroNome: (profile.full_name ?? "Aluno").split(" ")[0],
      xpTotal: xpRows.reduce((s, x) => s + x.amount, 0),
      xpSemana: xpRows.filter((x) => x.created_at >= semanaIso).reduce((s, x) => s + x.amount, 0),
    },
    objetivo: goal
      ? {
          titulo: exam?.name ?? "Objetivo da área escolhida",
          banca: exam?.board ?? "—",
          dataProva: goal.exam_date,
          diasRestantes,
          coberturaEdital: masteryQ.data?.length ? Math.round((100 * estudados) / masteryQ.data.length) : 0,
          assuntosEstudados: estudados,
          assuntosTotal: masteryQ.data?.length ?? 0,
        }
      : null,
    missao: montarMissao({
      sessoes: planoHoje?.sessoes ?? [],
      revisoesVencidas: revisoes,
      limiteRevisoes: profile.review_daily_limit ?? 30,
      minutosDisponiveis: goal?.minutes_per_day ?? 60,
    }),
    streak: { atual: streak.atual, recorde: streak.recorde, escudos: streak.escudos, emRisco: streak.emRisco, hojeCumprido: streak.hojeCumprido },
    semana: { minutos: ult7.reduce((s, d) => s + d.minutos, 0), metaMinutos: (goal?.minutes_per_day ?? 60) * (goal?.weekdays?.length ?? 5), dias: ult7 },
    continuar: lp
      ? { tipo: "aula", titulo: lp.lessons.title, subtitulo: `${lp.lessons.modules.courses.title} — ${lp.lessons.modules.title}`, progresso: lp.watched_ratio, href: "/cursos" }
      : null,
    desempenho: { acertoGeral: totQ ? Math.round((100 * totC) / totQ) : 0, tendencia: tendencia(delta), deltaPontos: delta, disciplinas },
    revisoesPendentes: revisoes,
    proximoSimulado: { titulo: "Simulado semanal", quando: "segunda-feira", questoes: 40 },
    plano,
    insights: (newsQ.data ?? []).map((n) => ({ id: n.id, titulo: n.title, resumo: n.summary, tag: n.tag, data: n.published_at, fonteUrl: n.source_url })),
  };
}
