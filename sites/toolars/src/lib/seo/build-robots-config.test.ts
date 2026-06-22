import { describe, expect, it } from "vitest";
import { buildRobotsConfig, type RobotsRule } from "./build-robots-config";

describe("buildRobotsConfig", () => {
  it("declares the sitemap url using the provided base url", () => {
    const config = buildRobotsConfig("https://toolars.app");
    expect(config.sitemapUrl).toBe("https://toolars.app/sitemap.xml");
    expect(config.host).toBe("https://toolars.app");
  });

  it("allows major search engine crawlers by default", () => {
    const config = buildRobotsConfig("https://toolars.app");
    const agents = config.rules.map((rule) => rule.userAgent);

    expect(agents).toContain("*");
  });

  it("explicitly allows AI crawlers so the site is discoverable for GEO", () => {
    const config = buildRobotsConfig("https://toolars.app");
    const aiAgents = ["GPTBot", "ClaudeBot", "Google-Extended", "PerplexityBot", "CCBot"];
    const allowedAgents = config.rules
      .filter((rule) => rule.allow !== undefined)
      .map((rule) => rule.userAgent);

    for (const agent of aiAgents) {
      expect(allowedAgents).toContain(agent);
    }
  });

  it("disallows private surfaces such as account, billing, and admin", () => {
    const config = buildRobotsConfig("https://toolars.app");
    const wildcard = config.rules.find((rule) => rule.userAgent === "*") as RobotsRule;
    const disallowed = wildcard.disallow ?? [];

    expect(disallowed).toContain("/my-tools");
    expect(disallowed).toContain("/settings");
    expect(disallowed).toContain("/admin");
    expect(disallowed).toContain("/api/");
  });

  it("does not disallow public tool or explore paths on the wildcard rule", () => {
    const config = buildRobotsConfig("https://toolars.app");
    const wildcard = config.rules.find((rule) => rule.userAgent === "*") as RobotsRule;
    const disallowed = wildcard.disallow ?? [];

    expect(disallowed).not.toContain("/tools");
    expect(disallowed).not.toContain("/explore");
  });
});
