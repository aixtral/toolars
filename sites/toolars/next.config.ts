import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import { withSentryConfig } from "@sentry/nextjs";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");
const nextDeploymentRoot = __dirname;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  outputFileTracingRoot: nextDeploymentRoot,
  turbopack: {
    root: nextDeploymentRoot
  },
  // Performance: enable image optimization for dynamic OG images and user content
  images: {
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400
  },
  // Security headers applied to all responses
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" }
        ]
      },
      {
        source: "/sitemap.xml",
        headers: [
          { key: "Content-Type", value: "application/xml; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }
        ]
      },
      {
        source: "/robots.txt",
        headers: [
          { key: "Content-Type", value: "text/plain; charset=utf-8" },
          { key: "Cache-Control", value: "public, max-age=3600, s-maxage=86400" }
        ]
      }
    ];
  }
};

// Sentry is a no-op when SENTRY_DSN is not set, so this is safe in all environments.
const sentryConfig = withSentryConfig(nextConfig, {
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  silent: true
});

export default withNextIntl(sentryConfig);
