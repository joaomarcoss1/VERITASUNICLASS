-- =====================================================================
-- Seeds de desenvolvimento — Academia Veritas UniClass
-- Taxonomia, editais, planos/entitlements, conquistas, notícias,
-- 1 curso demonstrativo, questões comentadas de exemplo e um aluno
-- de demonstração com 60 dias de histórico (apenas ambiente local).
--
-- Questões: este seed traz 24 questões AUTORAIS (Inéditas Veritas) para
-- validar fluxos. As 300 do critério de aceite entram pelo importador em
-- massa da Fase 2, com comentários revisados por professor.
-- =====================================================================

insert into public.roles (role, description) values
  ('aluno', 'Estuda, resolve, vê os próprios dados e gerencia a assinatura'),
  ('professor', 'Cria aulas, questões, comentários e mapas mentais (rascunho)'),
  ('revisor', 'Aprova, devolve ou corrige conteúdo; trata reportes'),
  ('financeiro', 'Planos, cupons, faturas, inadimplência e receita'),
  ('suporte', 'Leitura da conta do aluno, reemissão de certificado, tickets'),
  ('admin', 'Tudo, incluindo configurações, perfis e auditoria')
on conflict do nothing;

insert into public.areas (id, name, description) values
  ('tribunais', 'Tribunais', 'TJs, TRTs, TREs e TRFs'),
  ('policial', 'Policial', 'PF, PRF, PC e PM'),
  ('fiscal', 'Fiscal', 'Receita, SEFAZ e auditorias'),
  ('saude', 'Saúde', 'EBSERH, secretarias e hospitais'),
  ('educacao', 'Educação', 'Professores e técnicos'),
  ('enem', 'ENEM / Vestibular', 'Ensino médio e acesso à universidade')
on conflict do nothing;

-- Cores = src/lib/design/tokens.ts (disciplinas), todas AA com texto branco
insert into public.subjects (id, name, short_name, color) values
  ('portugues', 'Língua Portuguesa', 'Português', '#2B4166'),
  ('direito-constitucional', 'Direito Constitucional', 'Constitucional', '#5E1A28'),
  ('direito-administrativo', 'Direito Administrativo', 'Administrativo', '#7A5C2B'),
  ('raciocinio-logico', 'Raciocínio Lógico', 'Rac. Lógico', '#245E57'),
  ('informatica', 'Informática', 'Informática', '#45487F'),
  ('direito-penal', 'Direito Penal', 'Penal', '#7A3A22')
on conflict do nothing;

-- Árvore de assuntos (nível 1)
insert into public.topics (subject_id, name, position)
select s, t, ord from (values
  ('portugues', array['Interpretação de texto', 'Concordância verbal e nominal', 'Regência e crase', 'Pontuação', 'Classes de palavras', 'Coesão e coerência']),
  ('direito-constitucional', array['Princípios fundamentais', 'Direitos e garantias fundamentais', 'Remédios constitucionais', 'Organização do Estado', 'Poder Judiciário', 'Administração Pública na CF']),
  ('direito-administrativo', array['Princípios da Administração', 'Atos administrativos', 'Poderes administrativos', 'Licitações (Lei 14.133/2021)', 'Agentes públicos', 'Improbidade administrativa']),
  ('raciocinio-logico', array['Proposições e conectivos', 'Equivalências lógicas', 'Porcentagem', 'Análise combinatória', 'Probabilidade']),
  ('informatica', array['Segurança da informação', 'Redes e internet', 'Planilhas eletrônicas', 'Sistemas operacionais', 'Computação em nuvem']),
  ('direito-penal', array['Aplicação da lei penal', 'Teoria do crime', 'Excludentes de ilicitude', 'Crimes contra a Administração Pública'])
) as v(s, nomes), unnest(nomes) with ordinality as u(t, ord)
on conflict do nothing;

