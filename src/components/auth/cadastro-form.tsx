"use client";
import Link from "next/link";
import { useActionState } from "react";
import { cadastrar } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Aviso, Campo } from "./campo";

export function CadastroForm() {
  const [estado, acao, pendente] = useActionState(cadastrar, undefined);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="titulo-institucional text-[1.75rem] leading-tight">Crie sua conta</h1>
        <p className="mt-1.5 text-sm text-texto-suave">Em 3 minutos você recebe sua rotina e a primeira missão.</p>
      </div>
      {estado?.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}
      {estado?.ok && <Aviso tipo="ok">{estado.ok}</Aviso>}
      <form action={acao} className="space-y-4">
        <Campo rotulo="Nome completo" name="nome" autoComplete="name" defaultValue={estado?.campos?.nome} required />
        <Campo rotulo="E-mail" name="email" type="email" autoComplete="email" defaultValue={estado?.campos?.email} required />
        <Campo rotulo="Celular (WhatsApp)" name="celular" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 91234-5678" defaultValue={estado?.campos?.celular} required />
        <Campo rotulo="Senha" name="senha" type="password" autoComplete="new-password" minLength={8} required />
        <label className="flex items-start gap-3 text-sm text-texto-suave">
          <input type="checkbox" name="termos" className="mt-0.5 h-5 w-5 rounded accent-[#0E1B2E]" required />
          <span>
            Li e aceito os <Link href="/termos" className="font-semibold text-info underline">Termos de Uso</Link> e a{" "}
            <Link href="/privacidade" className="font-semibold text-info underline">Política de Privacidade</Link>, incluindo o tratamento dos meus dados de estudo (LGPD).
          </span>
        </label>
        <Button type="submit" className="h-10 w-full" disabled={pendente}>{pendente ? "Criando conta…" : "Criar conta grátis"}</Button>
      </form>
      <p className="text-center text-sm text-texto-suave">Já tem conta? <Link href="/login" className="font-semibold text-destaque-texto hover:underline">Entrar</Link></p>
    </div>
  );
}
