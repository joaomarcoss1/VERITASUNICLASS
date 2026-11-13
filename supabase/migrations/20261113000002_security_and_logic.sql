-- =====================================================================
-- Fase 1 — RLS, privilégios, triggers de agregação e RPCs
-- Regra geral: aluno lê/escreve apenas o que é dele; conteúdo só é
-- visível publicado; regras sensíveis rodam no banco/servidor.
-- =====================================================================

-- RLS em TODAS as tabelas do schema public
do $$
declare t record;
begin
  for t in select tablename from pg_tables where schemaname = 'public' loop
    execute format('alter table public.%I enable row level security', t.tablename);
    execute format('alter table public.%I force row level security', t.tablename);
  end loop;
end $$;

-- Nada para anônimos, exceto o que for liberado explicitamente
revoke all on all tables in schema public from anon;
-- Tabelas append-only / de sistema: sem UPDATE/DELETE para usuários (além dos triggers)
revoke update, delete, truncate on public.answers, public.study_events, public.xp_ledger, public.audit_logs,
  public.consents, public.study_sessions, public.daily_stats, public.daily_subject_stats, public.topic_mastery,
  public.certificates, public.webhook_events from authenticated;
revoke all on all functions in schema public from anon, public;

-- ---------------------------------------------------------------------
-- Pessoas e acesso
-- ---------------------------------------------------------------------
create policy profiles_own_read on public.profiles for select to authenticated using (id = auth.uid() or public.has_role('suporte'));
create policy profiles_own_update on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());
-- Aluno só altera colunas de preferência (onboarding_completed_at é definido pela RPC)
revoke update on public.profiles from authenticated;
grant update (full_name, phone, avatar_url, timezone, daily_goal_minutes, daily_goal_questions, review_daily_limit, rankings_enabled, notification_hour) on public.profiles to authenticated;

create policy roles_read on public.roles for select to authenticated using (true);
create policy user_roles_read on public.user_roles for select to authenticated using (user_id = auth.uid() or public.has_role('admin'));
create policy user_roles_admin on public.user_roles for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));

create policy consents_own on public.consents for select to authenticated using (user_id = auth.uid());
create policy consents_insert on public.consents for insert to authenticated with check (user_id = auth.uid());

create policy audit_admin_read on public.audit_logs for select to authenticated using (public.has_role('admin'));
create policy audit_staff_insert on public.audit_logs for insert to authenticated with check (public.is_staff() and actor_id = auth.uid());

-- ---------------------------------------------------------------------
-- Catálogo e conteúdo: leitura para logados; escrita para equipe
-- ---------------------------------------------------------------------
create policy areas_read on public.areas for select to authenticated using (true);
create policy subjects_read on public.subjects for select to authenticated using (true);
create policy topics_read on public.topics for select to authenticated using (true);
create policy exams_read on public.exams_catalog for select to authenticated using (true);
create policy esw_read on public.exam_subject_weights for select to authenticated using (true);
create policy etw_read on public.exam_topic_weights for select to authenticated using (true);
create policy achievements_read on public.achievements for select to authenticated using (true);
create policy plans_read on public.plans for select to authenticated, anon using (active);
create policy plan_prices_read on public.plan_prices for select to authenticated, anon using (true);
create policy plan_ent_read on public.plan_entitlements for select to authenticated, anon using (true);
grant select on public.plans, public.plan_prices, public.plan_entitlements to anon;

create policy taxonomy_staff_areas on public.areas for all to authenticated using (public.has_role('revisor')) with check (public.has_role('revisor'));
create policy taxonomy_staff_subjects on public.subjects for all to authenticated using (public.has_role('revisor')) with check (public.has_role('revisor'));
create policy taxonomy_staff_topics on public.topics for all to authenticated using (public.has_role('revisor')) with check (public.has_role('revisor'));
create policy taxonomy_staff_exams on public.exams_catalog for all to authenticated using (public.has_role('revisor')) with check (public.has_role('revisor'));
create policy taxonomy_staff_esw on public.exam_subject_weights for all to authenticated using (public.has_role('revisor')) with check (public.has_role('revisor'));
create policy taxonomy_staff_etw on public.exam_topic_weights for all to authenticated using (public.has_role('revisor')) with check (public.has_role('revisor'));