insert into public.exams_catalog (id, name, agency, board, area_id, level, status, reference_cutoff) values
  ('trt-tecnico-2027', 'TRT — Técnico Judiciário (Área Administrativa)', 'Tribunal Regional do Trabalho', 'FCC', 'tribunais', 'médio', 'previsto', 68),
  ('pf-agente-2027', 'Polícia Federal — Agente', 'Polícia Federal', 'Cebraspe', 'policial', 'superior', 'autorizado', 72),
  ('inss-tecnico-2027', 'INSS — Técnico do Seguro Social', 'INSS', 'Cebraspe', 'tribunais', 'médio', 'previsto', 70)
on conflict do nothing;

insert into public.exam_subject_weights (exam_id, subject_id, questions) values
  ('trt-tecnico-2027', 'portugues', 15), ('trt-tecnico-2027', 'direito-constitucional', 10), ('trt-tecnico-2027', 'direito-administrativo', 10),
  ('trt-tecnico-2027', 'raciocinio-logico', 5), ('trt-tecnico-2027', 'informatica', 5),
  ('pf-agente-2027', 'portugues', 24), ('pf-agente-2027', 'direito-constitucional', 12), ('pf-agente-2027', 'direito-administrativo', 12),
  ('pf-agente-2027', 'direito-penal', 18), ('pf-agente-2027', 'informatica', 14), ('pf-agente-2027', 'raciocinio-logico', 10),
  ('inss-tecnico-2027', 'portugues', 20), ('inss-tecnico-2027', 'direito-constitucional', 10), ('inss-tecnico-2027', 'direito-administrativo', 10),
  ('inss-tecnico-2027', 'raciocinio-logico', 10), ('inss-tecnico-2027', 'informatica', 10)
on conflict do nothing;

-- Edital mapeado (Radar do Edital): TRT Técnico cobre todos os assuntos das suas disciplinas
insert into public.exam_topic_weights (exam_id, topic_id, weight)
select 'trt-tecnico-2027', t.id, 1 from public.topics t
join public.exam_subject_weights w on w.subject_id = t.subject_id and w.exam_id = 'trt-tecnico-2027'
on conflict do nothing;

-- Planos e entitlements (preços definidos pelo financeiro no admin)
insert into public.plans (id, name, position) values
  ('gratuito', 'Gratuito', 0), ('essencial', 'Essencial', 1), ('pro', 'Pro', 2), ('elite', 'Elite', 3)
on conflict do nothing;

insert into public.plan_entitlements (plan_id, key, value) values
  ('gratuito', 'questoes_por_dia', '20'), ('gratuito', 'cursos', '"demonstrativos"'), ('gratuito', 'simulados', '["diagnostico"]'),
  ('gratuito', 'rotina', '"basica"'), ('gratuito', 'certificados', 'false'), ('gratuito', 'radar_edital', 'false'), ('gratuito', 'tutor_ia_cota', '0'),
  ('essencial', 'questoes_por_dia', '"ilimitado"'), ('essencial', 'cursos', '"trilha"'), ('essencial', 'simulados', '["diagnostico","semanal"]'),
  ('essencial', 'rotina', '"semanal"'), ('essencial', 'certificados', 'true'), ('essencial', 'radar_edital', 'false'), ('essencial', 'tutor_ia_cota', '0'),
  ('pro', 'questoes_por_dia', '"ilimitado"'), ('pro', 'cursos', '"todos"'), ('pro', 'simulados', '["diagnostico","semanal","personalizado","nacional","reta_final"]'),
  ('pro', 'rotina', '"semanal"'), ('pro', 'relatorio_pdf', 'true'), ('pro', 'certificados', 'true'), ('pro', 'radar_edital', 'true'), ('pro', 'tutor_ia_cota', '30'),
  ('elite', 'questoes_por_dia', '"ilimitado"'), ('elite', 'cursos', '"todos"'), ('elite', 'simulados', '["diagnostico","semanal","personalizado","nacional","reta_final"]'),
  ('elite', 'correcao_discursiva', 'true'), ('elite', 'rotina', '"semanal"'), ('elite', 'relatorio_pdf', 'true'), ('elite', 'mentoria_mensal', 'true'),
  ('elite', 'certificados', 'true'), ('elite', 'radar_edital', 'true'), ('elite', 'tutor_ia_cota', '200')
on conflict do nothing;

