import { describe, expect, it } from "vitest";
import { calculatePregnancyDueDate } from "./pregnancy-due-date";

describe("calculatePregnancyDueDate", () => {
  it("calculates due date, gestational age, trimester, and remaining days with cycle adjustment", () => {
    const result = calculatePregnancyDueDate({
      lmpDate: "2026-01-01",
      cycleLengthDays: 30,
      asOfDate: "2026-06-16"
    });

    expect(result.formattedDueDate).toBe("October 10, 2026");
    expect(result.formattedConceptionDate).toBe("January 17, 2026");
    expect(result.gestationalAgeLabel).toBe("Week 23, Day 5");
    expect(result.trimester).toBe("2nd Trimester");
    expect(result.daysRemainingLabel).toBe("116 days");
    expect(result.progressPercent).toBe(59);
  });

  it("labels dates before LMP as not pregnant", () => {
    const result = calculatePregnancyDueDate({
      lmpDate: "2026-07-01",
      cycleLengthDays: 28,
      asOfDate: "2026-06-16"
    });

    expect(result.gestationalAgeLabel).toBe("Not pregnant");
    expect(result.trimester).toBe("Not pregnant");
    expect(result.progressPercent).toBe(0);
  });
});
