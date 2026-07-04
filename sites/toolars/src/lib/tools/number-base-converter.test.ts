import { describe, expect, it } from "vitest";
import { convertBase, convertNumberBase, getUnicodeChar, isValidForBase } from "./number-base-converter";

describe("convertBase", () => {
  it("converts between binary, decimal, octal, and hexadecimal", () => {
    expect(convertBase("255", 10, 16)).toBe("FF");
    expect(convertBase("11111111", 2, 10)).toBe("255");
    expect(convertBase("64", 10, 8)).toBe("100");
  });

  it("uses exact BigInt conversion for large values", () => {
    expect(convertBase("18446744073709551615", 10, 16)).toBe("FFFFFFFFFFFFFFFF");
  });

  it("rejects invalid digits for the selected source base", () => {
    expect(() => convertBase("102", 2, 10)).toThrow("Invalid number");
    expect(isValidForBase("A0Ff", 16)).toBe(true);
    expect(isValidForBase("89", 8)).toBe(false);
  });
});

describe("convertNumberBase", () => {
  it("returns all supported base outputs and printable Unicode preview", () => {
    const result = convertNumberBase({ value: "65", fromBase: 10 });

    expect(result.success).toBe(true);
    expect(result.outputs).toMatchObject({
      binary: "1000001",
      octal: "101",
      decimal: "65",
      hexadecimal: "41"
    });
    expect(result.unicodeCharacter).toBe("A");
  });

  it("returns a typed validation error for bad input", () => {
    const result = convertNumberBase({ value: "G", fromBase: 16 });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("invalid-number");
  });
});

describe("getUnicodeChar", () => {
  it("returns null for control characters and valid characters for printable code points", () => {
    expect(getUnicodeChar("0")).toBeNull();
    expect(getUnicodeChar("128512")).toBe("\u{1F600}");
  });
});
