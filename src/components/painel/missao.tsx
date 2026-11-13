"use client";
import Link from "next/link";
import { useState } from "react";
import { BookOpen, Check, ChevronRight, ClipboardList, Layers, Swords, Target } from "lucide-react";
import { EstrelaVeritas, SimboloMarcaDagua } from "@/components/brand/fundo";
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
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 animate-respira rounded-full bg-destaque/15 blur-2xl" aria-hidden />
      <SimboloMarcaDagua className="pointer-events-none absolute -bottom-8 -right-6 h-40 w-40 text-destaque opacity-[.07]" />
      <CardTitulo icone={<Target className="h-4 w-4" />} acao={<span className="num text-sm text-texto-suave">{completa ? "Concluída" : `~${formatMinutos(restante)} restantes`}</span>}>
        Missão do dia
      </CardTitulo>

      <div className="mb-4 flex items-center gap-3">
        <Barra valor={itens.length ? feitos / itens.length : 0} rotulo="Progresso da missão" className="h-2.5" />
        <span className="num shrink-0 text-sm font-semibold">{feitos}/{itens.length}</span>
      </div>

      {completa && (
        <p className="mb-3 flex items-center gap-2 rounded-xl bg-acerto-suave px-3 py-2 text-sm font-semibold text-acerto">
          <EstrelaVeritas className="h-4 w-4 animate-cintila" /> Missão cumprida! Volte amanhã para manter a sequência.
        </p>
      )}
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
                    "group reflexo relative flex items-center gap-3 rounded-xl border px-3 py-3 transition duration-300 ease-premium",
                    item.feito ? "border-acerto/30 bg-acerto-suave/60" : "border-borda bg-superficie-alta/50 hover:-translate-y-0.5 hover:border-destaque/60 hover:bg-superficie-alta hover:shadow-[0_10px_24px_-14px_rgba(14,27,46,.45)]",
                    foco === item.id && "ring-2 ring-destaque/40",
                  )}
                >
                  <span
                    className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-xl text-white shadow-md ring-1 ring-inset ring-white/20 transition-transform duration-300 group-hover:scale-105", item.feito && "animate-check-pop bg-acerto")}
                    style={!item.feito ? { background: `linear-gradient(135deg, ${cor ?? "#2B4166"}, color-mix(in srgb, ${cor ?? "#2B4166"} 70%, black))` } : undefined}
                    aria-hidden
                  >
                    {item.feito ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate font-semibold", item.feito && "text-texto-suave line-through decoration-acerto/60")}>{item.titulo}</span>
                    <span className="block text-xs text-texto-suave">{item.detalhe}</span>
                  </span>
                  <span className="num shrink-0 text-xs font-medium text-texto-suave">{item.feito ? <span className="text-acerto">Feito</span> : formatMinutos(item.minutos)}</span>
                  {!item.feito && <ChevronRight className="h-4 w-4 shrink-0 text-texto-suave transition-transform duration-300 group-hover:translate-x-1 group-hover:text-destaque-texto" aria-hidden />}
                </Link>
              </li>
            );
          })}
        </ol>
      )}
    </Card>
  );
}
