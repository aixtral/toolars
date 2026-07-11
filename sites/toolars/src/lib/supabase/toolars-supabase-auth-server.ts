import { DEFAULT_TOOLARS_WORKSPACE_ID } from "@/lib/auth/toolars-auth-context";

import { createToolarsSupabaseServerClient } from "./server";
import { isToolarsSupabaseConfigured } from "./toolars-supabase-config";

interface SupabaseServerUser {
  email?: string | null;
  id: string;
}

interface SupabaseServerAuthResponse {
  data?: {
    user?: SupabaseServerUser | null;
  } | null;
  error?: {
    message?: string;
  } | null;
}

export interface ToolarsSupabaseServerAuthDriver {
  getUser: () => Promise<SupabaseServerAuthResponse>;
  signOut: () => Promise<{ error?: { message?: string } | null }>;
}

let serverAuthDriverForTest: ToolarsSupabaseServerAuthDriver | null = null;

export function setToolarsSupabaseServerAuthDriverForTest(driver: ToolarsSupabaseServerAuthDriver | null) {
  serverAuthDriverForTest = driver;
}

export async function getToolarsSupabaseSessionPayload(request: Request) {
  const workspaceId = normalizeWorkspaceId(request.headers.get("x-toolars-workspace-id"));
  const auth = await getServerAuthDriver();

  if (!auth) {
    return buildAnonymousPayload({
      isConfigured: false,
      workspaceId
    });
  }

  const response = await auth.getUser();
  const user = response.data?.user;
  if (response.error || !user?.id) {
    return buildAnonymousPayload({
      isConfigured: true,
      workspaceId
    });
  }

  const accountEmail = normalizeEmail(user.email);

  return {
    account: {
      accountEmail,
      accountId: user.id,
      source: "supabase",
      version: 1
    },
    auth: {
      accountEmail,
      accountId: user.id,
      isAuthenticated: true,
      source: "supabase",
      workspaceId
    },
    session: {
      accountEmail,
      accountId: user.id,
      provider: "supabase",
      status: "active"
    },
    supabase: {
      isConfigured: true
    }
  };
}

export async function signOutToolarsSupabaseSession() {
  const auth = await getServerAuthDriver();
  if (auth) {
    const response = await auth.signOut();
    if (response.error) {
      return {
        error: response.error.message,
        revokedSession: null
      };
    }
  }

  return {
    revokedSession: {
      provider: "supabase",
      status: "revoked"
    }
  };
}

async function getServerAuthDriver(): Promise<ToolarsSupabaseServerAuthDriver | null> {
  if (serverAuthDriverForTest) return serverAuthDriverForTest;
  if (!isToolarsSupabaseConfigured()) return null;

  return (await createToolarsSupabaseServerClient()).auth;
}

function buildAnonymousPayload({ isConfigured, workspaceId }: { isConfigured: boolean; workspaceId: string }) {
  return {
    account: null,
    auth: {
      accountEmail: null,
      accountId: null,
      isAuthenticated: false,
      source: "anonymous",
      workspaceId
    },
    session: null,
    supabase: {
      isConfigured
    }
  };
}

function normalizeWorkspaceId(workspaceId?: string | null) {
  const normalized = workspaceId?.trim().replace(/[^a-zA-Z0-9._:-]/g, "-").slice(0, 80);
  return normalized || DEFAULT_TOOLARS_WORKSPACE_ID;
}

function normalizeEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}
