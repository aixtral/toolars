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
