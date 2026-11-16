"use client";
import { useState } from "react";
import { BarChart3 } from "lucide-react";
import type { DiaEstudo } from "@/lib/data/types";
import { comparativo } from "@/lib/services/estudo";
import { Card, CardTitulo } from "@/components/ui/card";
import { cn, formatDuracao, relogio } from "@/lib/utils";
import { corDe, diaMes, diaSemana, nomeDe } from "./comum";

/** Últimos 7 dias: seletor de dia em pílulas, relógio do dia e colunas em cápsula (o dia escolhido abre por disciplina). */
export function UltimosSeteDias({ estudo, meta }: { estudo: DiaEstudo[]; meta: number }) {
  const dias = estudo.slice(-7);
  const [sel, setSel] = useState(dias.length - 1);
  const atual = dias[sel];
  const max = Math.max(meta * 1.25, ...dias.map((d) => d.minutos), 1);
  const comp = comparativo(estudo, 7);
  const pctMeta = meta ? Math.round((atual.minutos / meta) * 100) : 0;
  const segmentos = Object.entries(atual.porDisciplina).filter(([, m]) => m > 0).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardTitulo icone={<BarChart3 />} subtitulo="Toque em um dia para ver o detalhe">Últimos 7 dias</CardTitulo>

      {/* Pílulas de dia */}
      <div className="grid grid-cols-7 gap-1" role="tablist" aria-label="Dia">
        {dias.map((d, i) => {
          const hoje = i === dias.length - 1;
          const on = i === sel;
          return (
            <button key={d.data} role="tab" aria-selected={on} onClick={() => setSel(i)}
              className={cn("flex flex-col items-center rounded-lg py-1.5 text-[0.6875rem] transition-colors duration-200", on ? "bg-primaria text-primaria-texto" : "text-texto-suave hover:bg-superficie-alta")}>
              <span className={cn("font-medium", on ? "opacity-80" : "")}>{hoje ? "Hoje" : diaSemana(d.data)}</span>
              <span className="num text-[0.9375rem] font-semibold leading-tight">{diaMes(d.data)}</span>
            </button>
          );
        })}
      </div>

      {/* Relógio do dia */}
      <div className="mt-5 flex items-end justify-between gap-3">
        <div key={sel} className="animate-sobe-fade">
          <p className="num text-[2rem] font-semibold leading-none tracking-[-0.02em]">{relogio(atual.minutos)}</p>
          <p className="mt-1.5 text-xs text-texto-suave">horas líquidas no dia</p>
        </div>
        <span className={cn("rounded-md px-2 py-0.5 text-xs font-semibold", pctMeta >= 100 ? "bg-acerto-suave text-acerto" : "bg-revisar-suave text-revisar")}>
          {pctMeta}% da meta
        </span>
      </div>

      {/* Colunas */}
      <div className="relative mt-5 h-44">
        <div className="absolute inset-x-0 bottom-0 border-t border-borda" aria-hidden />
        <div className="absolute inset-x-0 border-t border-borda/70" style={{ bottom: "50%" }} aria-hidden />
        <div className="absolute inset-x-0 border-t border-dashed border-texto-suave/60" style={{ bottom: `${(meta / max) * 100}%` }} aria-hidden>
          <span className="absolute -top-2.5 right-0 bg-superficie pl-1.5 text-[0.625rem] font-medium text-texto-suave">Meta {formatDuracao(meta)}</span>
        </div>
        <div className="grid h-full grid-cols-7 items-end gap-2">
          {dias.map((d, i) => {
            const on = i === sel;
            const h = Math.max(3, (d.minutos / max) * 100);
            return (
              <button key={d.data} onClick={() => setSel(i)} aria-label={`${diaSemana(d.data)} ${diaMes(d.data)}: ${formatDuracao(d.minutos)}`}
                className="group relative flex h-full items-end justify-center">
                <span className="pointer-events-none absolute z-10 -translate-y-2 whitespace-nowrap rounded-md bg-slate-900 px-2 py-1 text-[0.6875rem] font-medium text-white opacity-0 shadow-lg transition group-hover:-translate-y-3 group-hover:opacity-100" style={{ bottom: `${h}%` }}>
                  {formatDuracao(d.minutos)}
                </span>
                <span
                  className={cn("flex w-full max-w-[32px] origin-bottom animate-cresce flex-col-reverse gap-[2px] overflow-hidden rounded-t-[4px] transition-colors duration-200", on ? "" : "bg-borda-forte group-hover:bg-texto-suave/50")}
                  style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }}
                >
                  {on && segmentos.map(([id, m]) => (
                    <span key={id} title={`${nomeDe(id)}: ${formatDuracao(m)}`} className="w-full shrink-0" style={{ height: `calc(${(m / Math.max(1, d.minutos)) * 100}% - 2px)`, background: corDe(id) }} />
                  ))}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Legenda do dia + comparativo */}
      <div key={`l${sel}`} className="mt-4 flex flex-wrap gap-x-3 gap-y-1.5 text-[0.7rem] text-texto-suave">
        {segmentos.slice(0, 4).map(([id, m]) => (
          <span key={id} className="inline-flex animate-sobe-fade items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: corDe(id) }} />{nomeDe(id)} <span className="num font-medium text-texto">{formatDuracao(m)}</span></span>
        ))}
      </div>
      <p className="mt-3 border-t border-borda pt-3 text-xs text-texto-suave">
        Semana: <strong className="text-texto">{formatDuracao(comp.atual)}</strong> · período anterior {formatDuracao(comp.anterior)}
        {comp.variacao != null && (
          <span className={cn("ml-1.5 font-semibold", comp.variacao >= 0 ? "text-acerto" : "text-erro")}>{comp.variacao >= 0 ? "▲" : "▼"} {Math.abs(Math.round(comp.variacao * 100))}%</span>
        )}
      </p>
    </Card>
  );
}