create policy courses_read on public.courses for select to authenticated using (status = 'publicado' or public.is_staff());
create policy courses_staff on public.courses for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
create policy modules_read on public.modules for select to authenticated using (exists (select 1 from public.courses c where c.id = course_id and (c.status = 'publicado' or public.is_staff())));
create policy modules_staff on public.modules for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
create policy lessons_read on public.lessons for select to authenticated using (status = 'publicado' or public.is_staff());
create policy lessons_staff on public.lessons for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
-- Assets (refs de vídeo/PDF) são entregues por rota de servidor com checagem de plano — aluno não lê direto
create policy assets_staff on public.lesson_assets for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
create policy versions_staff on public.content_versions for all to authenticated using (public.is_staff()) with check (public.is_staff());
create policy reviews_staff_read on public.content_reviews for select to authenticated using (public.is_staff());
create policy reviews_reviewer_write on public.content_reviews for insert to authenticated with check (public.has_role('revisor') and reviewer_id = auth.uid());

-- Questões: só publicadas para aluno; gabarito NÃO é exposto por SELECT
create policy questions_read on public.questions for select to authenticated using (status = 'publicado' or public.is_staff());
create policy questions_staff on public.questions for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
create policy options_read on public.question_options for select to authenticated using (exists (select 1 from public.questions q where q.id = question_id and (q.status = 'publicado' or public.is_staff())));
create policy options_staff on public.question_options for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
revoke select on public.question_options from authenticated;
grant select (id, question_id, label, body) on public.question_options to authenticated;
-- Comentário oficial: o aluno lê depois de responder (o app revela após a resposta)
create policy qcomments_read on public.question_comments for select to authenticated using (status = 'publicado' or public.is_staff());
create policy qcomments_staff on public.question_comments for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
create policy community_read on public.community_comments for select to authenticated using (not hidden or user_id = auth.uid() or public.has_role('revisor'));
create policy community_insert on public.community_comments for insert to authenticated with check (user_id = auth.uid());
create policy community_moderate on public.community_comments for update to authenticated using (public.has_role('revisor'));
create policy reports_own on public.question_reports for select to authenticated using (user_id = auth.uid() or public.has_role('revisor'));
create policy reports_insert on public.question_reports for insert to authenticated with check (user_id = auth.uid());
create policy reports_review on public.question_reports for update to authenticated using (public.has_role('revisor'));

-- ---------------------------------------------------------------------
-- Dados do aluno: somente os próprios
-- ---------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['goals', 'lesson_progress', 'notebooks', 'notes', 'study_plans', 'daily_stats', 'daily_subject_stats',
                           'topic_mastery', 'reports', 'streaks', 'xp_ledger', 'user_achievements', 'notifications',
                           'subscriptions', 'invoices', 'certificates', 'srs_cards', 'answers', 'study_sessions', 'study_events',
                           'simulation_attempts'] loop
    execute format('create policy %I on public.%I for select to authenticated using (user_id = auth.uid() or public.has_role(''suporte''))', t || '_own_read', t);
  end loop;
end $$;

-- Escritas permitidas diretamente ao aluno
create policy notebooks_write on public.notebooks for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notes_write on public.notes for all to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy notifications_mark_read on public.notifications for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.notifications from authenticated;
grant update (read_at) on public.notifications to authenticated;
create policy lesson_progress_write on public.lesson_progress for insert to authenticated with check (user_id = auth.uid());
create policy lesson_progress_update on public.lesson_progress for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
revoke update on public.lesson_progress from authenticated;
grant update (watched_ratio, last_position_seconds, rating) on public.lesson_progress to authenticated; -- completed_at só via servidor
create policy answers_insert on public.answers for insert to authenticated with check (user_id = auth.uid());
create policy sessions_insert on public.study_sessions for insert to authenticated with check (user_id = auth.uid());
create policy events_insert on public.study_events for insert to authenticated with check (user_id = auth.uid());
create policy flashcards_read on public.flashcards for select to authenticated using (owner_id = auth.uid() or (owner_id is null and status = 'publicado'));
create policy flashcards_own on public.flashcards for all to authenticated using (owner_id = auth.uid()) with check (owner_id = auth.uid());
create policy flashcards_staff on public.flashcards for all to authenticated using (owner_id is null and public.has_role('professor')) with check (owner_id is null and public.has_role('professor'));

