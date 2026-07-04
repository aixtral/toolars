import { describe, expect, it } from "vitest";
import { explainCronExpression } from "./cron-explainer";

describe("explainCronExpression", () => {
  it("explains a stepped weekday cron schedule", () => {
    const result = explainCronExpression({ expression: "*/15 9-17 * * 1-5" });

    expect(result.valid).toBe(true);
    expect(result.summary).toContain("Every 15 minutes");
    expect(result.summary).toContain("Monday through Friday");
    expect(result.fields.map((field) => field.name)).toEqual(["Minute", "Hour", "Day", "Month", "Weekday"]);
    expect(result.nextRuns).toHaveLength(3);
  });

  it("reports invalid cron expressions with field counts", () => {
    const result = explainCronExpression({ expression: "* * *" });

    expect(result.valid).toBe(false);
    expect(result.errors[0]?.type).toBe("field-count");
  });
});
