import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Rotina" };

export default function Page() {
  return (
    <EmBreve
      titulo="Rotina"
      fase="Fase 3"
      descricao="Calendário planejado × realizado. Se você atrasar, a semana é replanejada automaticamente."
      itens={["Ciclo de estudos por peso e desempenho", "Cronômetro com Pomodoro", "Registro manual (livro físico)", "Horas líquidas por disciplina", "Exportar para Google Agenda (.ics)", ]}
    />
  );
}
