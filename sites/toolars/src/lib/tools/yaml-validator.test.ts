import { describe, expect, it } from "vitest";
import { validateYamlDocument } from "./yaml-validator";

describe("validateYamlDocument", () => {
  it("validates YAML-like config and reports structure stats", () => {
    const result = validateYamlDocument({
      input: "app:\n  name: Toolars\n  features:\n    - local\n    - private\n"
    });

    expect(result.success).toBe(true);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.stats).toMatchObject({
      lines: 5,
      keys: 3,
      depth: 2
    });
    expect(result.summary).toContain("No blocking YAML issues");
  });

  it("separates syntax errors from style warnings with line numbers", () => {
    const result = validateYamlDocument({
      input: "app:\n\tname: Toolars\n  owner: ops   "
    });

    expect(result.success).toBe(false);
    expect(result.valid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          line: 2,
          column: 1,
          type: "tab"
        })
      ])
    );
    expect(result.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          line: 3,
          type: "trailing-whitespace"
        })
      ])
    );
  });

  it("warns about odd indentation before config handoff", () => {
    const result = validateYamlDocument({
      input: "app:\n   name: Toolars"
    });

    expect(result.success).toBe(true);
    expect(result.valid).toBe(true);
    expect(result.warnings.some((warning) => warning.type === "odd-indentation")).toBe(true);
  });
});
