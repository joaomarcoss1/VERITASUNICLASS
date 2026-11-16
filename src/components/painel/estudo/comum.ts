import { nomeDisciplina } from "@/lib/catalog";
import { disciplinas as cores } from "@/lib/design/tokens";

export const corDe = (id: string | null | undefined) => (id && cores[id]) || "#2B4166";
export const nomeDe = (id: string | null | undefined, curto = true) => (id ? nomeDisciplina(id, curto) : "Geral");

const SEMANA = ["dom.", "seg.", "ter.", "qua.", "qui.", "sex.", "sáb."];
export const diaSemana = (iso: string) => SEMANA[new Date(`${iso}T12:00:00Z`).getUTCDay()];
export const diaMes = (iso: string) => Number(iso.slice(8, 10));
export const ddmm = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;
