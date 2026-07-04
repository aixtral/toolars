import { describe, expect, it } from "vitest";
import { formatStructuredOutput } from "./structured-output-formatter";

describe("formatStructuredOutput", () => {
  it("extracts fenced JSON and reports required field coverage", () => {
    const result = formatStructuredOutput({
      rawOutput: "```json\n{\"title\":\"Roadmap\",\"score\":0.82}\n```",
      requiredFields: "title, score, confidence"
    });

    expect(result.success).toBe(true);
    expect(result.parsed).toMatchObject({ title: "Roadmap", score: 0.82 });
    expect(result.missingFields).toEqual(["confidence"]);
    expect(result.output).toContain('"score": 0.82');
    expect(result.warnings[0]).toMatch(/confidence/);
  });
});
