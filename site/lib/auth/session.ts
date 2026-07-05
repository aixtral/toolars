import { createClient } from '@/lib/supabase/server';
import type { PlanId } from '@/lib/plans';

/**
 * Authenticated session shape consumed by Server Components, Route Handlers,
 * and the auth guard in proxy.ts. `planId` is pinned to 'pro' for v1 because
 * the paywall is disabled (see lib/plans). Phase-two billing can derive this
 * from a subscriptions table.
 */
export interface ToolarsSession {
  userId: string;
  email: string;
  planId: PlanId;
  isAuthenticated: true;
}

const V1_DEFAULT_PLAN: PlanId = 'pro';

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

/**
 * Returns the current session from the Supabase server client, or null when the
 * visitor is anonymous (or when Supabase env vars aren't configured yet, so the
 * public site keeps working during checkout/CI). Use this in Server Components
 * and Route Handlers.
 */
export async function getSession(): Promise<ToolarsSession | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return {
    userId: user.id,
    email: user.email ?? '',
    planId: V1_DEFAULT_PLAN,
    isAuthenticated: true,
  };
}
