import { describe, expect, it } from "vitest";
import { searchUnicodeCharacters } from "./unicode-search";

describe("searchUnicodeCharacters", () => {
  it("finds Unicode characters by name and returns copy metadata", () => {
    const result = searchUnicodeCharacters({ query: "copyright" });

    expect(result.matches[0]).toMatchObject({
      char: "\u00A9",
      name: "Copyright Sign",
      codePoint: "U+00A9",
      htmlEntity: "&#169;"
    });
    expect(result.summary).toContain("1 character");
  });

  it("finds characters by code point", () => {
    const result = searchUnicodeCharacters({ query: "U+03A9" });

    expect(result.matches[0]?.name).toContain("Omega");
  });
});
