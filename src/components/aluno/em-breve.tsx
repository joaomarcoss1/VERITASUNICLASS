import { Lock } from "lucide-react";
import { SimboloVeritas } from "@/components/brand/logo";

/** Estado de módulo ainda não entregue — nunca uma tela de erro. */
export function EmBreve({ titulo, fase, descricao, itens }: { titulo: string; fase: string; descricao: string; itens: string[] }) {
  return (
    <div className="space-y-6">
      <h1 className="titulo-institucional text-3xl sm:text-4xl">{titulo}</h1>
      <section className="relative overflow-hidden rounded-xl2 border border-borda bg-superficie p-6 shadow-card sm:p-8">
        <SimboloVeritas className="pointer-events-none absolute -right-6 -top-4 h-40 w-40 opacity-[0.06]" cor="tinta" />
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-revisar-suave px-3 py-1 text-xs font-semibold text-revisar"><Lock className="h-3.5 w-3.5" /> Chega na {fase}</p>
        <p className="max-w-leitura text-leitura">{descricao}</p>
        <ul className="mt-5 grid gap-2 sm:grid-cols-2">
          {itens.map((i) => <li key={i} className="flex gap-2 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-destaque" aria-hidden />{i}</li>)}
        </ul>
      </section>
    </div>
  );
}
