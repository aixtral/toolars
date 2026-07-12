import { afterEach, describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/api/system/production-health", () => {
  const originalToken = process.env.TOOLARS_HEALTHCHECK_TOKEN;

  afterEach(() => {
    if (originalToken === undefined) delete process.env.TOOLARS_HEALTHCHECK_TOKEN;
    else process.env.TOOLARS_HEALTHCHECK_TOKEN = originalToken;
  });

  it("keeps configuration details private unless an explicit health token is supplied", async () => {
    process.env.TOOLARS_HEALTHCHECK_TOKEN = "health-token";
    expect(await (await GET(new Request("https://toolars.test/api/system/production-health"))).json()).toEqual({ status: "ok" });

    const detailed = await GET(new Request("https://toolars.test/api/system/production-health", { headers: { authorization: "Bearer health-token" } }));
    expect(detailed.status).toBe(200);
    expect((await detailed.json()).persistence).toEqual({ aiConsentAudit: "supabase", pdfUploads: "supabase-private-storage" });
  });
});
