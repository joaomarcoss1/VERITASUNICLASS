"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Check, ClipboardList, Layers, Swords, Target } from "lucide-react";
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
    <Card className="relative overflow-hidden">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-destaque/10 blur-2xl" aria-hidden />
      <CardTitulo icone={<Target className="h-4 w-4" />} acao={<span className="num text-sm text-texto-suave">{completa ? "Concluída" : `~${formatMinutos(restante)} restantes`}</span>}>
        Missão do dia
      </CardTitulo>

      <div className="mb-4 flex items-center gap-3">
        <Barra valor={itens.length ? feitos / itens.length : 0} rotulo="Progresso da missão" className="h-2.5" />
        <span className="num shrink-0 text-sm font-semibold">{feitos}/{itens.length}</span>
      </div>

      {itens.length === 0 ? (
        <p className="text-sm text-texto-suave">Hoje é dia de descanso no seu plano. Que tal revisar alguns cartões?</p>
      ) : (
        <ol className="space-y-2">
          {itens.map((item) => {
            const Icon = ICONE[item.tipo];
            const cor = item.disciplinaId ? coresDisc[item.disciplinaId] : undefined;
            return (
              <li key={item.id}>
                <Link
                  href={item.href}
                  onClick={() => setFoco(item.id)}
                  className={cn(
                    "group flex items-center gap-3 rounded-xl border px-3 py-3 transition",
                    item.feito ? "border-acerto/30 bg-acerto-suave/60" : "border-borda hover:border-destaque hover:bg-superficie-alta",
                    foco === item.id && "ring-2 ring-destaque/40",
                  )}
                >
                  <span
                    className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white", item.feito && "bg-acerto")}
                    style={!item.feito ? { background: cor ?? "rgb(var(--info))" } : undefined}
                    aria-hidden
                  >
                    {item.feito ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate font-semibold", item.feito && "text-texto-suave line-through decoration-acerto/60")}>{item.titulo}</span>
                    <span className="block text-xs text-texto-suave">{item.detalhe}</span>
                  </span>
                  <span className="num shrink-0 text-xs font-medium text-texto-suave">{item.feito ? <span className="sr-only">concluído</span> : formatMinutos(item.minutos)}</span>
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
