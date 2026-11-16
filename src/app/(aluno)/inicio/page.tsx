import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getPainel } from "@/lib/data/painel";
import { MissaoDoDia } from "@/components/painel/missao";
import { HabitoCard } from "@/components/painel/habito";
import { ContinuarCard } from "@/components/painel/continuar";
import { DesempenhoRapido } from "@/components/painel/desempenho";
import { RevisoesCard } from "@/components/painel/revisoes";
import { ObjetivoCard } from "@/components/painel/objetivo";
import { InsightsCard } from "@/components/painel/insights";
import { HeroPainel } from "@/components/painel/hero";
import { BoasVindas } from "@/components/painel/boas-vindas";
import { UltimosSeteDias } from "@/components/painel/estudo/ultimos-7-dias";
import { MateriasEstudadas } from "@/components/painel/estudo/materias-estudadas";
import { LinhaDoTempo } from "@/components/painel/estudo/linha-do-tempo";
import { AtividadesRecentes } from "@/components/painel/estudo/atividades-recentes";
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
    <div className="escalonado space-y-6">
      <Suspense><BoasVindas /></Suspense>
      <HeroPainel saudacao={saudacao()} nome={painel.aluno.primeiroNome} nivel={nivel.nome} dias={painel.objetivo?.diasRestantes ?? null} streak={painel.streak.atual} proximo={nivel.proximo}
        sugestao={painel.missao.find((m) => !m.feito && m.disciplinaId)?.disciplinaId ?? null} />

      {/* Missão do dia + constância */}
      <div className="grid items-start gap-6 lg:grid-cols-[1.55fr_1fr]">
        <MissaoDoDia itens={painel.missao} />
        <HabitoCard streak={painel.streak} semana={painel.semana} xpSemana={painel.aluno.xpSemana} nivel={nivel} />
      </div>

      {/* Tempo de estudo */}
      <div className="grid gap-6 xl:grid-cols-[1fr_1.45fr]">
        <UltimosSeteDias estudo={painel.estudo} meta={painel.metaDiariaMinutos} />
        <MateriasEstudadas estudo={painel.estudo} />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.45fr_1fr]">
        <LinhaDoTempo estudo={painel.estudo} />
        <AtividadesRecentes atividades={painel.atividades} />
      </div>

      {/* Continuar + desempenho */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <ContinuarCard item={painel.continuar} />
        <DesempenhoRapido desempenho={painel.desempenho} />
      </div>

      {/* Revisões, objetivo e insights */}
      <div className="grid items-start gap-6 md:grid-cols-2 xl:grid-cols-3">
        <RevisoesCard revisoes={painel.revisoesPendentes} simulado={painel.proximoSimulado} />
        <ObjetivoCard objetivo={painel.objetivo} />
        <InsightsCard noticias={painel.insights} className="md:col-span-2 xl:col-span-1" />
      </div>
    </div>
  );
}
