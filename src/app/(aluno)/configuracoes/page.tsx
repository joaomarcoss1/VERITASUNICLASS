import Link from "next/link";
import { LogOut } from "lucide-react";
import { sair } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Card, CardTitulo } from "@/components/ui/card";

export const metadata = { title: "Configurações" };

export default function ConfiguracoesPage() {
  return (
    <div className="space-y-6">
      <h1 className="titulo-institucional text-3xl sm:text-4xl">Configurações</h1>
      <Card>
        <CardTitulo>Objetivo e rotina</CardTitulo>
        <p className="text-sm text-texto-suave">Mudou de concurso ou de disponibilidade? Refaça o onboarding — seu histórico é mantido.</p>
        <Link href="/onboarding" className="mt-3 inline-block text-sm font-semibold text-info hover:underline">Refazer objetivo e rotina</Link>
      </Card>
      <Card>
        <CardTitulo>Privacidade (LGPD)</CardTitulo>
        <p className="text-sm text-texto-suave">Exportação e exclusão dos seus dados pelo próprio painel chegam na Fase 4. Até lá, solicite pelo suporte.</p>
      </Card>
      <form action={sair}><Button variante="secundaria"><LogOut className="h-4 w-4" /> Sair da conta</Button></form>
    </div>
  );
}
