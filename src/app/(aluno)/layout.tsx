import { AlunoShell } from "@/components/aluno/shell";
import { isDemoMode } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function AlunoLayout({ children }: { children: React.ReactNode }) {
  let nome = "Marina Albuquerque";
  if (!isDemoMode) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    const { data: p } = data.user ? await supabase.from("profiles").select("full_name").eq("id", data.user.id).maybeSingle() : { data: null };
    nome = p?.full_name ?? data.user?.email ?? "Aluno";
  }
  return <AlunoShell nome={nome} demo={isDemoMode}>{children}</AlunoShell>;
}
