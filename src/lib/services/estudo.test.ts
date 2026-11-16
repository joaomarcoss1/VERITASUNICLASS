import { describe, expect, it } from "vitest";
import { comparativo, janela, totaisPorDisciplina } from "./estudo";
import { formatDuracao, relogio } from "@/lib/utils";

const dia = (data: string, por: Record<string, number>) => ({ data, minutos: Object.values(por).reduce((a, b) => a + b, 0), porDisciplina: por });
const estudo = [
  dia("2026-01-01", { pt: 60 }),
  dia("2026-01-02", { pt: 30, dc: 30 }),
  dia("2026-01-03", {}),
  dia("2026-01-04", { dc: 90, rl: 30 }),
];

describe("agregação de estudo", () => {
  it("soma por disciplina, calcula fatia e ordena", () => {
    const r = totaisPorDisciplina(estudo, 4);
    expect(r.total).toBe(240);
    expect(r.disciplinas[0]).toMatchObject({ disciplinaId: "dc", minutos: 120, fatia: 0.5, diasEstudados: 2 });
    expect(r.disciplinas.map((d) => d.disciplinaId)).toEqual(["dc", "pt", "rl"]);
  });

  it("respeita a janela (hoje = último dia)", () => {
    expect(totaisPorDisciplina(estudo, 1).total).toBe(120);
    expect(totaisPorDisciplina(estudo, 1).disciplinas[0].mediaDia).toBe(90);
  });

  it("navega janelas para trás e indica limites", () => {
    expect(janela(estudo, 2, 0).dias.map((d) => d.data)).toEqual(["2026-01-03", "2026-01-04"]);
    const anterior = janela(estudo, 2, 1);
    expect(anterior.dias.map((d) => d.data)).toEqual(["2026-01-01", "2026-01-02"]);
    expect(anterior.temAnterior).toBe(false);
    expect(anterior.temProxima).toBe(true);
  });

  it("compara com o período anterior", () => {
    expect(comparativo(estudo, 2)).toEqual({ atual: 120, anterior: 120, variacao: 0 });
    expect(comparativo(estudo.slice(2), 2).variacao).toBeNull();
  });

  it("formata durações", () => {
    expect(formatDuracao(302)).toBe("5h 02m");
    expect(formatDuracao(47)).toBe("47m");
    expect(relogio(60)).toBe("1:00:00");
    expect(relogio(458.13)).toBe("7:38:08");
  });
});
