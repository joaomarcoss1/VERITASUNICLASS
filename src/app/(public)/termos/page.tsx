import { FundoVeritas } from "@/components/brand/fundo";
export const metadata = { title: "Termos de Uso" };

export default function TermosPage() {
  return (
    <article className="cartao-premium relative mx-auto my-10 max-w-leitura rounded-xl border border-borda/70 px-6 py-10 text-leitura sm:px-10">
      <FundoVeritas />
      <h1 className="titulo-institucional mb-6 text-4xl">Termos de Uso</h1>
      <p className="mb-4 rounded-lg bg-revisar-suave p-4 text-sm text-revisar">Minuta — revisar com assessoria jurídica antes do lançamento.</p>
      <h2 className="mb-2 mt-6 text-xl font-semibold">Natureza dos cursos</h2>
      <p>Os cursos da Academia Veritas UniClass são <strong>cursos livres, nos termos da legislação vigente</strong>. Os certificados emitidos comprovam a conclusão do curso livre e não equivalem a diploma de graduação, pós-graduação ou qualquer curso reconhecido pelo MEC.</p>
      <h2 className="mb-2 mt-6 text-xl font-semibold">Conteúdo</h2>
      <p>Enunciados de provas oficiais são reproduzidos para fins de estudo. Comentários, aulas, mapas mentais e questões inéditas são produção própria da Veritas e não podem ser redistribuídos.</p>
      <h2 className="mb-2 mt-6 text-xl font-semibold">Conta</h2>
      <p>O acesso é pessoal; a plataforma limita sessões simultâneas e aplica marca d’água com dados do titular em vídeos e PDFs.</p>
    </article>
  );
}
