import type { ToolarsAuthContext } from "@/lib/auth/toolars-auth-context";
import { getToolarsSupabaseSessionPayload } from "@/lib/supabase/toolars-supabase-auth-server";

export class ToolarsAuthenticationError extends Error {
  code = "authentication-required" as const;

  constructor() {
    super("Authentication required");
    this.name = "ToolarsAuthenticationError";
  }
}

export type ToolarsAuthenticatedAuthContext = ToolarsAuthContext & {
  accountId: string;
  isAuthenticated: true;
};

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

export async function requireAuthenticatedUser(request?: Request | null): Promise<ToolarsAuthenticatedAuthContext> {
  const auth = await resolveToolarsApiAuthContext(request);
  if (!auth.isAuthenticated || !auth.accountId) throw new ToolarsAuthenticationError();
  return { ...auth, accountId: auth.accountId, isAuthenticated: true };
}

export function isToolarsAuthenticationError(error: unknown): error is ToolarsAuthenticationError {
  return error instanceof ToolarsAuthenticationError;
}
