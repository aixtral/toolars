import { describe, expect, it } from "vitest";
import { decodeJwt, getJwtClaimDescription } from "./jwt-decoder";

function base64UrlJson(value: Record<string, unknown>): string {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function buildJwt(header: Record<string, unknown>, payload: Record<string, unknown>): string {
  return `${base64UrlJson(header)}.${base64UrlJson(payload)}.signature`;
}

describe("jwt-decoder core logic", () => {
  it("decodes header, payload, signature, and standard claims without verification", () => {
    const token = buildJwt({ alg: "HS256", typ: "JWT" }, { sub: "user-123", name: "Ada", iat: 1516239022 });

    const result = decodeJwt(token);

    expect(result.valid).toBe(true);
    expect(result.header.alg).toBe("HS256");
    expect(result.payload.name).toBe("Ada");
    expect(result.claims.standard.sub).toBe("user-123");
    expect(result.claims.custom.name).toBe("Ada");
    expect(result.metadata.algorithm).toBe("HS256");
    expect(result.signature).toBe("signature");
    expect(result.verified).toBe(false);
  });

  it("returns a stable invalid-format result", () => {
    const result = decodeJwt("not.a.jwt.extra");

    expect(result.valid).toBe(false);
    expect(result.error?.type).toBe("invalid-format");
    expect(getJwtClaimDescription("exp")).toContain("Expiration");
  });
});
