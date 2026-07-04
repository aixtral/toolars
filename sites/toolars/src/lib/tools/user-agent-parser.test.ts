import { describe, expect, it } from "vitest";
import { parseUserAgent } from "./user-agent-parser";

describe("parseUserAgent", () => {
  it("parses Chrome on Windows with browser, OS, device, and engine signals", () => {
    const ua =
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36";

    expect(parseUserAgent(ua)).toMatchObject({
      browser: { name: "Chrome", version: "125.0.0.0" },
      os: { name: "Windows", version: "10.0" },
      device: "desktop",
      engine: "Blink",
      raw: ua
    });
  });

  it("detects Safari on iPhone and Googlebot", () => {
    const safari =
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1";
    const bot = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";

    expect(parseUserAgent(safari)).toMatchObject({
      browser: { name: "Safari", version: "17.4" },
      os: { name: "iOS", version: "17.4" },
      device: "mobile",
      engine: "WebKit"
    });
    expect(parseUserAgent(bot)).toMatchObject({
      browser: { name: "Googlebot", version: "2.1" },
      device: "bot"
    });
  });

  it("returns unknown values for empty input", () => {
    expect(parseUserAgent("")).toMatchObject({
      browser: { name: "Unknown", version: "" },
      os: { name: "Unknown", version: "" },
      device: "unknown",
      engine: "Unknown"
    });
  });
});
