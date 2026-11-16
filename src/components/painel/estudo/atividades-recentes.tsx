import { History } from "lucide-react";
import type { Atividade } from "@/lib/data/types";
import { Card, CardTitulo } from "@/components/ui/card";
import { diaLocal, formatDuracao } from "@/lib/utils";
import { corDe, nomeDe } from "./comum";

const TIPO: Record<Atividade["tipo"], string> = { aula: "Aula", questoes: "Questões", revisao: "Revisão", simulado: "Simulado", livre: "Estudo livre" };

function rotuloDia(iso: string, hoje: string) {
  const dif = Math.round((Date.parse(`${hoje}T12:00:00Z`) - Date.parse(`${diaLocal(new Date(iso))}T12:00:00Z`)) / 864e5);
  if (dif <= 0) return "Hoje";
  if (dif === 1) return "Ontem";
  return `Há ${dif} dias`;
}

/** Atividades recentes em linha do tempo vertical, agrupadas por dia. */
export function AtividadesRecentes({ atividades }: { atividades: Atividade[] }) {
  const hoje = diaLocal();
  const grupos = new Map<string, Atividade[]>();
  for (const a of atividades) {
    const k = rotuloDia(a.quando, hoje);
    grupos.set(k, [...(grupos.get(k) ?? []), a]);
  }
  return (
    <Card>
      <CardTitulo icone={<History />} subtitulo="O que você fez por último">Atividades recentes</CardTitulo>
      {atividades.length === 0 && <p className="text-sm text-texto-suave">Suas sessões de estudo aparecem aqui.</p>}
      <div className="space-y-5">
        {[...grupos.entries()].map(([dia, lista]) => (
          <section key={dia}>
            <p className="mb-2 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-destaque-texto">{dia}</p>
            <ol className="relative ml-1.5 space-y-1 border-l border-borda pl-5">
              {lista.map((a) => {
                const pct = a.questoes ? Math.round(((a.acertos ?? 0) / a.questoes) * 100) : null;
                return (
                  <li key={a.id} className="group relative rounded-[12px] px-2 py-2 transition hover:bg-superficie-alta">
                    <span className="absolute -left-[27px] top-3.5 h-3 w-3 rounded-full ring-4 ring-superficie transition group-hover:scale-125" style={{ background: corDe(a.disciplinaId) }} aria-hidden />
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="min-w-0 truncate text-sm font-semibold">{nomeDe(a.disciplinaId, false)}</p>
                      <time className="num shrink-0 text-xs text-texto-suave" dateTime={a.quando}>
                        {new Date(a.quando).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" })}
                      </time>
                    </div>
                    <p className="mt-0.5 text-xs text-texto-suave">
                      {TIPO[a.tipo]} · {formatDuracao(a.minutos)}
                      {pct != null && <> · <span className={pct >= 70 ? "font-semibold text-acerto" : pct < 50 ? "font-semibold text-erro" : "font-semibold text-revisar"}>{a.acertos}/{a.questoes} ({pct}%)</span></>}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </Card>
  );
}
