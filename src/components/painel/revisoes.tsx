import Link from "next/link";
import { Layers, Swords } from "lucide-react";
import type { PainelData } from "@/lib/data/types";
import { Card, CardTitulo } from "@/components/ui/card";

export function RevisoesCard({ revisoes, simulado }: { revisoes: number; simulado: PainelData["proximoSimulado"] }) {
  return (
    <Card>
      <CardTitulo icone={<Layers className="h-4 w-4" />}>Revisões e simulado</CardTitulo>
      <Link href="/fixacao" className="flex items-center justify-between rounded-xl border border-borda px-4 py-3 hover:border-destaque">
        <span>
          <span className="block font-semibold">Revisões pendentes</span>
          <span className="text-xs text-texto-suave">Repetição espaçada</span>
        </span>
        <span className="num text-2xl font-semibold">{revisoes}</span>
      </Link>
      {simulado && (
        <Link href="/simulados" className="mt-3 flex items-center gap-3 rounded-xl border border-borda px-4 py-3 hover:border-destaque">
          <Swords className="h-5 w-5 text-destaque-texto" aria-hidden />
          <span className="min-w-0">
            <span className="block truncate font-semibold">{simulado.titulo}</span>
            <span className="text-xs text-texto-suave">Libera {simulado.quando} · {simulado.questoes} questões</span>
          </span>
        </Link>
      )}
    </Card>
  );
}
