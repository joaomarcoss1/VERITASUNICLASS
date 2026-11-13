import { redirect } from "next/navigation";
import { ShieldAlert } from "lucide-react";
import { LogoUniClass } from "@/components/brand/logo";
import { contextoAdministrativo, PAPEIS_ADMINISTRATIVOS } from "@/lib/auth/roles";

export const dynamic = "force-dynamic";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await contextoAdministrativo();
  if (!ctx.papeis.some((p) => PAPEIS_ADMINISTRATIVOS.includes(p))) redirect("/inicio");
  return (
    <div className="min-h-dvh">
      <header className="flex items-center justify-between bg-veritas-tinta px-5 py-4">
        <LogoUniClass invertido />
        <span className="text-xs font-semibold uppercase tracking-widest text-veritas-ouro">Painel administrativo</span>
      </header>
      <main className="mx-auto max-w-5xl px-5 py-8">
        {ctx.aal2 ? children : (
          <div role="alert" className="flex gap-3 rounded-xl bg-revisar-suave p-5 text-revisar">
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-semibold">Verificação em duas etapas obrigatória</p>
              <p className="mt-1 text-sm">Perfis administrativos precisam de 2FA ativo. Configure um app autenticador e entre novamente.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
