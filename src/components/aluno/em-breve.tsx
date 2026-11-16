import { CheckCircle2, Clock } from "lucide-react";
import { CabecalhoPagina } from "@/components/ui/card";

/** Estado de módulo ainda não entregue — cabeçalho de página + escopo previsto. Nunca uma tela de erro. */
export function EmBreve({ titulo, fase, descricao, itens }: { titulo: string; fase: string; descricao: string; itens: string[] }) {
  return (
    <div className="space-y-6">
      <CabecalhoPagina titulo={titulo} descricao={descricao} acoes={<span className="inline-flex items-center gap-1.5 rounded-md border border-borda bg-superficie px-2.5 py-1 text-xs font-semibold text-texto-suave"><Clock className="h-3.5 w-3.5" /> Previsto para a {fase}</span>} />
      <section className="cartao-premium rounded-xl border border-borda">
        <header className="border-b border-borda px-6 py-4">
          <h2 className="text-[0.9375rem] font-semibold">O que este módulo vai oferecer</h2>
          <p className="mt-0.5 text-[0.8125rem] text-texto-suave">Escopo aprovado no plano do produto</p>
        </header>
        <ul className="escalonado grid gap-px overflow-hidden rounded-b-xl bg-borda sm:grid-cols-2 sm:[&>li:last-child:nth-child(odd)]:col-span-2">
          {itens.map((i) => (
            <li key={i} className="flex items-start gap-3 bg-superficie px-6 py-4 text-sm">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-acerto" />{i}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