insert into public.achievements (id, name, description, icon, rule) values
  ('primeira-missao', 'Primeiro Passo', 'Concluiu a primeira Missão do dia', 'flag', '{"missoes": 1}'),
  ('cem-questoes', 'Centúria', 'Resolveu 100 questões', 'swords', '{"questoes": 100}'),
  ('mil-questoes', 'Legião', 'Resolveu 1.000 questões', 'castle', '{"questoes": 1000}'),
  ('trinta-dias', 'Juramento de Constância', '30 dias seguidos cumprindo a meta', 'flame', '{"streak": 30}'),
  ('acima-do-corte', 'Brasão de Aprovação', 'Primeiro simulado acima da nota de corte', 'shield', '{"simulado_acima_corte": 1}')
on conflict do nothing;

insert into public.news_posts (title, summary, tag, area_id, source_url, status, published_at) values
  ('TRT-2 tem concurso autorizado com 120 vagas para técnico', 'Comissão formada; a banca deve ser definida nas próximas semanas. Conteúdo deve seguir o último edital.', 'Tribunais', 'tribunais', 'https://www.gov.br', 'published', now() - interval '1 day'),
  ('Nova súmula altera tema recorrente em concursos', 'Entendimento já incorporado aos comentários das questões afetadas, que receberam o selo Desatualizada quando necessário.', 'Legislação', null, 'https://portal.stf.jus.br', 'published', now() - interval '3 days'),
  ('FCC divulga cronograma de provas do 1º semestre', 'Datas confirmadas para três tribunais; confira se a sua prova coincide com outras da área.', 'Bancas', 'tribunais', 'https://www.concursosfcc.com.br', 'published', now() - interval '5 days');

-- ---------------------------------------------------------------------
-- Curso demonstrativo
-- ---------------------------------------------------------------------
with c as (
  insert into public.courses (slug, title, description, area_id, workload_hours, status)
  values ('constitucional-tribunais', 'Direito Constitucional para Tribunais', 'Do zero aos direitos fundamentais, no padrão FCC e Cebraspe.', 'tribunais', 24, 'publicado')
  returning id
), m as (
  insert into public.modules (course_id, title, position) select c.id, x.t, x.p from c, (values ('Fundamentos', 1), ('Direitos e garantias', 2)) as x(t, p)
  returning id, position
)
insert into public.lessons (module_id, topic_id, title, position, duration_minutes, status)
select m.id, (select id from public.topics where name = l.topico), l.titulo, l.pos, l.dur, 'publicado'
from m join (values
  (1, 'Princípios fundamentais', 'Aula 1 · Princípios fundamentais', 1, 16),
  (1, 'Princípios fundamentais', 'Aula 2 · Objetivos da República', 2, 12),
  (2, 'Direitos e garantias fundamentais', 'Aula 3 · Direitos individuais', 1, 18),
  (2, 'Direitos e garantias fundamentais', 'Aula 4 · Direitos e garantias fundamentais', 2, 19),
  (2, 'Remédios constitucionais', 'Aula 5 · Remédios constitucionais', 3, 20)
) as l(mod, topico, titulo, pos, dur) on l.mod = m.position;

-- ---------------------------------------------------------------------
-- Questões autorais comentadas (Inéditas Veritas)
-- ---------------------------------------------------------------------
create or replace function pg_temp.q(p_subject text, p_topic text, p_kind public.question_type, p_diff int, p_statement text, p_options text[], p_correct text, p_comment text)
returns void language plpgsql as $$
declare v_q uuid; i int; v_label text;
begin
  insert into public.questions (subject_id, topic_id, kind, statement, board, year, difficulty, status, is_original, content_hash)
  values (p_subject, (select id from public.topics where subject_id = p_subject and name = p_topic), p_kind, p_statement, 'Veritas', 2026, p_diff, 'publicado', true, md5(p_statement))
  returning id into v_q;
  for i in 1 .. array_length(p_options, 1) loop
    v_label := case when p_kind = 'certo_errado' then (array['C', 'E'])[i] else chr(64 + i) end;
    insert into public.question_options (question_id, label, body, is_correct) values (v_q, v_label, p_options[i], v_label = p_correct);
  end loop;
  insert into public.question_comments (question_id, body, status) values (v_q, p_comment, 'publicado');
