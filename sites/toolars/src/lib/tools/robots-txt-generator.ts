export interface RobotsRule {
  userAgent: string;
  allow: string[];
  disallow: string[];
}

export interface RobotsTxtInput {
  rules: RobotsRule[];
  sitemap: string;
  crawlDelay?: number;
}

export interface RobotsTxtResult {
  text: string;
  ruleCount: number;
  warnings: string[];
}

export function generateRobotsTxt(input: RobotsTxtInput): RobotsTxtResult {
  const blocks = input.rules.map((rule) => {
    const lines = [
      `User-agent: ${rule.userAgent.trim() || "*"}`,
      ...rule.allow.filter(Boolean).map((path) => `Allow: ${normalizePath(path)}`),
      ...rule.disallow.filter(Boolean).map((path) => `Disallow: ${normalizePath(path)}`),
      ...(input.crawlDelay && input.crawlDelay > 0 ? [`Crawl-delay: ${Math.round(input.crawlDelay)}`] : [])
    ];
    return lines.join("\n");
  });
  const sitemap = input.sitemap.trim();
  const text = [...blocks, ...(sitemap ? [`Sitemap: ${sitemap}`] : [])].join("\n\n");

  return {
    text,
    ruleCount: input.rules.length,
    warnings: [
      ...(input.rules.some((rule) => rule.disallow.includes("/")) ? ["Disallowing / blocks the whole site for that user agent."] : []),
      ...(sitemap && !sitemap.startsWith("https://") ? ["Use an absolute HTTPS sitemap URL for production."] : [])
    ]
  };
}

function normalizePath(path: string): string {
  const trimmed = path.trim();
  if (!trimmed) return "/";
  return trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
}
