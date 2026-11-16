"use client";

/** Controle segmentado com indicador tinta deslizando entre as opções. */
export function Segmentado<T extends string>({ opcoes, valor, onChange, rotulo }: { opcoes: { v: T; t: string }[]; valor: T; onChange: (v: T) => void; rotulo: string }) {
  const i = Math.max(0, opcoes.findIndex((o) => o.v === valor));
  const n = opcoes.length;
  return (
    <div className="segmentado" role="group" aria-label={rotulo}>
      <span className="indicador" style={{ left: `calc(3px + ${i} * (100% - 6px) / ${n})`, width: `calc((100% - 6px) / ${n})` }} aria-hidden />
      {opcoes.map((o) => (
        <button key={o.v} type="button" aria-pressed={o.v === valor} onClick={() => onChange(o.v)}>{o.t}</button>
      ))}
    </div>
  );
}
