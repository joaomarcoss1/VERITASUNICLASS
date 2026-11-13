# Academia Veritas UniClass

Plataforma de cursos preparatórios, banco de questões comentadas, simulados e rotina de estudos para concursos — com a identidade visual oficial **Veritas Group** e uma extensão de paleta pensada para a área acadêmica.

> **Fase 1 — Fundação** (esta entrega): design system, login/cadastro, onboarding, painel do aluno, navegação, modelo de dados completo com RLS, triggers de agregação e seeds. Os demais módulos aparecem na navegação com o estado "chega na Fase X".

## Rodando

```bash
npm install
npm run dev
```

Sem variáveis do Supabase o app abre em **modo demonstração** (aluno fictício com 60 dias de histórico, nada é gravado). Para usar contas reais, copie `.env.example` para `.env.local` e preencha.

### Banco (Supabase)

```bash
supabase db reset   # aplica supabase/migrations/* e supabase/seed.sql
```

Aluno de demonstração local: `demo@veritas.local` / `veritas123`.

Testes de segurança do banco (RLS, correção de resposta no servidor, append-only, isolamento entre alunos) rodam num Postgres 16 comum:

```bash
PGHOST=localhost PGUSER=postgres supabase/tests/run.sh
```

### Verificação

```bash
npm run verify   # lint + typecheck + testes + build
```

## Estrutura

| Caminho | O quê |
|---|---|
| `src/app/(public)` | Landing, termos, privacidade |
| `src/app/(auth)` | Login (senha, Google, link mágico), cadastro com LGPD, recuperação |
| `src/app/onboarding` | Objetivo → disponibilidade → diagnóstico → rotina gerada |
| `src/app/(aluno)` | Painel (7 blocos) e módulos |
| `src/app/admin` | Área administrativa (RBAC + 2FA obrigatório) |
| `src/lib/services` | Regras de negócio puras e testadas: ciclo de estudos, streak/escudos, XP/níveis, índice de domínio, missão do dia |
| `src/lib/design/tokens.ts` | Paleta oficial + extensão acadêmica, com teste de contraste WCAG AA |
| `supabase/migrations` | Schema completo (seção 9), RLS, triggers e RPCs |

Detalhes de design: [`docs/design-system.md`](docs/design-system.md). Decisões e pendências: [`docs/fase-1.md`](docs/fase-1.md).
