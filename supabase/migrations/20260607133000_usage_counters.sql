-- Usage writes use the server-side service role path.
-- from https://supabase.com/docs/guides/database/postgres/row-level-security

create table if not exists public.usage_counters (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  period_start date not null,
  period_end date not null,
  ai_generations_used integer not null default 0 check (ai_generations_used >= 0),
  exports_used integer not null default 0 check (exports_used >= 0),
  batch_runs_used integer not null default 0 check (batch_runs_used >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (workspace_id, period_start),
  check (period_end > period_start)
);

create index if not exists usage_counters_workspace_period_idx
  on public.usage_counters(workspace_id, period_start);

alter table public.usage_counters enable row level security;

grant select, insert, update on public.usage_counters to service_role;

create or replace function public.increment_ai_generation_usage(
  p_workspace_id uuid,
  p_period_start date,
  p_period_end date
)
returns public.usage_counters
language plpgsql
security definer
set search_path = ''
as $$
declare
  usage_row public.usage_counters;
begin
  insert into public.usage_counters (
    workspace_id,
    period_start,
    period_end,
    ai_generations_used,
    updated_at
  )
  values (
    p_workspace_id,
    p_period_start,
    p_period_end,
    1,
    now()
  )
  on conflict (workspace_id, period_start)
  do update
  set
    ai_generations_used = public.usage_counters.ai_generations_used + 1,
    period_end = excluded.period_end,
    updated_at = now()
  returning * into usage_row;

  return usage_row;
end;
$$;

grant execute on function public.increment_ai_generation_usage(uuid, date, date)
  to service_role;

create or replace function public.increment_export_usage(
  p_workspace_id uuid,
  p_period_start date,
  p_period_end date
)
returns public.usage_counters
language plpgsql
security definer
set search_path = ''
as $$
declare
  usage_row public.usage_counters;
begin
  insert into public.usage_counters (
    workspace_id,
    period_start,
    period_end,
    exports_used,
    updated_at
  )
  values (
    p_workspace_id,
    p_period_start,
    p_period_end,
    1,
    now()
  )
  on conflict (workspace_id, period_start)
  do update
  set
    exports_used = public.usage_counters.exports_used + 1,
    period_end = excluded.period_end,
    updated_at = now()
  returning * into usage_row;

  return usage_row;
end;
$$;

grant execute on function public.increment_export_usage(uuid, date, date)
  to service_role;

create or replace function public.increment_batch_run_usage(
  p_workspace_id uuid,
  p_period_start date,
  p_period_end date
)
returns public.usage_counters
language plpgsql
security definer
set search_path = ''
as $$
declare
  usage_row public.usage_counters;
begin
  insert into public.usage_counters (
    workspace_id,
    period_start,
    period_end,
    batch_runs_used,
    updated_at
  )
  values (
    p_workspace_id,
    p_period_start,
    p_period_end,
    1,
    now()
  )
  on conflict (workspace_id, period_start)
  do update
  set
    batch_runs_used = public.usage_counters.batch_runs_used + 1,
    period_end = excluded.period_end,
    updated_at = now()
  returning * into usage_row;

  return usage_row;
end;
$$;

grant execute on function public.increment_batch_run_usage(uuid, date, date)
  to service_role;
