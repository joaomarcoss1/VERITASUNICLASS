"use client";
import { useState } from "react";
import { BookOpen, ChevronDown, Play } from "lucide-react";
import { CONTEUDOS, DISCIPLINAS } from "@/lib/catalog";
import { EVENTO_INICIAR, type DetalheIniciar } from "@/components/aluno/study-timer";
import { cn } from "@/lib/utils";
import { corDe } from "./comum";

/** Barra "Escolha uma matéria · Escolha um conteúdo · Iniciar" — abre o cronômetro já configurado. */
export function InicioRapido({ sugestao }: { sugestao?: string | null }) {
  const [disc, setDisc] = useState<string>(sugestao ?? "");
  const [cont, setCont] = useState<string>("");
  const conteudos = disc ? CONTEUDOS[disc] ?? [] : [];

  function iniciar() {
    window.dispatchEvent(new CustomEvent<DetalheIniciar>(EVENTO_INICIAR, { detail: { disciplinaId: disc || null, conteudo: cont || null } }));
  }

  const select = "h-10 w-full appearance-none rounded-lg border border-white/15 bg-white/[.06] pl-9 pr-9 text-sm text-white outline-none transition hover:border-white/30 focus:border-veritas-ouro focus:ring-4 focus:ring-veritas-ouro/20 [&>option]:text-veritas-tinta";
  return (
    <div className="grid gap-2.5 sm:grid-cols-[1fr_1.2fr_auto]">
      <label className="relative">
        <span className="sr-only">Matéria</span>
        <span className="pointer-events-none absolute left-3.5 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-2 ring-white/15 transition-colors" style={{ background: disc ? corDe(disc) : "rgba(255,255,255,.3)" }} />
        <select value={disc} onChange={(e) => { setDisc(e.target.value); setCont(""); }} className={select}>
          <option value="">Escolha uma matéria</option>
          {DISCIPLINAS.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </label>
      <label className="relative">
        <span className="sr-only">Conteúdo</span>
        <BookOpen className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <select value={cont} onChange={(e) => setCont(e.target.value)} disabled={!disc} className={cn(select, "disabled:opacity-50")}>
          <option value="">{disc ? "Escolha um conteúdo" : "Escolha a matéria primeiro"}</option>
          {conteudos.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      </label>
      <button onClick={iniciar} className="reflexo group inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-veritas-ouro px-5 text-sm font-semibold text-veritas-tinta transition hover:bg-[#C6A26A] active:scale-[.98]">
        <Play className="h-3.5 w-3.5 fill-current" />
        Iniciar
      </button>
    </div>
  );
}
