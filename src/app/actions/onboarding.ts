"use server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { EDITAIS, nomeDisciplina, pesosPorArea } from "@/lib/catalog";
import { isDemoMode } from "@/lib/env";
import { gerarPlanoSemanal } from "@/lib/services/study-plan";
import { createClient } from "@/lib/supabase/server";
import { diaLocal } from "@/lib/utils";

const Onboarding = z.object({
  editalId: z.string().max(64).nullable(),
  areaId: z.string().max(64),
  dataProva: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).nullable(),
  dias: z.array(z.number().int().min(0).max(6)).min(1, "Escolha ao menos um dia."),
  minutosPorDia: z.number().int().min(25).max(600),
  niveis: z.record(z.string(), z.number().int().min(0).max(100)),
});

export type OnboardingInput = z.infer<typeof Onboarding>;

/**
 * Salva objetivo e disponibilidade e gera o plano no SERVIDOR (o cliente só
 * mostra uma prévia; o plano oficial é sempre recalculado aqui).
 */
export async function concluirOnboarding(input: OnboardingInput) {
  const dados = Onboarding.safeParse(input);
  if (!dados.success) return { erro: dados.error.issues[0].message };
  const d = dados.data;
  if (d.dataProva && d.dataProva < diaLocal()) return { erro: "A data da prova precisa ser futura." };
  const edital = d.editalId ? EDITAIS.find((e) => e.id === d.editalId) : null;
  if (d.editalId && !edital) return { erro: "Edital não encontrado." };

  const pesos = edital?.pesos ?? pesosPorArea(d.areaId);
  const plano = gerarPlanoSemanal(
    Object.entries(pesos).map(([id, peso]) => ({ id, nome: nomeDisciplina(id, true), peso, dominio: d.niveis[id] ?? 30 })),
    { dias: d.dias, minutosPorDia: d.minutosPorDia },
  );

  if (isDemoMode) redirect("/inicio?bem-vindo=1");

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  // RPC transacional: desativa objetivo anterior, cria goal, plano e marca onboarding concluído
  const { error } = await supabase.rpc("complete_onboarding", {
    p_exam_id: edital?.id ?? null,
    p_area_id: d.areaId,
    p_exam_date: d.dataProva,
    p_weekdays: d.dias,
    p_minutes_per_day: d.minutosPorDia,
    p_self_levels: d.niveis,
    p_plan: plano,
  });
  if (error) return { erro: "Não foi possível salvar seu plano. Tente novamente." };
  redirect("/inicio?bem-vindo=1");
}
