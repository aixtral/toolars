import { describe, expect, it } from "vitest";
import { decodeUrlComponent, encodeUrlComponent, parseUrl } from "./url-parser";

describe("parseUrl", () => {
  it("parses URL components and duplicate query pairs locally", () => {
    const result = parseUrl("https://example.com:8443/docs/path?q=hello%20world&q=again#top");

    expect(result.success).toBe(true);
    expect(result.output).toMatchObject({
      protocol: "https:",
      hostname: "example.com",
      port: "8443",
      pathname: "/docs/path",
      hash: "#top",
      origin: "https://example.com:8443"
    });
    expect(result.output?.params).toEqual({ q: "again" });
    expect(result.output?.queryPairs).toEqual([
      { key: "q", value: "hello world" },
      { key: "q", value: "again" }
    ]);
    expect(result.stats.inputLength).toBeGreaterThan(20);
  });

  it("returns a stable invalid URL error", () => {
    const result = parseUrl("not-a-url");

    expect(result.success).toBe(false);
    expect(result.error?.type).toBe("invalid-url");
    expect(result.output).toBeUndefined();
  });
});

describe("URL component helpers", () => {
  it("encodes and decodes URL components with stable stats", () => {
    const encoded = encodeUrlComponent("hello world & a=1");
    const decoded = decodeUrlComponent(encoded.output);

    expect(encoded).toMatchObject({
      success: true,
      output: "hello%20world%20%26%20a%3D1"
    });
    expect(decoded).toMatchObject({ success: true, output: "hello world & a=1" });
    expect(decoded.stats.outputLength).toBe(17);
  });

  it("rejects malformed encoded components", () => {
    const decoded = decodeUrlComponent("%E0%A4%A");

    expect(decoded.success).toBe(false);
    expect(decoded.error?.type).toBe("invalid-percent-sequence");
  });
});
