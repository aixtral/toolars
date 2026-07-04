import { describe, expect, it } from "vitest";
import { convertToml } from "./toml-converter";

describe("convertToml", () => {
  it("converts simple TOML into formatted JSON", () => {
    const result = convertToml({ direction: "toml-to-json", input: 'title = "Toolars"\n[owner]\nname = "Ops"\n' });

    expect(result.success).toBe(true);
    expect(result.output).toContain('"title": "Toolars"');
    expect(result.output).toContain('"owner"');
  });

  it("converts JSON into TOML sections", () => {
    const result = convertToml({ direction: "json-to-toml", input: '{"title":"Toolars","owner":{"name":"Ops"}}' });

    expect(result.success).toBe(true);
    expect(result.output).toContain('title = "Toolars"');
    expect(result.output).toContain("[owner]");
  });
});
