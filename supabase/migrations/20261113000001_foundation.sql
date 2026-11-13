-- =====================================================================
-- Academia Veritas UniClass — Fase 1: Fundação
-- Modelo de dados completo (seção 9), RLS em todas as tabelas,
-- triggers de agregação e RPCs do onboarding.
-- =====================================================================

create extension if not exists pgcrypto;
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- ---------------------------------------------------------------------
-- Tipos
-- ---------------------------------------------------------------------
create type public.app_role as enum ('aluno', 'professor', 'revisor', 'financeiro', 'suporte', 'admin');
create type public.content_status as enum ('rascunho', 'em_revisao', 'aprovado', 'devolvido', 'publicado', 'arquivado');
create type public.question_type as enum ('multipla_escolha', 'certo_errado');
create type public.exam_status as enum ('publicado', 'previsto', 'autorizado', 'encerrado');
create type public.subscription_status as enum ('trial', 'ativa', 'em_atraso', 'carencia', 'cancelada', 'expirada');
create type public.invoice_status as enum ('pendente', 'paga', 'vencida', 'cancelada', 'estornada');
create type public.payment_method as enum ('pix', 'cartao', 'boleto');
create type public.simulation_kind as enum ('diagnostico', 'semanal', 'personalizado', 'nacional', 'reta_final');

-- ---------------------------------------------------------------------
-- Utilitários
-- ---------------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at := now();
  return new;
end $$;

create or replace function public.forbid_mutation() returns trigger
language plpgsql as $$
begin
  raise exception 'Tabela % é append-only', tg_table_name using errcode = '42501';
end $$;

-- ---------------------------------------------------------------------
-- Pessoas e acesso
-- ---------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null check (char_length(full_name) between 1 and 120),
  phone text check (phone ~ '^\d{10,11}$'),
  avatar_url text,
  timezone text not null default 'America/Sao_Paulo',
  daily_goal_minutes int not null default 25 check (daily_goal_minutes between 5 and 600),
  daily_goal_questions int not null default 10 check (daily_goal_questions between 1 and 500),
  review_daily_limit int not null default 30 check (review_daily_limit between 0 and 500),
  rankings_enabled boolean not null default true,
  notification_hour smallint check (notification_hour between 0 and 23),
  onboarding_completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger profiles_touch before update on public.profiles for each row execute function public.touch_updated_at();

create table public.roles (
  role public.app_role primary key,
  description text not null
);

create table public.user_roles (
  user_id uuid not null references auth.users (id) on delete cascade,
  role public.app_role not null references public.roles (role),
  granted_by uuid references auth.users (id),
  granted_at timestamptz not null default now(),
  primary key (user_id, role)
);

-- Funções de autorização (security definer evita recursão de RLS em user_roles)
create or replace function public.has_role(p_role public.app_role) returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role in (p_role, 'admin'));
$$;

create or replace function public.is_staff() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.user_roles where user_id = auth.uid() and role <> 'aluno');
$$;

create table public.consents (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('termos', 'privacidade', 'marketing', 'whatsapp')),
  version text not null,
  granted boolean not null,
  created_at timestamptz not null default now()
);

