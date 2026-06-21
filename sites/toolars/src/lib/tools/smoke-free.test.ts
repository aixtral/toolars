import { describe, expect, it } from "vitest";
import { calculateSmokeFree, defaultSmokeFreeScenario } from "./smoke-free";

describe("calculateSmokeFree", () => {
  it("tracks smoke-free days, savings, avoided cigarettes, and milestones", () => {
    const result = calculateSmokeFree(defaultSmokeFreeScenario, new Date("2026-06-19T12:00:00Z"));

    expect(result.daysSmokeFree).toBe(169);
    expect(result.formattedMoneySaved).toBe("$1,690");
    expect(result.formattedCigarettesAvoided).toBe("3,380 cigarettes");
    expect(result.formattedLifeExtended).toBe("25.8 days");
    expect(result.reachedMilestones.map((milestone) => milestone.time)).toContain("1-3 months");
    expect(result.nextMilestone?.time).toBe("1 year");
  });

  it("does not return negative progress for future quit dates", () => {
    const result = calculateSmokeFree(
      { quitDate: "2026-06-20", cigarettesPerDay: 20, pricePerPack: 10, cigarettesPerPack: 20 },
      new Date("2026-06-19T12:00:00Z")
    );

    expect(result.daysSmokeFree).toBe(0);
    expect(result.moneySaved).toBe(0);
    expect(result.summary).toContain("Starting today");
  });
});
