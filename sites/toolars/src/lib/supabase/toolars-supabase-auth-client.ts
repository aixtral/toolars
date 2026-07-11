import { createToolarsSupabaseBrowserClient } from "./client";
import { isToolarsSupabaseConfigured } from "./toolars-supabase-config";

export type ToolarsSupabaseAuthMode = "sign-in" | "sign-up";

export interface ToolarsSupabaseAuthUser {
  email?: string | null;
  id: string;
}

interface SupabaseAuthResponse {
  data?: {
    session?: unknown | null;
    user?: ToolarsSupabaseAuthUser | null;
  } | null;
  error?: {
    message?: string;
  } | null;
}

export interface ToolarsSupabaseBrowserAuthDriver {
  getUser: () => Promise<SupabaseAuthResponse>;
  signInWithPassword: (credentials: { email: string; password: string }) => Promise<SupabaseAuthResponse>;
  signOut: () => Promise<{ error?: { message?: string } | null }>;
  signUp: (credentials: {
    email: string;
    options?: {
      emailRedirectTo?: string;
    };
    password: string;
  }) => Promise<SupabaseAuthResponse>;
}

export type ToolarsSupabaseAuthResult =
  | {
      accountEmail: string;
      accountId: string;
      needsEmailConfirmation: boolean;
      ok: true;
    }
  | {
      errorCode: "invalid-input" | "not-configured" | "provider-error";
      message?: string;
      ok: false;
    };

let browserAuthDriverForTest: ToolarsSupabaseBrowserAuthDriver | null = null;

export function setToolarsSupabaseBrowserAuthDriverForTest(driver: ToolarsSupabaseBrowserAuthDriver | null) {
  browserAuthDriverForTest = driver;
}

export async function submitToolarsSupabaseEmailAuth({
  email,
  emailRedirectTo,
  mode,
  password
}: {
  email: string;
  emailRedirectTo?: string;
  mode: ToolarsSupabaseAuthMode;
  password: string;
}): Promise<ToolarsSupabaseAuthResult> {
  const normalizedEmail = normalizeEmail(email);
  if (!normalizedEmail || !password) {
    return { errorCode: "invalid-input", ok: false };
  }

  const auth = getBrowserAuthDriver();
  if (!auth) return { errorCode: "not-configured", ok: false };

  const response = await safeAuthRequest(() =>
    mode === "sign-in"
      ? auth.signInWithPassword({ email: normalizedEmail, password })
      : auth.signUp({
          email: normalizedEmail,
          options: emailRedirectTo ? { emailRedirectTo } : undefined,
          password
        })
  );

  if (!response) return { errorCode: "provider-error", ok: false };

  if (response.error) {
    return {
      errorCode: "provider-error",
      message: response.error.message,
      ok: false
    };
  }

  const user = response.data?.user;
  if (!user?.id) {
    return { errorCode: "provider-error", ok: false };
  }

  return {
    accountEmail: normalizeEmail(user.email) ?? normalizedEmail,
    accountId: user.id,
    needsEmailConfirmation: mode === "sign-up" && !response.data?.session,
    ok: true
  };
}

export async function getToolarsSupabaseBrowserUser() {
  const auth = getBrowserAuthDriver();
  if (!auth) return null;

  const response = await safeAuthRequest(() => auth.getUser());
  if (!response) return null;

  const user = response.data?.user;
  if (response.error || !user?.id) return null;

  return {
    accountEmail: normalizeEmail(user.email) ?? null,
    accountId: user.id
  };
}

export async function signOutToolarsSupabaseBrowserUser() {
  const auth = getBrowserAuthDriver();
  if (!auth) return { errorCode: "not-configured", ok: false as const };

  const response = await safeAuthRequest(() => auth.signOut());
  if (!response) return { errorCode: "provider-error", ok: false as const };

  if (response.error) {
    return {
      errorCode: "provider-error",
      message: response.error.message,
      ok: false as const
    };
  }

  return { ok: true as const };
}

async function safeAuthRequest<T>(request: () => Promise<T>): Promise<T | null> {
  try {
    return await request();
  } catch {
    return null;
  }
}

function getBrowserAuthDriver(): ToolarsSupabaseBrowserAuthDriver | null {
  if (browserAuthDriverForTest) return browserAuthDriverForTest;
  if (!isToolarsSupabaseConfigured()) return null;

  return createToolarsSupabaseBrowserClient().auth;
}

function normalizeEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}