create table public.audit_logs (
  id bigint generated always as identity primary key,
  actor_id uuid references auth.users (id) on delete set null,
  action text not null,
  entity text not null,
  entity_id text,
  details jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create trigger audit_logs_append_only before update or delete on public.audit_logs for each row execute function public.forbid_mutation();

-- ---------------------------------------------------------------------
-- Taxonomia: áreas, disciplinas, assuntos, editais
-- ---------------------------------------------------------------------
create table public.areas (
  id text primary key,
  name text not null,
  description text
);

create table public.subjects (
  id text primary key,
  name text not null,
  short_name text not null,
  color text check (color ~ '^#[0-9A-Fa-f]{6}$')
);

create table public.topics (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.subjects (id),
  parent_id uuid references public.topics (id),
  name text not null,
  position int not null default 0
);
create index topics_subject_idx on public.topics (subject_id);
create index topics_parent_idx on public.topics (parent_id);

create table public.exams_catalog (
  id text primary key,
  name text not null,
  agency text not null,
  board text not null,
  area_id text not null references public.areas (id),
  level text not null check (level in ('médio', 'superior')),
  status public.exam_status not null,
  reference_cutoff numeric(5,2),
  edital_url text,
  reviewed_by uuid references auth.users (id),
  created_at timestamptz not null default now()
);

create table public.exam_subject_weights (
  exam_id text references public.exams_catalog (id) on delete cascade,
  subject_id text references public.subjects (id),
  questions int not null check (questions > 0),
  weight numeric(4,2) not null default 1,
  primary key (exam_id, subject_id)
);

create table public.exam_topic_weights (
  exam_id text references public.exams_catalog (id) on delete cascade,
  topic_id uuid references public.topics (id),
  weight numeric(5,2) not null default 1,
  primary key (exam_id, topic_id)
);

create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  exam_id text references public.exams_catalog (id),
  area_id text not null references public.areas (id),
  exam_date date,
  weekdays smallint[] not null check (cardinality(weekdays) between 1 and 7),
  minutes_per_day int not null check (minutes_per_day between 25 and 600),
  self_levels jsonb not null default '{}',
  active boolean not null default true,
  created_at timestamptz not null default now()
);
create unique index goals_one_active on public.goals (user_id) where active;

-- ---------------------------------------------------------------------
-- Conteúdo (com fluxo editorial)
-- ---------------------------------------------------------------------
create table public.courses (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  area_id text references public.areas (id),
  workload_hours int not null default 0,
  status public.content_status not null default 'rascunho',
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create trigger courses_touch before update on public.courses for each row execute function public.touch_updated_at();

create table public.modules (
  id uuid primary key default gen_random_uuid(),
  course_id uuid not null references public.courses (id) on delete cascade,
  title text not null,
  position int not null default 0
);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  module_id uuid not null references public.modules (id) on delete cascade,
  topic_id uuid references public.topics (id),
  title text not null,
  position int not null default 0,
  duration_minutes int not null default 0,
  status public.content_status not null default 'rascunho'
);

create table public.lesson_assets (
  id uuid primary key default gen_random_uuid(),
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  kind text not null check (kind in ('video', 'pdf', 'mapa_mental', 'audio')),
  provider_ref text, -- id no Panda/Bunny ou caminho no Storage (nunca URL pública)
  content_md text,   -- mapa mental em Markdown
  chapters jsonb
);

create table public.lesson_progress (
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid not null references public.lessons (id) on delete cascade,
  watched_ratio numeric(4,3) not null default 0 check (watched_ratio between 0 and 1),
  last_position_seconds int not null default 0,
  rating smallint check (rating between 1 and 5),
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id)
);
create trigger lesson_progress_touch before update on public.lesson_progress for each row execute function public.touch_updated_at();

create table public.content_versions (
  id bigint generated always as identity primary key,
  entity text not null,
  entity_id uuid not null,
  version int not null,
  snapshot jsonb not null,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (entity, entity_id, version)
);

