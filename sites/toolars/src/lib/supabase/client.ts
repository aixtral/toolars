import { createBrowserClient } from "@supabase/ssr";

import { requireToolarsSupabasePublicConfig } from "./toolars-supabase-config";

export function createToolarsSupabaseBrowserClient() {
  const config = requireToolarsSupabasePublicConfig();
  return createBrowserClient(config.url!, config.publishableKey!);
}
