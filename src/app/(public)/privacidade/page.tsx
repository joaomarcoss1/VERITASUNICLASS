import { FundoVeritas } from "@/components/brand/fundo";
export const metadata = { title: "Política de Privacidade" };

export default function PrivacidadePage() {
  return (
    <article className="cartao-premium relative mx-auto my-10 max-w-leitura rounded-xl border border-borda/70 px-6 py-10 text-leitura sm:px-10">
      <FundoVeritas />
      <h1 className="titulo-institucional mb-6 text-4xl">Política de Privacidade</h1>
      <p className="mb-4 rounded-lg bg-revisar-suave p-4 text-sm text-revisar">Minuta — revisar com o encarregado (DPO) antes do lançamento.</p>
      <p>Tratamos nome, e-mail, celular e seus dados de estudo (tempo, respostas, desempenho) para montar sua rotina, gerar relatórios e enviar lembretes. O consentimento é registrado com data e versão destes termos.</p>
      <p className="mt-4">Você pode exportar ou excluir seus dados a qualquer momento. Ações administrativas sobre a sua conta ficam registradas em log de auditoria.</p>
    </article>
  );
}
