import { describe, expect, it } from "vitest";
import { buildFunctionCallSpec } from "./function-call-builder";

describe("buildFunctionCallSpec", () => {
  it("turns editable parameter rows into a local tool schema", () => {
    const result = buildFunctionCallSpec({
      name: "create_ticket",
      description: "Create a support ticket",
      parameterRows: "email:string:required:Customer email\npriority:string:optional:Ticket priority"
    });

    expect(result.success).toBe(true);
    expect(result.schema.function.name).toBe("create_ticket");
    expect(result.schema.function.parameters.required).toEqual(["email"]);
    expect(result.schema.function.parameters.properties.priority).toMatchObject({
      type: "string",
      description: "Ticket priority"
    });
    expect(result.output).toContain('"type": "function"');
    expect(result.privacyNote).toMatch(/local/i);
  });
});
