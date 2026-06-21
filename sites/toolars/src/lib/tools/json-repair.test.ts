import { describe, expect, it } from "vitest";
import { repairJson } from "./json-repair";

describe("repairJson", () => {
  it("repairs the JSON Repair workspace sample", () => {
    const result = repairJson("{ user: 'ada', score: 42, flags: ['beta', 'pro'], }");

    expect(result.success).toBe(true);
    expect(result.data).toEqual({ user: "ada", score: 42, flags: ["beta", "pro"] });
    expect(result.formatted).toContain('"user": "ada"');
    expect(result.fixes.map((fix) => fix.type)).toEqual(
      expect.arrayContaining(["single_quotes", "unquoted_keys", "trailing_commas"])
    );
  });

  it("passes valid JSON through without fixes", () => {
    const result = repairJson('{"status":"ok","count":2}');

    expect(result.success).toBe(true);
    expect(result.fixes).toHaveLength(0);
    expect(result.data).toEqual({ status: "ok", count: 2 });
  });

  it("returns a failure result instead of throwing for unrecoverable input", () => {
    const result = repairJson("not json at all");

    expect(result.success).toBe(false);
    expect(result.error).toBeTruthy();
    expect(result.formatted).toBeUndefined();
  });
});
