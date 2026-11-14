"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { LogoUniClass } from "@/components/brand/logo";
import { EstrelaVeritas, FundoVeritas, SimboloMarcaDagua } from "@/components/brand/fundo";
import { cn } from "@/lib/utils";
import { NAV_MOBILE, NAV_PERFIL, NAV_PRINCIPAL } from "./nav-items";
import { StudyTimer } from "./study-timer";
import { ThemeToggle } from "./theme-toggle";

function NavLink({ href, label, icon: Icon, ativo, onClick, tabIndex }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; ativo: boolean; onClick?: () => void; tabIndex?: number }) {
  return (
    <Link
      href={href}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-current={ativo ? "page" : undefined}
      className={cn(
        "group reflexo relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition duration-300 ease-premium",
        ativo
          ? "bg-white/[.06] text-veritas-pergaminho"
          : "text-veritas-pergaminho/65 hover:translate-x-0.5 hover:bg-white/[.05] hover:text-veritas-pergaminho",
      )}
    >
      <span className={cn("absolute left-0 top-1/2 w-[3px] -translate-y-1/2 rounded-r-full bg-veritas-ouro transition-all duration-300", ativo ? "h-6 opacity-100" : "h-0 opacity-0")} aria-hidden />
      <Icon className={cn("h-[18px] w-[18px] transition-transform duration-300 group-hover:scale-110", ativo ? "text-veritas-ouro" : "")} />
      <span className="flex-1">{label}</span>
    </Link>
  );
}

