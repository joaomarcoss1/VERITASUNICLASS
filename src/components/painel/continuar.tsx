import Link from "next/link";
import { PlayCircle } from "lucide-react";
import type { PainelData } from "@/lib/data/types";
import { Card, CardTitulo } from "@/components/ui/card";
import { Barra } from "@/components/ui/progress";
import { botaoClasses } from "@/components/ui/button";

export function ContinuarCard({ item }: { item: PainelData["continuar"] }) {
  return (
    <Card className="flex flex-col">
      <CardTitulo icone={<PlayCircle />}>Continuar de onde parei</CardTitulo>
      {item ? (
        <>
          <p className="font-semibold leading-snug">{item.titulo}</p>
          <p className="mt-1 text-sm text-texto-suave">{item.subtitulo}</p>
          <div className="mt-4 flex items-center gap-3">
            <Barra valor={item.progresso} rotulo="Progresso da aula" />
            <span className="num text-xs font-semibold">{Math.round(item.progresso * 100)}%</span>
          </div>
          <Link href={item.href} className={botaoClasses("primaria", "mt-5 w-full")}><PlayCircle className="h-4 w-4" /> Continuar</Link>
        </>
      ) : (
        <p className="text-sm text-texto-suave">Nenhuma aula em andamento. Comece pela missão do dia.</p>
      )}
    </Card>
  );
}
