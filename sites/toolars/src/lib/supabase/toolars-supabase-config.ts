export interface ToolarsSupabasePublicConfig {
  isConfigured: boolean;
  publishableKey: string | null;
  url: string | null;
}

type SupabaseEnv = Record<string, string | undefined>;

const inlineToolarsSupabasePublicEnv = {
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
} satisfies SupabaseEnv;

export function getToolarsSupabasePublicConfig(env: SupabaseEnv = inlineToolarsSupabasePublicEnv): ToolarsSupabasePublicConfig {
  const url = normalizeEnvValue(env.NEXT_PUBLIC_SUPABASE_URL)?.replace(/\/+$/, "") ?? null;
  const publishableKey =
    normalizeEnvValue(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) ??
    normalizeEnvValue(env.NEXT_PUBLIC_SUPABASE_ANON_KEY) ??
    null;

  return {
    isConfigured: Boolean(url && publishableKey),
    publishableKey,
    url
  };
}

export function requireToolarsSupabasePublicConfig(env: SupabaseEnv = inlineToolarsSupabasePublicEnv): ToolarsSupabasePublicConfig {
  const config = getToolarsSupabasePublicConfig(env);
  if (config.isConfigured) return config;

  const missingKeys = [
    config.url ? null : "NEXT_PUBLIC_SUPABASE_URL",
    config.publishableKey ? null : "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"
  ].filter(Boolean);

  throw new Error(`Toolars Supabase is not configured. Missing: ${missingKeys.join(", ")}`);
}

export function isToolarsSupabaseConfigured(env: SupabaseEnv = inlineToolarsSupabasePublicEnv) {
  return getToolarsSupabasePublicConfig(env).isConfigured;
}

export function getToolarsSupabaseSecretKey(env: SupabaseEnv = getProcessEnv()) {
  return normalizeEnvValue(env.SUPABASE_SECRET_KEY) ?? normalizeEnvValue(env.SUPABASE_SERVICE_ROLE_KEY) ?? null;
}

function normalizeEnvValue(value: string | undefined) {
  const normalized = value?.trim();
  return normalized || undefined;
}

function getProcessEnv(): SupabaseEnv {
  if (typeof process === "undefined") return {};
  return process.env;
}
