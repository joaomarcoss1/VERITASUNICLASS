import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Insights" };

export default function Page() {
  return (
    <EmBreve
      titulo="Insights"
      fase="Fase 5"
      descricao="Editais publicados, previstos e autorizados, mudanças de banca e novidades legislativas — filtrados pelo seu objetivo."
      itens={["Alertas quando sai edital da sua área", "Texto próprio com link da fonte oficial", "Radar do Edital", ]}
    />
  );
}
