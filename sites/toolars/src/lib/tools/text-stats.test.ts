import { describe, expect, it } from "vitest";
import { analyzeText } from "./text-stats";

describe("analyzeText", () => {
  it("counts text structure and estimates reading and speaking time", () => {
    const input = "Hello world! Hello Toolars.\n\nShip fast, review carefully.";
    const result = analyzeText(input);

    expect(result.success).toBe(true);
    expect(result.stats).toMatchObject({
      characters: input.length,
      charactersNoSpaces: input.replace(/\s/g, "").length,
      words: 8,
      sentences: 3,
      paragraphs: 2,
      lines: 3,
      readingTime: "2 sec",
      speakingTime: "4 sec"
    });
    expect(result.topWords[0]).toEqual({ word: "hello", count: 2 });
    expect(result.topWords.map((item) => item.word)).toEqual(
      expect.arrayContaining(["toolars", "review", "carefully"])
    );
  });

  it("returns zeroed local stats for empty input", () => {
    const result = analyzeText("   \n  ");

    expect(result.success).toBe(true);
    expect(result.stats).toEqual({
      characters: 0,
      charactersNoSpaces: 0,
      words: 0,
      sentences: 0,
      paragraphs: 0,
      lines: 0,
      readingTime: "0 sec",
      speakingTime: "0 sec"
    });
    expect(result.topWords).toEqual([]);
  });
});
