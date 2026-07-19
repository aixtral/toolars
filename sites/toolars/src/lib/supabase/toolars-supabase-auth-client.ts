import { createToolarsSupabaseBrowserClient } from "./client";
import { isToolarsSupabaseConfigured } from "./toolars-supabase-config";

export type ToolarsSupabaseAuthMode = "sign-in" | "sign-up";
export type ToolarsSupabaseOAuthProvider = "github" | "google";

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

interface SupabaseOAuthResponse {
  data?: {
    provider?: string;
    url?: string | null;
  } | null;
  error?: {
    message?: string;
  } | null;
}

export interface ToolarsSupabaseBrowserAuthDriver {
  getSession?: () => Promise<SupabaseAuthResponse>;
  getUser: () => Promise<SupabaseAuthResponse>;
  onAuthStateChange?: (callback: (event: string, session: unknown) => void) => {
    data?: { subscription?: { unsubscribe?: () => void } | null } | null;
  };
  signInWithOAuth?: (credentials: {
    options?: {
      redirectTo?: string;
    };
    provider: ToolarsSupabaseOAuthProvider;
  }) => Promise<SupabaseOAuthResponse>;
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

export type ToolarsSupabaseOAuthResult =
  | {
      ok: true;
      provider: ToolarsSupabaseOAuthProvider;
    }
  | {
      errorCode: "not-configured" | "provider-error";
      message?: string;
      ok: false;
    };

let browserAuthDriverForTest: ToolarsSupabaseBrowserAuthDriver | null = null;

export function setToolarsSupabaseBrowserAuthDriverForTest(driver: ToolarsSupabaseBrowserAuthDriver | null) {
  browserAuthDriverForTest = driver;
}

export async function startToolarsSupabaseOAuth({
  provider,
  redirectTo
}: {
  provider: ToolarsSupabaseOAuthProvider;
  redirectTo?: string;
}): Promise<ToolarsSupabaseOAuthResult> {
  const auth = getBrowserAuthDriver();
  if (!auth?.signInWithOAuth) return { errorCode: "not-configured", ok: false };

  const response = await safeAuthRequest(() =>
    auth.signInWithOAuth!({
      options: redirectTo ? { redirectTo } : undefined,
      provider
    })
  );

  if (!response || response.error || !response.data?.url) {
    return {
      errorCode: "provider-error",
      message: response?.error?.message,
      ok: false
    };
  }

  return { ok: true, provider };
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

/**
 * Header account display helper. Prefers getSession (storage-local, no
 * network) so the account chrome never blanks on transient network or
 * token-refresh races the way the getUser network round-trip can; falls back
 * to getUser for drivers that do not implement getSession.
 */
export async function getToolarsSupabaseBrowserSessionUser() {
  const auth = getBrowserAuthDriver();
  if (!auth) return null;

  if (auth.getSession) {
    const response = await safeAuthRequest(() => auth.getSession!());
    const session = response?.data?.session as { user?: ToolarsSupabaseAuthUser | null } | null | undefined;
    const user = session?.user ?? response?.data?.user;
    if (response && !response.error && user?.id) {
      return {
        accountEmail: normalizeEmail(user.email) ?? null,
        accountId: user.id
      };
    }
    return null;
  }

  return getToolarsSupabaseBrowserUser();
}

/** Subscribe to real session lifecycle events; returns an unsubscribe function. */
export function subscribeToolarsAuthStateChange(listener: (event: string) => void) {
  const auth = getBrowserAuthDriver();
  if (!auth?.onAuthStateChange) return () => undefined;

  const result = auth.onAuthStateChange((event) => listener(event));
  const subscription = result?.data?.subscription;
  return () => subscription?.unsubscribe?.();
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

  // Creating a client per call makes every session check spin up a fresh
  // storage read and refresh cycle, which raced into transient signed-out
  // states; keep one client for the page lifetime instead.
  cachedBrowserAuthDriver ??= createToolarsSupabaseBrowserClient().auth;
  return cachedBrowserAuthDriver;
}

let cachedBrowserAuthDriver: ToolarsSupabaseBrowserAuthDriver | null = null;

function normalizeEmail(email?: string | null) {
  const normalized = email?.trim().toLowerCase();
  return normalized || null;
}
