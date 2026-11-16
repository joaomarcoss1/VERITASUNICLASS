import Link from "next/link";
import { Swords, Layers } from "lucide-react";
import type { PainelData } from "@/lib/data/types";
import { Card, CardTitulo } from "@/components/ui/card";
import { Contador } from "@/components/ui/progress";

export function RevisoesCard({ revisoes, simulado }: { revisoes: number; simulado: PainelData["proximoSimulado"] }) {
  return (
    <Card>
      <CardTitulo icone={<Layers />} subtitulo="Fixação e avaliação da semana">Revisões e simulado</CardTitulo>
      <Link href="/fixacao" className="group block rounded-lg border border-borda p-4 transition hover:border-borda-forte hover:bg-superficie-alta">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.8125rem] font-medium text-texto-suave">Revisões pendentes</p>
            <Contador valor={revisoes} className="mt-1 block text-[1.75rem] font-semibold leading-none tracking-[-0.02em]" />
          </div>
          <span className="rounded-md bg-revisar-suave px-2 py-0.5 text-[0.6875rem] font-semibold text-revisar">Repetição espaçada</span>
        </div>
        <p className="mt-3 text-xs font-medium text-info group-hover:underline">Revisar agora →</p>
      </Link>
      {simulado && (
        <Link href="/simulados" className="group mt-3 flex items-center gap-3 rounded-lg border border-borda p-4 transition hover:border-borda-forte hover:bg-superficie-alta">
          <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-superficie-alta text-texto-suave"><Swords className="h-4 w-4" aria-hidden /></span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{simulado.titulo}</span>
            <span className="text-xs text-texto-suave">Libera {simulado.quando} · <span className="num">{simulado.questoes}</span> questões</span>
          </span>
        </Link>
      )}
    </Card>
  );
}
