"use client";
import { useEffect, useState } from "react";

const FRASES = [
  "A constância vence o talento que não se disciplina.",
  "Cada questão errada hoje é um ponto garantido na prova.",
  "Não é sobre estudar muito num dia. É sobre estudar todos os dias.",
  "Quem conhece os próprios erros já está à frente.",
];

export function FraseRotativa() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % FRASES.length), 6000);
    return () => clearInterval(t);
  }, []);
  return (
    <p key={i} className="animate-sobe-fade font-titulo text-xl italic leading-snug text-slate-200" aria-live="polite">“{FRASES[i]}”</p>
  );
}
