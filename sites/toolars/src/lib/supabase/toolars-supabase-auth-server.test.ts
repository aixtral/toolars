import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getToolarsSupabaseSessionPayload,
  setToolarsSupabaseServerAuthDriverForTest,
  signOutToolarsSupabaseSession
} from "./toolars-supabase-auth-server";

describe("toolars supabase server auth", () => {
  afterEach(() => {
    setToolarsSupabaseServerAuthDriverForTest(null);
  });

  it("returns an anonymous unconfigured payload without touching Supabase", async () => {
    const payload = await getToolarsSupabaseSessionPayload(new Request("https://toolars.test/api/auth/session"));

    expect(payload).toMatchObject({
      account: null,
      auth: {
        accountEmail: null,
        accountId: null,
        isAuthenticated: false,
        source: "anonymous",
        workspaceId: "anonymous-local"
      },
      session: null,
      supabase: {
        isConfigured: false
      }
    });
  });

  it("returns the current Supabase user as the account/session payload", async () => {
    setToolarsSupabaseServerAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "Owner@Example.com", id: "user_server_123" } },
        error: null
      }),
      signOut: vi.fn()
    });

    const payload = await getToolarsSupabaseSessionPayload(
      new Request("https://toolars.test/api/auth/session", {
        headers: {
          "x-toolars-workspace-id": "toolars_ws_server"
        }
      })
    );

    expect(payload).toMatchObject({
      account: {
        accountEmail: "owner@example.com",
        accountId: "user_server_123",
        source: "supabase"
      },
      auth: {
        accountEmail: "owner@example.com",
        accountId: "user_server_123",
        isAuthenticated: true,
        source: "supabase",
        workspaceId: "toolars_ws_server"
      },
      session: {
        accountEmail: "owner@example.com",
        accountId: "user_server_123",
        provider: "supabase",
        status: "active"
      },
      supabase: {
        isConfigured: true
      }
    });
  });

  it("signs out through the Supabase server driver", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    setToolarsSupabaseServerAuthDriverForTest({
      getUser: vi.fn(),
      signOut
    });

    await expect(signOutToolarsSupabaseSession()).resolves.toEqual({
      revokedSession: {
        provider: "supabase",
        status: "revoked"
      }
    });
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
