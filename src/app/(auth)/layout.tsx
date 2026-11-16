import { LogoUniClass } from "@/components/brand/logo";
import { PainelInstitucional } from "@/components/auth/painel-institucional";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-[1.05fr_1fr]">
      <PainelInstitucional />
      <main className="flex flex-col bg-fundo px-5 py-8 sm:px-10">
        <div className="lg:hidden"><LogoUniClass /></div>
        <div className="mx-auto my-auto w-full max-w-[400px] animate-sobe-fade py-10">{children}</div>
        <p className="text-center text-xs text-texto-suave">© Veritas Group · Cursos livres, nos termos da legislação vigente.</p>
      </main>
    </div>
  );
}
