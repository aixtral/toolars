import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("/api/auth/google/start", () => {
  const originalClientId = process.env.GOOGLE_OAUTH_CLIENT_ID;
  const originalRedirectUri = process.env.GOOGLE_OAUTH_REDIRECT_URI;
  const originalSecret = process.env.TOOLARS_AUTH_SESSION_SECRET;

  beforeEach(() => {
    process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_OAUTH_REDIRECT_URI = "https://toolars.test/api/auth/google/callback";
    process.env.TOOLARS_AUTH_SESSION_SECRET = "test-session-secret";
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-06-21T11:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
    process.env.GOOGLE_OAUTH_CLIENT_ID = originalClientId;
    process.env.GOOGLE_OAUTH_REDIRECT_URI = originalRedirectUri;
    process.env.TOOLARS_AUTH_SESSION_SECRET = originalSecret;
  });

  it("redirects to Google with OpenID scopes and a signed workspace state cookie", async () => {
    const response = await GET(
      new Request("https://toolars.test/api/auth/google/start?workspaceId=toolars_ws_google_trial", {
        method: "GET"
      })
    );
    const redirect = new URL(response.headers.get("location") ?? "");
    const setCookie = response.headers.get("set-cookie") ?? "";

    expect(response.status).toBe(302);
    expect(redirect.origin).toBe("https://accounts.google.com");
    expect(redirect.pathname).toBe("/o/oauth2/v2/auth");
    expect(redirect.searchParams.get("client_id")).toBe("google-client-id");
    expect(redirect.searchParams.get("redirect_uri")).toBe("https://toolars.test/api/auth/google/callback");
    expect(redirect.searchParams.get("response_type")).toBe("code");
    expect(redirect.searchParams.get("scope")).toBe("openid email profile");
    expect(redirect.searchParams.get("state")).toMatch(/^google_oauth_/);
    expect(setCookie).toContain("toolars_google_oauth_state=");
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Lax");
    expect(setCookie).toContain("Max-Age=600");
  });

  it("returns setup guidance when Google OAuth is not configured", async () => {
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;

    const response = await GET(new Request("https://toolars.test/api/auth/google/start"));
    const payload = await response.json();

    expect(response.status).toBe(503);
    expect(payload.error).toBe("Google OAuth is not configured");
  });
});
