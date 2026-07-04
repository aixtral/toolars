import { describe, expect, it } from "vitest";
import { applyCronPreset, buildCronExpression } from "./cron-builder";

describe("buildCronExpression", () => {
  it("builds a weekday cron expression from field controls", () => {
    const result = buildCronExpression({
      minute: "0",
      hour: "9",
      dayOfMonth: "*",
      month: "*",
      dayOfWeek: "1-5"
    });

    expect(result.valid).toBe(true);
    expect(result.expression).toBe("0 9 * * 1-5");
    expect(result.description).toContain("Monday through Friday");
    expect(result.fields).toHaveLength(5);
  });

  it("applies the hourly preset", () => {
    expect(applyCronPreset("hourly").expression).toBe("0 * * * *");
  });
});