create table public.content_reviews (
  id bigint generated always as identity primary key,
  entity text not null,
  entity_id uuid not null,
  from_status public.content_status not null,
  to_status public.content_status not null,
  reviewer_id uuid references auth.users (id),
  notes text,
  ai_drafted boolean not null default false,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Questões
-- ---------------------------------------------------------------------
create table public.questions (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.subjects (id),
  topic_id uuid references public.topics (id),
  kind public.question_type not null,
  statement text not null,
  board text,
  agency text,
  position_title text,
  level text check (level in ('médio', 'superior')),
  year smallint check (year between 1990 and 2100),
  difficulty smallint not null default 3 check (difficulty between 1 and 5),
  status public.content_status not null default 'rascunho',
  is_annulled boolean not null default false,
  is_outdated boolean not null default false,
  is_original boolean not null default false, -- "Inédita Veritas"
  under_review boolean not null default false, -- selo automático após 3 reportes
  content_hash text unique,                    -- detecção de duplicatas na importação
  search tsvector generated always as (to_tsvector('portuguese', statement)) stored,
  created_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index questions_filters_idx on public.questions (subject_id, topic_id, board, year, difficulty) where status = 'publicado';
create index questions_search_idx on public.questions using gin (search);
create index questions_trgm_idx on public.questions using gin (statement gin_trgm_ops);
create trigger questions_touch before update on public.questions for each row execute function public.touch_updated_at();

create table public.question_options (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  label text not null, -- A..E, ou C/E
  body text not null,
  is_correct boolean not null default false,
  unique (question_id, label)
);

create table public.question_comments (
  question_id uuid primary key references public.questions (id) on delete cascade,
  body text not null,
  video_ref text,
  author_id uuid references auth.users (id),
  status public.content_status not null default 'rascunho',
  ai_drafted boolean not null default false,
  updated_at timestamptz not null default now()
);

create table public.community_comments (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  body text not null check (char_length(body) between 1 and 3000),
  hidden boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.questions (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  reason text not null check (reason in ('gabarito', 'enunciado', 'comentario', 'desatualizada', 'outro')),
  details text,
  status text not null default 'aberto' check (status in ('aberto', 'em_analise', 'procedente', 'improcedente')),
  due_at timestamptz not null default now() + interval '72 hours',
  resolved_by uuid references auth.users (id),
  created_at timestamptz not null default now(),
  unique (question_id, user_id)
);

-- Selo "em análise" automático com 3 reportes abertos
create or replace function public.flag_reported_question() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if (select count(*) from public.question_reports where question_id = new.question_id and status in ('aberto', 'em_analise')) >= 3 then
    update public.questions set under_review = true where id = new.question_id;
  end if;
  return new;
end $$;
create trigger question_reports_flag after insert on public.question_reports for each row execute function public.flag_reported_question();

-- ---------------------------------------------------------------------
-- Prática
-- ---------------------------------------------------------------------
create table public.answers (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid not null references public.questions (id),
  option_id uuid not null references public.question_options (id),
  is_correct boolean not null default false, -- definido no servidor pelo trigger
  time_seconds int check (time_seconds between 0 and 7200),
  origin text not null check (origin in ('banco', 'aula', 'simulado', 'revisao', 'diagnostico')),
  origin_id uuid,
  answered_at timestamptz not null default now()
);
create index answers_user_idx on public.answers (user_id, answered_at desc);
create index answers_user_question_idx on public.answers (user_id, question_id);
create trigger answers_append_only before update or delete on public.answers for each row execute function public.forbid_mutation();

create table public.notebooks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  filters jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create table public.simulations (
  id uuid primary key default gen_random_uuid(),
  kind public.simulation_kind not null,
  title text not null,
  exam_id text references public.exams_catalog (id),
  user_id uuid references auth.users (id) on delete cascade, -- null = simulado coletivo (nacional)
  duration_minutes int not null,
  scoring_rule text not null default 'sem_penalidade' check (scoring_rule in ('sem_penalidade', 'cebraspe')),
  opens_at timestamptz,
  closes_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.simulation_questions (
  simulation_id uuid references public.simulations (id) on delete cascade,
  question_id uuid references public.questions (id),
  position int not null,
  weight numeric(4,2) not null default 1,
  primary key (simulation_id, question_id)
);

create table public.simulation_attempts (
  id uuid primary key default gen_random_uuid(),
  simulation_id uuid not null references public.simulations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  answers_draft jsonb not null default '{}', -- salvamento automático
  score numeric(6,2),                        -- calculado só no servidor
  details jsonb,
  unique (simulation_id, user_id)
);

create table public.srs_cards (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  question_id uuid references public.questions (id) on delete cascade,
  flashcard_id uuid,
  stability real not null default 0,
  difficulty real not null default 5,
  reps int not null default 0,
  lapses int not null default 0,
  due_at timestamptz not null default now(),
  last_review_at timestamptz,
  check ((question_id is not null) <> (flashcard_id is not null))
);
create index srs_due_idx on public.srs_cards (user_id, due_at);

create table public.flashcards (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade, -- null = do professor (oficial)
  topic_id uuid references public.topics (id),
  front text not null,
  back text not null,
  status public.content_status not null default 'publicado',
  created_at timestamptz not null default now()
);
alter table public.srs_cards add foreign key (flashcard_id) references public.flashcards (id) on delete cascade;

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  lesson_id uuid references public.lessons (id) on delete cascade,
  question_id uuid references public.questions (id) on delete cascade,
  video_seconds int,
  body text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Rotina e métricas (painéis leem os agregados, nunca os eventos brutos)
-- ---------------------------------------------------------------------
create table public.study_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  goal_id uuid references public.goals (id) on delete cascade,
  week_start date not null,
  plan jsonb not null,
  generated_at timestamptz not null default now(),
  unique (user_id, week_start)
);

create table public.study_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subject_id text references public.subjects (id),
  started_at timestamptz not null,
  minutes int not null check (minutes between 1 and 600),
  mode text not null check (mode in ('livre', 'pomodoro', 'manual')),
  source text not null check (source in ('timer', 'manual', 'aula', 'questoes')),
  created_at timestamptz not null default now(),
  check (started_at <= now() + interval '5 minutes')
);

create table public.study_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null,
  payload jsonb not null default '{}',
  created_at timestamptz not null default now()
);
create index study_events_user_idx on public.study_events (user_id, created_at);
create trigger study_events_append_only before update or delete on public.study_events for each row execute function public.forbid_mutation();

create table public.daily_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  minutes int not null default 0,
  questions int not null default 0,
  correct int not null default 0,
  lessons_completed int not null default 0,
  xp int not null default 0,
  primary key (user_id, day)
);

