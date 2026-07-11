create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete cascade,
  name text not null default 'Toolars workspace',
  slug text unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.workspace_members (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null default 'member' check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id)
);

create table if not exists public.saved_tools (
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  tool_slug text not null check (char_length(tool_slug) > 0),
  locale text not null default 'en',
  created_at timestamptz not null default now(),
  primary key (workspace_id, user_id, tool_slug)
);

create table if not exists public.recent_tools (
  id uuid primary key default gen_random_uuid(),
  workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  tool_slug text not null check (char_length(tool_slug) > 0),
  locale text not null default 'en',
  opened_at timestamptz not null default now()
);

create table if not exists public.workspace_settings (
  workspace_id uuid primary key references public.workspaces(id) on delete cascade,
  locale text not null default 'en',
  preferences jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create index if not exists profiles_email_idx on public.profiles (email);
create index if not exists workspaces_owner_id_idx on public.workspaces (owner_id);
create index if not exists workspace_members_user_id_idx on public.workspace_members (user_id);
create index if not exists workspace_members_workspace_id_idx on public.workspace_members (workspace_id);
create index if not exists saved_tools_user_id_idx on public.saved_tools (user_id);
create index if not exists saved_tools_workspace_id_idx on public.saved_tools (workspace_id);
create index if not exists recent_tools_user_id_idx on public.recent_tools (user_id);
create index if not exists recent_tools_workspace_id_idx on public.recent_tools (workspace_id);
create index if not exists recent_tools_workspace_opened_at_idx on public.recent_tools (workspace_id, opened_at desc);

create or replace function public.set_toolars_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_profiles_updated_at on public.profiles;
create trigger set_profiles_updated_at
before update on public.profiles
for each row execute function public.set_toolars_updated_at();

drop trigger if exists set_workspaces_updated_at on public.workspaces;
create trigger set_workspaces_updated_at
before update on public.workspaces
for each row execute function public.set_toolars_updated_at();

drop trigger if exists set_workspace_settings_updated_at on public.workspace_settings;
create trigger set_workspace_settings_updated_at
before update on public.workspace_settings
for each row execute function public.set_toolars_updated_at();

create or replace function public.is_toolars_workspace_member(target_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = (select auth.uid())
  );
$$;

create or replace function public.is_toolars_workspace_owner(target_workspace_id uuid)
returns boolean
language sql
security definer
stable
set search_path = ''
as $$
  select exists (
    select 1
    from public.workspaces
    where id = target_workspace_id
      and owner_id = (select auth.uid())
  );
$$;

create or replace function public.handle_new_toolars_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  default_workspace_id uuid;
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'name', new.raw_user_meta_data ->> 'full_name'),
    new.raw_user_meta_data ->> 'avatar_url'
  )
  on conflict (id) do update
  set
    email = excluded.email,
    display_name = coalesce(excluded.display_name, public.profiles.display_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    updated_at = now();

  insert into public.workspaces (owner_id, name)
  values (new.id, 'Toolars workspace')
  returning id into default_workspace_id;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (default_workspace_id, new.id, 'owner')
  on conflict (workspace_id, user_id) do nothing;

  insert into public.workspace_settings (workspace_id, locale, preferences)
  values (default_workspace_id, coalesce(new.raw_user_meta_data ->> 'locale', 'en'), '{}'::jsonb)
  on conflict (workspace_id) do nothing;

  return new;
end;
$$;

alter table public.profiles enable row level security;
alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.saved_tools enable row level security;
alter table public.recent_tools enable row level security;
alter table public.workspace_settings enable row level security;

grant usage on schema public to authenticated;
grant select, insert, update, delete on public.profiles to authenticated;
grant select, insert, update, delete on public.workspaces to authenticated;
grant select, insert, update, delete on public.workspace_members to authenticated;
grant select, insert, update, delete on public.saved_tools to authenticated;
grant select, insert, update, delete on public.recent_tools to authenticated;
grant select, insert, update, delete on public.workspace_settings to authenticated;

revoke all on function public.is_toolars_workspace_member(uuid) from public;
revoke all on function public.is_toolars_workspace_owner(uuid) from public;
grant execute on function public.is_toolars_workspace_member(uuid) to authenticated;
grant execute on function public.is_toolars_workspace_owner(uuid) to authenticated;

create policy profiles_select_own on public.profiles
for select to authenticated
using (id = (select auth.uid()));

create policy profiles_insert_own on public.profiles
for insert to authenticated
with check (id = (select auth.uid()));

create policy profiles_update_own on public.profiles
for update to authenticated
using (id = (select auth.uid()))
with check (id = (select auth.uid()));

create policy workspaces_select_member on public.workspaces
for select to authenticated
using ((select public.is_toolars_workspace_member(id)));

create policy workspaces_insert_owner on public.workspaces
for insert to authenticated
with check (owner_id = (select auth.uid()));

create policy workspaces_update_owner on public.workspaces
for update to authenticated
using (owner_id = (select auth.uid()))
with check (owner_id = (select auth.uid()));

create policy workspaces_delete_owner on public.workspaces
for delete to authenticated
using (owner_id = (select auth.uid()));

create policy workspace_members_select_member on public.workspace_members
for select to authenticated
using ((select public.is_toolars_workspace_member(workspace_id)));

create policy workspace_members_insert_owner on public.workspace_members
for insert to authenticated
with check ((select public.is_toolars_workspace_owner(workspace_id)));

create policy workspace_members_update_owner on public.workspace_members
for update to authenticated
using ((select public.is_toolars_workspace_owner(workspace_id)))
with check ((select public.is_toolars_workspace_owner(workspace_id)));

create policy workspace_members_delete_owner on public.workspace_members
for delete to authenticated
using ((select public.is_toolars_workspace_owner(workspace_id)));

create policy saved_tools_select_owner on public.saved_tools
for select to authenticated
using (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy saved_tools_insert_owner on public.saved_tools
for insert to authenticated
with check (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy saved_tools_update_owner on public.saved_tools
for update to authenticated
using (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)))
with check (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy saved_tools_delete_owner on public.saved_tools
for delete to authenticated
using (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy recent_tools_select_owner on public.recent_tools
for select to authenticated
using (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy recent_tools_insert_owner on public.recent_tools
for insert to authenticated
with check (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy recent_tools_update_owner on public.recent_tools
for update to authenticated
using (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)))
with check (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy recent_tools_delete_owner on public.recent_tools
for delete to authenticated
using (user_id = (select auth.uid()) and (select public.is_toolars_workspace_member(workspace_id)));

create policy workspace_settings_select_member on public.workspace_settings
for select to authenticated
using ((select public.is_toolars_workspace_member(workspace_id)));

create policy workspace_settings_insert_member on public.workspace_settings
for insert to authenticated
with check ((select public.is_toolars_workspace_member(workspace_id)));

create policy workspace_settings_update_member on public.workspace_settings
for update to authenticated
using ((select public.is_toolars_workspace_member(workspace_id)))
with check ((select public.is_toolars_workspace_member(workspace_id)));

drop trigger if exists on_auth_user_created_toolars on auth.users;
create trigger on_auth_user_created_toolars
after insert on auth.users
for each row execute function public.handle_new_toolars_user();
