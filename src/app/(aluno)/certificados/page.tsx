import { EmBreve } from "@/components/aluno/em-breve";

export const metadata = { title: "Certificados" };

export default function Page() {
  return (
    <EmBreve
      titulo="Certificados"
      fase="Fase 4"
      descricao="Certificados de curso livre com QR Code de validação pública e selo heráldico Veritas."
      itens={["Emissão automática ao concluir", "Validação em /validar/código", "Download em PDF", "Adicionar ao LinkedIn", ]}
    />
  );
}
