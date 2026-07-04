import { describe, expect, it } from "vitest";
import { convertUrlComponent } from "./url-encoder";

describe("convertUrlComponent", () => {
  it("encodes URL component text with special characters and stats", () => {
    const result = convertUrlComponent({
      input: "redirect=/tools?q=hello world&safe=true",
      mode: "encode"
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("redirect%3D%2Ftools%3Fq%3Dhello%20world%26safe%3Dtrue");
    expect(result.stats.inputCharacters).toBe(39);
    expect(result.stats.outputCharacters).toBe(53);
    expect(result.summary).toContain("Encoded");
  });

  it("decodes percent-encoded URL component text", () => {
    const result = convertUrlComponent({
      input: "hello%20world%20%26%20a%3D1",
      mode: "decode"
    });

    expect(result.success).toBe(true);
    expect(result.output).toBe("hello world & a=1");
    expect(result.error).toBeUndefined();
    expect(result.summary).toContain("Decoded");
  });

  it("rejects invalid percent sequences with a stable error type", () => {
    const result = convertUrlComponent({
      input: "%E0%A4%A",
      mode: "decode"
    });

    expect(result.success).toBe(false);
    expect(result.output).toBe("");
    expect(result.error?.type).toBe("invalid-percent-sequence");
  });
});
