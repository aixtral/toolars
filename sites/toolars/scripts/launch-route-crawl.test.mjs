import { describe, expect, it } from "vitest";
import {
  createRouteCrawlTargets,
  crawlRouteTargets,
  extractSitemapUrls
} from "./launch-route-crawl.mjs";

describe("launch route crawl", () => {
  it("extracts sitemap loc and hreflang href URLs", () => {
    const xml = `<?xml version="1.0"?>
      <urlset>
        <url>
          <loc>https://toolars.com/tools/json-repair</loc>
          <xhtml:link rel="alternate" hreflang="es" href="https://toolars.com/es/tools/json-repair" />
        </url>
      </urlset>`;

    expect(extractSitemapUrls(xml)).toEqual([
      "https://toolars.com/tools/json-repair",
      "https://toolars.com/es/tools/json-repair"
    ]);
  });

  it("rewrites launch sitemap routes to the local base URL and excludes draft locales", () => {
    const xml = `
      <loc>https://toolars.com/tools/json-repair</loc>
      <loc>https://toolars.com/es/tools/json-repair</loc>
      <loc>https://toolars.com/zh-hans/blog/pdf-workflows</loc>
      <loc>https://toolars.com/fr/tools/json-repair</loc>
    `;

    expect(createRouteCrawlTargets(xml, { baseUrl: "http://127.0.0.1:9088" })).toEqual([
      "http://127.0.0.1:9088/tools/json-repair",
      "http://127.0.0.1:9088/es/tools/json-repair",
      "http://127.0.0.1:9088/zh-hans/blog/pdf-workflows"
    ]);
  });

  it("fails targets that return non-2xx or application error content", async () => {
    const report = await crawlRouteTargets(["http://local/ok", "http://local/missing", "http://local/error"], {
      fetcher: async (url) => ({
        ok: url.endsWith("/ok"),
        status: url.endsWith("/missing") ? 404 : 200,
        text: async () =>
          url.endsWith("/error")
            ? "Application error"
            : "<main>Ready launch route with enough meaningful page content.</main>"
      })
    });

    expect(report.status).toBe("fail");
    expect(report.summary).toEqual({ total: 3, passed: 1, failed: 2 });
    expect(report.results.map((result) => result.ok)).toEqual([true, false, false]);
  });
});
