import { describe, expect, it } from "vitest";
import { scanPii } from "./pii-scanner";

describe("scanPii", () => {
  it("detects and redacts common PII locally", () => {
    const result = scanPii("Contact Dr. Jane Smith at jane@example.com, (415) 555-1212, SSN 123-45-6789.");

    expect(result.entities.map((entity) => entity.type)).toEqual(expect.arrayContaining(["name", "email", "phone", "ssn"]));
    expect(result.redacted).toContain("[REDACTED_EMAIL]");
    expect(result.redacted).toContain("[REDACTED_PHONE]");
    expect(result.redacted).toContain("[REDACTED_SSN]");
    expect(result.score).toBeGreaterThan(50);
    expect(result.riskLevel).toMatch(/medium|high|critical/);
    expect(result.privacyNote).toBe("Local PII scan only; source text stays in the browser.");
  });

  it("returns a safe report when no PII-like patterns are present", () => {
    const result = scanPii("Summarize the public launch checklist into three bullets.");

    expect(result.entities).toEqual([]);
    expect(result.riskLevel).toBe("low");
    expect(result.redacted).toBe("Summarize the public launch checklist into three bullets.");
  });
});
