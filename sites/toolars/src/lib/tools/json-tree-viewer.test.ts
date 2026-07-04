import { describe, expect, it } from "vitest";
import { buildJsonTree } from "./json-tree-viewer";

describe("buildJsonTree", () => {
  it("parses JSON into inspectable tree nodes", () => {
    const result = buildJsonTree({ input: '{"user":{"name":"Ada","roles":["admin"]}}' });

    expect(result.success).toBe(true);
    expect(result.nodes.map((node) => node.path)).toEqual(
      expect.arrayContaining(["$", "$.user", "$.user.name", "$.user.roles[0]"])
    );
    expect(result.stats.maxDepth).toBe(3);
  });

  it("returns parse errors without throwing", () => {
    const result = buildJsonTree({ input: "{bad" });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("invalid-json");
  });
});
