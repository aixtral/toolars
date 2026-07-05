import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Server-side Supabase client for App Router Server Components, Route Handlers,
 * and Server Actions. Reads/writes the auth session cookie via next/headers.
 *
 * Uses the anon key (NOT the service_role key) so Row Level Security still
 * applies. The service_role key is reserved for trusted server-only admin work
 * and is intentionally not wired in here.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // The `setAll` method was called from a Server Component where
            // cookies can't be mutated. This is safe to ignore when middleware
            // refreshes the session; the next request will have the fresh cookie.
          }
        },
      },
    },
  );
}
