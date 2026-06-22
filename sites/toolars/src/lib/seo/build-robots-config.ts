export interface RobotsRule {
  userAgent: string;
  allow?: string | string[];
  disallow?: string[];
}

export interface RobotsConfig {
  host: string;
  sitemapUrl: string;
  rules: RobotsRule[];
}

const PRIVATE_DISALLOWED_PATHS = [
  "/my-tools",
  "/settings",
  "/admin",
  "/api/"
];

/**
 * AI crawlers we explicitly allow so the site is discoverable in generative
 * search experiences (GEO). Each gets its own Allow:/ rule so providers that
 * require explicit opt-in can pick the site up.
 */
const AI_CRAWLER_AGENTS = ["GPTBot", "ClaudeBot", "Google-Extended", "PerplexityBot", "CCBot"];

/**
 * Build the robots.txt policy. Private account/billing/admin/api surfaces are
 * disallowed for the wildcard crawler; public tools and explore paths stay open.
 * AI crawlers are explicitly allowed to support generative search discovery.
 */
export function buildRobotsConfig(baseUrl: string): RobotsConfig {
  const host = baseUrl.replace(/\/+$/g, "");

  const rules: RobotsRule[] = [
    {
      userAgent: "*",
      allow: "/",
      disallow: PRIVATE_DISALLOWED_PATHS
    },
    ...AI_CRAWLER_AGENTS.map<RobotsRule>((userAgent) => ({
      userAgent,
      allow: "/"
    }))
  ];

  return {
    host,
    sitemapUrl: `${host}/sitemap.xml`,
    rules
  };
}
