import type { InputHTMLAttributes } from "react";

export function Campo({ rotulo, ...props }: InputHTMLAttributes<HTMLInputElement> & { rotulo: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.8125rem] font-medium text-texto">{rotulo}</span>
      <input {...props} className="h-10 w-full rounded-lg border border-borda bg-superficie px-3.5 text-sm text-texto shadow-[0_1px_2px_rgba(16,24,40,.05)] transition placeholder:text-texto-suave/70 hover:border-borda-forte focus:border-info focus:outline-none focus:ring-4 focus:ring-info/10" />
    </label>
  );
}

export function Aviso({ tipo, children }: { tipo: "erro" | "ok"; children: React.ReactNode }) {
  return (
    <p role={tipo === "erro" ? "alert" : "status"} className={tipo === "erro" ? "rounded-lg border border-erro/20 bg-erro-suave px-3.5 py-2.5 text-sm font-medium text-erro" : "rounded-lg border border-acerto/20 bg-acerto-suave px-3.5 py-2.5 text-sm font-medium text-acerto"}>
      {children}
    </p>
  );
}

export function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.6 10.6 0 0 0 12 1 11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}
