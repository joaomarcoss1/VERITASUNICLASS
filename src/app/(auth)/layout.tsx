import { SeloUniClass } from "@/components/brand/selo";
import { LogoUniClass } from "@/components/brand/logo";
import { FraseRotativa } from "@/components/auth/frase-rotativa";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-dvh lg:grid-cols-2">
      <aside className="textura-pergaminho relative hidden flex-col items-center justify-center overflow-hidden bg-veritas-tinta px-10 text-veritas-pergaminho lg:flex">
        <SeloUniClass className="w-60 drop-shadow-2xl" />
        <div className="filete mt-10 w-64" />
        <FraseRotativa />
        <p className="absolute bottom-6 text-xs tracking-[0.25em] text-veritas-ouro/70">ACADEMIA VERITAS UNICLASS</p>
      </aside>
      <main className="flex flex-col bg-fundo px-5 py-8 sm:px-10">
        <div className="mb-8 rounded-xl bg-veritas-tinta px-4 py-3 lg:hidden"><LogoUniClass invertido /></div>
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center">{children}</div>
      </main>
    </div>
  );
}
