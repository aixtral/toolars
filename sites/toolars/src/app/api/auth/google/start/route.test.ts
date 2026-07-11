import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/api/auth/google/start", () => {
  it("returns a retired response instead of starting legacy Google OAuth", async () => {
    const response = await GET(new Request("https://toolars.test/api/auth/google/start?workspaceId=toolars_ws_google_trial"));
    const payload = await response.json();

    expect(response.status).toBe(410);
    expect(response.headers.get("set-cookie")).toBeNull();
    expect(response.headers.get("location")).toBeNull();
    expect(payload).toEqual({
      code: "supabase_auth_required",
      error: "Legacy Google OAuth is retired. Use Supabase Auth instead."
    });
  });
});
