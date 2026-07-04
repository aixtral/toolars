import { describe, expect, it } from "vitest";
import { buildSyntheticDataset } from "./synthetic-dataset-gen";

describe("buildSyntheticDataset", () => {
  it("builds a deterministic synthetic dataset plan and sample rows", () => {
    const result = buildSyntheticDataset({
      topic: "B2B onboarding events",
      schema: "account_id:string\nactivation_score:number\nsegment:enum(smb|enterprise)",
      rows: 3
    });

    expect(result.records).toHaveLength(3);
    expect(result.records[0]).toMatchObject({ account_id: "account_id_1", activation_score: 10, segment: "smb" });
    expect(result.summary).toContain("3 synthetic rows");
    expect(result.reviewChecklist).toEqual(expect.arrayContaining(["Review synthetic fields before using them as eval fixtures."]));
  });
});
