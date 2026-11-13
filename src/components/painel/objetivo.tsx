import Link from "next/link";
import { Hourglass } from "lucide-react";
import type { PainelData } from "@/lib/data/types";
import { Card, CardTitulo, Badge } from "@/components/ui/card";
import { Anel, Contador } from "@/components/ui/progress";

export function ObjetivoCard({ objetivo }: { objetivo: PainelData["objetivo"] }) {
  if (!objetivo) {
    return (
      <Card>
        <CardTitulo icone={<Hourglass className="h-4 w-4" />}>Seu objetivo</CardTitulo>
        <p className="text-sm text-texto-suave">Defina um edital-alvo para ver a contagem regressiva e a cobertura.</p>
        <Link href="/onboarding" className="mt-3 inline-block text-sm font-semibold text-info hover:underline">Definir objetivo</Link>
      </Card>
    );
  }
  const data = objetivo.dataProva ? new Date(`${objetivo.dataProva}T12:00:00Z`).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" }) : "data a definir";
  return (
    <Card>
      <CardTitulo icone={<Hourglass className="h-4 w-4" />}>Rumo à prova</CardTitulo>
      <p className="font-semibold leading-snug">{objetivo.titulo}</p>
      <div className="mt-1 flex items-center gap-2 text-sm text-texto-suave"><Badge className="bg-veritas-tinta text-veritas-pergaminho">{objetivo.banca}</Badge>{data}</div>
      <div className="mt-4 flex items-center gap-5">
        <Anel valor={objetivo.coberturaEdital / 100} tamanho={88} espessura={8} rotulo={`Cobertura do edital: ${objetivo.coberturaEdital}%`}>
          <Contador valor={objetivo.coberturaEdital} sufixo="%" className="text-lg font-semibold" />
        </Anel>
        <div className="text-sm">
          <p className="font-semibold">Cobertura do edital</p>
          <p className="num text-texto-suave">{objetivo.assuntosEstudados} de {objetivo.assuntosTotal} assuntos estudados e praticados</p>
          {objetivo.diasRestantes != null && <p className="num mt-1 font-semibold text-destaque-texto">Faltam {objetivo.diasRestantes} dias</p>}
        </div>
      </div>
    </Card>
  );
}
