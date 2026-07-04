import { describe, expect, it } from "vitest";
import { generateMetaTags } from "./meta-tag-generator";

describe("meta tag generator", () => {
  it("generates SEO, Open Graph, and Twitter card tags", () => {
    const result = generateMetaTags({
      title: "Toolars JSON Repair",
      description: "Repair JSON locally before it reaches production.",
      url: "https://toolars.app/tools/json-repair",
      image: "https://toolars.app/og/json-repair.png",
      siteName: "Toolars",
      twitterHandle: "@toolars"
    });

    expect(result.html).toContain("<title>Toolars JSON Repair</title>");
    expect(result.html).toContain('property="og:title"');
    expect(result.html).toContain('name="twitter:card" content="summary_large_image"');
    expect(result.tagCount).toBeGreaterThanOrEqual(10);
  });
});
