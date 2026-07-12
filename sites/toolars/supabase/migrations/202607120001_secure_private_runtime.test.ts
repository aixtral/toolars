import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("secure private runtime migration", () => {
  it("uses private Supabase tables, bucket policies, and revokes anonymous workspace RPC access", () => {
    const sql = readFileSync("supabase/migrations/202607120001_secure_private_runtime.sql", "utf8");

    expect(sql).toContain("create table if not exists public.ai_consent_audit_records");
    expect(sql).toContain("create table if not exists public.pdf_uploads");
    expect(sql).toContain("'toolars-pdf-temp', 'toolars-pdf-temp', false");
    expect(sql).toContain("user_id = (select auth.uid())");
    expect(sql).toContain("owner_id = (select auth.uid()::text)");
    expect(sql).toContain("revoke all on function public.ensure_toolars_workspace(text) from anon");
  });
});
