import { Lock } from "lucide-react";
import { SimboloMarcaDagua, EstrelaVeritas } from "@/components/brand/fundo";

/** Estado de módulo ainda não entregue — nunca uma tela de erro. */
export function EmBreve({ titulo, fase, descricao, itens }: { titulo: string; fase: string; descricao: string; itens: string[] }) {
  return (
    <div className="space-y-6">
      <h1 className="titulo-institucional text-3xl sm:text-4xl">{titulo}</h1>
      <section className="cartao-premium relative overflow-hidden rounded-xl2 border border-borda p-6 shadow-card sm:p-8">
        <SimboloMarcaDagua className="pointer-events-none absolute -right-8 -top-6 h-48 w-48 text-destaque opacity-[.2]" />
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-revisar-suave px-3 py-1 text-xs font-semibold text-revisar"><Lock className="h-3.5 w-3.5" /> Chega na {fase}</p>
        <p className="max-w-leitura text-leitura">{descricao}</p>
        <ul className="escalonado mt-5 grid gap-1 sm:grid-cols-2">
          {itens.map((i) => <li key={i} className="flex items-start gap-2.5 rounded-lg px-2 py-1.5 text-sm transition hover:bg-borda/25"><EstrelaVeritas className="mt-0.5 h-3.5 w-3.5 shrink-0 text-destaque" />{i}</li>)}
        </ul>
      </section>
    </div>
  );
}
