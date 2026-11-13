"use client";
import Link from "next/link";
import { useActionState, useState } from "react";
import { entrar, entrarComGoogle, linkMagico } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Aviso, Campo, GoogleIcon } from "./campo";

export function LoginForm({ next, erroUrl }: { next?: string; erroUrl?: string }) {
  const [modo, setModo] = useState<"senha" | "link">("senha");
  const [estadoSenha, acaoSenha, pendenteSenha] = useActionState(entrar, undefined);
  const [estadoLink, acaoLink, pendenteLink] = useActionState(linkMagico, undefined);
  const estado = modo === "senha" ? estadoSenha : estadoLink;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="titulo-institucional text-4xl">Bem-vindo de volta</h1>
        <p className="mt-2 text-texto-suave">Sua missão de hoje já está pronta.</p>
      </div>

      {erroUrl && <Aviso tipo="erro">{erroUrl === "google" ? "Não foi possível entrar com o Google." : "Link inválido ou expirado. Peça um novo."}</Aviso>}
      {estado?.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}
      {estado?.ok && <Aviso tipo="ok">{estado.ok}</Aviso>}

      <form action={entrarComGoogle}>
        <Button type="submit" variante="secundaria" className="h-12 w-full"><GoogleIcon /> Entrar com Google</Button>
      </form>

      <div className="flex items-center gap-3 text-xs uppercase tracking-widest text-texto-suave"><span className="h-px flex-1 bg-borda" />ou<span className="h-px flex-1 bg-borda" /></div>

      {modo === "senha" ? (
        <form action={acaoSenha} className="space-y-4">
          <input type="hidden" name="next" value={next ?? ""} />
          <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" required />
          <Campo rotulo="Senha" name="senha" type="password" autoComplete="current-password" required />
          <div className="flex justify-end"><Link href="/recuperar-senha" className="text-sm font-medium text-destaque-texto hover:underline">Esqueci a senha</Link></div>
          <Button type="submit" className="h-12 w-full" disabled={pendenteSenha}>{pendenteSenha ? "Entrando…" : "Entrar"}</Button>
        </form>
      ) : (
        <form action={acaoLink} className="space-y-4">
          <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" required />
          <Button type="submit" className="h-12 w-full" disabled={pendenteLink}>{pendenteLink ? "Enviando…" : "Enviar link de acesso"}</Button>
        </form>
      )}

      <button type="button" onClick={() => setModo(modo === "senha" ? "link" : "senha")} className="w-full text-center text-sm font-medium text-info hover:underline">
        {modo === "senha" ? "Prefere entrar sem senha? Receba um link mágico" : "Entrar com e-mail e senha"}
      </button>

      <p className="text-center text-sm text-texto-suave">
        Ainda não tem conta? <Link href="/cadastro" className="font-semibold text-destaque-texto hover:underline">Cadastre-se grátis</Link>
      </p>
    </div>
  );
}
