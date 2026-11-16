"use client";
import { useState } from "react";
import { BookMarked, Timer } from "lucide-react";
import type { DiaEstudo } from "@/lib/data/types";
import { DIAS_PERIODO, totaisPorDisciplina, type Periodo } from "@/lib/services/estudo";
import { Card, CardTitulo } from "@/components/ui/card";
import { Segmentado } from "@/components/ui/segmentado";
import { formatDuracao } from "@/lib/utils";
import { corDe, nomeDe } from "./comum";

/** Matérias mais estudadas: faixa de participação + cartões por disciplina, por Hoje / Semana / Mês. */
export function MateriasEstudadas({ estudo }: { estudo: DiaEstudo[] }) {
  const [periodo, setPeriodo] = useState<Periodo>("semana");
  const { total, disciplinas } = totaisPorDisciplina(estudo, DIAS_PERIODO[periodo]);

  return (
    <Card>
      <CardTitulo icone={<BookMarked />} subtitulo={`${formatDuracao(total)} no período`}
        acao={<Segmentado rotulo="Período" valor={periodo} onChange={setPeriodo} opcoes={[{ v: "hoje", t: "Hoje" }, { v: "semana", t: "Semana" }, { v: "mes", t: "Mês" }]} />}>
        Matérias mais estudadas
      </CardTitulo>

      {disciplinas.length === 0 ? (
        <p className="py-10 text-center text-sm text-texto-suave">Nenhum estudo registrado neste período. Que tal começar agora?</p>
      ) : (
        <div key={periodo}>
          {/* Faixa de participação */}
          <div className="flex h-3 overflow-hidden rounded-full bg-borda/50" role="img" aria-label="Participação de cada disciplina no tempo">
            {disciplinas.map((d, i) => (
              <span key={d.disciplinaId} className="h-full origin-left animate-[cresce-x_.8s_cubic-bezier(.2,.7,.2,1)_both]" style={{ width: `${d.fatia * 100}%`, background: corDe(d.disciplinaId), animationDelay: `${i * 60}ms` }} />
            ))}
          </div>

          {/* Cartões por disciplina */}
          <div className="escalonado -mx-1 mt-5 flex snap-x gap-3 overflow-x-auto px-1 pb-2 [scrollbar-width:thin]">
            {disciplinas.map((d) => {
              const cor = corDe(d.disciplinaId);
              return (
                <article key={d.disciplinaId} className="group relative w-[11.5rem] shrink-0 snap-start overflow-hidden rounded-[16px] border border-borda/80 bg-superficie p-4 transition duration-300 ease-premium hover:-translate-y-1 hover:shadow-[0_16px_30px_-18px_rgba(14,27,46,.45)]"
                  style={{ backgroundImage: `linear-gradient(160deg, color-mix(in srgb, ${cor} 9%, transparent), transparent 60%)` }}>
                  <span className="absolute inset-x-0 top-0 h-1" style={{ background: cor }} aria-hidden />
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-0.5 text-[0.68rem] font-semibold text-white" style={{ background: cor }}>
                    <span className="truncate">{nomeDe(d.disciplinaId)}</span>
                  </span>
                  <p className="num mt-3 text-[1.65rem] font-semibold leading-none tracking-tight">{formatDuracao(d.minutos)}</p>
                  <div className="mt-3 flex items-center justify-between text-[0.7rem] text-texto-suave">
                    <span className="inline-flex items-center gap-1"><span className="num font-semibold text-texto">{(d.fatia * 100).toFixed(1).replace(".", ",")}%</span> do tempo</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-borda/60"><span className="block h-full rounded-full transition-all duration-700" style={{ width: `${d.fatia * 100}%`, background: cor }} /></div>
                  <p className="mt-2.5 inline-flex items-center gap-1 text-[0.7rem] text-texto-suave"><Timer className="h-3.5 w-3.5" /> {formatDuracao(d.mediaDia)}/dia · {d.diasEstudados} {d.diasEstudados === 1 ? "dia" : "dias"}</p>
                </article>
              );
            })}
          </div>

          {/* Ranking completo */}
          <ol className="mt-4 space-y-2.5 border-t border-borda pt-4">
            {disciplinas.map((d, i) => (
              <li key={d.disciplinaId} className="grid grid-cols-[1.25rem_minmax(0,9rem)_1fr_auto] items-center gap-3 text-sm">
                <span className="num text-xs font-semibold text-destaque-texto">{i + 1}º</span>
                <span className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: corDe(d.disciplinaId) }} /><span className="truncate">{nomeDe(d.disciplinaId, false)}</span></span>
                <span className="h-1.5 overflow-hidden rounded-full bg-borda/60">
                  <span className="block h-full origin-left animate-[cresce-x_.9s_cubic-bezier(.2,.7,.2,1)_both] rounded-full" style={{ width: `${(d.minutos / disciplinas[0].minutos) * 100}%`, background: corDe(d.disciplinaId), animationDelay: `${i * 80}ms` }} />
                </span>
                <span className="num inline-flex items-center gap-1 text-xs font-semibold"><Timer className="h-3.5 w-3.5 text-texto-suave" />{formatDuracao(d.minutos)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}
