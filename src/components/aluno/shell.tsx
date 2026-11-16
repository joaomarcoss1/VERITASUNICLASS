"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Bell, Menu, Play, Search, X } from "lucide-react";
import { LogoUniClass, SimboloVeritas } from "@/components/brand/logo";
import { EstrelaVeritas, FundoVeritas } from "@/components/brand/fundo";
import { cn } from "@/lib/utils";
import { NAV_GRUPOS, NAV_MOBILE, NAV_TODOS } from "./nav-items";
import { EVENTO_INICIAR, StudyTimer, type DetalheIniciar } from "./study-timer";
import { ThemeToggle } from "./theme-toggle";

function ItemMenu({ href, label, icon: Icon, ativo, tabIndex }: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; ativo: boolean; tabIndex?: number }) {
  return (
    <Link
      href={href}
      tabIndex={tabIndex}
      aria-current={ativo ? "page" : undefined}
      className={cn(
        "group relative flex h-9 items-center gap-3 rounded-lg px-3 text-[0.875rem] font-medium transition-colors duration-150",
        ativo ? "bg-white/[.08] text-white" : "text-slate-300/80 hover:bg-white/[.04] hover:text-white",
      )}
    >
      <span className={cn("absolute -left-3 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r bg-veritas-ouro transition-opacity", ativo ? "opacity-100" : "opacity-0")} aria-hidden />
      <Icon className={cn("h-[18px] w-[18px] shrink-0", ativo ? "text-veritas-ouro" : "text-slate-400 group-hover:text-slate-200")} />
      {label}
    </Link>
  );
}

function Navegacao({ ativo, tabIndex }: { ativo: (h: string) => boolean; tabIndex?: number }) {
  return (
    <nav aria-label="Principal" className="space-y-6">
      {NAV_GRUPOS.map((g, gi) => (
        <div key={gi}>
          {g.titulo && <p className="mb-1.5 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.08em] text-slate-500">{g.titulo}</p>}
          <div className="space-y-0.5">
            {g.itens.map((i) => <ItemMenu key={i.href} {...i} ativo={ativo(i.href)} tabIndex={tabIndex} />)}
          </div>
        </div>
      ))}
    </nav>
  );
}

function CartaoAluno({ nome }: { nome: string }) {
  const iniciais = nome.split(" ").filter(Boolean).slice(0, 2).map((p) => p[0]).join("").toUpperCase();
  return (
    <Link href="/configuracoes" className="flex items-center gap-3 rounded-lg border border-white/[.08] bg-white/[.03] p-2.5 transition hover:bg-white/[.06]">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-veritas-ouro text-[0.8125rem] font-semibold text-veritas-tinta">{iniciais}</span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[0.8125rem] font-semibold text-white">{nome}</span>
        <span className="block truncate text-xs text-slate-400">Aluno · Plano Gratuito</span>
      </span>
    </Link>
  );
}

function Busca({ className }: { className?: string }) {
  const router = useRouter();
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => {
    function atalho(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); ref.current?.focus(); }
    }
    window.addEventListener("keydown", atalho);
    return () => window.removeEventListener("keydown", atalho);
  }, []);
  return (
    <form role="search" className={cn("relative", className)} onSubmit={(e) => { e.preventDefault(); const q = ref.current?.value.trim(); if (q) router.push(`/questoes?busca=${encodeURIComponent(q)}`); }}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-texto-suave" />
      <input ref={ref} type="search" placeholder="Buscar questões, aulas e assuntos" aria-label="Buscar"
        className="h-9 w-full rounded-lg border border-borda bg-superficie-alta pl-9 pr-14 text-sm text-texto placeholder:text-texto-suave/80 transition focus:border-info focus:bg-superficie focus:outline-none focus:ring-4 focus:ring-info/10" />
      <kbd className="pointer-events-none absolute right-2.5 top-1/2 hidden -translate-y-1/2 rounded border border-borda bg-superficie px-1.5 py-px text-[0.625rem] font-semibold text-texto-suave sm:block">Ctrl K</kbd>
    </form>
  );
}

function iniciarSessao() {
  window.dispatchEvent(new CustomEvent<DetalheIniciar>(EVENTO_INICIAR, { detail: { disciplinaId: null, conteudo: null } }));
}

