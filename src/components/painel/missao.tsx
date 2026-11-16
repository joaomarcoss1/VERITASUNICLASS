"use client";
import Link from "next/link";
import { BookOpen, Check, ChevronRight, ClipboardList, Layers, Swords, Target } from "lucide-react";
import type { ItemMissao } from "@/lib/services/habit";
import { Card, CardTitulo, ChipDisciplina } from "@/components/ui/card";
import { Barra } from "@/components/ui/progress";
import { cn, formatMinutos } from "@/lib/utils";
import { corDe, nomeDe } from "./estudo/comum";

const TIPO = {
  aula: { icone: BookOpen, rotulo: "Aula" },
  questoes: { icone: ClipboardList, rotulo: "Questões" },
  revisao: { icone: Layers, rotulo: "Revisão" },
  simulado: { icone: Swords, rotulo: "Simulado" },
};

/** Missão do dia como lista de tarefas: estado, título, disciplina, tipo e duração. */
export function MissaoDoDia({ itens }: { itens: ItemMissao[] }) {
  const feitos = itens.filter((i) => i.feito).length;
  const restante = itens.filter((i) => !i.feito).reduce((s, i) => s + i.minutos, 0);
  const completa = itens.length > 0 && feitos === itens.length;

  return (
    <Card>
      <CardTitulo icone={<Target />} subtitulo={completa ? "Concluída — volte amanhã para manter a sequência" : `${feitos} de ${itens.length} concluídas · cerca de ${formatMinutos(restante)} restantes`}
        acao={<Link href="/rotina">Ver plano</Link>}>
        Missão do dia
      </CardTitulo>
      <Barra valor={itens.length ? feitos / itens.length : 0} rotulo="Progresso da missão" className="mb-4 h-1.5" cor="rgb(var(--acerto))" />

      {itens.length === 0 ? (
        <p className="rounded-lg bg-superficie-alta px-4 py-6 text-center text-sm text-texto-suave">Hoje é dia de descanso no seu plano. Que tal revisar alguns cartões?</p>
      ) : (
        <ul className="-mx-2">
          {itens.map((item) => {
            const tipo = TIPO[item.tipo];
            const Icon = tipo.icone;
            return (
              <li key={item.id}>
                <Link href={item.href} className="group flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-superficie-alta">
                  <span className={cn("grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 transition",
                    item.feito ? "animate-check-pop border-acerto bg-acerto text-white" : "border-borda-forte text-transparent group-hover:border-info")} aria-hidden>
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-sm font-medium", item.feito && "text-texto-suave line-through")}>{item.titulo}</span>
                    <span className="mt-1 flex flex-wrap items-center gap-2 text-xs text-texto-suave">
                      {item.disciplinaId && <ChipDisciplina cor={corDe(item.disciplinaId)}>{nomeDe(item.disciplinaId)}</ChipDisciplina>}
                      <span className="inline-flex items-center gap-1"><Icon className="h-3.5 w-3.5" /> {tipo.rotulo}</span>
                    </span>
                  </span>
                  <span className="num shrink-0 text-[0.8125rem] font-medium text-texto-suave">{item.feito ? <span className="font-semibold text-acerto">Feito</span> : formatMinutos(item.minutos)}</span>
                  <ChevronRight className="h-4 w-4 shrink-0 text-texto-suave/60 transition group-hover:translate-x-0.5 group-hover:text-texto" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}
