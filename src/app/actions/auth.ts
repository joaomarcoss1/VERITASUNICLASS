"use server";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { z } from "zod";
import { isDemoMode, SITE_URL } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export type AuthState = { erro?: string; ok?: string; campos?: Record<string, string> } | undefined;

const Email = z.string().trim().toLowerCase().email("Informe um e-mail válido.");
const Senha = z.string().min(8, "A senha precisa ter ao menos 8 caracteres.");

function destinoSeguro(next: FormDataEntryValue | null) {
  const n = typeof next === "string" ? next : "";
  return n.startsWith("/") && !n.startsWith("//") ? n : "/inicio";
}

async function origem() {
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const proto = h.get("x-forwarded-proto") ?? "https";
  return host ? `${proto}://${host}` : SITE_URL;
}

function traduzir(msg: string) {
  if (/invalid login/i.test(msg)) return "E-mail ou senha incorretos.";
  if (/email not confirmed/i.test(msg)) return "Confirme seu e-mail pelo link que enviamos antes de entrar.";
  if (/rate limit|too many/i.test(msg)) return "Muitas tentativas. Aguarde alguns minutos e tente de novo.";
  if (/already registered/i.test(msg)) return "Este e-mail já tem conta. Tente entrar ou recuperar a senha.";
  return "Não foi possível concluir agora. Tente novamente.";
}

export async function entrar(_: AuthState, form: FormData): Promise<AuthState> {
  const next = destinoSeguro(form.get("next"));
  if (isDemoMode) redirect(next);
  const dados = z.object({ email: Email, senha: z.string().min(1, "Informe a senha.") }).safeParse({ email: form.get("email"), senha: form.get("senha") });
  if (!dados.success) return { erro: dados.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: dados.data.email, password: dados.data.senha });
  if (error) return { erro: traduzir(error.message) };
  redirect(next);
}

export async function linkMagico(_: AuthState, form: FormData): Promise<AuthState> {
  if (isDemoMode) return { ok: "Modo demonstração: o link mágico funciona quando o Supabase estiver configurado." };
  const email = Email.safeParse(form.get("email"));
  if (!email.success) return { erro: email.error.issues[0].message };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({ email: email.data, options: { shouldCreateUser: false, emailRedirectTo: `${await origem()}/auth/callback` } });
  // Mesma resposta exista ou não a conta (evita enumeração de e-mails)
  if (error && !/signups not allowed|not found/i.test(error.message)) return { erro: traduzir(error.message) };
  return { ok: "Se houver uma conta com este e-mail, enviamos um link de acesso." };
}

export async function entrarComGoogle() {
  if (isDemoMode) redirect("/inicio");
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: `${await origem()}/auth/callback` } });
  if (error || !data.url) redirect("/login?erro=google");
  redirect(data.url);
}

const Cadastro = z.object({
  nome: z.string().trim().min(3, "Informe seu nome completo.").max(120),
  email: Email,
  celular: z.string().transform((v) => v.replace(/\D/g, "")).pipe(z.string().regex(/^\d{10,11}$/, "Informe um celular com DDD.")),
  senha: Senha,
  termos: z.literal("on", { errorMap: () => ({ message: "É preciso aceitar os Termos e a Política de Privacidade." }) }),
});

export async function cadastrar(_: AuthState, form: FormData): Promise<AuthState> {
  const bruto = Object.fromEntries(["nome", "email", "celular", "senha", "termos"].map((k) => [k, form.get(k) ?? undefined]));
  const dados = Cadastro.safeParse(bruto);
  const campos = { nome: String(bruto.nome ?? ""), email: String(bruto.email ?? ""), celular: String(bruto.celular ?? "") };
  if (!dados.success) return { erro: dados.error.issues[0].message, campos };
  if (isDemoMode) redirect("/onboarding");

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: dados.data.email,
    password: dados.data.senha,
    options: {
      emailRedirectTo: `${await origem()}/auth/callback?next=/onboarding`,
      // Lidos pelo trigger handle_new_user, que cria o profile e registra o consentimento LGPD
      data: { full_name: dados.data.nome, phone: dados.data.celular, terms_version: "2026-11", privacy_version: "2026-11" },
    },
  });
  if (error) return { erro: traduzir(error.message), campos };
  if (!data.session) return { ok: "Conta criada! Enviamos um link de confirmação para o seu e-mail." };
  redirect("/onboarding");
}

export async function recuperarSenha(_: AuthState, form: FormData): Promise<AuthState> {
  if (isDemoMode) return { ok: "Modo demonstração: a recuperação funciona com o Supabase configurado." };
  const email = Email.safeParse(form.get("email"));
  if (!email.success) return { erro: email.error.issues[0].message };
  const supabase = await createClient();
  await supabase.auth.resetPasswordForEmail(email.data, { redirectTo: `${await origem()}/auth/callback?next=/configuracoes` });
  return { ok: "Se houver uma conta com este e-mail, enviamos as instruções para redefinir a senha." };
}

export async function sair() {
  if (!isDemoMode) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect("/login");
}
