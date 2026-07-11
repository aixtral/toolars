-- Backfill the launch workspace for accounts created before the Phase 1 trigger,
-- and provide one idempotent browser-safe entrypoint for authenticated sessions.
create or replace function public.ensure_toolars_workspace(preferred_locale text default 'en')
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
  default_workspace_id uuid;
  normalized_locale text := coalesce(nullif(trim(preferred_locale), ''), 'en');
begin
  if current_user_id is null then
    raise exception 'Toolars workspace provisioning requires an authenticated user';
  end if;

  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    current_user_id,
    nullif((select auth.jwt() ->> 'email'), ''),
    nullif(coalesce((select auth.jwt() -> 'user_metadata' ->> 'full_name'), (select auth.jwt() -> 'user_metadata' ->> 'name')), ''),
    nullif((select auth.jwt() -> 'user_metadata' ->> 'avatar_url'), '')
  )
  on conflict (id) do nothing;

  select id
    into default_workspace_id
    from public.workspaces
   where owner_id = current_user_id
   order by created_at asc
   limit 1;

  if default_workspace_id is null then
    insert into public.workspaces (owner_id, name)
    values (current_user_id, 'Toolars workspace')
    returning id into default_workspace_id;
  end if;

  insert into public.workspace_members (workspace_id, user_id, role)
  values (default_workspace_id, current_user_id, 'owner')
  on conflict (workspace_id, user_id) do update set role = excluded.role;

  insert into public.workspace_settings (workspace_id, locale, preferences)
  values (default_workspace_id, normalized_locale, '{}'::jsonb)
  on conflict (workspace_id) do nothing;

  return default_workspace_id;
end;
$$;

revoke all on function public.ensure_toolars_workspace(text) from public;
grant execute on function public.ensure_toolars_workspace(text) to authenticated;

create index if not exists saved_tools_workspace_user_created_at_idx
  on public.saved_tools (workspace_id, user_id, created_at desc);

create index if not exists recent_tools_workspace_user_opened_at_idx
  on public.recent_tools (workspace_id, user_id, opened_at desc);
