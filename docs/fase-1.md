# Fase 1 — Fundação: entregue, pendente e decisões

## Entregue
- Design system (paleta oficial + extensão acadêmica), fontes locais, modo claro/escuro, selo heráldico, ícones PWA e manifest.
- Login (e-mail/senha, Google, link mágico, recuperar senha) e cadastro com celular e aceite LGPD (registrado em `consents`).
- Middleware de sessão; `/admin` exige papel administrativo **e** 2FA (AAL2).
- Onboarding em 4 passos com prévia da rotina; o plano oficial é recalculado no servidor e salvo pela RPC transacional `complete_onboarding`.
- Painel com os 7 blocos na ordem pedida, lendo **só tabelas agregadas**.
- Navegação: menu lateral (desktop), barra inferior + gaveta (mobile), botão global "Iniciar sessão de estudo" (livre ou Pomodoro 25/5, sobrevive a recarregar, só conta tempo líquido).
- Modelo de dados completo da seção 9 com RLS forçada em todas as tabelas, colunas sensíveis protegidas por GRANT de coluna, tabelas append-only, correção de resposta no banco, agregação imediata, índice de domínio (`refresh_topic_mastery`, agendado via pg_cron), entitlements por plano e validação pública de certificado.
- Seeds: 6 áreas, 6 disciplinas, 32 assuntos, 3 editais (1 mapeado), 4 planos com entitlements, conquistas, notícias, 1 curso, 24 questões autorais comentadas e aluno demo com 60 dias.
- Testes: 38 unitários (regras de negócio + contraste) e testes SQL de RLS/segurança; CI no GitHub Actions.

## Pendente (próximas fases)
- 300 questões com comentários revisados → importador em massa da Fase 2 (o seed tem 24 autorais).
- Mini-simulado diagnóstico de 20 questões (o onboarding usa autoavaliação e indica o simulado).
- Testes E2E com Supabase real, Lighthouse e PostHog.
- Rate limit próprio além do nativo do Supabase Auth.

## Decisões assumidas
- **Paleta do manual prevalece** sobre os HEX do prompt.
- O "brasão" não substitui o logo: o símbolo oficial vai dentro do escudo.
- Gabarito (`question_options.is_correct`) não é legível pelo aluno; telas de edição da equipe usarão rotas de servidor.
- Sem Supabase configurado, o app roda em modo demonstração em vez de quebrar.
- Termos e privacidade são **minutas**: validar com assessoria jurídica (direitos sobre questões e "curso livre").