end $$;

select pg_temp.q('portugues', 'Concordância verbal e nominal', 'multipla_escolha', 2,
  'Assinale a frase em que a concordância verbal está de acordo com a norma-padrão.',
  array['Fazem dois anos que o edital foi publicado.', 'Houveram muitas inscrições no último dia.', 'Faz dois anos que o edital foi publicado.', 'Existe, na fila, muitos candidatos.'],
  'C', 'O verbo "fazer" indicando tempo decorrido é impessoal e fica no singular: "Faz dois anos". "Haver" no sentido de existir também é impessoal ("Houve muitas inscrições"), e "existir" concorda com o sujeito: "Existem muitos candidatos".');
select pg_temp.q('portugues', 'Regência e crase', 'multipla_escolha', 3,
  'O acento grave está empregado corretamente em:',
  array['Ele começou à estudar cedo.', 'Entreguei o recurso à banca examinadora.', 'Fiquei frente à frente com o examinador.', 'Refiro-me à esta questão.'],
  'B', 'Há crase quando a preposição "a" (exigida por "entregar algo a alguém") encontra o artigo "a" de "a banca". Não há crase antes de verbo (à estudar), em expressões com palavras repetidas (frente a frente) nem antes de pronome demonstrativo "esta".');
select pg_temp.q('portugues', 'Pontuação', 'certo_errado', 2,
  'Em "Os candidatos, que estudaram com constância, foram aprovados", as vírgulas indicam que todos os candidatos estudaram com constância.',
  array['Certo', 'Errado'], 'C', 'A oração adjetiva entre vírgulas é explicativa: atribui a característica a todo o conjunto. Sem as vírgulas, seria restritiva — só os que estudaram com constância teriam sido aprovados.');
select pg_temp.q('portugues', 'Interpretação de texto', 'certo_errado', 3,
  'Em "Nem todo candidato que estuda muito é aprovado", infere-se que estudar muito é condição suficiente para a aprovação.',
  array['Certo', 'Errado'], 'E', '"Nem todo" nega a universalidade: existe ao menos um candidato que estuda muito e não é aprovado. Logo, estudar muito não é condição suficiente.');

select pg_temp.q('direito-constitucional', 'Princípios fundamentais', 'multipla_escolha', 1,
  'Segundo o art. 1º da Constituição Federal, NÃO é fundamento da República Federativa do Brasil:',
  array['a soberania', 'a cidadania', 'a dignidade da pessoa humana', 'a erradicação da pobreza', 'o pluralismo político'],
  'D', 'Erradicar a pobreza e a marginalização é OBJETIVO fundamental (art. 3º, III). Os fundamentos (art. 1º) são: soberania, cidadania, dignidade da pessoa humana, valores sociais do trabalho e da livre iniciativa e pluralismo político (mnemônico SO-CI-DI-VA-PLU).');
select pg_temp.q('direito-constitucional', 'Direitos e garantias fundamentais', 'certo_errado', 2,
  'A casa é asilo inviolável do indivíduo, mas nela se pode penetrar, durante a noite, por determinação judicial.',
  array['Certo', 'Errado'], 'E', 'Pelo art. 5º, XI, sem consentimento do morador só se entra em caso de flagrante delito, desastre ou para prestar socorro (a qualquer hora) ou, durante o DIA, por determinação judicial. À noite, ordem judicial não autoriza a entrada.');
select pg_temp.q('direito-constitucional', 'Remédios constitucionais', 'multipla_escolha', 2,
  'O remédio constitucional adequado para assegurar o conhecimento de informações relativas à pessoa do impetrante, constantes de registros de entidades governamentais, é o:',
  array['mandado de segurança', 'habeas data', 'mandado de injunção', 'habeas corpus', 'ação popular'],
  'B', 'O habeas data (art. 5º, LXXII) garante acesso e retificação de dados da própria pessoa em registros de entidades governamentais ou de caráter público.');
