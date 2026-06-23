import * as Sentry from "@sentry/nextjs";

/**
 * Sentry client-side initialization. Only active when SENTRY_DSN is set.
 * No-op in development or when DSN is missing.
 */
Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: Number(process.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ?? 0.1),
  environment: process.env.NODE_ENV,
  enabled: !!process.env.NEXT_PUBLIC_SENTRY_DSN,
  ignoreErrors: [
    "ResizeObserver loop limit exceeded",
    "Navigation cancelled"
  ]
});
