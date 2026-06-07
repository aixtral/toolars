-- Billing webhook writes use the server-side service role path.
-- from https://supabase.com/docs/guides/database/postgres/row-level-security

create table if not exists public.subscription_events (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('lemon_squeezy')),
  provider_event_id text not null,
  event_name text not null,
  provider_object_type text not null,
  provider_object_id text not null,
  workspace_id uuid references public.workspaces(id) on delete set null,
  payload_hash text not null,
  processing_status text not null check (processing_status in ('processed', 'failed')),
  error_message text,
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  unique (provider, provider_event_id)
);

create table if not exists public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  provider text not null check (provider in ('lemon_squeezy')),
  provider_subscription_id text not null,
  workspace_id uuid references public.workspaces(id) on delete set null,
  provider_customer_id text,
  provider_product_id text,
  provider_variant_id text not null,
  plan_id text not null check (plan_id in ('free', 'pro', 'team')),
  provider_status text not null check (
    provider_status in (
      'on_trial',
      'active',
      'paused',
      'past_due',
      'unpaid',
      'cancelled',
      'expired'
    )
  ),
  access_state text not null check (
    access_state in ('paid', 'grace', 'paused', 'paid_until_end', 'free')
  ),
  renews_at timestamptz,
  ends_at timestamptz,
  trial_ends_at timestamptz,
  customer_portal_url text,
  update_payment_method_url text,
  last_provider_event_id text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (provider, provider_subscription_id)
);

create index if not exists subscription_events_provider_event_idx
  on public.subscription_events(provider, provider_event_id);

create index if not exists subscription_events_workspace_id_idx
  on public.subscription_events(workspace_id);

create index if not exists subscriptions_workspace_id_idx
  on public.subscriptions(workspace_id);

create index if not exists subscriptions_provider_subscription_idx
  on public.subscriptions(provider, provider_subscription_id);

alter table public.subscription_events enable row level security;
alter table public.subscriptions enable row level security;

grant select, insert, update on public.subscription_events to service_role;
grant select, insert, update on public.subscriptions to service_role;