select pg_temp.q('direito-constitucional', 'Administração Pública na CF', 'certo_errado', 3,
  'É vedada a acumulação remunerada de cargos públicos, salvo, havendo compatibilidade de horários, a de dois cargos de professor.',
  array['Certo', 'Errado'], 'C', 'Art. 37, XVI: a regra é a vedação, com exceções para dois cargos de professor; um de professor com outro técnico ou científico; e dois cargos ou empregos privativos de profissionais de saúde com profissões regulamentadas — sempre com compatibilidade de horários.');

select pg_temp.q('direito-administrativo', 'Princípios da Administração', 'multipla_escolha', 1,
  'São princípios expressos no caput do art. 37 da Constituição Federal:',
  array['legalidade, impessoalidade, moralidade, publicidade e eficiência', 'legalidade, razoabilidade, moralidade, publicidade e eficiência', 'supremacia do interesse público, legalidade e eficiência', 'legalidade, impessoalidade, motivação e publicidade'],
  'A', 'O caput do art. 37 traz o LIMPE: Legalidade, Impessoalidade, Moralidade, Publicidade e Eficiência (esta incluída pela EC 19/1998). Razoabilidade, motivação e supremacia do interesse público são princípios implícitos ou de outras leis.');
select pg_temp.q('direito-administrativo', 'Atos administrativos', 'certo_errado', 3,
  'A revogação de ato administrativo ocorre por razões de conveniência e oportunidade e produz efeitos retroativos (ex tunc).',
  array['Certo', 'Errado'], 'E', 'A revogação atinge ato válido por conveniência e oportunidade e produz efeitos prospectivos (ex nunc). Quem retroage é, em regra, a anulação de ato ilegal.');
select pg_temp.q('direito-administrativo', 'Poderes administrativos', 'multipla_escolha', 2,
  'A aplicação de multa a estabelecimento comercial por descumprimento de normas sanitárias é manifestação do poder:',
  array['hierárquico', 'disciplinar', 'de polícia', 'regulamentar'],
  'C', 'O poder de polícia limita a liberdade e a propriedade em favor do interesse público e alcança particulares em geral. O poder disciplinar alcança quem tem vínculo especial com a Administração (servidores, contratados).');
select pg_temp.q('direito-administrativo', 'Licitações (Lei 14.133/2021)', 'certo_errado', 4,
  'A Lei 14.133/2021 extinguiu as modalidades tomada de preços e convite e criou o diálogo competitivo.',
  array['Certo', 'Errado'], 'C', 'As modalidades da Lei 14.133/2021 são pregão, concorrência, concurso, leilão e diálogo competitivo. Tomada de preços e convite deixaram de existir.');

select pg_temp.q('raciocinio-logico', 'Equivalências lógicas', 'multipla_escolha', 3,
  'A negação de "Se estudo, então sou aprovado" é:',
  array['Se não estudo, então não sou aprovado.', 'Estudo e não sou aprovado.', 'Não estudo ou sou aprovado.', 'Não estudo e não sou aprovado.'],
  'B', 'A negação de "p → q" é "p ∧ ¬q": basta que o antecedente ocorra e o consequente não. Logo: "Estudo e não sou aprovado".');
select pg_temp.q('raciocinio-logico', 'Porcentagem', 'multipla_escolha', 2,
  'Um candidato acertou 60% das 50 questões de um simulado. No seguinte, de mesmo tamanho, acertou 6 questões a mais. Seu percentual de acerto passou a ser:',
  array['66%', '70%', '72%', '75%'], 'C', '60% de 50 = 30 acertos. Com 6 a mais: 36/50 = 0,72 = 72%.');
select pg_temp.q('raciocinio-logico', 'Análise combinatória', 'multipla_escolha', 3,
  'De quantas maneiras se pode escolher 2 disciplinas, sem importar a ordem, entre 5 disponíveis?',
  array['10', '20', '25', '120'], 'A', 'Combinação C(5,2) = 5!/(2!·3!) = 10. A ordem não importa, então não é arranjo (que daria 20).');
