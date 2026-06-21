import { describe, expect, it } from "vitest";
import { calculateSubscriptionAudit, defaultSubscriptionAuditEntries } from "./subscription-audit";

describe("calculateSubscriptionAudit", () => {
  it("normalizes the VitalCalc subscription frequencies into monthly and yearly spend", () => {
    const result = calculateSubscriptionAudit(defaultSubscriptionAuditEntries);

    expect(result.formattedMonthlySpend).toBe("$126.69");
    expect(result.formattedYearlySpend).toBe("$1,520.28");
    expect(result.subscriptionCount).toBe(5);
    expect(result.formattedAverageMonthly).toBe("$25.34");
    expect(result.categoryBreakdown[0].label).toBe("News/Reading");
  });

  it("returns empty-state values when no subscriptions are present", () => {
    const result = calculateSubscriptionAudit([]);

    expect(result.monthlySpend).toBe(0);
    expect(result.formattedMonthlySpend).toBe("$0.00");
    expect(result.savingsTips).toEqual([]);
  });
});
