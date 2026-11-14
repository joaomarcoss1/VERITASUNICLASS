"use client";
import { useRef } from "react";
import { FundoVeritas } from "@/components/brand/fundo";
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
      <FundoVeritas variante="institucional" fixo={false} gravura={false} />
      <div className="relative grid place-items-center transition-transform duration-500 ease-premium" style={{ transform: "translate3d(calc(var(--px) * 18px), calc(var(--py) * 18px), 0)" }}>
        <div className="absolute h-[24rem] w-[24rem] rounded-full border border-veritas-ouro/20" aria-hidden />
        <div className="absolute h-[23.25rem] w-[23.25rem] rounded-full border border-veritas-ouro/10" aria-hidden />
        <div style={{ transform: "translate3d(calc(var(--px) * -10px), calc(var(--py) * -10px), 0)" }}>
          <SeloUniClass className="relative w-64 drop-shadow-[0_18px_24px_rgba(0,0,0,.35)]" />
        </div>
      </div>
      <div className="filete relative mt-14 w-64" />
      <FraseRotativa />
      <p className="absolute bottom-6 text-xs tracking-[0.3em] text-veritas-ouro/70">ACADEMIA VERITAS UNICLASS</p>
    </aside>
  );
}
