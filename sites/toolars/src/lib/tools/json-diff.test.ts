import { describe, expect, it } from "vitest";
import { compareJsonPayloads, diffJsonValues } from "./json-diff";

describe("diffJsonValues", () => {
  it("reports changed, added, and removed JSONPath-style differences", () => {
    const result = diffJsonValues(
      { user: { name: "Alice", role: "admin" }, enabled: true },
      { user: { name: "Bob", plan: "pro" }, enabled: true }
    );

    expect(result).toEqual([
      { path: "$.user.name", type: "changed", oldValue: "Alice", newValue: "Bob" },
      { path: "$.user.role", type: "removed", oldValue: "admin" },
      { path: "$.user.plan", type: "added", newValue: "pro" }
    ]);
  });

  it("uses array index paths for list changes", () => {
    const result = diffJsonValues(["stable", "old"], ["stable", "new", "added"]);

    expect(result).toEqual([
      { path: "$[1]", type: "changed", oldValue: "old", newValue: "new" },
      { path: "$[2]", type: "added", newValue: "added" }
    ]);
  });
});

describe("compareJsonPayloads", () => {
  it("parses pasted JSON and returns copyable diff output with stats", () => {
    const result = compareJsonPayloads({
      original: JSON.stringify({ version: 1, flags: { beta: false } }),
      modified: JSON.stringify({ version: 2, flags: { beta: true, local: true } })
    });

    expect(result.success).toBe(true);
    expect(result.stats).toMatchObject({ added: 1, removed: 0, changed: 2, total: 3 });
    expect(result.output).toContain("$.flags.local");
    expect(result.summary).toBe("3 JSON paths changed.");
  });

  it("returns a stable invalid-json error before diffing", () => {
    const result = compareJsonPayloads({ original: "{\"ok\":true}", modified: "{bad" });

    expect(result.success).toBe(false);
    expect(result.output).toBe("");
    expect(result.error?.type).toBe("invalid-json");
    expect(result.summary).toBe("JSON diff failed.");
  });
});
