import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';

const migrationPath = join(
  process.cwd(),
  '..',
  'supabase/migrations/20260606152000_auth_workspace_foundation.sql',
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return readFileSync(migrationPath, 'utf8').toLowerCase();
}

describe('auth workspace Supabase migration', () => {
  it('creates profile and workspace ownership tables', () => {
    const sql = readMigration();

    expect(sql).toContain('create table if not exists public.profiles');
    expect(sql).toContain('references auth.users(id) on delete cascade');
    expect(sql).toContain('create table if not exists public.workspaces');
    expect(sql).toContain('create table if not exists public.workspace_members');
    expect(sql).toContain("role text not null check (role in ('owner', 'admin', 'member'))");
  });

  it('creates a minimal auth signup trigger for personal workspaces', () => {
    const sql = readMigration();

    expect(sql).toContain('create or replace function public.handle_new_user');
    expect(sql).toContain('after insert on auth.users');
    expect(sql).toContain('insert into public.profiles');
    expect(sql).toContain('insert into public.workspaces');
    expect(sql).toContain('insert into public.workspace_members');
  });

  it('enables RLS and workspace-scoped policies for account tables', () => {
    const sql = readMigration();

    for (const table of ['profiles', 'workspaces', 'workspace_members']) {
      expect(sql).toContain(`alter table public.${table} enable row level security`);
    }

    expect(sql).toContain('to authenticated');
    expect(sql).toContain('(select auth.uid())');
    expect(sql).toContain('public.workspace_members wm');
  });
});
