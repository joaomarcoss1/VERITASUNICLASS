"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, GanttChart } from "lucide-react";
import type { DiaEstudo } from "@/lib/data/types";
import { janela, totaisPorDisciplina } from "@/lib/services/estudo";
import { Card, CardTitulo } from "@/components/ui/card";
import { Segmentado } from "@/components/ui/segmentado";
import { cn, formatDuracao, relogio } from "@/lib/utils";
import { corDe, ddmm, nomeDe } from "./comum";

type Escala = "semana" | "mes";

/** Linha do tempo: colunas empilhadas por disciplina, navegação ‹ › entre períodos e legenda com tempo e %. */
export function LinhaDoTempo({ estudo }: { estudo: DiaEstudo[] }) {
  const [escala, setEscala] = useState<Escala>("semana");
  const [desloc, setDesloc] = useState(0);
  const tamanho = escala === "semana" ? 7 : 30;
  const { dias, temAnterior, temProxima } = janela(estudo, tamanho, desloc);
  const { total, disciplinas } = totaisPorDisciplina(dias, dias.length);
  const max = Math.max(60, ...dias.map((d) => d.minutos));
  const ordem = disciplinas.map((d) => d.disciplinaId);
  const [foco, setFoco] = useState<string | null>(null);

  function trocarEscala(e: Escala) { setEscala(e); setDesloc(0); }

  return (
    <Card>
      <CardTitulo icone={<GanttChart />} subtitulo="Tempo por disciplina, dia a dia"
        acao={<Segmentado rotulo="Escala" valor={escala} onChange={trocarEscala} opcoes={[{ v: "semana", t: "Semana" }, { v: "mes", t: "Mês" }]} />}>
        Linha do tempo
      </CardTitulo>

      <div className="flex items-center justify-between gap-2">
        <button onClick={() => setDesloc((d) => d + 1)} disabled={!temAnterior} className="grid h-8 w-8 place-items-center rounded-lg border border-borda text-texto-suave transition hover:bg-superficie-alta hover:text-texto disabled:opacity-30" aria-label="Período anterior"><ChevronLeft className="h-4 w-4" /></button>
        <div className="text-center">
          <p className="sobrelinha">Todas as matérias</p>
          <p className="num mt-0.5 text-sm font-semibold">{dias.length ? `${ddmm(dias[0].data)} a ${ddmm(dias[dias.length - 1].data)}` : "—"}</p>
        </div>
        <button onClick={() => setDesloc((d) => Math.max(0, d - 1))} disabled={!temProxima} className="grid h-8 w-8 place-items-center rounded-lg border border-borda text-texto-suave transition hover:bg-superficie-alta hover:text-texto disabled:opacity-30" aria-label="Próximo período"><ChevronRight className="h-4 w-4" /></button>
      </div>

      {/* Colunas empilhadas */}
      <div key={`${escala}-${desloc}`} className={cn("mt-4 grid h-48 items-end border-b border-borda", escala === "semana" ? "gap-3" : "gap-[3px]")} style={{ gridTemplateColumns: `repeat(${dias.length}, minmax(0, 1fr))` }}>
        {dias.map((d, i) => (
          <div key={d.data} className="group relative flex h-full flex-col justify-end" title={`${ddmm(d.data)} · ${formatDuracao(d.minutos)}`}>
            <div className={cn("mx-auto flex w-full origin-bottom animate-cresce flex-col-reverse overflow-hidden", escala === "semana" ? "max-w-[32px] gap-[2px] rounded-t-[4px]" : "gap-px rounded-t-[2px]")}
              style={{ height: `${(d.minutos / max) * 100}%`, animationDelay: `${i * (escala === "semana" ? 60 : 15)}ms` }}>
              {ordem.map((id) => {
                const m = d.porDisciplina[id] ?? 0;
                if (!m) return null;
                return <span key={id} className={cn("w-full shrink-0 transition-opacity duration-300", foco && foco !== id && "opacity-20")} style={{ height: `calc(${(m / d.minutos) * 100}% - ${escala === "semana" ? 2 : 1}px)`, background: corDe(id) }} />;
              })}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-1.5 grid text-center text-[0.6rem] text-texto-suave" style={{ gridTemplateColumns: `repeat(${dias.length}, minmax(0, 1fr))` }}>
        {dias.map((d, i) => <span key={d.data} className="num">{escala === "semana" || i % 5 === 0 || i === dias.length - 1 ? ddmm(d.data) : ""}</span>)}
      </div>

      <div className="mt-4 flex items-baseline justify-between border-b border-borda pb-3"><span className="text-xs text-texto-suave">Total no período</span><span className="num text-lg font-semibold">{relogio(total)}</span></div>

      {/* Legenda interativa */}
      <ul className="mt-1 divide-y divide-borda/70">
        {disciplinas.map((d) => (
          <li key={d.disciplinaId}>
            <button onMouseEnter={() => setFoco(d.disciplinaId)} onMouseLeave={() => setFoco(null)} onFocus={() => setFoco(d.disciplinaId)} onBlur={() => setFoco(null)}
              className="-mx-2 flex w-[calc(100%+1rem)] items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition hover:bg-superficie-alta">
              <span className="h-3 w-3 shrink-0 rounded-md" style={{ background: corDe(d.disciplinaId) }} />
              <span className="min-w-0 flex-1 truncate">{nomeDe(d.disciplinaId, false)}</span>
              <span className="num font-semibold">{formatDuracao(d.minutos)}</span>
              <span className="num w-14 text-right text-xs text-texto-suave">({(d.fatia * 100).toFixed(1).replace(".", ",")}%)</span>
            </button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
