import type { MetadataRoute } from "next";
import { buildRobotsConfig } from "@/lib/seo/build-robots-config";
import { getSiteBaseUrl } from "@/lib/seo/site-config";

export default function robots(): MetadataRoute.Robots {
  const config = buildRobotsConfig(getSiteBaseUrl());

  return {
    rules: config.rules.map((rule) => ({
      userAgent: rule.userAgent,
      allow: rule.allow,
      disallow: rule.disallow
    })),
    sitemap: config.sitemapUrl,
    host: config.host
  };
}
