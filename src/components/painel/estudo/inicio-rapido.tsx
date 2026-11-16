"use client";
import { useState } from "react";
import { ChevronDown, Play } from "lucide-react";
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

  const select = "h-12 w-full appearance-none rounded-[14px] border border-white/15 bg-white/[.07] pl-10 pr-9 text-sm text-veritas-pergaminho outline-none transition hover:border-veritas-ouro/50 focus:border-veritas-ouro focus:ring-2 focus:ring-veritas-ouro/30 [&>option]:text-veritas-tinta";
  return (
    <div className="grid gap-2.5 sm:grid-cols-[1fr_1.2fr_auto]">
      <label className="relative">
        <span className="sr-only">Matéria</span>
        <span className="pointer-events-none absolute left-4 top-1/2 h-2.5 w-2.5 -translate-y-1/2 rounded-full ring-2 ring-white/20 transition-colors" style={{ background: disc ? corDe(disc) : "rgba(245,240,230,.35)" }} />
        <select value={disc} onChange={(e) => { setDisc(e.target.value); setCont(""); }} className={select}>
          <option value="">Escolha uma matéria</option>
          {DISCIPLINAS.map((d) => <option key={d.id} value={d.id}>{d.nome}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-veritas-ouro" />
      </label>
      <label className="relative">
        <span className="sr-only">Conteúdo</span>
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-titulo text-sm font-semibold text-veritas-ouro">§</span>
        <select value={cont} onChange={(e) => setCont(e.target.value)} disabled={!disc} className={cn(select, "disabled:opacity-50")}>
          <option value="">{disc ? "Escolha um conteúdo" : "Escolha a matéria primeiro"}</option>
          {conteudos.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-veritas-ouro" />
      </label>
      <button onClick={iniciar} className="reflexo group inline-flex h-12 items-center justify-center gap-2 rounded-[14px] bg-veritas-ouro px-6 text-sm font-bold text-veritas-tinta shadow-[0_10px_24px_-10px_rgba(184,147,90,.9)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#C6A26A] active:scale-[.97]">
        <span className="grid h-6 w-6 place-items-center rounded-full bg-veritas-tinta text-veritas-ouro transition group-hover:scale-110"><Play className="ml-0.5 h-3 w-3 fill-current" /></span>
        Iniciar
      </button>
    </div>
  );
}
