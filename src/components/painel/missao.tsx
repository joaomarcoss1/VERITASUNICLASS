"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Check, ChevronRight, ClipboardList, Layers, Swords, Target } from "lucide-react";
import { EstrelaVeritas } from "@/components/brand/fundo";
import type { ItemMissao } from "@/lib/services/habit";
import { disciplinas as coresDisc } from "@/lib/design/tokens";
import { Card, CardTitulo } from "@/components/ui/card";
import { Barra } from "@/components/ui/progress";
import { cn, formatMinutos } from "@/lib/utils";

const ICONE = { aula: BookOpen, questoes: ClipboardList, revisao: Layers, simulado: Swords };

export function MissaoDoDia({ itens }: { itens: ItemMissao[] }) {
  // Conclusão vem do servidor (eventos de estudo). Localmente só destacamos o item em andamento.
  const [foco, setFoco] = useState<string | null>(null);
  const feitos = itens.filter((i) => i.feito).length;
  const restante = itens.filter((i) => !i.feito).reduce((s, i) => s + i.minutos, 0);
  const completa = itens.length > 0 && feitos === itens.length;

  return (
    <Card fita className="relative">
      <CardTitulo icone={<Target />}>Missão do dia</CardTitulo>

      <div className="mb-4 flex items-center gap-3">
        <Barra valor={itens.length ? feitos / itens.length : 0} rotulo="Progresso da missão" className="h-2.5" />
        <span className="num shrink-0 text-sm"><strong className="font-semibold">{feitos}/{itens.length}</strong> <span className="text-texto-suave">· {completa ? "concluída" : `~${formatMinutos(restante)} restantes`}</span></span>
      </div>

      {completa && (
        <p className="mb-3 flex items-center gap-2 rounded-[4px] bg-acerto-suave px-3 py-2 text-sm font-semibold text-acerto">
          <EstrelaVeritas className="h-4 w-4" /> Missão cumprida! Volte amanhã para manter a sequência.
        </p>
      )}
      {itens.length === 0 ? (
        <p className="text-sm text-texto-suave">Hoje é dia de descanso no seu plano. Que tal revisar alguns cartões?</p>
      ) : (
        <ol className="divide-y divide-borda border-y border-borda">
          {itens.map((item, idx) => {
            const Icon = ICONE[item.tipo];
            const cor = item.disciplinaId ? coresDisc[item.disciplinaId] : "#2B4166";
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setFoco(item.id)}
                  className={cn(
                    "group relative flex items-center gap-4 py-3.5 pl-4 pr-2 transition-colors duration-200",
                    item.feito ? "bg-acerto-suave/40" : "hover:bg-superficie-alta",
                    foco === item.id && "bg-superficie-alta",
                  )}
                >
                  {/* Lombada na cor da disciplina */}
                  <span className="absolute inset-y-2 left-0 w-[3px] rounded-full transition-all duration-300 group-hover:inset-y-0" style={{ background: item.feito ? "rgb(var(--acerto))" : cor }} aria-hidden />
                  <span className="num w-7 shrink-0 text-sm font-bold leading-none text-destaque-texto">{String(idx + 1).padStart(2, "0")}</span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("flex items-center gap-2 font-semibold", item.feito && "text-texto-suave line-through decoration-acerto/60")}>
                      <span className="truncate">{item.titulo}</span>
                    </span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-xs text-texto-suave">
                      <Icon className="h-3.5 w-3.5" aria-hidden /> {item.detalhe}
                    </span>
                  </span>
                  {item.feito ? (
                    <span className="inline-flex shrink-0 animate-check-pop items-center gap-1 rounded-[3px] border border-acerto/40 px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-widest text-acerto">
                      <Check className="h-3 w-3" /> Feito
                    </span>
                  ) : (
                    <span className="num inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-texto">
                      {formatMinutos(item.minutos)}
                      <ChevronRight className="h-4 w-4 text-texto-suave transition-transform duration-300 group-hover:translate-x-1 group-hover:text-destaque-texto" aria-hidden />
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
