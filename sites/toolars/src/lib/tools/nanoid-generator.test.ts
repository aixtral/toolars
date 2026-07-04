import { describe, expect, it } from "vitest";
import { generateNanoIds, nanoidPresets } from "./nanoid-generator";

describe("nanoid-generator core logic", () => {
  it("generates compact URL-safe IDs with entropy metadata", () => {
    const result = generateNanoIds({ length: 10, alphabet: nanoidPresets.urlSafe, quantity: 4 });

    expect(result.success).toBe(true);
    expect(result.ids).toHaveLength(4);
    expect(result.ids.every((id) => /^[A-Za-z0-9_-]{10}$/.test(id))).toBe(true);
    expect(result.stats.alphabetSize).toBe(nanoidPresets.urlSafe.length);
    expect(result.stats.entropyBits).toBeGreaterThan(50);
  });

  it("rejects empty alphabets and unsafe batch sizes", () => {
    expect(generateNanoIds({ length: 8, alphabet: "", quantity: 1 }).error?.type).toBe("empty-alphabet");
    expect(generateNanoIds({ length: 8, alphabet: "abc", quantity: 101 }).error?.type).toBe("invalid-quantity");
  });
});
