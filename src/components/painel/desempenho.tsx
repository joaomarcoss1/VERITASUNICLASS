import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Crosshair } from "lucide-react";
import type { PainelData, Tendencia } from "@/lib/data/types";
import { classificar } from "@/lib/services/habit";
import { Card, CardTitulo, ChipDisciplina } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { corDe } from "./estudo/comum";

export function SetaTendencia({ t, className }: { t: Tendencia; className?: string }) {
  const Icon = t === "subindo" ? ArrowUpRight : t === "caindo" ? ArrowDownRight : ArrowRight;
  const txt = t === "subindo" ? "subindo" : t === "caindo" ? "caindo" : "estável";
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-xs font-medium", t === "subindo" ? "text-acerto" : t === "caindo" ? "text-erro" : "text-texto-suave", className)}>
      <Icon className="h-3.5 w-3.5" aria-hidden />{txt}
    </span>
  );
}

const STATUS = {
  Fraco: "bg-erro-suave text-erro",
  "Em evolução": "bg-revisar-suave text-revisar",
  Dominado: "bg-acerto-suave text-acerto",
} as const;

/** Domínio por disciplina — tabela ordenada da mais fraca para a mais forte, com ação direta. */
export function DesempenhoRapido({ desempenho }: { desempenho: PainelData["desempenho"] }) {
  const linhas = [...desempenho.disciplinas].sort((a, b) => a.dominio - b.dominio);
  return (
    <Card className="overflow-hidden">
      <CardTitulo icone={<Crosshair />} subtitulo="Da mais fraca para a mais forte · últimos 30 dias" acao={<Link href="/desempenho">Ver relatório</Link>}>
        Domínio por disciplina
      </CardTitulo>
      <div className="-mx-5 max-w-[calc(100%+2.5rem)] overflow-x-auto sm:-mx-6 sm:max-w-[calc(100%+3rem)]">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-y border-borda bg-superficie-alta text-left text-xs text-texto-suave">
              <th className="py-2 pl-5 font-medium sm:pl-6">Disciplina</th>
              <th className="py-2 font-medium">Domínio</th>
              <th className="py-2 text-right font-medium">Acerto</th>
              <th className="py-2 pl-4 font-medium">Tendência</th>
              <th className="py-2 pr-5 text-right font-medium sm:pr-6"><span className="sr-only">Ação</span></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-borda">
            {linhas.map((d) => {
              const classe = classificar(d.dominio);
              return (
                <tr key={d.disciplinaId} className="transition-colors hover:bg-superficie-alta/60">
                  <td className="py-3 pl-5 sm:pl-6"><ChipDisciplina cor={corDe(d.disciplinaId)}>{d.nome}</ChipDisciplina></td>
                  <td className="py-3">
                    <div className="flex items-center gap-2.5">
                      <span className="h-1.5 w-24 overflow-hidden rounded-[2px] bg-superficie-alta">
                        <span className="block h-full origin-left animate-[cresce-x_.8s_cubic-bezier(.2,.7,.2,1)_both] rounded-r-[2px] bg-primaria" style={{ width: `${d.dominio}%` }} />
                      </span>
                      <span className="num w-7 text-xs font-semibold">{d.dominio}</span>
                      <span className={cn("rounded-md px-1.5 py-0.5 text-[0.6875rem] font-semibold", STATUS[classe as keyof typeof STATUS])}>{classe}</span>
                    </div>
                  </td>
                  <td className="num py-3 text-right font-semibold">{d.acerto}%</td>
                  <td className="py-3 pl-4"><SetaTendencia t={d.tendencia} /></td>
                  <td className="py-3 pr-5 text-right sm:pr-6"><Link href="/questoes" className="text-xs font-semibold text-info hover:underline">Treinar</Link></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
