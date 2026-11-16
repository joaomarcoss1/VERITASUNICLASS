import { Flame, Shield, Sparkles } from "lucide-react";
import type { PainelData } from "@/lib/data/types";
import type { nivelPorXp } from "@/lib/services/habit";
import { Card, CardTitulo } from "@/components/ui/card";
import { Anel, Barra, Contador } from "@/components/ui/progress";
import { cn, formatMinutos } from "@/lib/utils";


export function HabitoCard({ streak, semana, xpSemana, nivel }: { streak: PainelData["streak"]; semana: PainelData["semana"]; xpSemana: number; nivel: ReturnType<typeof nivelPorXp> }) {
  const progresso = semana.metaMinutos ? semana.minutos / semana.metaMinutos : 0;
  return (
    <Card>
      <CardTitulo icone={<Flame />}>Constância</CardTitulo>
      <div className="flex items-center gap-5">
        <Anel valor={progresso} rotulo={`Meta semanal: ${Math.round(progresso * 100)}%`}>
          <div>
            <p className="num text-xl font-semibold leading-none">{formatMinutos(semana.minutos)}</p>
            <p className="num mt-1 text-[0.7rem] text-texto-suave">de {formatMinutos(semana.metaMinutos)}</p>
          </div>
        </Anel>
        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex items-center gap-2">
            <Flame className={cn("h-6 w-6", streak.hojeCumprido ? "fill-destaque text-destaque" : "text-texto-suave")} aria-hidden />
            <p><Contador valor={streak.atual} className="text-2xl font-semibold" /> <span className="text-sm text-texto-suave">dias seguidos</span></p>
          </div>
          <div className="flex items-center gap-1.5" aria-label={`${streak.escudos} escudos protetores guardados de 2`}>
            {[0, 1].map((i) => <Shield key={i} className={cn("h-5 w-5 transition-transform hover:scale-125", i < streak.escudos ? "fill-destaque/80 text-destaque-texto" : "text-borda")} aria-hidden />)}
            <span className="text-xs text-texto-suave">Escudos</span>
          </div>
          <p className="flex items-center gap-1.5 text-sm"><Sparkles className="h-4 w-4 text-destaque-texto" aria-hidden /><Contador valor={xpSemana} sufixo=" XP" className="font-semibold" /> <span className="text-texto-suave">na semana</span></p>
        </div>
      </div>

      {streak.emRisco && (
        <p className="mt-4 rounded-[4px] bg-revisar-suave px-3 py-2 text-sm font-medium text-revisar">Sua sequência está em risco: cumpra a meta mínima hoje.</p>
      )}

      <div className="mt-4 border-t border-borda pt-3">
        <div className="mb-1.5 flex justify-between text-xs"><span className="font-semibold">{nivel.nome}</span>{nivel.proximo && <span className="num text-texto-suave">{nivel.faltam.toLocaleString("pt-BR")} XP para {nivel.proximo}</span>}</div>
        <Barra valor={nivel.progresso} rotulo="Progresso de nível" />
      </div>
    </Card>
  );
}
