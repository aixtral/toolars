import { describe, expect, it } from "vitest";
import {
  evaluatePublicHealth,
  parsePublicHealthArgs
} from "./check-public-health.mjs";

describe("public production health check", () => {
  it("accepts an OK public health response without exposing configuration", () => {
    expect(evaluatePublicHealth({ status: "ok" })).toEqual({ ok: true, reason: null });
  });

  it("rejects incomplete public health responses", () => {
    expect(evaluatePublicHealth({ status: "degraded" })).toEqual({
      ok: false,
      reason: 'Expected public health status "ok"'
    });
  });

  it("parses a temporary production origin", () => {
    expect(parsePublicHealthArgs(["--base-url", "https://toolars-two.vercel.app/"])).toEqual({
      baseUrl: "https://toolars-two.vercel.app"
    });
  });
});
