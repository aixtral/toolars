import { describe, expect, it } from "vitest";
import { calculateCreditCardApr, defaultCreditCardAprScenario } from "./credit-card-apr";

describe("calculateCreditCardApr", () => {
  it("calculates the VitalCalc default true installment APR", () => {
    const result = calculateCreditCardApr(defaultCreditCardAprScenario);

    expect(result.formattedApr).toBe("13.03%");
    expect(result.formattedNominalTotalRate).toBe("7.20%");
    expect(result.formattedTotalFees).toBe("$720");
    expect(result.formattedTotalPayment).toBe("$10,720");
    expect(result.formattedMonthlyPayment).toBe("$893");
    expect(result.summary).toBe("13.03% true APR from 0.60% monthly fee");
  });

  it("returns zero APR when the monthly fee rate is zero", () => {
    const result = calculateCreditCardApr({
      amount: 5000,
      payments: 12,
      monthlyFeeRate: 0
    });

    expect(result.formattedApr).toBe("0.00%");
    expect(result.formattedTotalFees).toBe("$0");
    expect(result.guidanceTone).toBe("low");
  });
});
