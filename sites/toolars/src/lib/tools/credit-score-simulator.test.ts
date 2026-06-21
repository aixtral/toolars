import { describe, expect, it } from "vitest";
import { calculateCreditScoreSimulation, defaultCreditScoreScenario } from "./credit-score-simulator";

describe("calculateCreditScoreSimulation", () => {
  it("simulates the VitalCalc default payoff action", () => {
    const result = calculateCreditScoreSimulation(defaultCreditScoreScenario);

    expect(result.newScore).toBe(720);
    expect(result.scoreChange).toBe(40);
    expect(result.formattedScoreChange).toBe("+40");
    expect(result.formattedCurrentUtilization).toBe("50.0%");
    expect(result.formattedNewUtilization).toBe("0.0%");
    expect(result.rating).toBe("Good");
  });

  it("keeps simulated scores inside the FICO range", () => {
    const result = calculateCreditScoreSimulation({
      ...defaultCreditScoreScenario,
      currentScore: 320,
      action: "miss-payment"
    });

    expect(result.newScore).toBe(300);
    expect(result.formattedScoreChange).toBe("-20");
    expect(result.rating).toBe("Poor");
  });
});
