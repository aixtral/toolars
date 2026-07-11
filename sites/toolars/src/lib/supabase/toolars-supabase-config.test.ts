import { describe, expect, it } from "vitest";

import {
  getToolarsSupabasePublicConfig,
  getToolarsSupabaseSecretKey,
  isToolarsSupabaseConfigured,
  requireToolarsSupabasePublicConfig
} from "./toolars-supabase-config";

describe("toolars supabase config", () => {
  it("reports an unconfigured state without leaking server-only secrets", () => {
    const config = getToolarsSupabasePublicConfig({
      SUPABASE_SECRET_KEY: "sb_secret_server_only"
    });

    expect(config).toEqual({
      isConfigured: false,
      publishableKey: null,
      url: null
    });
    expect(Object.keys(config)).not.toContain("secretKey");
    expect(isToolarsSupabaseConfigured({})).toBe(false);
  });

  it("reads the current publishable key names recommended by Supabase", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: " sb_publishable_123 ",
      NEXT_PUBLIC_SUPABASE_URL: " https://toolars.supabase.co/ ",
      SUPABASE_SECRET_KEY: " sb_secret_server "
    };

    expect(getToolarsSupabasePublicConfig(env)).toEqual({
      isConfigured: true,
      publishableKey: "sb_publishable_123",
      url: "https://toolars.supabase.co"
    });
    expect(getToolarsSupabaseSecretKey(env)).toBe("sb_secret_server");
    expect(isToolarsSupabaseConfigured(env)).toBe(true);
  });

  it("supports legacy anon and service role variable names during migration", () => {
    const env = {
      NEXT_PUBLIC_SUPABASE_ANON_KEY: " legacy_anon_key ",
      NEXT_PUBLIC_SUPABASE_URL: "https://toolars.supabase.co",
      SUPABASE_SERVICE_ROLE_KEY: " legacy_service_role "
    };

    expect(requireToolarsSupabasePublicConfig(env)).toEqual({
      isConfigured: true,
      publishableKey: "legacy_anon_key",
      url: "https://toolars.supabase.co"
    });
    expect(getToolarsSupabaseSecretKey(env)).toBe("legacy_service_role");
  });

  it("throws a clear setup error when a required public value is missing", () => {
    expect(() =>
      requireToolarsSupabasePublicConfig({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_123"
      })
    ).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });
});
