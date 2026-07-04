import { describe, expect, it } from "vitest";
import { generateSyntheticDataset } from "./synthetic-dataset-generator";

describe("generateSyntheticDataset", () => {
  it("generates local fixture rows with JSONL export for AI workflow tests", () => {
    const result = generateSyntheticDataset({
      scenario: "Support classifier evals",
      fields: "ticket:string\nlabel:enum(billing|bug)",
      count: 2
    });

    expect(result.records).toEqual([
      { ticket: "ticket_1", label: "billing" },
      { ticket: "ticket_2", label: "bug" }
    ]);
    expect(result.jsonl.split("\n")).toHaveLength(2);
    expect(result.privacyNote).toMatch(/local/i);
  });
});