export function AlunoShell({ children, nome, demo }: { children: ReactNode; nome: string; demo: boolean }) {
  const path = usePathname();
  const [aberto, setAberto] = useState(false);
  const ativo = (href: string) => path === href || path.startsWith(`${href}/`);
  const atual = NAV_TODOS.find((i) => ativo(i.href));
  useEffect(() => setAberto(false), [path]);

  const lateral = (tabIndex?: number) => (
    <>
      <div className="flex h-16 shrink-0 items-center px-5">
        <Link href="/inicio" tabIndex={tabIndex}><LogoUniClass invertido /></Link>
      </div>
      <div className="flex-1 overflow-y-auto px-3 pb-4 pt-2">
        <Navegacao ativo={ativo} tabIndex={tabIndex} />
      </div>
      <div className="relative shrink-0 border-t border-white/[.06] p-3">
        <CartaoAluno nome={nome} />
      </div>
    </>
  );

  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-[256px_1fr]">
      <FundoVeritas />

      {/* Menu lateral (desktop) */}
      <aside className="sticky top-0 z-20 hidden h-dvh flex-col overflow-hidden bg-veritas-tinta lg:flex">
        <SimboloVeritas className="pointer-events-none absolute -bottom-16 -right-20 h-64 w-64 opacity-[.05]" cor="ouro" />
        {lateral()}
      </aside>

      <div className="relative min-w-0">
        {/* Barra superior */}
        <header className="sticky top-0 z-30 border-b border-borda bg-superficie/90 backdrop-blur supports-[backdrop-filter]:bg-superficie/80">
          <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setAberto(true)} className="-ml-1 grid h-9 w-9 place-items-center rounded-lg text-texto hover:bg-superficie-alta lg:hidden" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/inicio" className="lg:hidden"><SimboloVeritas className="h-7 w-7" cor="auto" /></Link>
            <p className="hidden text-sm font-semibold text-texto md:block lg:w-40">{atual?.label ?? "Veritas UniClass"}</p>
            <Busca className="hidden flex-1 sm:block sm:max-w-md" />
            <div className="ml-auto flex items-center gap-1.5">
              <button onClick={iniciarSessao} className="reflexo hidden h-9 items-center gap-2 rounded-lg bg-veritas-ouro px-3.5 text-[0.8125rem] font-semibold text-veritas-tinta transition hover:bg-[#AB8650] md:inline-flex">
                <Play className="h-3.5 w-3.5 fill-current" /> Iniciar sessão
              </button>
              <ThemeToggle tom="claro" />
              <Link href="/insights" className="grid h-9 w-9 place-items-center rounded-lg text-texto-suave transition hover:bg-superficie-alta hover:text-texto" aria-label="Novidades e alertas">
                <Bell className="h-[18px] w-[18px]" />
              </Link>
            </div>
          </div>
        </header>

        {demo && (
          <div className="border-b border-borda bg-revisar-suave px-4 py-1.5 text-center text-xs font-medium text-revisar">
            <EstrelaVeritas className="mr-1.5 inline h-3 w-3 align-[-1px]" />
            Modo demonstração — dados fictícios. Configure o Supabase em <code className="font-mono">.env.local</code> para usar contas reais.
          </div>
        )}

        <main className="relative mx-auto max-w-[1240px] px-4 pb-32 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">{children}</main>
      </div>

      {/* Gaveta (mobile) */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", aberto ? "pointer-events-auto" : "pointer-events-none")} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!aberto}>
        <div className={cn("absolute inset-0 bg-slate-950/50 transition-opacity duration-300", aberto ? "opacity-100" : "opacity-0")} onClick={() => setAberto(false)} />
        <div className={cn("absolute inset-y-0 left-0 flex w-[82%] max-w-[288px] flex-col bg-veritas-tinta shadow-2xl transition-transform duration-300 ease-premium", aberto ? "translate-x-0" : "-translate-x-full")}>
          <button onClick={() => setAberto(false)} className="absolute right-3 top-4 grid h-8 w-8 place-items-center rounded-lg text-slate-300 hover:bg-white/10" aria-label="Fechar menu" tabIndex={aberto ? 0 : -1}><X className="h-5 w-5" /></button>
          {lateral(aberto ? 0 : -1)}
        </div>
      </div>

      {/* Barra inferior (mobile) */}
      <nav aria-label="Atalhos" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-borda bg-superficie pb-[env(safe-area-inset-bottom)] lg:hidden">
        {NAV_TODOS.filter((i) => (NAV_MOBILE as readonly string[]).includes(i.href)).map(({ href, label, icon: Icon }) => {
          const on = ativo(href);
          return (
            <Link key={href} href={href} aria-current={on ? "page" : undefined} className={cn("relative flex flex-col items-center gap-1 py-2 text-[0.6875rem] font-medium", on ? "text-texto" : "text-texto-suave")}>
              <span className={cn("absolute top-0 h-0.5 w-8 rounded-b bg-veritas-ouro transition-opacity", on ? "opacity-100" : "opacity-0")} />
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          );
        })}
        <button onClick={() => setAberto(true)} className="flex flex-col items-center gap-1 py-2 text-[0.6875rem] font-medium text-texto-suave">
          <Menu className="h-5 w-5" />
          Menu
        </button>
      </nav>

      <StudyTimer />
    </div>
  );
}
