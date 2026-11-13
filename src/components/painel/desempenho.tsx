import Link from "next/link";
import { ArrowDownRight, ArrowRight, ArrowUpRight, Crosshair } from "lucide-react";
import type { PainelData, Tendencia } from "@/lib/data/types";
import { classificar } from "@/lib/services/habit";
import { corDominio } from "@/lib/design/tokens";
import { Card, CardTitulo } from "@/components/ui/card";
import { Barra, Contador } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export function SetaTendencia({ t, className }: { t: Tendencia; className?: string }) {
  const Icon = t === "subindo" ? ArrowUpRight : t === "caindo" ? ArrowDownRight : ArrowRight;
  const txt = t === "subindo" ? "subindo" : t === "caindo" ? "caindo" : "estável";
  return (
    <span className={cn("inline-flex items-center", t === "subindo" ? "text-acerto" : t === "caindo" ? "text-erro" : "text-texto-suave", className)}>
      <Icon className="h-4 w-4" aria-hidden /><span className="sr-only">{txt}</span>
    </span>
  );
}

export function DesempenhoRapido({ desempenho }: { desempenho: PainelData["desempenho"] }) {
  const fracas = [...desempenho.disciplinas].sort((a, b) => a.dominio - b.dominio).slice(0, 3);
  return (
    <Card>
      <CardTitulo icone={<Crosshair className="h-4 w-4" />} acao={<Link href="/desempenho" className="text-sm font-semibold text-info hover:underline">Ver tudo</Link>}>
        Desempenho rápido
      </CardTitulo>
      <div className="grid gap-5 sm:grid-cols-[auto_1fr] sm:items-center">
        <div className="sm:border-r sm:border-borda sm:pr-6">
          <p className="text-sm text-texto-suave">Acerto geral</p>
          <p className="num flex items-center gap-2 text-4xl font-semibold">
            <Contador valor={desempenho.acertoGeral} sufixo="%" />
            <SetaTendencia t={desempenho.tendencia} className="text-base" />
          </p>
          <p className="num text-xs text-texto-suave">{desempenho.deltaPontos >= 0 ? "+" : ""}{desempenho.deltaPontos} p.p. vs. 30 dias anteriores</p>
        </div>
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-texto-suave">Onde você mais precisa treinar</p>
          <ul className="space-y-2.5">
            {fracas.map((d) => {
              const classe = classificar(d.dominio);
              return (
                <li key={d.disciplinaId} className="group rounded-lg px-1 py-0.5 transition hover:bg-borda/30">
                  <div className="flex items-center gap-3">
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full ring-2 ring-white/40" style={{ background: corDominio(d.dominio) }} aria-hidden />
                    <span className="min-w-0 flex-1 truncate text-sm font-medium">{d.nome}</span>
                    <span className="hidden text-xs text-texto-suave sm:inline">{classe}</span>
                    <span className="num w-10 text-right text-sm font-semibold">{d.acerto}%</span>
                    <SetaTendencia t={d.tendencia} />
                  </div>
                  <Barra valor={d.dominio / 100} cor={corDominio(d.dominio)} rotulo={`Domínio em ${d.nome}`} className="ml-5 mt-1.5 h-1 w-auto" />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Card>
  );
}
