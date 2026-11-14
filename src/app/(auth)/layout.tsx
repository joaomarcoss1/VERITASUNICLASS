import { LogoUniClass } from "@/components/brand/logo";
import { FundoVeritas } from "@/components/brand/fundo";
import { PainelInstitucional } from "@/components/auth/painel-institucional";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <PainelInstitucional />
      <main className="relative isolate flex flex-col px-5 py-8 sm:px-10">
        <FundoVeritas fixo={false} />
        <div className="sobre-tinta relative mb-8 overflow-hidden rounded-2xl px-4 py-3 lg:hidden">
          <FundoVeritas variante="institucional" fixo={false} gravura={false} />
          <LogoUniClass invertido />
        </div>
        <div className="relative mx-auto my-auto w-full max-w-md animate-sobe-fade rounded-[1.25rem] border border-borda bg-superficie p-6 shadow-[0_1px_3px_rgba(14,27,46,.06),0_20px_50px_-30px_rgba(14,27,46,.25)] sm:p-9">
          {children}
        </div>
      </main>
    </div>
  );
}
