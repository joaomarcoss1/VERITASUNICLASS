import { describe, expect, it } from "vitest";
import { blocosPorDisciplina, gerarPlanoSemanal, type DisciplinaPlano } from "./study-plan";
import { calcularStreak, indiceDominio, montarMissao, nivelPorXp } from "./habit";

const discs: DisciplinaPlano[] = [
  { id: "pt", nome: "Português", peso: 20, dominio: 70 },
  { id: "dc", nome: "Dir. Constitucional", peso: 15, dominio: 30 },
  { id: "rl", nome: "Raciocínio Lógico", peso: 10, dominio: 40 },
  { id: "inf", nome: "Informática", peso: 5, dominio: 80 },
];

describe("ciclo de estudos", () => {
  it("distribui exatamente o total de blocos e inclui todas as disciplinas", () => {
    const m = blocosPorDisciplina(discs, 20);
    expect([...m.values()].reduce((a, b) => a + b, 0)).toBe(20);
    discs.forEach((d) => expect(m.get(d.id)).toBeGreaterThanOrEqual(1));
  });

  it("dá mais tempo à disciplina fraca de peso parecido", () => {
    const m = blocosPorDisciplina([
      { id: "a", nome: "A", peso: 10, dominio: 90 },
      { id: "b", nome: "B", peso: 10, dominio: 10 },
    ], 10);
    expect(m.get("b")!).toBeGreaterThan(m.get("a")!);
  });

  it("respeita os dias e os minutos disponíveis", () => {
    const plano = gerarPlanoSemanal(discs, { dias: [1, 3, 5], minutosPorDia: 100 });
    expect(plano.map((d) => d.diaSemana)).toEqual([1, 3, 5]);
    plano.forEach((d) => expect(d.totalMinutos).toBe(100));
  });

  it("com pouco tempo prioriza as disciplinas de maior prioridade", () => {
    const m = blocosPorDisciplina(discs, 2);
    expect([...m.values()].reduce((a, b) => a + b, 0)).toBe(2);
    expect(m.get("dc")).toBe(1);
  });
});

describe("streak", () => {
  const dia = (data: string, minutos: number) => ({ data, minutos, questoes: 0 });

  it("conta dias seguidos e hoje ainda incompleto fica em risco", () => {
    const s = calcularStreak([dia("2026-01-01", 30), dia("2026-01-02", 30)], "2026-01-03");
    expect(s.atual).toBe(2);
    expect(s.emRisco).toBe(true);
  });

  it("zera sem escudo", () => {
    const s = calcularStreak([dia("2026-01-01", 30), dia("2026-01-03", 30)], "2026-01-03");
    expect(s.atual).toBe(1);
  });

  it("escudo ganho após 7 dias protege um dia perdido", () => {
    const h = Array.from({ length: 7 }, (_, i) => dia(`2026-01-0${i + 1}`, 30));
    h.push(dia("2026-01-09", 30)); // dia 8 perdido
    const s = calcularStreak(h, "2026-01-09");
    expect(s.escudosUsados).toBe(1);
    expect(s.atual).toBe(8);
  });
});

describe("níveis", () => {
  it("progride de Aprendiz a Escudeiro em 1000 XP", () => {
    expect(nivelPorXp(0).nome).toBe("Aprendiz");
    expect(nivelPorXp(999).proximo).toBe("Escudeiro");
    expect(nivelPorXp(1000).nome).toBe("Escudeiro");
    expect(nivelPorXp(999_999).progresso).toBe(1);
  });
});

describe("índice de domínio", () => {
  it("acertar difíceis vale mais do que acertar fáceis", () => {
    const base = { diasAtras: 0 } as const;
    const dificeis = indiceDominio([{ ...base, acertou: true, dificuldade: 5 }, { ...base, acertou: false, dificuldade: 5 }]);
    const faceis = indiceDominio([{ ...base, acertou: true, dificuldade: 1 }, { ...base, acertou: false, dificuldade: 1 }]);
    expect(dificeis.indice).toBeGreaterThan(faceis.indice);
  });

  it("respostas antigas pesam menos que as recentes", () => {
    const r = indiceDominio([
      { acertou: false, dificuldade: 3, diasAtras: 120 },
      { acertou: true, dificuldade: 3, diasAtras: 0 },
    ]);
    expect(r.indice).toBeGreaterThan(80);
    expect(r.classe).toBe("Dominado");
  });
});

describe("missão do dia", () => {
  it("inclui revisões limitadas e cabe no tempo disponível", () => {
    const m = montarMissao({
      sessoes: [
        { disciplinaId: "dc", disciplina: "Dir. Constitucional", tipo: "aula", minutos: 25 },
        { disciplinaId: "pt", disciplina: "Português", tipo: "questoes", minutos: 50 },
        { disciplinaId: "rl", disciplina: "Raciocínio Lógico", tipo: "questoes", minutos: 50 },
      ],
      revisoesVencidas: 40,
      limiteRevisoes: 12,
      minutosDisponiveis: 90,
    });
    expect(m[0].titulo).toBe("Revisar 12 cartões");
    expect(m.reduce((s, i) => s + i.minutos, 0)).toBeLessThanOrEqual(90);
    expect(m.some((i) => i.titulo.includes("20 questões de Português"))).toBe(true);
  });
});
