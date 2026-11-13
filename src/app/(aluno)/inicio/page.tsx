import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getPainel } from "@/lib/data/painel";
import { MissaoDoDia } from "@/components/painel/missao";
import { HabitoCard } from "@/components/painel/habito";
import { ContinuarCard } from "@/components/painel/continuar";
import { DesempenhoRapido } from "@/components/painel/desempenho";
import { RevisoesCard } from "@/components/painel/revisoes";
import { ObjetivoCard } from "@/components/painel/objetivo";
import { InsightsCard } from "@/components/painel/insights";
import { nivelPorXp } from "@/lib/services/habit";

export const metadata: Metadata = { title: "Início" };
export const dynamic = "force-dynamic";

function saudacao() {
  const h = Number(new Intl.DateTimeFormat("pt-BR", { hour: "numeric", hour12: false, timeZone: "America/Sao_Paulo" }).format(new Date()));
  return h < 12 ? "Bom dia" : h < 18 ? "Boa tarde" : "Boa noite";
}

export default async function InicioPage() {
  const painel = await getPainel();
  if ("precisaOnboarding" in painel) redirect("/onboarding");
  const nivel = nivelPorXp(painel.aluno.xpTotal);

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-destaque-texto">{nivel.nome}</p>
          <h1 className="titulo-institucional text-3xl sm:text-4xl">{saudacao()}, {painel.aluno.primeiroNome}.</h1>
        </div>
        {painel.objetivo?.diasRestantes != null && (
          <p className="num text-sm text-texto-suave">
            <strong className="text-texto">{painel.objetivo.diasRestantes} dias</strong> até a prova
          </p>
        )}
      </header>

      {/* 1. Missão do dia  2. Sequência, XP e meta */}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <MissaoDoDia itens={painel.missao} />
        <HabitoCard streak={painel.streak} semana={painel.semana} xpSemana={painel.aluno.xpSemana} nivel={nivel} />
      </div>

      {/* 3. Continuar  4. Desempenho rápido */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <ContinuarCard item={painel.continuar} />
        <DesempenhoRapido desempenho={painel.desempenho} />
      </div>

      {/* 5. Revisões e simulado  6. Contagem e cobertura  7. Insights */}
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RevisoesCard revisoes={painel.revisoesPendentes} simulado={painel.proximoSimulado} />
        <ObjetivoCard objetivo={painel.objetivo} />
        <InsightsCard noticias={painel.insights} className="md:col-span-2 xl:col-span-1" />
      </div>
    </div>
  );
}