select pg_temp.q('raciocinio-logico', 'Probabilidade', 'certo_errado', 3,
  'Ao lançar duas moedas honestas, a probabilidade de obter ao menos uma cara é 3/4.',
  array['Certo', 'Errado'], 'C', 'Espaço amostral: CC, CK, KC, KK. Só KK não tem cara: 1 − 1/4 = 3/4.');

select pg_temp.q('informatica', 'Segurança da informação', 'multipla_escolha', 2,
  'O tipo de malware que criptografa os arquivos da vítima e exige pagamento para liberá-los é o:',
  array['spyware', 'ransomware', 'worm', 'adware'], 'B', 'Ransomware sequestra os dados (criptografia) e cobra resgate. Backups offline e atualizações são a principal defesa.');
select pg_temp.q('informatica', 'Redes e internet', 'certo_errado', 2,
  'O protocolo HTTPS utiliza criptografia (TLS) para proteger os dados trafegados entre o navegador e o servidor.',
  array['Certo', 'Errado'], 'C', 'HTTPS é o HTTP sobre TLS: garante confidencialidade e integridade no transporte e autentica o servidor por certificado digital.');
select pg_temp.q('informatica', 'Planilhas eletrônicas', 'multipla_escolha', 3,
  'Em uma planilha, a fórmula =MÉDIA(A1:A4) com A1=2, A2=4, A3 vazia e A4=6 retorna:',
  array['3', '4', '6', '12'], 'B', 'MÉDIA ignora células vazias: (2+4+6)/3 = 4. Se A3 contivesse 0, o resultado seria 3.');
select pg_temp.q('informatica', 'Computação em nuvem', 'certo_errado', 3,
  'No modelo SaaS, o cliente é responsável por gerenciar o sistema operacional dos servidores que executam a aplicação.',
  array['Certo', 'Errado'], 'E', 'No SaaS o provedor gerencia toda a pilha; o cliente apenas usa o software. Gerenciar o SO é responsabilidade do cliente no IaaS.');

select pg_temp.q('direito-penal', 'Excludentes de ilicitude', 'multipla_escolha', 2,
  'NÃO é causa excludente de ilicitude prevista no art. 23 do Código Penal:',
  array['estado de necessidade', 'legítima defesa', 'estrito cumprimento de dever legal', 'coação moral irresistível'],
  'D', 'A coação moral irresistível exclui a CULPABILIDADE (inexigibilidade de conduta diversa, art. 22). As excludentes de ilicitude do art. 23 são estado de necessidade, legítima defesa, estrito cumprimento de dever legal e exercício regular de direito.');
select pg_temp.q('direito-penal', 'Crimes contra a Administração Pública', 'certo_errado', 3,
  'Comete peculato o funcionário público que se apropria de bem móvel de que tem a posse em razão do cargo.',
  array['Certo', 'Errado'], 'C', 'É o peculato-apropriação (art. 312, caput, do CP).');
select pg_temp.q('direito-penal', 'Aplicação da lei penal', 'certo_errado', 2,
  'A lei penal mais benéfica retroage para alcançar fatos anteriores, ainda que decididos por sentença transitada em julgado.',
  array['Certo', 'Errado'], 'C', 'Art. 5º, XL, da CF e art. 2º, parágrafo único, do CP: a lei posterior que favorece o agente aplica-se aos fatos anteriores, mesmo após o trânsito em julgado.');
select pg_temp.q('direito-penal', 'Teoria do crime', 'multipla_escolha', 4,
  'Na teoria finalista adotada pelo Código Penal, dolo e culpa integram:',
  array['a culpabilidade', 'a tipicidade (conduta)', 'a ilicitude', 'a punibilidade'],
  'B', 'No finalismo, dolo e culpa migram da culpabilidade para a conduta, elemento do fato típico. A culpabilidade fica com imputabilidade, potencial consciência da ilicitude e exigibilidade de conduta diversa.');

-- ---------------------------------------------------------------------
-- Aluno de demonstração (somente local): demo@veritas.local / veritas123
-- 60 dias de histórico agregado para validar gráficos e relatórios.
-- ---------------------------------------------------------------------
do $$
declare v_user uuid := '00000000-0000-4000-8000-0000000000a1';
        v_hoje date := (now() at time zone 'America/Sao_Paulo')::date;
