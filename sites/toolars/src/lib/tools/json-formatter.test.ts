import { describe, expect, it } from "vitest";
import { formatJsonDocument } from "./json-formatter";

describe("json-formatter core logic", () => {
  it("formats and minifies valid JSON locally", () => {
    const formatted = formatJsonDocument({ input: "{\"name\":\"Toolars\",\"items\":[1,2]}", mode: "format", indent: 2 });
    const minified = formatJsonDocument({ input: formatted.output, mode: "minify" });

    expect(formatted.success).toBe(true);
    expect(formatted.output).toContain('\n  "name": "Toolars"');
    expect(formatted.stats.keys).toBe(2);
    expect(minified.output).toBe('{"name":"Toolars","items":[1,2]}');
  });

  it("returns a validation error for invalid JSON", () => {
    const result = formatJsonDocument({ input: "{bad", mode: "format" });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("invalid-json");
    expect(result.output).toBe("");
  });
});
