"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { EstrelaVeritas } from "@/components/brand/fundo";
import { SimboloVeritas } from "@/components/brand/logo";

/** Celebração ao concluir o onboarding: chuva de estrelas Veritas + mensagem. */
export function BoasVindas() {
  const sp = useSearchParams();
  const router = useRouter();
  const [ativo, setAtivo] = useState(false);
  useEffect(() => {
    if (sp.get("bem-vindo") !== "1") return;
    setAtivo(true);
    const t = setTimeout(() => { setAtivo(false); router.replace("/inicio", { scroll: false }); }, 3200);
    return () => clearTimeout(t);
  }, [sp, router]);
  if (!ativo) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[60] grid place-items-center" role="status">
      {Array.from({ length: 28 }, (_, i) => {
        const ang = (i / 28) * Math.PI * 2;
        const dist = 160 + (i % 5) * 40;
        return (
          <EstrelaVeritas key={i} className="absolute h-4 w-4 animate-estrela-sobe text-veritas-ouro"
            style={{ ["--dx" as string]: `${Math.cos(ang) * dist}px`, ["--dy" as string]: `${Math.sin(ang) * dist}px`, animationDelay: `${(i % 7) * 60}ms` }} />
        );
      })}
      <div className="flex animate-sobe-fade flex-col items-center gap-3 rounded-[6px] border border-veritas-ouro/40 bg-veritas-tinta px-8 py-6 text-center text-veritas-pergaminho shadow-2xl">
        <SimboloVeritas className="h-12 w-12" cor="ouro" />
        <p className="titulo-institucional text-2xl">Bem-vindo à Academia</p>
        <p className="text-sm text-veritas-pergaminho/70">Sua rotina foi criada. Vamos à primeira missão.</p>
      </div>
    </div>
  );
}
