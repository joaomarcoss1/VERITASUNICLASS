import "server-only";
import { isDemoMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const PAPEIS = ["aluno", "professor", "revisor", "financeiro", "suporte", "admin"] as const;
export type Papel = (typeof PAPEIS)[number];
export const PAPEIS_ADMINISTRATIVOS: Papel[] = ["professor", "revisor", "financeiro", "suporte", "admin"];

/**
 * Papéis do usuário atual + nível de autenticação. Perfis administrativos
 * exigem 2FA (AAL2) — sem isso, o acesso ao /admin é negado.
 */
export async function contextoAdministrativo() {
  if (isDemoMode) return { papeis: ["admin"] as Papel[], aal2: true, demo: true };
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return { papeis: [] as Papel[], aal2: false, demo: false };
  const [{ data: roles }, { data: aal }] = await Promise.all([
    supabase.from("user_roles").select("role").eq("user_id", auth.user.id),
    supabase.auth.mfa.getAuthenticatorAssuranceLevel(),
  ]);
  return { papeis: (roles ?? []).map((r) => r.role as Papel), aal2: aal?.currentLevel === "aal2", demo: false };
}
