import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(process.cwd(), "supabase", "migrations", "202607060001_phase1_foundation.sql");

function readMigration() {
  return readFileSync(migrationPath, "utf8");
}

describe("toolars supabase phase 1 foundation migration", () => {
  it("creates the launch account and workspace tables", () => {
    const sql = readMigration();

    for (const table of [
      "profiles",
      "workspaces",
      "workspace_members",
      "saved_tools",
      "recent_tools",
      "workspace_settings"
    ]) {
      expect(sql).toMatch(new RegExp(`create table if not exists public\\.${table}\\b`, "i"));
    }
  });

  it("enables RLS and authenticated-only policies on every public account table", () => {
    const sql = readMigration();

    for (const table of [
      "profiles",
      "workspaces",
      "workspace_members",
      "saved_tools",
      "recent_tools",
      "workspace_settings"
    ]) {
      expect(sql).toMatch(new RegExp(`alter table public\\.${table}\\s+enable row level security`, "i"));
      expect(sql).toMatch(new RegExp(`create policy .+ on public\\.${table}.+\\bto authenticated\\b`, "is"));
    }

    expect(sql).not.toMatch(/using\s*\(\s*true\s*\)/i);
    expect(sql).not.toMatch(/with check\s*\(\s*true\s*\)/i);
  });

  it("indexes foreign keys and columns used by RLS policies", () => {
    const sql = readMigration();

    for (const indexName of [
      "profiles_email_idx",
      "workspaces_owner_id_idx",
      "workspace_members_user_id_idx",
      "workspace_members_workspace_id_idx",
      "saved_tools_user_id_idx",
      "saved_tools_workspace_id_idx",
      "recent_tools_user_id_idx",
      "recent_tools_workspace_id_idx"
    ]) {
      expect(sql).toMatch(new RegExp(`create index if not exists ${indexName}\\b`, "i"));
    }
  });

  it("uses cached auth.uid calls and creates a profile trigger for new auth users", () => {
    const sql = readMigration();

    expect(sql).toContain("(select auth.uid())");
    expect(sql).toMatch(/after insert on auth\.users/i);
    expect(sql).toMatch(/execute function public\.handle_new_toolars_user\(\)/i);
  });

  it("provides an authenticated, idempotent workspace provisioning RPC for existing OAuth accounts", () => {
    const runtimeSql = readFileSync(
      join(process.cwd(), "supabase", "migrations", "202607110001_workspace_runtime.sql"),
      "utf8"
    );

    expect(runtimeSql).toMatch(/create or replace function public\.ensure_toolars_workspace/i);
    expect(runtimeSql).toMatch(/security definer/i);
    expect(runtimeSql).toMatch(/auth\.uid\(\)/i);
    expect(runtimeSql).toMatch(/grant execute on function public\.ensure_toolars_workspace\(text\) to authenticated/i);
  });
});
