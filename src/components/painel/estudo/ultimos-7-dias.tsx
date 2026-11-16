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
              className={cn("flex flex-col items-center rounded-full py-2 text-[0.68rem] transition-all duration-300 ease-premium", on ? "bg-veritas-tinta text-veritas-pergaminho shadow-[0_8px_18px_-8px_rgba(14,27,46,.8)] dark:bg-veritas-ouro dark:text-veritas-tinta" : "text-texto-suave hover:bg-superficie-alta")}>
              <span className={cn("font-medium", on && "text-veritas-ouro dark:text-veritas-tinta")}>{hoje ? "Hoje" : diaSemana(d.data)}</span>
              <span className="num text-base font-semibold leading-tight">{diaMes(d.data)}</span>
            </button>
          );
        })}
      </div>

      {/* Relógio do dia */}
      <div className="mt-5 flex items-end justify-between gap-3">
        <div key={sel} className="animate-sobe-fade">
          <p className="num text-[2.4rem] font-semibold leading-none tracking-tight">{relogio(atual.minutos)}</p>
          <p className="mt-1 text-xs text-texto-suave">líquidas estudadas</p>
        </div>
        <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", pctMeta >= 100 ? "bg-acerto-suave text-acerto" : "bg-revisar-suave text-revisar")}>
          {pctMeta}% da meta
        </span>
      </div>

      {/* Colunas */}
      <div className="relative mt-5 h-44">
        <div className="absolute inset-x-0 border-t border-dashed border-destaque/60" style={{ bottom: `${(meta / max) * 100}%` }} aria-hidden>
          <span className="absolute -top-2.5 right-0 bg-superficie px-1 text-[0.6rem] font-semibold uppercase tracking-wider text-destaque-texto">meta {formatDuracao(meta)}</span>
        </div>
        <div className="grid h-full grid-cols-7 items-end gap-2">
          {dias.map((d, i) => {
            const on = i === sel;
            const h = Math.max(3, (d.minutos / max) * 100);
            return (
              <button key={d.data} onClick={() => setSel(i)} aria-label={`${diaSemana(d.data)} ${diaMes(d.data)}: ${formatDuracao(d.minutos)}`}
                className="group relative flex h-full items-end justify-center">
                <span className="pointer-events-none absolute z-10 -translate-y-2 rounded-md bg-veritas-tinta px-1.5 py-0.5 text-[0.62rem] font-semibold text-veritas-pergaminho opacity-0 transition group-hover:-translate-y-3 group-hover:opacity-100" style={{ bottom: `${h}%` }}>
                  {formatDuracao(d.minutos)}
                </span>
                <span
                  className={cn("flex w-full max-w-[34px] origin-bottom animate-cresce flex-col-reverse overflow-hidden rounded-full transition-all duration-500 ease-premium", on ? "shadow-[0_10px_20px_-10px_rgba(14,27,46,.8)]" : "opacity-80 group-hover:opacity-100")}
                  style={{ height: `${h}%`, animationDelay: `${i * 70}ms`, background: on ? undefined : "linear-gradient(180deg, #CDAA6E, #A9844C)" }}
                >
                  {on && segmentos.map(([id, m]) => (
                    <span key={id} title={`${nomeDe(id)}: ${formatDuracao(m)}`} className="w-full transition-all duration-500" style={{ height: `${(m / Math.max(1, d.minutos)) * 100}%`, background: corDe(id) }} />
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
          <span key={id} className="inline-flex animate-sobe-fade items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{ background: corDe(id) }} />{nomeDe(id)} {formatDuracao(m)}</span>
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
