import { join } from "node:path";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

type RuntimeEnv = Partial<Record<string, string | undefined>>;
type RuntimeStatus = "configured" | "fallback" | "legacy-disabled" | "missing";

// Retained for one-way reads of legacy records only. New runtime writes use Supabase.
export const TOOLARS_RUNTIME_FILES = {
  accountStore: "toolars-account-store.json",
  aiConsentLedger: "toolars-ai-consent-audit-ledger.json",
  authSessionLedger: "toolars-auth-session-ledger.json"
} as const;

export function getToolarsRuntimeFilePath({
  env = readToolarsRuntimeEnv(),
  envKey,
  fallbackPath,
  fileName
}: {
  env?: RuntimeEnv;
  envKey: string;
  fallbackPath: string;
  fileName: string;
}) {
  const explicitPath = normalizeRuntimeValue(env[envKey]);
  if (explicitPath) return explicitPath;

  const dataRoot = normalizeRuntimeValue(env.TOOLARS_DATA_DIR);
  if (dataRoot) return join(/*turbopackIgnore: true*/ dataRoot, fileName);
  return fallbackPath;
}

export function getToolarsProductionRuntimeStatus(env = readToolarsRuntimeEnv()) {
  const status = {
    auth: {
      supabase: getSupabasePublicStatus(env),
      supabaseSecret: getSupabaseSecretStatus(env)
    },
    missing: [] as string[],
    mode: {
      freeTrial: isFreeTrialMode(env)
    },
    persistence: {
      aiConsentAudit: "supabase",
      pdfUploads: "supabase-private-storage"
    },
    providers: {
      aiProvider: getGroupedSecretStatus(env.TOOLARS_AI_PROVIDER_ENDPOINT, env.TOOLARS_AI_PROVIDER_API_KEY),
      billingProvider: getGroupedSecretStatus(env.TOOLARS_BILLING_PROVIDER_ENDPOINT, env.TOOLARS_BILLING_PROVIDER_API_KEY)
    },
    version: 1 as const
  };

  if (status.auth.supabase === "missing") {
    status.missing.push("NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
  }
  if (status.providers.aiProvider === "missing") status.missing.push("TOOLARS_AI_PROVIDER_ENDPOINT/TOOLARS_AI_PROVIDER_API_KEY");
  if (status.providers.billingProvider === "missing" && !status.mode.freeTrial) {
    status.missing.push("TOOLARS_BILLING_PROVIDER_ENDPOINT/TOOLARS_BILLING_PROVIDER_API_KEY");
  }

  return status;
}

function readToolarsRuntimeEnv(): RuntimeEnv {
  if (typeof process === "undefined") return {};
  return process.env;
}

function getSupabasePublicStatus(env: RuntimeEnv): RuntimeStatus {
  const hasUrl = hasRuntimeValue(env.NEXT_PUBLIC_SUPABASE_URL);
  const hasPublicKey =
    hasRuntimeValue(env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY) || hasRuntimeValue(env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

  return hasUrl && hasPublicKey ? "configured" : "missing";
}

function getSupabaseSecretStatus(env: RuntimeEnv): RuntimeStatus {
  return hasRuntimeValue(env.SUPABASE_SECRET_KEY) || hasRuntimeValue(env.SUPABASE_SERVICE_ROLE_KEY)
    ? "configured"
    : "fallback";
}

function getGroupedSecretStatus(...values: Array<string | undefined>): RuntimeStatus {
  return values.every(hasRuntimeValue) ? "configured" : "missing";
}

function hasRuntimeValue(value: string | undefined) {
  return Boolean(normalizeRuntimeValue(value));
}

function normalizeRuntimeValue(value: string | undefined) {
  const trimmed = value?.trim();
  if (!trimmed || trimmed === "undefined" || trimmed === "null") return null;
  return trimmed;
}
