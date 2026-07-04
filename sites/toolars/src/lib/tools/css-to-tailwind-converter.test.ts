import { describe, expect, it } from "vitest";
import { convertCssToTailwind } from "./css-to-tailwind-converter";

describe("CSS to Tailwind converter", () => {
  it("maps common layout declarations to Tailwind utility classes", () => {
    const result = convertCssToTailwind(`
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem;
    `);

    expect(result.className).toBe("flex flex-col justify-center items-center gap-4 p-2");
    expect(result.matchedDeclarations).toHaveLength(6);
    expect(result.unmatchedDeclarations).toEqual([]);
  });
});
