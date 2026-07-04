import { describe, expect, it } from "vitest";
import { minifyCode } from "./code-minifier";

describe("minifyCode", () => {
  it("minifies JavaScript locally and reports byte savings", () => {
    const result = minifyCode({
      input: "function add(a, b) {\n  return a + b;\n}\nconsole.log(add(1, 2));",
      language: "javascript"
    });

    expect(result.success).toBe(true);
    expect(result.output).toContain("function add(a,b)");
    expect(result.output).not.toContain("\n");
    expect(result.stats.savingsBytes).toBeGreaterThan(0);
    expect(result.privacyNote).toContain("browser");
  });

  it("returns a validation error for empty source", () => {
    const result = minifyCode({ input: "   ", language: "css" });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("empty-input");
    expect(result.output).toBe("");
  });
});
