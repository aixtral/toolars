import { describe, expect, it } from "vitest";
import { validateJsonSchemaDocument } from "./schema-validator";

describe("validateJsonSchemaDocument", () => {
  it("validates JSON data against required schema fields", () => {
    const result = validateJsonSchemaDocument({
      schemaInput: '{"type":"object","required":["email"],"properties":{"email":{"type":"string","format":"email"}}}',
      dataInput: '{"name":"Ada"}'
    });

    expect(result.success).toBe(true);
    expect(result.valid).toBe(false);
    expect(result.errors[0]).toMatchObject({ path: "$.email", type: "required" });
  });

  it("reports invalid JSON separately from validation failures", () => {
    const result = validateJsonSchemaDocument({ schemaInput: "{bad", dataInput: "{}" });

    expect(result.success).toBe(false);
    expect(result.parseError?.type).toBe("invalid-schema-json");
  });
});
