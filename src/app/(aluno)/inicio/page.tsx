import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { CalendarDays, Clock3, Flame, Shield, Target } from "lucide-react";
import { getPainel } from "@/lib/data/painel";
import { nivelPorXp } from "@/lib/services/habit";
import { CabecalhoPagina } from "@/components/ui/card";
import { Kpi, MiniColunas } from "@/components/ui/kpi";
import { Barra, Contador } from "@/components/ui/progress";
import { botaoClasses } from "@/components/ui/button";
import { FaixaFoco } from "@/components/painel/faixa-foco";
import { MissaoDoDia } from "@/components/painel/missao";
import { DesempenhoRapido } from "@/components/painel/desempenho";
import { RevisoesCard } from "@/components/painel/revisoes";
import { InsightsCard } from "@/components/painel/insights";
import { BoasVindas } from "@/components/painel/boas-vindas";
import { UltimosSeteDias } from "@/components/painel/estudo/ultimos-7-dias";
import { MateriasEstudadas } from "@/components/painel/estudo/materias-estudadas";
import { LinhaDoTempo } from "@/components/painel/estudo/linha-do-tempo";
import { AtividadesRecentes } from "@/components/painel/estudo/atividades-recentes";
import { cn, formatDuracao } from "@/lib/utils";

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
  const data = new Intl.DateTimeFormat("pt-BR", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Sao_Paulo" }).format(new Date());
  const { semana, desempenho, streak, objetivo } = painel;
  const pctSemana = semana.metaMinutos ? semana.minutos / semana.metaMinutos : 0;

  return (
    <div className="escalonado space-y-6">
      <Suspense><BoasVindas /></Suspense>

      <CabecalhoPagina
        sobretitulo={data}
        titulo={<>{saudacao()}, {painel.aluno.primeiroNome}</>}
        descricao={<>Grau <strong className="font-semibold text-destaque-texto">{nivel.nome}</strong>{nivel.proximo && <> · faltam <span className="num">{nivel.faltam.toLocaleString("pt-BR")}</span> XP para {nivel.proximo}</>}</>}
        acoes={<Link href="/rotina" className={botaoClasses("secundaria")}><CalendarDays className="h-4 w-4" /> Plano da semana</Link>}
      />

      {/* Indicadores-chave */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Kpi rotulo="Horas na semana" icone={<Clock3 />} valor={formatDuracao(semana.minutos)}
          variacao={{ texto: `${Math.round(pctSemana * 100)}% da meta`, tom: pctSemana >= 1 ? "bom" : "neutro" }}
          nota={`Meta semanal: ${formatDuracao(semana.metaMinutos)}`}>
          <MiniColunas valores={semana.dias.map((d) => d.minutos)} rotulo="Minutos por dia nos últimos 7 dias" />
        </Kpi>
        <Kpi rotulo="Acerto geral" icone={<Target />} valor={<Contador valor={desempenho.acertoGeral} sufixo="%" />}
          variacao={{ texto: `${desempenho.deltaPontos >= 0 ? "+" : ""}${desempenho.deltaPontos} p.p.`, tom: desempenho.deltaPontos > 0 ? "bom" : desempenho.deltaPontos < 0 ? "ruim" : "neutro" }}
          nota="Comparado aos 30 dias anteriores">
          <Barra valor={desempenho.acertoGeral / 100} rotulo="Acerto geral" className="h-1.5" cor="rgb(var(--primaria))" />
        </Kpi>
        <Kpi rotulo="Sequência" icone={<Flame />} valor={<Contador valor={streak.atual} />} unidade="dias"
          variacao={streak.emRisco ? { texto: "Em risco hoje", tom: "ruim" } : streak.hojeCumprido ? { texto: "Meta de hoje ✓", tom: "bom" } : undefined}
          nota={`Recorde: ${streak.recorde} dias`}>
          <div className="flex items-center gap-1.5 text-xs text-texto-suave" aria-label={`${streak.escudos} de 2 escudos protetores`}>
            {[0, 1].map((i) => <Shield key={i} className={cn("h-4 w-4", i < streak.escudos ? "fill-destaque/80 text-destaque-texto" : "text-borda-forte")} />)}
            <span className="ml-1">Escudos protetores</span>
          </div>
        </Kpi>
        <Kpi rotulo="Até a prova" icone={<CalendarDays />} valor={objetivo?.diasRestantes != null ? <Contador valor={objetivo.diasRestantes} /> : "—"} unidade={objetivo?.diasRestantes != null ? "dias" : undefined}
          nota={objetivo ? `${objetivo.titulo.split("—")[0].trim()} · ${objetivo.banca}` : "Defina seu edital-alvo"}>
          {objetivo && (
            <div>
              <div className="mb-1.5 flex justify-between text-xs text-texto-suave"><span>Cobertura do edital</span><span className="num font-semibold text-texto">{objetivo.coberturaEdital}%</span></div>
              <Barra valor={objetivo.coberturaEdital / 100} rotulo="Cobertura do edital" className="h-1.5" />
            </div>
          )}
        </Kpi>
      </div>

      <FaixaFoco continuar={painel.continuar} sugestao={painel.missao.find((m) => !m.feito && m.disciplinaId)?.disciplinaId ?? null} />

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.7fr_1fr]">
        <MissaoDoDia itens={painel.missao} />
        <RevisoesCard revisoes={painel.revisoesPendentes} simulado={painel.proximoSimulado} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1fr_1.35fr]">
        <UltimosSeteDias estudo={painel.estudo} meta={painel.metaDiariaMinutos} />
        <MateriasEstudadas estudo={painel.estudo} />
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <LinhaDoTempo estudo={painel.estudo} />
        <AtividadesRecentes atividades={painel.atividades} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 xl:grid-cols-[1.6fr_1fr]">
        <DesempenhoRapido desempenho={painel.desempenho} />
        <InsightsCard noticias={painel.insights} />
      </div>
    </div>
  );
}
