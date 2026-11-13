import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Simulados" };

export default function Page() {
  return (
    <EmBreve
      titulo="Simulados"
      fase="Fase 3"
      descricao="Simulado semanal gerado toda segunda pelo seu edital, corrigido no servidor com a regra da banca."
      itens={["Diagnóstico de 20 questões", "Semanal automático sem repetição", "Modo prova com salvamento automático", "Regra Cebraspe (uma errada anula uma certa)", "Ranking e nota de corte", "Erros vão direto para a Fixação", ]}
    />
  );
}