create table public.daily_subject_stats (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  subject_id text not null references public.subjects (id),
  minutes int not null default 0,
  questions int not null default 0,
  correct int not null default 0,
  time_seconds_total int not null default 0,
  primary key (user_id, day, subject_id)
);

create table public.topic_mastery (
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id uuid not null references public.topics (id) on delete cascade,
  subject_id text not null references public.subjects (id),
  mastery smallint not null default 0 check (mastery between 0 and 100),
  answers int not null default 0,
  correct int not null default 0,
  studied boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, topic_id)
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  kind text not null check (kind in ('etapa', 'semanal', 'mensal', 'disciplina')),
  period_start date not null,
  period_end date not null,
  data jsonb not null,
  pdf_path text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Engajamento
-- ---------------------------------------------------------------------
create table public.streaks (
  user_id uuid primary key references auth.users (id) on delete cascade,
  current int not null default 0,
  best int not null default 0,
  shields smallint not null default 0 check (shields between 0 and 2),
  updated_at timestamptz not null default now()
);

create table public.xp_ledger (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  amount int not null,
  reason text not null,
  ref_id text,
  created_at timestamptz not null default now()
);
create index xp_user_idx on public.xp_ledger (user_id, created_at);
create trigger xp_ledger_append_only before update or delete on public.xp_ledger for each row execute function public.forbid_mutation();

create table public.achievements (
  id text primary key,
  name text not null,
  description text not null,
  icon text not null,
  rule jsonb not null
);

create table public.user_achievements (
  user_id uuid references auth.users (id) on delete cascade,
  achievement_id text references public.achievements (id),
  earned_at timestamptz not null default now(),
  primary key (user_id, achievement_id)
);

create table public.leagues (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  division text not null check (division in ('bronze', 'prata', 'ouro', 'veritas')),
  unique (week_start, division, id)
);

