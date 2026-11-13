-- Testes de segurança e regras (rodar após migrações + seed). Falha = exceção.
\set ON_ERROR_STOP 1
insert into auth.users (id, email, raw_user_meta_data) values ('00000000-0000-4000-8000-0000000000b2', 'outro@x.com', '{"full_name":"Outro Aluno"}');

do $$ begin
  assert (select count(*) from public.questions where status = 'publicado') = 24, 'seed: 24 questões';
  assert (select count(*) from public.daily_stats where user_id = '00000000-0000-4000-8000-0000000000a1') = 60, 'seed: 60 dias';
  assert (select count(*) from public.user_roles where user_id = '00000000-0000-4000-8000-0000000000b2' and role = 'aluno') = 1, 'trigger novo usuário: papel aluno';
  assert (select count(*) from public.consents where user_id = '00000000-0000-4000-8000-0000000000a1') = 2, 'consentimento LGPD registrado';
  assert (select count(*) from pg_tables t where schemaname = 'public' and not rowsecurity) = 0, 'RLS em todas as tabelas';
end $$;

-- ===== Como o aluno demo =====
set role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', false);

do $$
declare v_q uuid; v_opt uuid; v_before int; v_after int; ok boolean;
begin
  assert (select count(*) from public.daily_stats) = 60, 'aluno vê só os próprios agregados';
  assert (select count(*) from public.profiles) = 1, 'aluno vê só o próprio perfil';
  assert public.current_plan() = 'gratuito', 'sem assinatura = gratuito';
  assert public.entitlement('questoes_por_dia') = '20'::jsonb, 'entitlement do gratuito';

  -- Gabarito não é legível pelo aluno
  begin
    perform is_correct from public.question_options limit 1;
    raise exception 'FALHA: aluno leu is_correct';
  exception when insufficient_privilege then null;
  end;

  -- Resposta corrigida no servidor, mesmo se o cliente mentir
  select q.id, o.id into v_q, v_opt from public.questions q join public.question_options o on o.question_id = q.id
   where q.statement like 'Assinale a frase em que a concordância%' and o.label = 'A';
  select coalesce(sum(questions), 0) into v_before from public.daily_stats;
  insert into public.answers (user_id, question_id, option_id, is_correct, origin) values (auth.uid(), v_q, v_opt, true, 'banco');
  assert (select is_correct from public.answers where question_id = v_q order by id desc limit 1) = false, 'servidor corrige a resposta';
  select sum(questions) into v_after from public.daily_stats;
  assert v_after = v_before + 1, 'agregado diário atualizado na hora';
  assert exists (select 1 from public.srs_cards where question_id = v_q), 'erro entra na fixação';

  -- Append-only
  begin
    update public.answers set is_correct = true where question_id = v_q;
    raise exception 'FALHA: answers mutável';
  exception when insufficient_privilege then null;
  end;

  -- Aluno não marca o próprio onboarding nem muda o plano
  begin
    update public.profiles set onboarding_completed_at = now();
    raise exception 'FALHA: coluna protegida editável';
  exception when insufficient_privilege then null;
  end;

  -- Não insere dados em nome de outro
  begin
    insert into public.study_sessions (user_id, started_at, minutes, mode, source) values ('00000000-0000-4000-8000-0000000000b2', now(), 30, 'livre', 'timer');
    raise exception 'FALHA: inseriu sessão de outro usuário';
  exception when insufficient_privilege then null;
  end;

  -- Sessão própria agrega minutos e XP
  insert into public.study_sessions (user_id, started_at, minutes, mode, source, subject_id) values (auth.uid(), now(), 30, 'pomodoro', 'timer', 'portugues');
  assert (select sum(minutes) from public.daily_subject_stats where day = (now() at time zone 'America/Sao_Paulo')::date and subject_id = 'portugues') >= 30, 'minutos por disciplina';

  -- Não se promove a admin
  begin
    insert into public.user_roles (user_id, role) values (auth.uid(), 'admin');
    raise exception 'FALHA: autopromoção a admin';
  exception when insufficient_privilege then null;
  end;
end $$;

-- Onboarding transacional (como o outro aluno)
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000b2', false);
do $$ begin
  assert (select count(*) from public.daily_stats) = 0, 'isolamento entre alunos';
  perform public.complete_onboarding('pf-agente-2027', 'policial', current_date + 120, '{1,3,5}', 90, '{}'::jsonb, '[{"diaSemana":1,"sessoes":[],"totalMinutos":0}]'::jsonb);
  perform public.complete_onboarding('inss-tecnico-2027', 'tribunais', null, '{1,2}', 60, '{}'::jsonb, '[]'::jsonb);
  assert (select count(*) from public.goals where active) = 1, 'apenas um objetivo ativo';
  assert (select onboarding_completed_at is not null from public.profiles), 'onboarding concluído';
end $$;

-- ===== Anônimo =====
reset role; set role anon;
do $$ begin
  begin
    perform 1 from public.profiles;
    raise exception 'FALHA: anônimo leu perfis';
  exception when insufficient_privilege then null;
  end;
  assert (select count(*) from public.plans) = 4, 'anônimo vê planos (página de preços)';
end $$;
reset role;

-- Domínio por assunto recalculado pelo job
select public.refresh_topic_mastery('00000000-0000-4000-8000-0000000000a1') > 0 as mastery_ok;
select 'TODOS OS TESTES PASSARAM' as resultado;
