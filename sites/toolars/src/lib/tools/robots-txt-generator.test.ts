import { describe, expect, it } from "vitest";
import { generateRobotsTxt } from "./robots-txt-generator";

describe("robots.txt generator", () => {
  it("generates crawler rules with sitemap and crawl delay", () => {
    const result = generateRobotsTxt({
      rules: [{ userAgent: "*", allow: ["/"], disallow: ["/admin", "/api/private"] }],
      sitemap: "https://toolars.app/sitemap.xml",
      crawlDelay: 10
    });

    expect(result.text).toContain("User-agent: *");
    expect(result.text).toContain("Allow: /");
    expect(result.text).toContain("Disallow: /admin");
    expect(result.text).toContain("Crawl-delay: 10");
    expect(result.text).toContain("Sitemap: https://toolars.app/sitemap.xml");
  });
});
