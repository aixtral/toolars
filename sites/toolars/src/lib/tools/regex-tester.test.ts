import { describe, expect, it } from "vitest";
import { getRegexFlagDescriptions, testRegex } from "./regex-tester";

describe("regex-tester core logic", () => {
  it("finds global matches with captures and stable stats", () => {
    const result = testRegex("(\\w+)@(\\w+)", "g", "ada@example bob@test");

    expect(result.success).toBe(true);
    expect(result.matchCount).toBe(2);
    expect(result.matches[0]).toMatchObject({
      fullMatch: "ada@example",
      captures: ["ada", "example"]
    });
    expect(result.stats.uniqueMatches).toBe(2);
  });

  it("reports invalid patterns without throwing", () => {
    const result = testRegex("[unterminated", "g", "text");

    expect(result.success).toBe(false);
    expect(result.pattern.isValid).toBe(false);
    expect(result.error?.type).toBe("invalid-pattern");
    expect(getRegexFlagDescriptions().g).toContain("Global");
  });
});
