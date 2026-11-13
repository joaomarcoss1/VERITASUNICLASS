export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

/**
 * Sem Supabase configurado o app roda em modo demonstração: telas navegáveis
 * com um aluno fictício de 60 dias de histórico, sem gravar nada.
 */
export const isDemoMode = !SUPABASE_URL || !SUPABASE_ANON_KEY;
