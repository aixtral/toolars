import { describe, expect, it } from "vitest";
import { buildRagChunkPreview } from "./rag-chunk-visualizer";

describe("buildRagChunkPreview", () => {
  it("splits document text into overlapping local RAG chunks", () => {
    const result = buildRagChunkPreview({
      text: "Intro paragraph explains refunds. Eligibility section covers annual plans. Support escalation notes mention evidence. Closing section lists next actions.",
      chunkTokens: 8,
      overlapTokens: 2
    });

    expect(result.chunks.length).toBeGreaterThan(1);
    expect(result.chunks[0]).toMatchObject({ index: 1, estimatedTokens: 8 });
    expect(result.chunks[1].overlapTokens).toBe(2);
    expect(result.totalEstimatedTokens).toBeGreaterThan(0);
    expect(result.summary).toContain("chunks");
    expect(result.privacyNote).toBe("Local chunk preview only; document text stays in the browser.");
  });

  it("clamps overlap below the chunk size", () => {
    const result = buildRagChunkPreview({
      text: "one two three four five six seven eight nine ten",
      chunkTokens: 4,
      overlapTokens: 10
    });

    expect(result.settings.overlapTokens).toBe(3);
  });
});
