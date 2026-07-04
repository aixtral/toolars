import { describe, expect, it } from "vitest";
import { generateMultipleUUIDs, generateUUIDBatch, generateUUIDv4, validateUUID } from "./uuid-generator";

describe("uuid generator utilities", () => {
  it("generates valid UUID v4 identifiers with RFC 4122 metadata", () => {
    const result = generateUUIDv4();

    expect(result.success).toBe(true);
    expect(validateUUID(result.uuid)).toBe(true);
    expect(result.metadata).toEqual({ version: 4, variant: "RFC 4122" });
  });

  it("generates a unique batch with copy-ready output and summary", () => {
    const result = generateUUIDBatch(3);

    expect(result.success).toBe(true);
    expect(result.uuids).toHaveLength(3);
    expect(new Set(result.uuids).size).toBe(3);
    expect(result.uuids.every(validateUUID)).toBe(true);
    expect(result.output.split("\n")).toEqual(result.uuids);
    expect(result.summary).toBe("3 UUIDs generated.");
    expect(result.privacyNote).toBe("Local UUID generation only; identifiers stay in the browser.");
  });

  it("keeps the Aixtral count boundary of 1 to 1000 UUIDs", () => {
    expect(() => generateMultipleUUIDs(0)).toThrow("Count must be between 1 and 1000");
    expect(() => generateMultipleUUIDs(1001)).toThrow("Count must be between 1 and 1000");
    expect(generateUUIDBatch(0)).toMatchObject({
      success: false,
      error: { type: "invalid-count" },
      uuids: []
    });
  });
});
