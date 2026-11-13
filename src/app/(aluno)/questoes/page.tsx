import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Banco de Questões" };

export default function Page() {
  return (
    <EmBreve
      titulo="Banco de Questões"
      fase="Fase 2"
      descricao="Questões filtráveis por disciplina, assunto, banca, órgão, ano e status pessoal, todas com comentário revisado por professor."
      itens={["Filtros combináveis e cadernos salvos", "Riscar alternativas", "Estatística de marcação por alternativa", "Reportar erro com SLA de 72h", "Selos: Anulada, Desatualizada, Inédita", "Modo resolver em série", ]}
    />
  );
}
