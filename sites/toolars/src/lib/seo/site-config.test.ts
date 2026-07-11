import { afterEach, describe, expect, it } from "vitest";
import { getSiteBaseUrl, getSiteUrl } from "./site-config";

describe("site-config", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
  });

  it("returns the configured NEXT_PUBLIC_SITE_URL as the base", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://toolars.app";
    expect(getSiteBaseUrl()).toBe("https://toolars.app");
  });

  it("falls back to localhost dev origin when no site url is configured", () => {
    delete process.env.NEXT_PUBLIC_SITE_URL;
    expect(getSiteBaseUrl()).toBe("http://localhost:9088");
  });

  it("strips trailing slashes from the configured base", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://toolars.app/";
    expect(getSiteBaseUrl()).toBe("https://toolars.app");
  });

  it("joins a relative path onto the base url without duplicate slashes", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://toolars.app";
    expect(getSiteUrl("/tools/bmi-calculator")).toBe("https://toolars.app/tools/bmi-calculator");
  });

  it("ensures the path begins with a leading slash", () => {
    process.env.NEXT_PUBLIC_SITE_URL = "https://toolars.app";
    expect(getSiteUrl("tools/bmi-calculator")).toBe("https://toolars.app/tools/bmi-calculator");
  });
});