create table public.league_members (
  league_id uuid references public.leagues (id) on delete cascade,
  user_id uuid references auth.users (id) on delete cascade,
  xp int not null default 0,
  primary key (league_id, user_id)
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  channel text not null check (channel in ('app', 'push', 'email', 'whatsapp')),
  kind text not null,
  title text not null,
  body text,
  href text,
  read_at timestamptz,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------
-- Comercial
-- ---------------------------------------------------------------------
create table public.plans (
  id text primary key,
  name text not null,
  position int not null,
  active boolean not null default true
);

create table public.plan_prices (
  plan_id text references public.plans (id) on delete cascade,
  period text check (period in ('mensal', 'semestral', 'anual')),
  amount_cents int not null check (amount_cents >= 0), -- definido no admin, nunca no código
  primary key (plan_id, period)
);

create table public.plan_entitlements (
  plan_id text references public.plans (id) on delete cascade,
  key text not null,
  value jsonb not null, -- ex.: true, 20, "ilimitado"
  primary key (plan_id, key)
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  plan_id text not null references public.plans (id),
  period text not null check (period in ('mensal', 'semestral', 'anual')),
  status public.subscription_status not null,
  current_period_start timestamptz not null,
  current_period_end timestamptz not null,
  grace_until timestamptz,
  gateway text,
  gateway_ref text unique,
  canceled_at timestamptz,
  cancel_reason text,
  created_at timestamptz not null default now()
);
create unique index subscriptions_one_live on public.subscriptions (user_id) where status in ('trial', 'ativa', 'em_atraso', 'carencia');

create table public.coupons (
  code text primary key,
  percent_off smallint check (percent_off between 1 and 100),
  amount_off_cents int check (amount_off_cents > 0),
  valid_until timestamptz,
  max_redemptions int,
  redemptions int not null default 0,
  active boolean not null default true,
  check ((percent_off is null) <> (amount_off_cents is null))
);

create table public.invoices (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  subscription_id uuid references public.subscriptions (id),
  amount_cents int not null,
  status public.invoice_status not null default 'pendente',
  due_date date not null,
  method public.payment_method,
  pix_copy_paste text,
  boleto_url text,
  gateway_ref text unique,
  coupon_code text references public.coupons (code),
  created_at timestamptz not null default now()
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  invoice_id uuid not null references public.invoices (id),
  amount_cents int not null,
  method public.payment_method not null,
  paid_at timestamptz not null,
  gateway_ref text unique not null
);

create table public.webhook_events (
  id bigint generated always as identity primary key,
  gateway text not null,
  event_id text not null,
  type text not null,
  payload jsonb not null,
  signature_valid boolean not null,
  processed_at timestamptz,
  error text,
  received_at timestamptz not null default now(),
  unique (gateway, event_id) -- idempotência
);

-- ---------------------------------------------------------------------
-- Certificação e notícias
-- ---------------------------------------------------------------------
create table public.certificates (
  id uuid primary key default gen_random_uuid(),
  code text unique not null default upper(encode(gen_random_bytes(6), 'hex')),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id uuid not null references public.courses (id),
  student_name text not null,
  course_title text not null,
  workload_hours int not null,
  period_start date not null,
  period_end date not null,
  content_hash text not null,
  issued_at timestamptz not null default now(),
  revoked_at timestamptz,
  unique (user_id, course_id)
);
create trigger certificates_immutable before delete on public.certificates for each row execute function public.forbid_mutation();

create table public.news_sources (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  kind text not null check (kind in ('rss', 'oficial')),
  active boolean not null default true
);

create table public.news_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  summary text not null,      -- texto próprio, resumido
  tag text not null,
  area_id text references public.areas (id),
  region text,
  source_url text not null,   -- link para a fonte oficial
  status text not null default 'rascunho' check (status in ('sugestao', 'rascunho', 'published', 'arquivado')),
  author_id uuid references auth.users (id),
  published_at timestamptz,
  created_at timestamptz not null default now()
);
create index news_published_idx on public.news_posts (published_at desc) where status = 'published';
