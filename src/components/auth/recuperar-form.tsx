"use client";
import Link from "next/link";
import { useActionState } from "react";
import { recuperarSenha } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Aviso, Campo } from "./campo";

export function RecuperarForm() {
  const [estado, acao, pendente] = useActionState(recuperarSenha, undefined);
  return (
    <div className="space-y-6">
      <h1 className="titulo-institucional text-4xl">Recuperar senha</h1>
      {estado?.erro && <Aviso tipo="erro">{estado.erro}</Aviso>}
      {estado?.ok && <Aviso tipo="ok">{estado.ok}</Aviso>}
      <form action={acao} className="space-y-4">
        <Campo rotulo="E-mail da conta" name="email" type="email" autoComplete="email" required />
        <Button type="submit" className="h-12 w-full" disabled={pendente}>Enviar instruções</Button>
      </form>
      <Link href="/login" className="block text-center text-sm font-medium text-destaque-texto hover:underline">Voltar para o login</Link>
    </div>
  );
}
