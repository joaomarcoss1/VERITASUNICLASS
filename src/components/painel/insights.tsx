import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { Noticia } from "@/lib/data/types";
import { Card, CardTitulo, Badge } from "@/components/ui/card";

export function InsightsCard({ noticias, className }: { noticias: Noticia[]; className?: string }) {
  return (
    <Card className={className}>
      <CardTitulo icone={<Newspaper className="h-4 w-4" />} acao={<Link href="/insights" className="text-sm font-semibold text-info hover:underline">Mais</Link>}>Insights do mercado</CardTitulo>
      <ul className="divide-y divide-borda">
        {noticias.map((n) => (
          <li key={n.id} className="py-3 first:pt-0 last:pb-0">
            <div className="mb-1 flex items-center gap-2">
              <Badge className="bg-premium/10 text-premium">{n.tag}</Badge>
              <time className="text-xs text-texto-suave" dateTime={n.data}>{new Date(n.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</time>
            </div>
            <p className="text-sm font-semibold leading-snug">{n.titulo}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-texto-suave">{n.resumo}</p>
          </li>
        ))}
        {noticias.length === 0 && <li className="text-sm text-texto-suave">Sem novidades da sua área por enquanto.</li>}
      </ul>
    </Card>
  );
}
