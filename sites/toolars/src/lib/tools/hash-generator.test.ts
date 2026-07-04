import { describe, expect, it } from "vitest";
import { generateHash, generateHashes } from "./hash-generator";

describe("hash-generator core logic", () => {
  it("generates source-compatible hashes for local text", async () => {
    const result = await generateHashes("hello");

    expect(result.success).toBe(true);
    expect(result.hashes.md5).toBe("5d41402abc4b2a76b9719d911017c592");
    expect(result.hashes.sha1).toBe("aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d");
    expect(result.hashes.sha256).toBe("2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824");
    expect(result.stats.inputLength).toBe(5);
  });

  it("generates a selected single digest", async () => {
    await expect(generateHash("test", "sha512")).resolves.toMatch(/^[0-9a-f]{128}$/);
  });
});
