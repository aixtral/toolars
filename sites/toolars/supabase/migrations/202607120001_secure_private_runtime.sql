create table if not exists public.ai_consent_audit_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event jsonb not null,
  run_metadata jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists ai_consent_audit_records_user_created_at_idx
  on public.ai_consent_audit_records (user_id, created_at asc);

alter table public.ai_consent_audit_records enable row level security;

grant select, insert, delete on public.ai_consent_audit_records to authenticated;

create policy ai_consent_audit_records_select_own on public.ai_consent_audit_records
for select to authenticated using (user_id = (select auth.uid()));

create policy ai_consent_audit_records_insert_own on public.ai_consent_audit_records
for insert to authenticated with check (user_id = (select auth.uid()));

create policy ai_consent_audit_records_delete_own on public.ai_consent_audit_records
for delete to authenticated using (user_id = (select auth.uid()));

create table if not exists public.pdf_uploads (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  object_path text not null unique,
  file_name text not null check (char_length(file_name) > 0),
  file_size_bytes bigint not null check (file_size_bytes > 0 and file_size_bytes <= 52428800),
  content_type text not null check (content_type = 'application/pdf'),
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists pdf_uploads_user_created_at_idx
  on public.pdf_uploads (user_id, created_at desc);

alter table public.pdf_uploads enable row level security;

grant select, insert, delete on public.pdf_uploads to authenticated;

create policy pdf_uploads_select_own on public.pdf_uploads
for select to authenticated using (user_id = (select auth.uid()));

create policy pdf_uploads_insert_own on public.pdf_uploads
for insert to authenticated with check (user_id = (select auth.uid()));

create policy pdf_uploads_delete_own on public.pdf_uploads
for delete to authenticated using (user_id = (select auth.uid()));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('toolars-pdf-temp', 'toolars-pdf-temp', false, 52428800, array['application/pdf'])
on conflict (id) do update
set public = false,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

create policy toolars_pdf_temp_select_own on storage.objects
for select to authenticated
using (bucket_id = 'toolars-pdf-temp' and owner_id = (select auth.uid()::text));

create policy toolars_pdf_temp_insert_own on storage.objects
for insert to authenticated
with check (bucket_id = 'toolars-pdf-temp' and owner_id = (select auth.uid()::text));

create policy toolars_pdf_temp_delete_own on storage.objects
for delete to authenticated
using (bucket_id = 'toolars-pdf-temp' and owner_id = (select auth.uid()::text));

revoke all on function public.ensure_toolars_workspace(text) from anon;
revoke all on function public.is_toolars_workspace_member(uuid) from anon;
revoke all on function public.is_toolars_workspace_owner(uuid) from anon;
