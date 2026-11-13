/**
 * Gerador do ciclo de estudos semanal.
 *
 * Prioridade de cada disciplina = peso no edital × (1 + lacuna de domínio).
 * Disciplinas fracas ganham mais tempo; nenhuma disciplina do edital fica de fora.
 * Os blocos usam múltiplos de 25 min (compatível com Pomodoro).
 */

export type DisciplinaPlano = {
  id: string;
  nome: string;
  /** Peso relativo no edital-alvo (ex.: nº de questões na prova). */
  peso: number;
  /** Índice de domínio atual 0–100 (diagnóstico, autoavaliação ou histórico). */
  dominio: number;
};

export type Disponibilidade = {
  /** Dias da semana disponíveis (0 = domingo … 6 = sábado). */
  dias: number[];
  /** Minutos por dia disponível. */
  minutosPorDia: number;
};

export type TipoSessao = "aula" | "questoes" | "revisao";

export type SessaoPlanejada = {
  disciplinaId: string;
  disciplina: string;
  tipo: TipoSessao;
  minutos: number;
};

export type DiaPlano = { diaSemana: number; sessoes: SessaoPlanejada[]; totalMinutos: number };

export const BLOCO_MIN = 25;

export function prioridades(disciplinas: DisciplinaPlano[]) {
  const brutas = disciplinas.map((d) => {
    const lacuna = (100 - clamp(d.dominio, 0, 100)) / 100;
    return { ...d, prioridade: Math.max(d.peso, 0.0001) * (1 + lacuna) };
  });
  const soma = brutas.reduce((s, d) => s + d.prioridade, 0) || 1;
  return brutas
    .map((d) => ({ ...d, fatia: d.prioridade / soma }))
    .sort((a, b) => b.fatia - a.fatia);
}

/**
 * Distribui os blocos da semana pelas disciplinas (método do maior resto),
 * garantindo ao menos 1 bloco por disciplina quando houver tempo.
 */
export function blocosPorDisciplina(disciplinas: DisciplinaPlano[], totalBlocos: number) {
  const ps = prioridades(disciplinas);
  const resultado = new Map<string, number>();
  if (totalBlocos <= 0 || ps.length === 0) return resultado;

  const minimo = totalBlocos >= ps.length ? 1 : 0;
  let restante = totalBlocos - minimo * ps.length;
  const ideais = ps.map((p) => ({ id: p.id, ideal: p.fatia * restante }));
  ideais.forEach(({ id, ideal }) => resultado.set(id, minimo + Math.floor(ideal)));
  restante -= ideais.reduce((s, i) => s + Math.floor(i.ideal), 0);
  ideais
    .sort((a, b) => (b.ideal % 1) - (a.ideal % 1))
    .slice(0, restante)
    .forEach(({ id }) => resultado.set(id, (resultado.get(id) ?? 0) + 1));
  // Se não há blocos para todas, as de maior prioridade ficam com 1
  if (minimo === 0) {
    ps.slice(0, totalBlocos).forEach((p) => resultado.set(p.id, Math.max(1, resultado.get(p.id) ?? 0)));
  }
  return resultado;
}

export function gerarPlanoSemanal(disciplinas: DisciplinaPlano[], disp: Disponibilidade): DiaPlano[] {
  const dias = [...new Set(disp.dias)].filter((d) => d >= 0 && d <= 6).sort();
  const blocosDia = Math.max(1, Math.floor(disp.minutosPorDia / BLOCO_MIN));
  const totalBlocos = blocosDia * dias.length;
  const porDisc = blocosPorDisciplina(disciplinas, totalBlocos);

  // Fila intercalada (round-robin ponderado) para não estudar a mesma matéria o dia inteiro
  const fila: DisciplinaPlano[] = [];
  const saldo = new Map(porDisc);
  const ordem = prioridades(disciplinas);
  while ([...saldo.values()].some((v) => v > 0)) {
    for (const d of ordem) {
      const s = saldo.get(d.id) ?? 0;
      if (s > 0) {
        fila.push(d);
        saldo.set(d.id, s - 1);
      }
    }
  }

  const contagemTipo = new Map<string, number>();
  return dias.map((diaSemana, i) => {
    const blocos = fila.slice(i * blocosDia, (i + 1) * blocosDia);
    const sessoes: SessaoPlanejada[] = [];
    for (const d of blocos) {
      const n = contagemTipo.get(d.id) ?? 0;
      contagemTipo.set(d.id, n + 1);
      const tipo = tipoDaSessao(n, d.dominio);
      const ultima = sessoes.at(-1);
      if (ultima && ultima.disciplinaId === d.id && ultima.tipo === tipo) ultima.minutos += BLOCO_MIN;
      else sessoes.push({ disciplinaId: d.id, disciplina: d.nome, tipo, minutos: BLOCO_MIN });
    }
    return { diaSemana, sessoes, totalMinutos: sessoes.reduce((s, x) => s + x.minutos, 0) };
  });
}

/** Fracas: começa por teoria. Fortes: mais questões. A cada 4 blocos, uma revisão. */
function tipoDaSessao(n: number, dominio: number): TipoSessao {
  if (n % 4 === 3) return "revisao";
  if (dominio < 50) return n % 2 === 0 ? "aula" : "questoes";
  return n % 3 === 0 ? "aula" : "questoes";
}

function clamp(n: number, a: number, b: number) {
  return Math.min(b, Math.max(a, n));
}
