import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_ANON_KEY, SUPABASE_URL, isDemoMode } from "@/lib/env";

/** Cliente Supabase com a sessão do usuário (respeita RLS). */
export async function createClient() {
  if (isDemoMode) throw new Error("Supabase não configurado (modo demonstração).");
  const cookieStore = await cookies();
  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // chamado a partir de Server Component: o middleware renova a sessão
        }
      },
    },
  });
}

export async function getUser() {
  if (isDemoMode) return null;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  return data.user;
}
