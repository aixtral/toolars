import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getToolarsSupabaseBrowserUser,
  setToolarsSupabaseBrowserAuthDriverForTest,
  signOutToolarsSupabaseBrowserUser,
  startToolarsSupabaseOAuth,
  submitToolarsSupabaseEmailAuth
} from "./toolars-supabase-auth-client";

describe("toolars supabase browser auth", () => {
  afterEach(() => {
    setToolarsSupabaseBrowserAuthDriverForTest(null);
  });

  it("fails clearly when Supabase is not configured", async () => {
    const result = await submitToolarsSupabaseEmailAuth({
      email: "owner@example.com",
      mode: "sign-in",
      password: "correct horse"
    });

    expect(result).toEqual({
      errorCode: "not-configured",
      ok: false
    });
  });

  it("starts Google OAuth with the current Toolars route as the return URL", async () => {
    const signInWithOAuth = vi.fn().mockResolvedValue({
      data: { provider: "google", url: "https://project.supabase.co/auth/v1/authorize?provider=google" },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithOAuth,
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    await expect(
      startToolarsSupabaseOAuth({
        provider: "google",
        redirectTo: "https://toolars.app/zh-hans"
      })
    ).resolves.toEqual({
      ok: true,
      provider: "google"
    });
    expect(signInWithOAuth).toHaveBeenCalledWith({
      options: { redirectTo: "https://toolars.app/zh-hans" },
      provider: "google"
    });
  });

  it("signs in with email and password through the injected Supabase driver", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { user: { email: "owner@example.com", id: "user_123" } },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithPassword,
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    await expect(
      submitToolarsSupabaseEmailAuth({
        email: " Owner@Example.com ",
        mode: "sign-in",
        password: "correct horse"
      })
    ).resolves.toEqual({
      accountEmail: "owner@example.com",
      accountId: "user_123",
      needsEmailConfirmation: false,
      ok: true
    });
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "owner@example.com",
      password: "correct horse"
    });
  });

  it("signs up with email redirect options and reports confirmation-required accounts", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: { session: null, user: { email: "owner@example.com", id: "user_456" } },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp
    });

    await expect(
      submitToolarsSupabaseEmailAuth({
        email: "owner@example.com",
        emailRedirectTo: "https://toolars.test/settings",
        mode: "sign-up",
        password: "correct horse"
      })
    ).resolves.toEqual({
      accountEmail: "owner@example.com",
      accountId: "user_456",
      needsEmailConfirmation: true,
      ok: true
    });
    expect(signUp).toHaveBeenCalledWith({
      email: "owner@example.com",
      options: {
        emailRedirectTo: "https://toolars.test/settings"
      },
      password: "correct horse"
    });
  });

  it("loads and signs out the current Supabase browser user", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "owner@example.com", id: "user_789" } },
        error: null
      }),
      signInWithPassword: vi.fn(),
      signOut,
      signUp: vi.fn()
    });

    await expect(getToolarsSupabaseBrowserUser()).resolves.toEqual({
      accountEmail: "owner@example.com",
      accountId: "user_789"
    });
    await expect(signOutToolarsSupabaseBrowserUser()).resolves.toEqual({ ok: true });
    expect(signOut).toHaveBeenCalledTimes(1);
  });
});
