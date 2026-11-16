"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { LogoUniClass, SimboloVeritas } from "@/components/brand/logo";
import { EstrelaVeritas, FundoVeritas } from "@/components/brand/fundo";
import { cn } from "@/lib/utils";
import { NAV_MOBILE, NAV_PERFIL, NAV_PRINCIPAL } from "./nav-items";
import { StudyTimer } from "./study-timer";
import { ThemeToggle } from "./theme-toggle";

type Item = { href: string; numero: string; label: string; icon: React.ComponentType<{ className?: string }> };

/** Linha do índice: numeral · título em serifa · pontilhado · ícone. Ativo ganha a fita vinho. */
function EntradaIndice({ item, ativo, onClick, tabIndex }: { item: Item; ativo: boolean; onClick?: () => void; tabIndex?: number }) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      tabIndex={tabIndex}
      aria-current={ativo ? "page" : undefined}
      className={cn("group relative flex items-baseline gap-2.5 py-[0.55rem] pl-1 pr-9 transition-colors duration-200", ativo ? "text-texto" : "text-texto-suave hover:text-texto")}
    >
      <span className={cn("w-7 shrink-0 font-titulo text-[0.82rem] font-semibold tracking-[0.12em] transition-colors", ativo ? "text-premium" : "text-destaque-texto/80 group-hover:text-destaque-texto")}>{item.numero}</span>
      <span className={cn("font-titulo text-[1.12rem] leading-none", ativo ? "font-semibold" : "font-medium")}>{item.label}</span>
      <span className={cn("pontilhado transition-opacity", ativo ? "opacity-0" : "opacity-60 group-hover:opacity-100")} aria-hidden />
      <Icon className={cn("absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 transition", ativo ? "opacity-0" : "opacity-50 group-hover:opacity-90")} />
      {/* Fita marcadora saindo pela borda direita do índice */}
      <span
        className={cn("absolute -right-[1.15rem] top-1/2 h-7 w-9 -translate-y-1/2 bg-veritas-vinho transition-all duration-300 ease-premium", ativo ? "opacity-100" : "w-0 opacity-0")}
        style={{ clipPath: "polygon(0 0, 100% 0, 82% 50%, 100% 100%, 0 100%)" }}
        aria-hidden
      />
      {ativo && <span className="absolute inset-x-0 -bottom-px h-px bg-[linear-gradient(90deg,rgb(var(--destaque)),transparent)]" aria-hidden />}
    </Link>
  );
}

function Indice({ ativo, onClick, tabIndex }: { ativo: (href: string) => boolean; onClick?: () => void; tabIndex?: number }) {
  return (
    <>
      <p className="mb-2 flex items-center gap-3 font-titulo text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-destaque-texto">
        Índice <span className="h-px flex-1 bg-borda" />
      </p>
      <nav aria-label="Principal">
        {NAV_PRINCIPAL.map((i) => <EntradaIndice key={i.href} item={i} ativo={ativo(i.href)} onClick={onClick} tabIndex={tabIndex} />)}
      </nav>
      <p className="mb-2 mt-7 flex items-center gap-3 font-titulo text-[0.78rem] font-semibold uppercase tracking-[0.32em] text-destaque-texto">
        Apêndices <span className="h-px flex-1 bg-borda" />
      </p>
      <nav aria-label="Perfil">
        {NAV_PERFIL.map((i) => <EntradaIndice key={i.href} item={i} ativo={ativo(i.href)} onClick={onClick} tabIndex={tabIndex} />)}
      </nav>
    </>
  );
}

/** Ex-libris: o "selo de dono" do livro, no rodapé do índice. */
function ExLibris({ nome }: { nome: string }) {
  return (
    <div className="relative rounded-[4px] border border-borda bg-superficie p-1">
      <div className="flex items-center gap-3 rounded-[2px] border border-destaque/30 px-3 py-2.5">
        <SimboloVeritas className="h-8 w-8" cor="auto" />
        <div className="min-w-0 flex-1">
          <p className="font-titulo text-[0.7rem] italic tracking-wide text-destaque-texto">Ex libris</p>
          <p className="truncate font-titulo text-base font-semibold leading-tight text-texto">{nome}</p>
        </div>
      </div>
    </div>
  );
}

/** Lombada: faixa azul tinta com nervuras douradas, como um livro encadernado. */
function Lombada() {
  return (
    <div className="absolute inset-y-0 left-0 w-3 bg-veritas-tinta" aria-hidden>
      {[12, 14.5, 46, 48.5, 84, 86.5].map((t) => <span key={t} className="absolute inset-x-0 h-[2px] bg-veritas-ouro/80" style={{ top: `${t}%` }} />)}
      <span className="absolute inset-y-0 right-0 w-px bg-veritas-ouro/40" />
    </div>
  );
}

