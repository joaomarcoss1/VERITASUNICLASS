"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { LogoUniClass } from "@/components/brand/logo";
import { cn } from "@/lib/utils";
import { NAV_MOBILE, NAV_PERFIL, NAV_PRINCIPAL } from "./nav-items";
import { StudyTimer } from "./study-timer";
import { ThemeToggle } from "./theme-toggle";

function NavLink({ href, label, icon: Icon, ativo, onClick }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; ativo: boolean; onClick?: () => void }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      aria-current={ativo ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
        ativo ? "bg-white/10 text-veritas-pergaminho" : "text-veritas-pergaminho/70 hover:bg-white/5 hover:text-veritas-pergaminho",
      )}
    >
      <span className={cn("h-5 w-0.5 rounded-full transition", ativo ? "bg-veritas-ouro" : "bg-transparent")} aria-hidden />
      <Icon className={cn("h-[18px] w-[18px]", ativo ? "text-veritas-ouro" : "")} />
      {label}
    </Link>
  );
}

export function AlunoShell({ children, nome, demo }: { children: ReactNode; nome: string; demo: boolean }) {
  const path = usePathname();
  const [aberto, setAberto] = useState(false);
  const ativo = (href: string) => path === href || path.startsWith(`${href}/`);

  const menu = (onClick?: () => void) => (
    <>
      <nav aria-label="Principal" className="space-y-0.5">
        {NAV_PRINCIPAL.map((i) => <NavLink key={i.href} {...i} ativo={ativo(i.href)} onClick={onClick} />)}
      </nav>
      <div className="my-5 filete opacity-50" />
      <p className="px-3 pb-2 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-veritas-ouro/80">Perfil</p>
      <nav aria-label="Perfil" className="space-y-0.5">
        {NAV_PERFIL.map((i) => <NavLink key={i.href} {...i} ativo={ativo(i.href)} onClick={onClick} />)}
      </nav>
    </>
  );

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[264px_1fr]">
      {/* Menu lateral (desktop) */}
      <aside className="sticky top-0 hidden h-dvh flex-col bg-veritas-tinta px-4 py-6 lg:flex">
        <Link href="/inicio" className="mb-8 px-2"><LogoUniClass invertido /></Link>
        <div className="flex-1 overflow-y-auto">{menu()}</div>
        <div className="mt-4 flex items-center justify-between rounded-xl bg-white/5 px-3 py-2.5">
          <span className="truncate text-sm text-veritas-pergaminho/90">{nome}</span>
          <ThemeToggle />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Topo (mobile) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-white/10 bg-veritas-tinta px-4 py-3 lg:hidden">
          <Link href="/inicio"><LogoUniClass invertido /></Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button onClick={() => setAberto(true)} className="grid h-10 w-10 place-items-center rounded-xl text-veritas-pergaminho" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {demo && (
          <div className="border-b border-revisar/30 bg-revisar-suave px-4 py-2 text-center text-xs font-medium text-revisar">
            Modo demonstração — dados fictícios. Configure o Supabase no <code>.env.local</code> para usar contas reais.
          </div>
        )}

        <main className="mx-auto max-w-6xl px-4 pb-32 pt-6 sm:px-6 lg:px-10 lg:pb-16 lg:pt-10">{children}</main>
      </div>

      {/* Gaveta (mobile) */}
      {aberto && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <div className="absolute inset-0 bg-black/50" onClick={() => setAberto(false)} />
          <div className="absolute inset-y-0 right-0 w-[82%] max-w-xs overflow-y-auto bg-veritas-tinta px-4 py-5">
            <div className="mb-6 flex justify-end">
              <button onClick={() => setAberto(false)} className="grid h-10 w-10 place-items-center rounded-xl text-veritas-pergaminho" aria-label="Fechar menu"><X className="h-5 w-5" /></button>
            </div>
            {menu(() => setAberto(false))}
          </div>
        </div>
      )}

      {/* Barra inferior (mobile) */}
      <nav aria-label="Atalhos" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-white/10 bg-veritas-tinta pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV_PRINCIPAL.filter((i) => (NAV_MOBILE as readonly string[]).includes(i.href)).map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} aria-current={ativo(href) ? "page" : undefined} className={cn("flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium", ativo(href) ? "text-veritas-ouro" : "text-veritas-pergaminho/70")}>
            <Icon className="h-5 w-5" />
            {label.replace("Meus ", "")}
          </Link>
        ))}
        <button onClick={() => setAberto(true)} className="flex flex-col items-center gap-1 py-2.5 text-[0.65rem] font-medium text-veritas-pergaminho/70">
          <Menu className="h-5 w-5" />
          Mais
        </button>
      </nav>

      <StudyTimer />
    </div>
  );
}
