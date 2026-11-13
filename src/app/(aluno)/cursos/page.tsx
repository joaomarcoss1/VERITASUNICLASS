import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Meus Cursos" };

export default function Page() {
  return (
    <EmBreve
      titulo="Meus Cursos"
      fase="Fase 2"
      descricao="Trilhas por objetivo com aulas em vídeo, PDF, mapa mental e exercícios — progresso por aula no estilo das melhores plataformas."
      itens={["Vídeo com capítulos e retomada", "PDF carimbado com seus dados", "Mapa mental interativo", "Exercícios com correção imediata", "Anotações com marcação de tempo", "Avaliação final e certificado", ]}
    />
  );
}
