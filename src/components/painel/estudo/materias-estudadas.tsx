"use client";
import { useState } from "react";
import { BookMarked } from "lucide-react";
import type { DiaEstudo } from "@/lib/data/types";
import { DIAS_PERIODO, totaisPorDisciplina, type Periodo } from "@/lib/services/estudo";
import { Card, CardTitulo, ChipDisciplina } from "@/components/ui/card";
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
          {/* Faixa de participação (100%) */}
          <div className="flex h-2.5 gap-[2px] overflow-hidden rounded-lg" role="img" aria-label="Participação de cada disciplina no tempo">
            {disciplinas.map((d, i) => (
              <span key={d.disciplinaId} title={`${nomeDe(d.disciplinaId, false)} · ${(d.fatia * 100).toFixed(1)}%`} className="h-full origin-left animate-[cresce-x_.7s_cubic-bezier(.2,.7,.2,1)_both]" style={{ width: `${d.fatia * 100}%`, background: corDe(d.disciplinaId), animationDelay: `${i * 50}ms` }} />
            ))}
          </div>

          {/* Destaques: as 3 com mais tempo */}
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {disciplinas.slice(0, 3).map((d) => (
              <article key={d.disciplinaId} className="animate-sobe-fade rounded-lg border border-borda bg-superficie p-3.5 transition hover:border-borda-forte">
                <ChipDisciplina cor={corDe(d.disciplinaId)}>{nomeDe(d.disciplinaId)}</ChipDisciplina>
                <p className="num mt-3 text-[1.375rem] font-semibold leading-none tracking-[-0.02em]">{formatDuracao(d.minutos)}</p>
                <p className="mt-1.5 text-xs text-texto-suave"><span className="num font-medium text-texto">{(d.fatia * 100).toFixed(1).replace(".", ",")}%</span> do tempo · <span className="num">{formatDuracao(d.mediaDia)}</span>/dia</p>
              </article>
            ))}
          </div>

          {/* Ranking completo */}
          <ol className="mt-5 space-y-2.5">
            {disciplinas.map((d, i) => (
              <li key={d.disciplinaId} className="grid grid-cols-[1rem_minmax(0,10rem)_1fr_3.5rem] items-center gap-3 text-sm">
                <span className="num text-xs font-medium text-texto-suave">{i + 1}</span>
                <span className="flex min-w-0 items-center gap-2"><span className="h-2.5 w-2.5 shrink-0 rounded-sm" style={{ background: corDe(d.disciplinaId) }} /><span className="truncate">{nomeDe(d.disciplinaId, false)}</span></span>
                <span className="h-1.5 overflow-hidden rounded-md bg-superficie-alta">
                  <span className="block h-full origin-left animate-[cresce-x_.9s_cubic-bezier(.2,.7,.2,1)_both] rounded-r-[2px]" style={{ width: `${(d.minutos / disciplinas[0].minutos) * 100}%`, background: corDe(d.disciplinaId), animationDelay: `${i * 80}ms` }} />
                </span>
                <span className="num text-right text-xs font-semibold">{formatDuracao(d.minutos)}</span>
              </li>
            ))}
          </ol>
        </div>
      )}
    </Card>
  );
}
