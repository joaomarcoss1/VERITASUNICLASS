"use client";
import { useRef } from "react";
import { FundoVeritas, EstrelaVeritas } from "@/components/brand/fundo";
import { SeloUniClass } from "@/components/brand/selo";
import { FraseRotativa } from "./frase-rotativa";

/** Lado institucional do login: selo com paralaxe suave ao mover o mouse, órbitas e constelação. */
export function PainelInstitucional() {
  const ref = useRef<HTMLDivElement>(null);
  function mover(e: React.MouseEvent) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--px", String((e.clientX - r.left) / r.width - 0.5));
    el.style.setProperty("--py", String((e.clientY - r.top) / r.height - 0.5));
  }
  return (
    <aside ref={ref} onMouseMove={mover} className="sobre-tinta relative isolate hidden flex-col items-center justify-center overflow-hidden px-10 text-veritas-pergaminho lg:flex" style={{ ["--px" as string]: 0, ["--py" as string]: 0 }}>
      <FundoVeritas variante="institucional" fixo={false} />
      <div className="relative grid place-items-center transition-transform duration-500 ease-premium" style={{ transform: "translate3d(calc(var(--px) * 18px), calc(var(--py) * 18px), 0)" }}>
        <div className="absolute h-[26rem] w-[26rem] animate-gira-medio rounded-full border border-dashed border-veritas-ouro/20" aria-hidden />
        <div className="absolute h-[20rem] w-[20rem] animate-gira-reverso rounded-full border border-veritas-ouro/15" aria-hidden>
          <EstrelaVeritas className="absolute -top-2 left-1/2 h-4 w-4 -translate-x-1/2 text-veritas-ouro" />
          <EstrelaVeritas className="absolute -bottom-1.5 left-1/2 h-3 w-3 -translate-x-1/2 text-veritas-ouro/70" />
        </div>
        <div className="absolute h-56 w-56 animate-respira rounded-full bg-veritas-ouro/25 blur-3xl" aria-hidden />
        <div style={{ transform: "translate3d(calc(var(--px) * -10px), calc(var(--py) * -10px), 0)" }}>
          <div className="animate-flutua">
            <SeloUniClass className="relative w-64 drop-shadow-[0_30px_40px_rgba(0,0,0,.45)]" />
          </div>
        </div>
      </div>
      <div className="filete relative mt-14 w-64" />
      <FraseRotativa />
      <p className="absolute bottom-6 text-xs tracking-[0.3em] text-veritas-ouro/70">ACADEMIA VERITAS UNICLASS</p>
    </aside>
  );
}
