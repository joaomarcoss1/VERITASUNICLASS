import { contextoAdministrativo } from "@/lib/auth/roles";

export const metadata = { title: "Administração" };

const AREAS = [
  { papel: "professor", t: "Conteúdo", d: "Aulas, questões, comentários e mapas mentais em rascunho." },
  { papel: "revisor", t: "Revisão", d: "Fila Rascunho → Em revisão → Aprovado/Devolvido e reportes (SLA 72h)." },
  { papel: "financeiro", t: "Financeiro", d: "MRR, churn, inadimplência, cupons e conciliação de webhooks." },
  { papel: "suporte", t: "Suporte", d: "Conta do aluno (leitura), reemissão de certificado e tickets." },
  { papel: "admin", t: "Configurações", d: "Planos, entitlements, perfis e auditoria." },
];

export default async function AdminPage() {
  const { papeis } = await contextoAdministrativo();
  const visiveis = AREAS.filter((a) => papeis.includes("admin") || papeis.includes(a.papel as never));
  return (
    <div className="space-y-6">
      <h1 className="titulo-institucional text-3xl">Administração</h1>
      <p className="text-texto-suave">Os módulos abaixo são liberados por papel (RBAC) e chegam nas Fases 2 a 4.</p>
      <ul className="escalonado grid gap-4 sm:grid-cols-2">
        {visiveis.map((a) => (
          <li key={a.t} className="cartao-premium rounded-xl border border-borda p-5">
            <p className="font-semibold">{a.t}</p>
            <p className="mt-1 text-sm text-texto-suave">{a.d}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
