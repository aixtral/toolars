import type { ToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import { getToolarsSupabaseSessionPayload } from "@/lib/supabase/toolars-supabase-auth-server";

export async function resolveToolarsApiAuthContext(request?: Request | null): Promise<ToolarsAuthContext> {
  const payload = await getToolarsSupabaseSessionPayload(request ?? new Request("https://toolars.local/api"));

  return {
    accountEmail: payload.auth.accountEmail,
    accountId: payload.auth.accountId,
    isAuthenticated: payload.auth.isAuthenticated,
    source: payload.auth.source === "supabase" ? "supabase" : "anonymous",
    workspaceId: payload.auth.workspaceId
  };
}
