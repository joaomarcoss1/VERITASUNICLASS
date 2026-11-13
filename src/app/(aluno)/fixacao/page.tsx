import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Fixação" };

export default function Page() {
  return (
    <EmBreve
      titulo="Fixação"
      fase="Fase 3"
      descricao="Caderno de erros automático e revisão espaçada (FSRS) de questões e flashcards, dentro do limite diário que você escolher."
      itens={["Caderno de erros por assunto", "Flashcards do professor e seus", "Revisões entram na Missão do dia", "Limite diário configurável", ]}
    />
  );
}
