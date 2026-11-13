import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Financeiro" };

export default function Page() {
  return (
    <EmBreve
      titulo="Financeiro"
      fase="Fase 4"
      descricao="Plano, faturas, Pix, boleto e cartão; upgrade com cálculo pró-rata e cancelamento em 2 cliques."
      itens={["Histórico de faturas e 2ª via", "Pix copia-e-cola e QR", "Cupom de desconto", "Sem perda de dados ao mudar de plano", ]}
    />
  );
}
