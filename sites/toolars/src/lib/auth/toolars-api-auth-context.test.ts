import { afterEach, describe, expect, it, vi } from "vitest";
import { setToolarsSupabaseServerAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-server";
import { requireAuthenticatedUser, resolveToolarsApiAuthContext } from "./toolars-api-auth-context";

describe("resolveToolarsApiAuthContext", () => {
  afterEach(() => {
    setToolarsSupabaseServerAuthDriverForTest(null);
  });

  it("ignores legacy preview account headers when Supabase is not configured", async () => {
    await expect(
      resolveToolarsApiAuthContext(
        new Request("https://toolars.test/api/billing/account", {
          headers: {
            "x-toolars-account-email": "owner@example.com",
            "x-toolars-account-id": "acct-preview-123",
            "x-toolars-workspace-id": "toolars_ws_local"
          }
        })
      )
    ).resolves.toEqual({
      accountEmail: null,
      accountId: null,
      isAuthenticated: false,
      source: "anonymous",
      workspaceId: "anonymous-local"
    });
  });

  it("returns the Supabase user context for downstream API routes", async () => {
    setToolarsSupabaseServerAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "Owner@Example.com", id: "user_supabase_123" } },
        error: null
      }),
      signOut: vi.fn()
    });

    await expect(
      resolveToolarsApiAuthContext(
        new Request("https://toolars.test/api/billing/account", {
          headers: {
            "x-toolars-workspace-id": "toolars_ws_supabase"
          }
        })
      )
    ).resolves.toEqual({
      accountEmail: "owner@example.com",
      accountId: "user_supabase_123",
      isAuthenticated: true,
      source: "supabase",
      workspaceId: "user:user_supabase_123"
    });
  });

  it("rejects unauthenticated requests even when they forge workspace or account headers", async () => {
    await expect(
      requireAuthenticatedUser(
        new Request("https://toolars.test/api/ai/consent-audit", {
          headers: {
            "x-toolars-account-id": "victim-account",
            "x-toolars-workspace-id": "victim-workspace"
          }
        })
      )
    ).rejects.toMatchObject({ code: "authentication-required" });
  });
});
