import { describe, expect, it } from "vitest";
import {
  evaluateProductionHealth,
  formatProductionHealthReport,
  getProductionHealthRequestHeaders,
  parseProductionHealthArgs
} from "./check-production-health.mjs";

const healthyPhase1Payload = {
  auth: {
    supabase: "configured",
    supabaseSecret: "configured"
  },
  missing: ["TOOLARS_AI_PROVIDER_ENDPOINT/TOOLARS_AI_PROVIDER_API_KEY"],
  mode: {
    freeTrial: true
  },
  persistence: {
    accountStore: "legacy-disabled",
    authSessionLedger: "legacy-disabled"
  },
  providers: {
    aiProvider: "missing",
    billingProvider: "missing"
  },
  version: 1
};

describe("production health check", () => {
  it("passes Phase 1 free launch when Supabase is configured and paid providers are parked", () => {
    expect(evaluateProductionHealth(healthyPhase1Payload)).toMatchObject({
      ok: true,
      blockers: [],
      warnings: ["TOOLARS_AI_PROVIDER_ENDPOINT/TOOLARS_AI_PROVIDER_API_KEY"]
    });
  });

  it("treats the intentionally limited anonymous response as a liveness pass with an observability warning", () => {
    expect(evaluateProductionHealth({ status: "ok" })).toEqual({
      ok: true,
      blockers: [],
      warnings: ["Detailed runtime status requires TOOLARS_HEALTHCHECK_TOKEN"]
    });
  });

  it("blocks release when Supabase public config is missing", () => {
    const result = evaluateProductionHealth({
      ...healthyPhase1Payload,
      auth: { ...healthyPhase1Payload.auth, supabase: "missing" },
      missing: ["NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]
    });

    expect(result.ok).toBe(false);
    expect(result.blockers).toContain("NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  });

  it("can require AI provider config for AI-enabled releases", () => {
    const result = evaluateProductionHealth(healthyPhase1Payload, { requireAiProvider: true });

    expect(result.ok).toBe(false);
    expect(result.blockers).toContain("TOOLARS_AI_PROVIDER_ENDPOINT/TOOLARS_AI_PROVIDER_API_KEY");
  });

  it("parses release health CLI options", () => {
    expect(
      parseProductionHealthArgs([
        "--base-url",
        "https://toolars.app/",
        "--require-ai-provider",
        "--require-billing-provider"
      ])
    ).toEqual({
      baseUrl: "https://toolars.app",
      requireAiProvider: true,
      requireBillingProvider: true
    });
  });

  it("accepts the pnpm run argument separator", () => {
    expect(parseProductionHealthArgs(["--", "--base-url", "https://toolars.app/"])).toMatchObject({
      baseUrl: "https://toolars.app"
    });
  });

  it("sends the configured health token without exposing it in the report", () => {
    expect(getProductionHealthRequestHeaders({ TOOLARS_HEALTHCHECK_TOKEN: "health-token" })).toEqual({
      accept: "application/json",
      authorization: "Bearer health-token"
    });
    expect(getProductionHealthRequestHeaders({})).toEqual({ accept: "application/json" });
  });

  it("formats blocker and warning evidence without secret values", () => {
    const report = formatProductionHealthReport(
      evaluateProductionHealth(healthyPhase1Payload, { requireAiProvider: true })
    );

    expect(report).toContain("Status: fail");
    expect(report).toContain("Blockers:");
    expect(report).toContain("TOOLARS_AI_PROVIDER_ENDPOINT/TOOLARS_AI_PROVIDER_API_KEY");
    expect(report).not.toContain("secret");
  });
});
