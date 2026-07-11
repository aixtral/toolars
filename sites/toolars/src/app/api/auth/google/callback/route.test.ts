import { describe, expect, it, vi } from "vitest";
import { GET } from "./route";

describe("/api/auth/google/callback", () => {
  it("returns a retired response without exchanging codes or issuing legacy sessions", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new Request("https://toolars.test/api/auth/google/callback?code=oauth-code&state=google_oauth_state_001", {
        headers: {
          cookie: "toolars_google_oauth_state=legacy-state"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(410);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("location")).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(payload).toEqual({
      code: "supabase_auth_required",
      error: "Legacy Google OAuth is retired. Use Supabase Auth instead."
    });

    vi.unstubAllGlobals();
  });
});
