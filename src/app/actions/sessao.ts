"use server";
import { z } from "zod";
import { isDemoMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

const Sessao = z.object({
  disciplinaId: z.string().min(1).max(64).nullable(),
  inicio: z.string().datetime(),
  minutos: z.number().int().min(1).max(600),
  modo: z.enum(["livre", "pomodoro"]),
});

/** Registra uma sessão do cronômetro. A agregação em daily_stats é feita no banco (trigger/job). */
export async function registrarSessao(input: z.infer<typeof Sessao>) {
  const dados = Sessao.safeParse(input);
  if (!dados.success) return { ok: false as const, erro: "Sessão inválida." };
  if (isDemoMode) return { ok: true as const, demo: true };

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { ok: false as const, erro: "Sessão expirada. Entre novamente." };

  // Não aceita sessão "do futuro" nem maior que o tempo decorrido desde o início
  const decorrido = (Date.now() - Date.parse(dados.data.inicio)) / 60000;
  if (decorrido < 0 || dados.data.minutos > Math.ceil(decorrido) + 1) return { ok: false as const, erro: "Duração inconsistente." };

  const { error } = await supabase.from("study_sessions").insert({
    user_id: auth.user.id,
    subject_id: dados.data.disciplinaId,
    started_at: dados.data.inicio,
    minutes: dados.data.minutos,
    mode: dados.data.modo,
    source: "timer",
  });
  return error ? { ok: false as const, erro: "Não foi possível salvar a sessão." } : { ok: true as const };
}
