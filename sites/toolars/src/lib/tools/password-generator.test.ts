import { describe, expect, it } from "vitest";
import { generatePassword, type PasswordOptions } from "./password-generator";

const strongOptions: PasswordOptions = {
  length: 20,
  uppercase: true,
  lowercase: true,
  numbers: true,
  symbols: true,
  excludeAmbiguous: true
};

describe("password-generator core logic", () => {
  it("generates a local password with requested length and strength metadata", () => {
    const result = generatePassword(strongOptions);

    expect(result.success).toBe(true);
    expect(result.password).toHaveLength(20);
    expect(result.password).not.toMatch(/[Il1O0]/);
    expect(result.strengthScore).toBeGreaterThan(0);
    expect(["weak", "fair", "good", "strong"]).toContain(result.strength);
  });

  it("rejects invalid generation rules before producing output", () => {
    const result = generatePassword({ ...strongOptions, length: 3 });

    expect(result.success).toBe(false);
    expect(result.password).toBe("");
    expect(result.error?.type).toBe("invalid-length");
  });
});
