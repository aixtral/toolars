import { describe, expect, it } from "vitest";
import { calculateGad7Anxiety, defaultGad7Answers, type Gad7Severity } from "./gad7-anxiety";

describe("calculateGad7Anxiety", () => {
  it("scores the default GAD-7 answers and maps them to the source mild band", () => {
    const result = calculateGad7Anxiety(defaultGad7Answers);

    expect(result.totalScore).toBe(7);
    expect(result.formattedScore).toBe("7 / 21");
    expect(result.severity).toBe<Gad7Severity>("mild");
  });

  it("maps high GAD-7 scores to the severe support band", () => {
    const result = calculateGad7Anxiety([3, 3, 3, 3, 3, 3, 3]);

    expect(result.totalScore).toBe(21);
    expect(result.severity).toBe<Gad7Severity>("severe");
  });
});
