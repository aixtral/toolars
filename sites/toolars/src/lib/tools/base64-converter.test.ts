import { describe, expect, it } from "vitest";
import { convertBase64Payload } from "./base64-converter";

describe("convertBase64Payload", () => {
  it("encodes UTF-8 text to standard Base64 with conversion stats", () => {
    const result = convertBase64Payload({
      alphabet: "standard",
      input: "Hello, 世界",
      mode: "encode"
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("SGVsbG8sIOS4lueVjA==");
    expect(result.stats.inputBytes).toBe(13);
    expect(result.stats.outputCharacters).toBe(20);
    expect(result.summary).toContain("13 bytes");
  });

  it("decodes URL-safe Base64 that is missing padding", () => {
    const result = convertBase64Payload({
      alphabet: "url-safe",
      input: "eyJyb2xlIjoiYWRtaW4ifQ",
      mode: "decode"
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe('{"role":"admin"}');
    expect(result.normalizedInput).toBe("eyJyb2xlIjoiYWRtaW4ifQ==");
    expect(result.warnings.map((warning) => warning.type)).toContain("padding-added");
  });

  it("rejects malformed Base64 with a specific error type", () => {
    const result = convertBase64Payload({
      alphabet: "standard",
      input: "not!valid@base64#",
      mode: "decode"
    });

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("invalid-base64");
    expect(result.output).toBe("");
  });
});