export function AlunoShell({ children, nome, demo }: { children: ReactNode; nome: string; demo: boolean }) {
  const path = usePathname();
  const [aberto, setAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const ativo = (href: string) => path === href || path.startsWith(`${href}/`);
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();

  useEffect(() => {
    const f = () => setRolou(window.scrollY > 8);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  useEffect(() => setAberto(false), [path]);

  const menu = (onClick?: () => void, tabIndex?: number) => (
    <>
      <nav aria-label="Principal" className="space-y-1">
        {NAV_PRINCIPAL.map((i) => <NavLink key={i.href} {...i} ativo={ativo(i.href)} onClick={onClick} tabIndex={tabIndex} />)}
      </nav>
      <div className="filete my-5 opacity-40" />
      <p className="flex items-center gap-2 px-3 pb-2 text-[0.62rem] font-semibold uppercase tracking-[0.24em] text-veritas-ouro/80">
        <EstrelaVeritas className="h-2 w-2" /> Perfil
      </p>
      <nav aria-label="Perfil" className="space-y-1">
        {NAV_PERFIL.map((i) => <NavLink key={i.href} {...i} ativo={ativo(i.href)} onClick={onClick} tabIndex={tabIndex} />)}
      </nav>
    </>
  );

  const perfil = (
    <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/[.04] px-3 py-2.5">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-veritas-ouro text-xs font-bold text-veritas-tinta">{iniciais}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium text-veritas-pergaminho">{nome}</span>
        <span className="block text-[0.65rem] uppercase tracking-widest text-veritas-ouro/80">Aluno Veritas</span>
      </span>
      <ThemeToggle />
    </div>
  );

  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-[272px_1fr]">
      <FundoVeritas />

      {/* Menu lateral (desktop) */}
      <aside className="sticky top-0 hidden h-dvh flex-col overflow-hidden bg-veritas-tinta px-4 py-6 lg:flex">
        <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-veritas-ouro/40 to-transparent" aria-hidden />
        <SimboloMarcaDagua className="pointer-events-none absolute -bottom-12 -left-14 h-64 w-64 text-veritas-ouro opacity-[.12]" />
        <Link href="/inicio" className="relative mb-8 px-2 transition hover:opacity-90"><LogoUniClass invertido /></Link>
        <div className="relative flex-1 overflow-y-auto pr-1">{menu()}</div>
        <div className="relative mt-4">{perfil}</div>
      </aside>

      <div className="relative min-w-0">
        {/* Topo (mobile) */}
        <header className={cn("vidro-tinta sticky top-0 z-30 flex items-center justify-between border-b px-4 py-3 transition-shadow lg:hidden", rolou ? "border-veritas-ouro/25" : "border-white/5")}>
          <Link href="/inicio"><LogoUniClass invertido /></Link>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button onClick={() => setAberto(true)} className="grid h-10 w-10 place-items-center rounded-xl text-veritas-pergaminho transition active:scale-90" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {demo && (
          <div className="border-b border-revisar/20 bg-revisar-suave px-4 py-2 text-center text-xs font-medium text-revisar">
            <EstrelaVeritas className="mr-1.5 inline h-3 w-3 align-[-1px]" />
            Modo demonstração — dados fictícios. Configure o Supabase no <code>.env.local</code> para usar contas reais.
          </div>
        )}

        <main className="relative mx-auto max-w-6xl px-4 pb-36 pt-6 sm:px-6 lg:px-10 lg:pb-20 lg:pt-10">{children}</main>
      </div>

      {/* Gaveta (mobile) */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", aberto ? "pointer-events-auto" : "pointer-events-none")} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!aberto}>
        <div className={cn("absolute inset-0 bg-veritas-tinta/50 transition-opacity duration-300", aberto ? "opacity-100" : "opacity-0")} onClick={() => setAberto(false)} />
        <div className={cn("absolute inset-y-0 right-0 flex w-[84%] max-w-xs flex-col overflow-hidden bg-veritas-tinta px-4 py-5 shadow-2xl transition-transform duration-500 ease-premium", aberto ? "translate-x-0" : "translate-x-full")}>
          <SimboloMarcaDagua className="pointer-events-none absolute -bottom-10 -right-16 h-64 w-64 text-veritas-ouro opacity-[.12]" />
          <div className="relative mb-6 flex items-center justify-between">
            <LogoUniClass invertido />
            <button onClick={() => setAberto(false)} className="grid h-10 w-10 place-items-center rounded-xl text-veritas-pergaminho" aria-label="Fechar menu" tabIndex={aberto ? 0 : -1}><X className="h-5 w-5" /></button>
          </div>
          <div className="relative flex-1 overflow-y-auto">{menu(() => setAberto(false), aberto ? 0 : -1)}</div>
          <div className="relative mt-4">{perfil}</div>
        </div>
      </div>

      {/* Barra inferior (mobile) */}
      <nav aria-label="Atalhos" className="vidro-tinta fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-veritas-ouro/15 pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV_PRINCIPAL.filter((i) => (NAV_MOBILE as readonly string[]).includes(i.href)).map(({ href, label, icon: Icon }) => {
          const on = ativo(href);
          return (
            <Link key={href} href={href} aria-current={on ? "page" : undefined} className={cn("relative flex flex-col items-center gap-0.5 py-2 text-[0.65rem] font-medium transition active:scale-90", on ? "text-veritas-ouro" : "text-veritas-pergaminho/65")}>
              <span className={cn("absolute top-0 h-[2px] rounded-full bg-veritas-ouro transition-all duration-300", on ? "w-8 opacity-100" : "w-0 opacity-0")} />
              <span className={cn("grid h-8 w-12 place-items-center rounded-full transition", on && "bg-veritas-ouro/15")}><Icon className="h-5 w-5" /></span>
              {label.replace("Meus ", "")}
            </Link>
          );
        })}
        <button onClick={() => setAberto(true)} className="flex flex-col items-center gap-0.5 py-2 text-[0.65rem] font-medium text-veritas-pergaminho/65 active:scale-90">
          <span className="grid h-8 w-12 place-items-center"><Menu className="h-5 w-5" /></span>
          Mais
        </button>
      </nav>

      <StudyTimer />
    </div>
  );
}
