"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/** Alterna entre claro e "Biblioteca noturna". Preferência salva no navegador. */
export function ThemeToggle({ tom = "escuro" }: { tom?: "claro" | "escuro" }) {
  const [escuro, setEscuro] = useState(false);
  useEffect(() => setEscuro(document.documentElement.classList.contains("dark")), []);
  function alternar() {
    const novo = !escuro;
    setEscuro(novo);
    document.documentElement.classList.toggle("dark", novo);
    try { localStorage.setItem("vu-tema", novo ? "escuro" : "claro"); } catch {}
  }
  return (
    <button onClick={alternar} className={tom === "claro" ? "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-texto-suave transition hover:bg-superficie-alta hover:text-texto" : "grid h-9 w-9 shrink-0 place-items-center rounded-lg text-veritas-pergaminho/80 hover:bg-white/10"} aria-label={escuro ? "Usar tema claro" : "Usar tema Biblioteca noturna"} title={escuro ? "Tema claro" : "Biblioteca noturna"}>
      {escuro ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
    </button>
  );
}

/** Script inline (antes da hidratação) para evitar "piscar" de tema. */
export const temaInicialScript = `try{var t=localStorage.getItem('vu-tema');if(t==='escuro'||(!t&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.classList.add('dark')}catch(e){}`;
