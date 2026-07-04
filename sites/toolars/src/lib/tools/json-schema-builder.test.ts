import { describe, expect, it } from "vitest";
import { buildJsonSchema } from "./json-schema-builder";

describe("buildJsonSchema", () => {
  it("builds an object schema from editable field rows", () => {
    const result = buildJsonSchema({
      title: "User",
      fields: [
        { name: "email", type: "string", required: true, format: "email" },
        { name: "age", type: "number", minimum: 0 }
      ]
    });

    expect(result.success).toBe(true);
    expect(result.schema.required).toEqual(["email"]);
    expect(result.schema.properties.email).toMatchObject({ type: "string", format: "email" });
    expect(result.output).toContain('"title": "User"');
  });

  it("rejects duplicate field names", () => {
    const result = buildJsonSchema({
      fields: [
        { name: "id", type: "string" },
        { name: "id", type: "number" }
      ]
    });

    expect(result.success).toBe(false);
    expect(result.errors[0]?.type).toBe("duplicate-field");
  });
});
