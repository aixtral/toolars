import { describe, expect, it } from "vitest";
import { generateLoremIpsum } from "./lorem-ipsum";

describe("generateLoremIpsum", () => {
  it("generates configured paragraph copy with the classic opening", () => {
    const result = generateLoremIpsum({
      paragraphs: 2,
      wordsPerParagraph: 12,
      startWithLorem: true
    });

    expect(result.success).toBe(true);
    expect(result.text).toMatch(/^Lorem ipsum dolor sit amet/);
    expect(result.text.split("\n\n")).toHaveLength(2);
    expect(result.stats).toMatchObject({
      paragraphs: 2,
      words: 24
    });
    expect(result.summary).toContain("2 paragraphs");
  });

  it("generates local copy without the classic opening when disabled", () => {
    const result = generateLoremIpsum({
      paragraphs: 1,
      wordsPerParagraph: 8,
      startWithLorem: false
    });

    expect(result.success).toBe(true);
    expect(result.text).not.toMatch(/^Lorem ipsum/);
    expect(result.stats.words).toBe(8);
  });

  it("rejects values outside the Aixtral paragraph and word ranges", () => {
    expect(generateLoremIpsum({ paragraphs: 0, wordsPerParagraph: 20 }).error?.type).toBe("paragraph-range");
    expect(generateLoremIpsum({ paragraphs: 1, wordsPerParagraph: 501 }).error?.type).toBe("word-range");
  });
});
