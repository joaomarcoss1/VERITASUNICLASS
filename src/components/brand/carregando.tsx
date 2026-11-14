import { SimboloVeritas } from "./logo";

/** Tela de espera com o símbolo respirando e um anel dourado girando. */
export function CarregandoVeritas({ texto = "Preparando sua missão…" }: { texto?: string }) {
  return (
    <div className="grid min-h-[60vh] place-items-center" role="status" aria-live="polite">
      <div className="flex flex-col items-center gap-5">
        <div className="relative grid h-28 w-28 place-items-center">
          <span className="absolute inset-0 animate-[gira_1.6s_linear_infinite] rounded-full border-2 border-transparent border-r-veritas-ouro/30 border-t-veritas-ouro" />
          <SimboloVeritas className="relative h-12 w-12 " cor="ouro" />
        </div>
        <p className="text-sm font-medium tracking-wide text-texto-suave">{texto}</p>
      </div>
    </div>
  );
}
