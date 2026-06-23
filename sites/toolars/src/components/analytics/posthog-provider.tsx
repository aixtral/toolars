"use client";

import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { useEffect, type ReactNode } from "react";

/**
 * PostHog analytics provider. Only initializes when NEXT_PUBLIC_POSTHOG_KEY
 * is set — no-op in development and before analytics is configured.
 */
export function PostHogProviderWrapper({ children }: { children: ReactNode }) {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;
    posthog.init(key, {
      api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://app.posthog.com",
      loaded: () => {},
      capture_pageview: true,
      disable_session_recording: true,
      persistence: "localStorage+cookie"
    });
  }, []);

  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