export function AlunoShell({ children, nome, demo }: { children: ReactNode; nome: string; demo: boolean }) {
  const path = usePathname();
  const [aberto, setAberto] = useState(false);
  const ativo = (href: string) => path === href || path.startsWith(`${href}/`);
  useEffect(() => setAberto(false), [path]);

  return (
    <div className="relative min-h-dvh lg:grid lg:grid-cols-[280px_1fr]">
      <FundoVeritas />

      {/* Índice (desktop) */}
      <aside className="sticky top-0 z-20 hidden h-dvh flex-col border-r border-borda bg-superficie py-7 pl-8 pr-5 lg:flex">
        <Lombada />
        <span className="absolute inset-y-0 right-1 w-px bg-borda/70" aria-hidden />
        <div className="mb-9 flex items-center justify-between"><Link href="/inicio"><LogoUniClass /></Link><ThemeToggle tom="claro" /></div>
        <div className="-mr-5 flex-1 overflow-y-auto overflow-x-visible pr-5">
          <Indice ativo={ativo} />
        </div>
        <div className="mt-5"><ExLibris nome={nome} /></div>
      </aside>

      <div className="relative min-w-0">
        {/* Topo (mobile) */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-borda bg-superficie/95 px-4 py-3 lg:hidden">
          <Link href="/inicio"><LogoUniClass /></Link>
          <div className="flex items-center gap-1">
            <ThemeToggle tom="claro" />
            <button onClick={() => setAberto(true)} className="grid h-10 w-10 place-items-center rounded-[4px] text-texto transition active:scale-90" aria-label="Abrir menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </header>

        {demo && (
          <div className="border-b border-borda bg-revisar-suave px-4 py-2 text-center text-xs font-medium text-revisar">
            <EstrelaVeritas className="mr-1.5 inline h-3 w-3 align-[-1px]" />
            Modo demonstração — dados fictícios. Configure o Supabase no <code>.env.local</code> para usar contas reais.
          </div>
        )}

        <main className="relative mx-auto max-w-6xl px-4 pb-36 pt-6 sm:px-6 lg:px-12 lg:pb-20 lg:pt-10">{children}</main>
      </div>

      {/* Gaveta (mobile) */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", aberto ? "pointer-events-auto" : "pointer-events-none")} role="dialog" aria-modal="true" aria-label="Menu" aria-hidden={!aberto}>
        <div className={cn("absolute inset-0 bg-veritas-tinta/40 transition-opacity duration-300", aberto ? "opacity-100" : "opacity-0")} onClick={() => setAberto(false)} />
        <div className={cn("absolute inset-y-0 right-0 flex w-[86%] max-w-xs flex-col bg-superficie py-5 pl-8 pr-5 shadow-2xl transition-transform duration-500 ease-premium", aberto ? "translate-x-0" : "translate-x-full")}>
          <Lombada />
          <div className="mb-6 flex items-center justify-between">
            <LogoUniClass />
            <ThemeToggle tom="claro" />
            <button onClick={() => setAberto(false)} className="grid h-10 w-10 place-items-center rounded-[4px] text-texto" aria-label="Fechar menu" tabIndex={aberto ? 0 : -1}><X className="h-5 w-5" /></button>
          </div>
          <div className="-mr-5 flex-1 overflow-y-auto pr-5"><Indice ativo={ativo} onClick={() => setAberto(false)} tabIndex={aberto ? 0 : -1} /></div>
          <div className="mt-4"><ExLibris nome={nome} /></div>
        </div>
      </div>

      {/* Barra inferior (mobile) */}
      <nav aria-label="Atalhos" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-borda bg-superficie pb-[env(safe-area-inset-bottom)] lg:hidden">
        <span className="absolute inset-x-0 top-0 h-[2px] bg-veritas-tinta" aria-hidden />
        {NAV_PRINCIPAL.filter((i) => (NAV_MOBILE as readonly string[]).includes(i.href)).map(({ href, label, icon: Icon }) => {
          const on = ativo(href);
          return (
            <Link key={href} href={href} aria-current={on ? "page" : undefined} className={cn("relative flex flex-col items-center gap-0.5 pb-2 pt-2.5 text-[0.65rem] font-medium transition active:scale-95", on ? "text-texto" : "text-texto-suave")}>
              <span className={cn("absolute top-0 h-5 w-5 bg-veritas-vinho transition-all duration-300", on ? "opacity-100" : "h-0 opacity-0")} style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 50% 75%, 0 100%)" }} aria-hidden />
              <Icon className={cn("mt-2 h-5 w-5", on && "text-premium")} />
              {label.replace("Meus ", "")}
            </Link>
          );
        })}
        <button onClick={() => setAberto(true)} className="flex flex-col items-center gap-0.5 pb-2 pt-2.5 text-[0.65rem] font-medium text-texto-suave active:scale-95">
          <Menu className="mt-2 h-5 w-5" />
          Índice
        </button>
      </nav>

      <StudyTimer />
    </div>
  );
}
