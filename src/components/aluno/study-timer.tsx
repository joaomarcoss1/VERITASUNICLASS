"use client";
import { useEffect, useState, useTransition } from "react";
import { Pause, Play, Square, Timer, X } from "lucide-react";
import { DISCIPLINAS } from "@/lib/catalog";
import { registrarSessao } from "@/app/actions/sessao";
import { cn } from "@/lib/utils";

type Estado = { inicio: string; acumuladoMs: number; retomadoEm: number | null; modo: "livre" | "pomodoro"; disciplinaId: string | null; conteudo?: string | null };

/** Outros componentes (ex.: Início rápido) disparam este evento para abrir e iniciar uma sessão. */
export const EVENTO_INICIAR = "vu:iniciar-sessao";
export type DetalheIniciar = { disciplinaId: string | null; conteudo: string | null };
const CHAVE = "vu-sessao";
const FOCO = 25 * 60_000, PAUSA = 5 * 60_000;

function ler(): Estado | null {
  try { return JSON.parse(localStorage.getItem(CHAVE) ?? "null"); } catch { return null; }
}
function salvar(e: Estado | null) {
  try {
    if (e) localStorage.setItem(CHAVE, JSON.stringify(e));
    else localStorage.removeItem(CHAVE);
  } catch {}
}
function mmss(ms: number) {
  const s = Math.floor(ms / 1000);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  return `${h ? `${h}:` : ""}${String(m).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
}

/** Botão global "Iniciar sessão de estudo" com cronômetro livre ou Pomodoro (25/5). Sobrevive a recarregar a página. */
export function StudyTimer() {
  const [estado, setEstado] = useState<Estado | null>(null);
  const [aberto, setAberto] = useState(false);
  const [agora, setAgora] = useState(() => Date.now());
  const [msg, setMsg] = useState<string | null>(null);
  const [disciplina, setDisciplina] = useState<string>("");
  const [modo, setModo] = useState<"livre" | "pomodoro">("pomodoro");
  const [salvando, iniciarTransicao] = useTransition();

  useEffect(() => setEstado(ler()), []);
  useEffect(() => {
    function ouvir(e: Event) {
      const d = (e as CustomEvent<DetalheIniciar>).detail;
      setMsg(null);
      setAberto(true);
      const atualEstado = ler();
      if (atualEstado) return; // já existe sessão em andamento: só mostra o painel
      const novo: Estado = { inicio: new Date().toISOString(), acumuladoMs: 0, retomadoEm: Date.now(), modo: "pomodoro", disciplinaId: d.disciplinaId, conteudo: d.conteudo };
      setEstado(novo);
      salvar(novo);
      setAgora(Date.now());
    }
    window.addEventListener(EVENTO_INICIAR, ouvir);
    return () => window.removeEventListener(EVENTO_INICIAR, ouvir);
  }, []);
  useEffect(() => {
    if (!estado?.retomadoEm) return;
    const t = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(t);
  }, [estado?.retomadoEm]);

  const decorrido = estado ? estado.acumuladoMs + (estado.retomadoEm ? agora - estado.retomadoEm : 0) : 0;
  const ciclo = FOCO + PAUSA;
  const noCiclo = decorrido % ciclo;
  const emPausa = estado?.modo === "pomodoro" && noCiclo >= FOCO;
  const restante = estado?.modo === "pomodoro" ? (emPausa ? ciclo - noCiclo : FOCO - noCiclo) : 0;
  // No Pomodoro, só conta o tempo líquido de foco
  const liquidoMs = estado?.modo === "pomodoro" ? Math.floor(decorrido / ciclo) * FOCO + Math.min(noCiclo, FOCO) : decorrido;

  function atualizar(e: Estado | null) { setEstado(e); salvar(e); }
  function iniciar() {
    setMsg(null);
    atualizar({ inicio: new Date().toISOString(), acumuladoMs: 0, retomadoEm: Date.now(), modo, disciplinaId: disciplina || null });
    setAgora(Date.now());
  }
  function pausarOuRetomar() {
    if (!estado) return;
    atualizar(estado.retomadoEm ? { ...estado, acumuladoMs: decorrido, retomadoEm: null } : { ...estado, retomadoEm: Date.now() });
  }
  function encerrar() {
    if (!estado) return;
    const minutos = Math.floor(liquidoMs / 60_000);
    const e = estado;
    atualizar(null);
    if (minutos < 1) { setMsg("Sessão muito curta — nada foi registrado."); return; }
    iniciarTransicao(async () => {
      const r = await registrarSessao({ disciplinaId: e.disciplinaId, inicio: e.inicio, minutos, modo: e.modo });
      setMsg(r.ok ? `${minutos} min líquidos registrados. Bom trabalho!` : r.erro);
    });
  }

  return (
    <>
      {aberto && (
        <div className="fixed bottom-40 right-4 z-40 w-[min(22rem,calc(100vw-2rem))] animate-sobe-fade rounded-xl border border-borda bg-superficie p-5 lg:bottom-24 lg:right-6 shadow-[0_24px_60px_-20px_rgba(14,27,46,.5)] lg:bottom-24" role="dialog" aria-label="Sessão de estudo">
          <div className="mb-3 flex items-center justify-between">
            <p className="font-semibold">Sessão de estudo</p>
            <button onClick={() => setAberto(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-borda/40" aria-label="Minimizar"><X className="h-4 w-4" /></button>
          </div>
          {estado ? (
            <div className="text-center">
              <p className={cn("text-xs font-semibold uppercase tracking-widest", emPausa ? "text-acerto" : "text-destaque-texto")}>
                {estado.modo === "pomodoro" ? (emPausa ? "Pausa — respire" : "Foco") : "Cronômetro livre"}
                {estado.disciplinaId && <span className="mt-1 block normal-case tracking-normal text-texto-suave">{DISCIPLINAS.find((x) => x.id === estado.disciplinaId)?.nome}{estado.conteudo ? ` · ${estado.conteudo}` : ""}</span>}
              </p>
              <p className="num my-2 text-5xl font-semibold tracking-tight">{mmss(estado.modo === "pomodoro" ? restante : decorrido)}</p>
              <p className="num text-sm text-texto-suave">Tempo líquido: {mmss(liquidoMs)}</p>
              <div className="mt-4 flex justify-center gap-2">
                <button onClick={pausarOuRetomar} className="inline-flex h-11 items-center gap-2 rounded-lg border border-borda px-4 text-sm font-semibold">
                  {estado.retomadoEm ? <><Pause className="h-4 w-4" /> Pausar</> : <><Play className="h-4 w-4" /> Retomar</>}
                </button>
                <button onClick={encerrar} className="inline-flex h-11 items-center gap-2 rounded-lg bg-primaria px-4 text-sm font-semibold text-primaria-texto">
                  <Square className="h-4 w-4" /> Encerrar
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <label className="block text-sm">
                <span className="mb-1 block text-texto-suave">Disciplina</span>
                <select value={disciplina} onChange={(e) => setDisciplina(e.target.value)} className="h-11 w-full rounded-lg border border-borda bg-superficie-alta px-3">
                  <option value="">Geral / várias</option>
                  {DISCIPLINAS.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
                </select>
              </label>
              <div className="grid grid-cols-2 gap-2" role="radiogroup" aria-label="Modo">
                {(["pomodoro", "livre"] as const).map((m) => (
                  <button key={m} role="radio" aria-checked={modo === m} onClick={() => setModo(m)} className={cn("h-11 rounded-lg border text-sm font-semibold", modo === m ? "border-destaque bg-revisar-suave text-revisar" : "border-borda")}>
                    {m === "pomodoro" ? "Pomodoro 25/5" : "Livre"}
                  </button>
                ))}
              </div>
              <button onClick={iniciar} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-primaria text-sm font-semibold text-primaria-texto"><Play className="h-4 w-4" /> Começar</button>
            </div>
          )}
          {msg && <p className="mt-3 text-center text-sm text-texto-suave" role="status">{salvando ? "Salvando…" : msg}</p>}
        </div>
      )}
      <button
        onClick={() => setAberto((v) => !v)}
        className={cn(
          "group fixed bottom-24 right-4 z-40 inline-flex h-12 items-center gap-2 rounded-full px-5 text-sm font-semibold shadow-[0_6px_18px_-6px_rgba(14,27,46,.45)] transition duration-300 ease-premium hover:-translate-y-0.5 active:scale-95 lg:bottom-6 lg:right-6",
          estado ? "bg-veritas-tinta text-veritas-ouro ring-1 ring-veritas-ouro/60" : "bg-veritas-tinta text-white lg:hidden",
        )}
        aria-expanded={aberto}
      >
        {estado && <span className="pointer-events-none absolute inset-0 -z-10 animate-halo rounded-full bg-veritas-ouro/40" aria-hidden />}
        {estado ? <><Timer className="h-4 w-4" /><span className="num">{mmss(liquidoMs)}</span></> : <><Play className="h-4 w-4 fill-current" /><span className="sm:hidden">Estudar</span><span className="hidden sm:inline">Iniciar sessão de estudo</span></>}
      </button>
    </>
  );
}
