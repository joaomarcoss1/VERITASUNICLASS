/** Transição suave a cada navegação entre telas do aluno. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="animate-sobe-fade">{children}</div>;
}