begin
  if not exists (select 1 from auth.users where id = v_user) then
    insert into auth.users (id, instance_id, aud, role, email, encrypted_password, email_confirmed_at, raw_user_meta_data, raw_app_meta_data, created_at, updated_at)
    values (v_user, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'demo@veritas.local',
            crypt('veritas123', gen_salt('bf')), now(),
            '{"full_name": "Marina Albuquerque", "phone": "11912345678", "terms_version": "2026-11"}', '{"provider": "email", "providers": ["email"]}', now(), now());
  end if;

  insert into public.goals (user_id, exam_id, area_id, exam_date, weekdays, minutes_per_day, self_levels)
  values (v_user, 'trt-tecnico-2027', 'tribunais', v_hoje + 87, '{1,2,3,4,5,6}', 100, '{"portugues": 60, "direito-constitucional": 40}')
  on conflict do nothing;
  update public.profiles set onboarding_completed_at = now() - interval '60 days' where id = v_user;

  insert into public.daily_stats (user_id, day, minutes, questions, correct, xp)
  select v_user, d, m, q, round(q * least(0.95, 0.55 + (i / 60.0) * 0.15 + (random() - 0.5) * 0.12))::int, m + q * 8
  from (
    select i, v_hoje - (59 - i) as d,
           case when i in (12, 31) then 0 else (40 + random() * 110)::int end as m
    from generate_series(0, 59) as i
  ) base, lateral (select case when m = 0 then 0 else (m / 3 + random() * 10)::int end as q) qq
  on conflict do nothing;

  insert into public.daily_subject_stats (user_id, day, subject_id, minutes, questions, correct)
  select v_user, ds.day, s.id, ds.minutes / 5, ds.questions / 5,
         round((ds.questions / 5) * case s.id when 'portugues' then 0.79 when 'informatica' then 0.73 when 'direito-administrativo' then 0.61
                                             when 'direito-constitucional' then 0.52 else 0.44 end)::int
  from public.daily_stats ds cross join public.subjects s
  where ds.user_id = v_user and s.id <> 'direito-penal'
  on conflict do nothing;

  insert into public.topic_mastery (user_id, topic_id, subject_id, mastery, answers, correct, studied)
  select v_user, t.id, t.subject_id,
         greatest(0, least(100, (case t.subject_id when 'portugues' then 78 when 'informatica' then 71 when 'direito-administrativo' then 58
                                                   when 'direito-constitucional' then 46 else 39 end) + (random() * 20 - 10)::int)),
         (random() * 60)::int, 0, t.position <= 4
  from public.topics t join public.exam_subject_weights w on w.subject_id = t.subject_id and w.exam_id = 'trt-tecnico-2027'
  on conflict do nothing;

  insert into public.xp_ledger (user_id, amount, reason, created_at)
  select v_user, xp, 'historico', day::timestamptz + interval '20 hours' from public.daily_stats where user_id = v_user and xp > 0;
end $$;

-- Plano semanal do aluno demo (mesmo formato JSON gerado por gerarPlanoSemanal)
insert into public.study_plans (user_id, goal_id, week_start, plan)
select g.user_id, g.id, date_trunc('week', now() at time zone 'America/Sao_Paulo')::date,
  (select jsonb_agg(jsonb_build_object(
      'diaSemana', dia,
      'totalMinutos', 100,
      'sessoes', jsonb_build_array(
        jsonb_build_object('disciplinaId', s1.id, 'disciplina', s1.short_name, 'tipo', 'aula', 'minutos', 50),
        jsonb_build_object('disciplinaId', s2.id, 'disciplina', s2.short_name, 'tipo', 'questoes', 'minutos', 50))) order by dia)
   from generate_series(1, 6) dia
   join lateral (select id, short_name from public.subjects where id <> 'direito-penal' order by id offset (dia % 5) limit 1) s1 on true
   join lateral (select id, short_name from public.subjects where id <> 'direito-penal' order by id offset ((dia + 2) % 5) limit 1) s2 on true)
from public.goals g where g.user_id = '00000000-0000-4000-8000-0000000000a1' and g.active
on conflict do nothing;
