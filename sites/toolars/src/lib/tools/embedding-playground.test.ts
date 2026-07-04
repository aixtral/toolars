import { describe, expect, it } from "vitest";
import { compareEmbeddingChunks } from "./embedding-playground";

describe("compareEmbeddingChunks", () => {
  it("ranks candidate chunks with local lexical similarity", () => {
    const result = compareEmbeddingChunks({
      query: "refund policy for annual subscription",
      chunks: [
        "Pricing page explains monthly plan limits.",
        "Annual subscription refunds are available within 14 days.",
        "Security documentation explains SSO and audit logs."
      ]
    });

    expect(result.queryTokens).toEqual(expect.arrayContaining(["refund", "policy", "annual", "subscription"]));
    expect(result.rows[0]).toMatchObject({
      index: 2,
      text: "Annual subscription refunds are available within 14 days."
    });
    expect(result.rows[0].score).toBeGreaterThan(result.rows[1].score);
    expect(result.summary).toContain("Top match");
    expect(result.privacyNote).toBe("Local lexical similarity only; no embedding text leaves the browser.");
  });

  it("returns empty rankings for blank input", () => {
    const result = compareEmbeddingChunks({ query: "  ", chunks: ["one"] });

    expect(result.rows).toEqual([]);
    expect(result.summary).toBe("Add a query and candidate chunks to compare local similarity.");
  });
});