create policy simulations_read on public.simulations for select to authenticated using (user_id is null or user_id = auth.uid());
create policy simq_read on public.simulation_questions for select to authenticated using (exists (select 1 from public.simulations s where s.id = simulation_id and (s.user_id is null or s.user_id = auth.uid())));
create policy attempts_draft on public.simulation_attempts for update to authenticated using (user_id = auth.uid() and finished_at is null) with check (user_id = auth.uid());
revoke update on public.simulation_attempts from authenticated;
grant update (answers_draft) on public.simulation_attempts to authenticated; -- nota só no servidor

create policy leagues_read on public.leagues for select to authenticated using (true);
create policy league_members_read on public.league_members for select to authenticated using (
  exists (select 1 from public.profiles p where p.id = auth.uid() and p.rankings_enabled)
  and exists (select 1 from public.profiles p where p.id = league_members.user_id and p.rankings_enabled)
);

create policy news_read on public.news_posts for select to authenticated using (status = 'published' or public.is_staff());
create policy news_staff on public.news_posts for all to authenticated using (public.has_role('professor') or public.has_role('revisor')) with check (public.has_role('professor') or public.has_role('revisor'));
create policy news_sources_staff on public.news_sources for all to authenticated using (public.is_staff()) with check (public.is_staff());

-- Financeiro / suporte
create policy coupons_finance on public.coupons for all to authenticated using (public.has_role('financeiro')) with check (public.has_role('financeiro'));
create policy plans_admin on public.plans for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy prices_finance on public.plan_prices for all to authenticated using (public.has_role('financeiro')) with check (public.has_role('financeiro'));
create policy ent_admin on public.plan_entitlements for all to authenticated using (public.has_role('admin')) with check (public.has_role('admin'));
create policy subs_finance on public.subscriptions for select to authenticated using (public.has_role('financeiro'));
create policy invoices_finance on public.invoices for select to authenticated using (public.has_role('financeiro'));
create policy payments_own on public.payments for select to authenticated using (
  public.has_role('financeiro') or exists (select 1 from public.invoices i where i.id = invoice_id and i.user_id = auth.uid())
);
-- webhook_events: sem policy — apenas service_role (Edge Function do gateway)

-- ---------------------------------------------------------------------
-- Novo usuário: profile + papel aluno + consentimento LGPD
-- ---------------------------------------------------------------------
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare meta jsonb := coalesce(new.raw_user_meta_data, '{}');
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(nullif(trim(meta->>'full_name'), ''), nullif(trim(meta->>'name'), ''), split_part(new.email, '@', 1)),
    nullif(regexp_replace(coalesce(meta->>'phone', ''), '\D', '', 'g'), '')
  );
  insert into public.user_roles (user_id, role) values (new.id, 'aluno');
  insert into public.streaks (user_id) values (new.id);
  if meta ? 'terms_version' then
    insert into public.consents (user_id, kind, version, granted) values
      (new.id, 'termos', meta->>'terms_version', true),
      (new.id, 'privacidade', coalesce(meta->>'privacy_version', meta->>'terms_version'), true);
  end if;
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- Agregação imediata (acerto, horas, XP atualizados na hora)
-- ---------------------------------------------------------------------
create or replace function public.user_day(p_user uuid, p_at timestamptz) returns date
language sql stable security definer set search_path = public as $$
  select (p_at at time zone coalesce((select timezone from public.profiles where id = p_user), 'America/Sao_Paulo'))::date;
$$;

-- Correção da resposta no servidor: o cliente nunca informa se acertou
create or replace function public.grade_answer() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_correct boolean;
begin
  select o.is_correct into v_correct from public.question_options o where o.id = new.option_id and o.question_id = new.question_id;
  if v_correct is null then
    raise exception 'Alternativa não pertence à questão' using errcode = '22023';
  end if;
  new.is_correct := v_correct;
  new.answered_at := now();
  return new;
