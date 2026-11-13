import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Conquistas" };

export default function Page() {
  return (
    <EmBreve
      titulo="Conquistas"
      fase="Fase 5"
      descricao="Brasões por marcos de estudo, níveis de Aprendiz a Grão-Mestre Veritas e ligas semanais opcionais."
      itens={["100 questões resolvidas", "30 dias seguidos", "1º simulado acima da nota de corte", "Ligas semanais (podem ser desligadas)", ]}
    />
  );
}
