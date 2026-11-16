import Link from "next/link";
import { Newspaper } from "lucide-react";
import type { Noticia } from "@/lib/data/types";
import { Card, CardTitulo, Badge } from "@/components/ui/card";

export function InsightsCard({ noticias, className }: { noticias: Noticia[]; className?: string }) {
  return (
    <Card className={className}>
      <CardTitulo icone={<Newspaper />} subtitulo="Editais e mudanças da sua área" acao={<Link href="/insights">Ver todos</Link>}>Mercado e editais</CardTitulo>
      <ul className="divide-y divide-borda">
        {noticias.map((n) => (
          <li key={n.id} className="group -mx-2 rounded-lg px-2 py-3 transition first:pt-1 last:pb-1 hover:bg-superficie-alta">
            <div className="mb-1 flex items-center gap-2">
              <Badge className="bg-superficie-alta text-texto ring-1 ring-inset ring-borda">{n.tag}</Badge>
              <time className="text-xs text-texto-suave" dateTime={n.data}>{new Date(n.data).toLocaleDateString("pt-BR", { day: "2-digit", month: "short" })}</time>
            </div>
            <p className="text-sm font-semibold leading-snug transition group-hover:text-info">{n.titulo}</p>
            <p className="mt-0.5 line-clamp-2 text-xs text-texto-suave">{n.resumo}</p>
          </li>
        ))}
        {noticias.length === 0 && <li className="text-sm text-texto-suave">Sem novidades da sua área por enquanto.</li>}
      </ul>
    </Card>
  );
}
