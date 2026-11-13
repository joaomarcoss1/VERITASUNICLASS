import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Desempenho" };

export default function Page() {
  return (
    <EmBreve
      titulo="Desempenho"
      fase="Fase 3"
      descricao="Evolução, mapa de calor por assunto e as 5 disciplinas mais fracas com botão Treinar agora."
      itens={["Índice de domínio 0–100 por assunto", "Tendência 7/30/90 dias", "Tempo médio por questão", "Termômetro de Aprovação", "Relatório mensal em PDF", ]}
    />
  );
}
