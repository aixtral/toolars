import { describe, expect, it } from "vitest";
import { compareTextWithOptions } from "./text-diff";

describe("compareTextWithOptions", () => {
  it("respects case and trim options while preserving line numbers", () => {
    const result = compareTextWithOptions({
      original: "  Hello  \nWorld",
      revised: "hello\nworld",
      options: { ignoreCase: true, trimLines: true }
    });

    expect(result.success).toBe(true);
    expect(result.stats.totalChanges).toBe(0);
    expect(result.lines).toEqual([
      { type: "unchanged", content: "  Hello  ", leftLine: 1, rightLine: 1 },
      { type: "unchanged", content: "World", leftLine: 2, rightLine: 2 }
    ]);
  });

  it("reports additions and removals without normalization options", () => {
    const result = compareTextWithOptions({
      original: "alpha\nbeta",
      revised: "alpha\nBETA\nbeta"
    });

    expect(result.success).toBe(true);
    expect(result.stats).toMatchObject({ added: 1, removed: 0, unchanged: 2, totalChanges: 1 });
    expect(result.output).toContain("+ BETA");
  });
});
