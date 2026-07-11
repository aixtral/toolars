import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

import { requireToolarsSupabasePublicConfig } from "./toolars-supabase-config";

export async function createToolarsSupabaseServerClient() {
  const config = requireToolarsSupabasePublicConfig();
  const cookieStore = await cookies();

  return createServerClient(config.url!, config.publishableKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const cookie of cookiesToSet) {
            cookieStore.set(cookie.name, cookie.value, cookie.options);
          }
        } catch {
          // Server Components cannot write cookies; Server Actions and Route Handlers can.
        }
      }
    }
  });
}
