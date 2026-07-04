import { describe, expect, it } from "vitest";
import { compareTextVersions } from "./diff-checker";

describe("compareTextVersions", () => {
  it("computes line-level additions and unchanged lines", () => {
    const result = compareTextVersions({
      original: "alpha\nbeta",
      revised: "alpha\ngamma\nbeta"
    });

    expect(result.success).toBe(true);
    expect(result.stats).toMatchObject({ added: 1, removed: 0, unchanged: 2, totalChanges: 1 });
    expect(result.lines.map((line) => line.type)).toEqual(["unchanged", "added", "unchanged"]);
    expect(result.output).toContain("+ gamma");
  });

  it("represents modified lines as one removal and one addition", () => {
    const result = compareTextVersions({
      original: "hello\nworld",
      revised: "hello\nearth"
    });

    expect(result.success).toBe(true);
    expect(result.stats).toMatchObject({ added: 1, removed: 1, totalChanges: 2 });
    expect(result.summary).toBe("2 line changes found.");
  });
});