end $$;
create trigger answers_grade before insert on public.answers for each row execute function public.grade_answer();

create or replace function public.aggregate_answer() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_day date := public.user_day(new.user_id, new.answered_at);
        v_subject text;
        v_xp int := case when new.is_correct then 10 else 3 end;
begin
  select subject_id into v_subject from public.questions where id = new.question_id;
  insert into public.daily_stats as d (user_id, day, questions, correct, xp)
  values (new.user_id, v_day, 1, new.is_correct::int, v_xp)
  on conflict (user_id, day) do update set questions = d.questions + 1, correct = d.correct + excluded.correct, xp = d.xp + excluded.xp;
  insert into public.daily_subject_stats as s (user_id, day, subject_id, questions, correct, time_seconds_total)
  values (new.user_id, v_day, v_subject, 1, new.is_correct::int, coalesce(new.time_seconds, 0))
  on conflict (user_id, day, subject_id) do update set questions = s.questions + 1, correct = s.correct + excluded.correct,
    time_seconds_total = s.time_seconds_total + excluded.time_seconds_total;
  insert into public.xp_ledger (user_id, amount, reason, ref_id) values (new.user_id, v_xp, 'questao', new.question_id::text);
  -- Errou: entra na fixação (revisão espaçada) se ainda não estiver
  if not new.is_correct and not exists (select 1 from public.srs_cards where user_id = new.user_id and question_id = new.question_id) then
    insert into public.srs_cards (user_id, question_id, due_at) values (new.user_id, new.question_id, now() + interval '1 day');
  end if;
  return new;
end $$;
create trigger answers_aggregate after insert on public.answers for each row execute function public.aggregate_answer();

create or replace function public.aggregate_session() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_day date := public.user_day(new.user_id, new.started_at);
begin
  insert into public.daily_stats as d (user_id, day, minutes, xp) values (new.user_id, v_day, new.minutes, new.minutes)
  on conflict (user_id, day) do update set minutes = d.minutes + excluded.minutes, xp = d.xp + excluded.xp;
  if new.subject_id is not null then
    insert into public.daily_subject_stats as s (user_id, day, subject_id, minutes) values (new.user_id, v_day, new.subject_id, new.minutes)
    on conflict (user_id, day, subject_id) do update set minutes = s.minutes + excluded.minutes;
  end if;
  insert into public.xp_ledger (user_id, amount, reason, ref_id) values (new.user_id, new.minutes, 'estudo', new.id::text);
  return new;
end $$;
create trigger sessions_aggregate after insert on public.study_sessions for each row execute function public.aggregate_session();

-- ---------------------------------------------------------------------
-- Índice de domínio por assunto (mesma fórmula de src/lib/services/habit.ts)
-- Rodado por pg_cron a cada minuto para quem respondeu algo recentemente.
-- ---------------------------------------------------------------------
create or replace function public.refresh_topic_mastery(p_user uuid default null) returns int
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  with alvo as (
    select distinct user_id from public.answers
    where (p_user is null and answered_at > now() - interval '2 minutes') or user_id = p_user
  ), pesos as (
    select a.user_id, q.topic_id, q.subject_id, a.is_correct,
           (case when a.is_correct then 0.6 + q.difficulty * 0.2 else 2.2 - q.difficulty * 0.2 end)
             * power(0.5, extract(epoch from now() - a.answered_at) / 86400 / 30) as w
    from public.answers a join alvo using (user_id) join public.questions q on q.id = a.question_id
    where q.topic_id is not null
  ), agg as (
    select user_id, topic_id, min(subject_id) as subject_id,
           round(100 * sum(w * is_correct::int) / nullif(sum(w), 0))::smallint as mastery,
           count(*)::int as answers, sum(is_correct::int)::int as correct
    from pesos group by user_id, topic_id
  )
  insert into public.topic_mastery as t (user_id, topic_id, subject_id, mastery, answers, correct, studied, updated_at)
  select user_id, topic_id, subject_id, coalesce(mastery, 0), answers, correct, true, now() from agg
  on conflict (user_id, topic_id) do update set mastery = excluded.mastery, answers = excluded.answers,
    correct = excluded.correct, studied = true, updated_at = now();
  get diagnostics n = row_count;
  return n;
