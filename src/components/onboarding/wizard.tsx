"use client";
import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, Check, Compass, Gauge, ListChecks, Target } from "lucide-react";
import type { Area, Edital } from "@/lib/catalog";
import { pesosPorArea } from "@/lib/catalog";
import { concluirOnboarding } from "@/app/actions/onboarding";
import { gerarPlanoSemanal } from "@/lib/services/study-plan";
import { montarMissao } from "@/lib/services/habit";
import { disciplinas as coresDisc } from "@/lib/design/tokens";
import { LogoUniClass } from "@/components/brand/logo";
import { FundoVeritas } from "@/components/brand/fundo";
import { Button } from "@/components/ui/button";
import { cn, formatMinutos } from "@/lib/utils";

type Disc = { id: string; nome: string; curto: string };
const DIAS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const NIVEIS = [
  { v: 15, t: "Nunca estudei" },
  { v: 40, t: "Básico" },
  { v: 60, t: "Intermediário" },
  { v: 80, t: "Avançado" },
];
const PASSOS = [
  { t: "Objetivo", i: Target },
  { t: "Disponibilidade", i: Compass },
  { t: "Diagnóstico", i: Gauge },
  { t: "Sua rotina", i: ListChecks },
];

export function OnboardingWizard({ areas, editais, disciplinas }: { areas: Area[]; editais: Edital[]; disciplinas: Disc[] }) {
  const [passo, setPasso] = useState(0);
  const [editalId, setEditalId] = useState<string | null>(null);
  const [areaId, setAreaId] = useState<string>("");
  const [naoSei, setNaoSei] = useState(false);
  const [dataProva, setDataProva] = useState("");
  const [dias, setDias] = useState<number[]>([1, 2, 3, 4, 5]);
  const [minutos, setMinutos] = useState(90);
  const [niveis, setNiveis] = useState<Record<string, number>>({});
  const [erro, setErro] = useState<string | null>(null);
  const [salvando, startTransition] = useTransition();

  const edital = editais.find((e) => e.id === editalId) ?? null;
  const pesos = edital?.pesos ?? (areaId ? pesosPorArea(areaId) : {});
  const discsDoObjetivo = disciplinas.filter((d) => d.id in pesos);
  const nomeCurto = (id: string) => disciplinas.find((d) => d.id === id)?.curto ?? id;

  // Prévia local (o servidor recalcula ao salvar)
  const plano = useMemo(
    () => gerarPlanoSemanal(Object.entries(pesos).map(([id, peso]) => ({ id, nome: nomeCurto(id), peso, dominio: niveis[id] ?? 30 })), { dias, minutosPorDia: minutos }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(pesos), dias, minutos, niveis],
  );
  const primeiroDia = plano[0];
  const missao = primeiroDia ? montarMissao({ sessoes: primeiroDia.sessoes, revisoesVencidas: 0, limiteRevisoes: 0, minutosDisponiveis: minutos }) : [];

  const podeAvancar = passo === 0 ? !!(editalId || (naoSei && areaId)) : passo === 1 ? dias.length > 0 : true;

  function salvar() {
    setErro(null);
    startTransition(async () => {
      const r = await concluirOnboarding({
        editalId,
        areaId: edital?.areaId ?? areaId,
        dataProva: dataProva || null,
        dias,
        minutosPorDia: minutos,
        niveis,
      });
      if (r?.erro) setErro(r.erro);
    });
  }

  return (
    <div className="relative min-h-dvh">
      <FundoVeritas />
      <header className="vidro-tinta sticky top-0 z-20 border-b border-veritas-ouro/20 px-5 py-4"><div className="mx-auto max-w-3xl"><LogoUniClass invertido /></div></header>
      <div className="relative mx-auto max-w-3xl px-5 py-8">
        {/* Indicador de passos */}
        <ol className="mb-8 grid grid-cols-4 gap-2" aria-label="Etapas">
          {PASSOS.map(({ t, i: Icon }, idx) => (
            <li key={t} className="flex flex-col gap-2" aria-current={idx === passo ? "step" : undefined}>
              <span className="h-1.5 overflow-hidden rounded-full bg-borda"><span className={cn("block h-full rounded-full bg-destaque transition-all duration-700 ease-premium", idx <= passo ? "w-full" : "w-0")} /></span>
              <span className={cn("flex items-center gap-1.5 text-xs font-semibold", idx === passo ? "text-texto" : "text-texto-suave")}>
                <Icon className="hidden h-3.5 w-3.5 sm:block" aria-hidden />{t}
              </span>
            </li>
          ))}
        </ol>

        <div key={passo}>
          {passo === 0 && (
            <section className="escalonado space-y-5">
              <div>
                <h1 className="titulo-institucional text-3xl sm:text-4xl">Qual é o seu objetivo?</h1>
                <p className="mt-2 text-texto-suave">Tudo na plataforma vai se organizar em volta dele. Dá para trocar depois.</p>
              </div>
              <div className="grid gap-3">
                {editais.map((e) => (
                  <button key={e.id} onClick={() => { setEditalId(e.id); setNaoSei(false); }} aria-pressed={editalId === e.id}
                    className={cn("reflexo cartao-premium rounded-[4px] border p-4 text-left", editalId === e.id ? "border-destaque ring-2 ring-destaque/30" : "border-borda hover:border-destaque/60")}>
                    <div className="flex items-start justify-between gap-3">
                      <span className="font-semibold">{e.nome}</span>
                      <span className="shrink-0 rounded-full bg-veritas-tinta px-2.5 py-0.5 text-xs font-semibold text-veritas-pergaminho">{e.banca}</span>
                    </div>
                    <p className="mt-1 text-sm text-texto-suave">{e.status[0].toUpperCase() + e.status.slice(1)} · nível {e.nivel} · {Object.keys(e.pesos).length} disciplinas</p>
                  </button>
                ))}
                <button onClick={() => { setNaoSei(true); setEditalId(null); }} aria-pressed={naoSei}
                  className={cn("cartao-premium rounded-[4px] border border-dashed p-4 text-left", naoSei ? "border-destaque ring-2 ring-destaque/30" : "border-borda")}>
                  <span className="font-semibold">Ainda não sei o concurso</span>
                  <p className="mt-1 text-sm text-texto-suave">Escolha uma área e começamos pela base comum.</p>
                </button>
              </div>
              {naoSei && (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {areas.map((a) => (
                    <button key={a.id} onClick={() => setAreaId(a.id)} aria-pressed={areaId === a.id}
                      className={cn("rounded-[4px] border p-3 text-left text-sm", areaId === a.id ? "border-destaque bg-revisar-suave" : "border-borda bg-superficie")}>
                      <span className="block font-semibold">{a.nome}</span>
                      <span className="text-xs text-texto-suave">{a.descricao}</span>
                    </button>
                  ))}
                </div>
              )}
              <label className="block max-w-xs">
                <span className="mb-1.5 block text-sm font-medium">Data prevista da prova <span className="text-texto-suave">(opcional)</span></span>
                <input type="date" value={dataProva} onChange={(e) => setDataProva(e.target.value)} className="h-12 w-full rounded-[4px] border border-borda bg-superficie-alta px-4" />
              </label>
            </section>
          )}

          {passo === 1 && (
            <section className="escalonado space-y-6">
              <div>
                <h1 className="titulo-institucional text-3xl sm:text-4xl">Quando você pode estudar?</h1>
                <p className="mt-2 text-texto-suave">Seja realista: uma rotina possível vence uma rotina perfeita.</p>
              </div>
              <fieldset>
                <legend className="mb-2 text-sm font-medium">Dias da semana</legend>
                <div className="grid grid-cols-7 gap-1.5">
                  {DIAS.map((d, i) => (
                    <button key={d} aria-pressed={dias.includes(i)} onClick={() => setDias((x) => (x.includes(i) ? x.filter((y) => y !== i) : [...x, i].sort()))}
                      className={cn("h-12 rounded-[4px] border text-sm font-semibold", dias.includes(i) ? "border-primaria bg-primaria text-primaria-texto" : "border-borda bg-superficie")}>
                      {d}
                    </button>
                  ))}
                </div>
              </fieldset>
              <label className="block">
                <span className="mb-2 flex justify-between text-sm font-medium"><span>Tempo por dia</span><span className="num text-destaque-texto">{formatMinutos(minutos)}</span></span>
                <input type="range" min={25} max={360} step={5} value={minutos} onChange={(e) => setMinutos(Number(e.target.value))} className="w-full accent-[#B8935A]" />
                <span className="mt-1 flex justify-between text-xs text-texto-suave"><span>25 min</span><span>6h</span></span>
              </label>
              <p className="num rounded-[4px] bg-superficie p-4 text-sm">
                Total: <strong>{formatMinutos(minutos * dias.length)}</strong> por semana · cerca de <strong>{Math.round((minutos * dias.length * 4.3) / 60)}h</strong> por mês.
              </p>
            </section>
          )}

          {passo === 2 && (
            <section className="escalonado space-y-5">
              <div>
                <h1 className="titulo-institucional text-3xl sm:text-4xl">Diagnóstico rápido</h1>
                <p className="mt-2 text-texto-suave">
                  Como você se sente em cada disciplina? Isso calibra a primeira semana. O mini-simulado de 20 questões ficará disponível em <em>Simulados</em> e ajusta tudo automaticamente.
                </p>
              </div>
              <ul className="space-y-3">
                {discsDoObjetivo.map((d) => (
                  <li key={d.id} className="rounded-[4px] border border-borda bg-superficie p-4">
                    <p className="mb-2 flex items-center gap-2 font-semibold"><span className="h-2.5 w-2.5 rounded-full" style={{ background: coresDisc[d.id] }} aria-hidden />{d.nome}</p>
                    <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-4" role="radiogroup" aria-label={`Nível em ${d.nome}`}>
                      {NIVEIS.map((n) => (
                        <button key={n.v} role="radio" aria-checked={niveis[d.id] === n.v} onClick={() => setNiveis((x) => ({ ...x, [d.id]: n.v }))}
                          className={cn("h-10 rounded-[4px] border text-sm", niveis[d.id] === n.v ? "border-primaria bg-primaria font-semibold text-primaria-texto" : "border-borda")}>
                          {n.t}
                        </button>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {passo === 3 && (
            <section className="escalonado space-y-6">
              <div>
                <h1 className="titulo-institucional text-3xl sm:text-4xl">Sua rotina está pronta</h1>
                <p className="mt-2 text-texto-suave">Mais tempo para o que pesa mais no edital e para onde você está mais fraco. Ela se reajusta sozinha conforme você estuda.</p>
              </div>
              <div className="rounded-[6px] border border-destaque/50 bg-superficie p-5 shadow-selo">
                <p className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-destaque-texto"><Target className="h-4 w-4" /> Primeira missão do dia</p>
                <ul className="space-y-2">
                  {missao.map((m) => <li key={m.id} className="flex justify-between gap-3 text-sm"><span className="font-medium">{m.titulo}</span><span className="num text-texto-suave">{formatMinutos(m.minutos)}</span></li>)}
                </ul>
              </div>
              <div className="overflow-x-auto">
                <div className="grid min-w-[560px] gap-2" style={{ gridTemplateColumns: `repeat(${plano.length}, minmax(0,1fr))` }}>
                  {plano.map((dia) => (
                    <div key={dia.diaSemana} className="cartao-premium rounded-[4px] border border-borda p-2.5">
                      <p className="mb-2 text-center text-xs font-semibold">{DIAS[dia.diaSemana]}</p>
                      <div className="space-y-1.5">
                        {dia.sessoes.map((s, i) => (
                          <div key={i} className="animate-sobe-fade rounded-md px-2 py-1.5 text-[0.7rem] leading-tight text-white shadow-sm transition hover:scale-[1.03]" style={{ background: coresDisc[s.disciplinaId] ?? "#2B4166" }}>
                            <span className="block truncate font-semibold">{s.disciplina}</span>
                            <span className="opacity-90">{s.tipo === "aula" ? "Teoria" : s.tipo === "questoes" ? "Questões" : "Revisão"} · {s.minutos}′</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>

        {erro && <p role="alert" className="mt-6 rounded-[4px] bg-erro-suave px-4 py-3 text-sm font-medium text-erro">{erro}</p>}

        <div className="mt-8 flex items-center justify-between gap-3">
          <Button variante="fantasma" onClick={() => setPasso((p) => Math.max(0, p - 1))} disabled={passo === 0}><ArrowLeft className="h-4 w-4" /> Voltar</Button>
          <div className="flex gap-2">
            {passo === 2 && <Button variante="secundaria" onClick={() => { setNiveis({}); setPasso(3); }}>Pular</Button>}
            {passo < 3 ? (
              <Button onClick={() => setPasso((p) => p + 1)} disabled={!podeAvancar}>Continuar <ArrowRight className="h-4 w-4" /></Button>
            ) : (
              <Button variante="ouro" onClick={salvar} disabled={salvando}><Check className="h-4 w-4" /> {salvando ? "Salvando…" : "Começar a estudar"}</Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
