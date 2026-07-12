import { afterEach, describe, expect, it, vi } from "vitest";
import { setToolarsSupabaseServerAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-server";
import { DELETE, GET, POST } from "./route";

describe("/api/auth/session", () => {
  afterEach(() => {
    setToolarsSupabaseServerAuthDriverForTest(null);
  });

  it("rejects legacy fake session creation because auth now runs through Supabase", async () => {
    const response = await POST(
      new Request("http://toolars.test/api/auth/session", {
        body: JSON.stringify({
          accountEmail: "Owner@Example.com",
          accountId: "acct_owner_example_com"
        }),
        headers: {
          "Content-Type": "application/json",
          "x-toolars-workspace-id": "toolars_ws_session_test"
        },
        method: "POST"
      })
    );

    const payload = await response.json();

    expect(response.status).toBe(410);
    expect(payload).toEqual({
      error: "Use Supabase Auth from the client instead of creating Toolars preview sessions.",
      supabase: { isConfigured: false }
    });
  });

  it("returns an anonymous Supabase setup payload when Supabase is not configured", async () => {
    const response = await GET(new Request("http://toolars.test/api/auth/session"));
    const payload = await response.json();

    expect(payload).toMatchObject({
      account: null,
      auth: {
        isAuthenticated: false,
        source: "anonymous"
      },
      session: null,
      supabase: {
        isConfigured: false
      }
    });
  });

  it("returns the current Supabase account when configured", async () => {
    setToolarsSupabaseServerAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "Owner@Example.com", id: "user_server_123" } },
        error: null
      }),
      signOut: vi.fn()
    });

    const response = await GET(
      new Request("http://toolars.test/api/auth/session", {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_session_test"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      account: {
        accountEmail: "owner@example.com",
        accountId: "user_server_123",
        source: "supabase"
      },
      auth: {
        isAuthenticated: true,
        source: "supabase",
        workspaceId: "user:user_server_123"
      },
      session: {
        provider: "supabase",
        status: "active"
      }
    });
  });

  it("signs out through Supabase and clears the legacy Toolars preview cookie", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    setToolarsSupabaseServerAuthDriverForTest({
      getUser: vi.fn(),
      signOut
    });

    const response = await DELETE(
      new Request("http://toolars.test/api/auth/session", {
        method: "DELETE"
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.revokedSession).toEqual({
      provider: "supabase",
      status: "revoked"
    });
    expect(response.headers.get("set-cookie")).toContain("toolars_session=;");
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