end $$;

-- ---------------------------------------------------------------------
-- Entitlements por plano (nunca "if plano === 'pro'" no código)
-- ---------------------------------------------------------------------
create or replace function public.current_plan(p_user uuid default auth.uid()) returns text
language sql stable security definer set search_path = public as $$
  select coalesce(
    (select plan_id from public.subscriptions
      where user_id = p_user and (status in ('trial', 'ativa', 'em_atraso') or (status = 'carencia' and grace_until > now()))
      order by created_at desc limit 1),
    'gratuito');
$$;

create or replace function public.entitlement(p_key text) returns jsonb
language sql stable security definer set search_path = public as $$
  select value from public.plan_entitlements where plan_id = public.current_plan(auth.uid()) and key = p_key;
$$;

-- ---------------------------------------------------------------------
-- Onboarding (transacional)
-- ---------------------------------------------------------------------
create or replace function public.complete_onboarding(
  p_exam_id text, p_area_id text, p_exam_date date, p_weekdays smallint[], p_minutes_per_day int, p_self_levels jsonb, p_plan jsonb
) returns uuid
language plpgsql security definer set search_path = public as $$
declare v_user uuid := auth.uid();
        v_goal uuid;
        v_week date := date_trunc('week', now() at time zone 'America/Sao_Paulo')::date;
begin
  if v_user is null then raise exception 'não autenticado' using errcode = '42501'; end if;
  if p_exam_date is not null and p_exam_date < current_date then raise exception 'data da prova no passado' using errcode = '22023'; end if;
  if jsonb_typeof(p_plan) <> 'array' or jsonb_array_length(p_plan) > 7 then raise exception 'plano inválido' using errcode = '22023'; end if;

  update public.goals set active = false where user_id = v_user and active;
  insert into public.goals (user_id, exam_id, area_id, exam_date, weekdays, minutes_per_day, self_levels)
  values (v_user, p_exam_id, p_area_id, p_exam_date, p_weekdays, p_minutes_per_day, coalesce(p_self_levels, '{}'))
  returning id into v_goal;

  insert into public.study_plans (user_id, goal_id, week_start, plan) values (v_user, v_goal, v_week, p_plan)
  on conflict (user_id, week_start) do update set goal_id = excluded.goal_id, plan = excluded.plan, generated_at = now();

  update public.profiles set onboarding_completed_at = coalesce(onboarding_completed_at, now()) where id = v_user;
  insert into public.study_events (user_id, kind, payload) values (v_user, 'onboarding_concluido', jsonb_build_object('exam_id', p_exam_id, 'area_id', p_area_id));
  return v_goal;
end $$;

-- ---------------------------------------------------------------------
-- Validação pública de certificado (/validar/{codigo})
-- ---------------------------------------------------------------------
create or replace function public.validate_certificate(p_code text) returns table (
  student_name text, course_title text, workload_hours int, period_start date, period_end date, issued_at timestamptz, content_hash text, valid boolean
)
language sql stable security definer set search_path = public as $$
  select student_name, course_title, workload_hours, period_start, period_end, issued_at, content_hash, revoked_at is null
  from public.certificates where code = upper(p_code);
$$;

grant execute on function public.validate_certificate(text) to anon, authenticated;
grant execute on function public.complete_onboarding(text, text, date, smallint[], int, jsonb, jsonb) to authenticated;
grant execute on function public.entitlement(text), public.current_plan(uuid), public.has_role(public.app_role), public.is_staff() to authenticated;
revoke execute on function public.refresh_topic_mastery(uuid) from authenticated;

-- ---------------------------------------------------------------------
-- Agendamentos (pg_cron) — habilite a extensão no painel do Supabase
-- ---------------------------------------------------------------------
do $$
begin
  if exists (select 1 from pg_available_extensions where name = 'pg_cron') then
    create extension if not exists pg_cron;
    perform cron.schedule('vu-topic-mastery', '* * * * *', 'select public.refresh_topic_mastery()');
  end if;
end $$;
