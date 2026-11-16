import Link from "next/link";
import { Swords, Layers } from "lucide-react";
import type { PainelData } from "@/lib/data/types";
import { Card, CardTitulo } from "@/components/ui/card";
import { Contador } from "@/components/ui/progress";

export function RevisoesCard({ revisoes, simulado }: { revisoes: number; simulado: PainelData["proximoSimulado"] }) {
  return (
    <Card>
      <CardTitulo icone={<Layers />}>Revisões e simulado</CardTitulo>
      <Link href="/fixacao" className="reflexo flex items-center justify-between rounded-[4px] border border-borda bg-superficie px-4 py-3 transition duration-300 hover:border-destaque/50 hover:bg-superficie-alta">
        <span>
          <span className="block font-semibold">Revisões pendentes</span>
          <span className="text-xs text-texto-suave">Repetição espaçada</span>
        </span>
        <Contador valor={revisoes} className="text-3xl font-semibold text-destaque-texto" />
      </Link>
      {simulado && (
        <Link href="/simulados" className="reflexo mt-3 flex items-center gap-3 rounded-[4px] border border-borda bg-superficie px-4 py-3 transition duration-300 hover:border-destaque/50 hover:bg-superficie-alta">
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
