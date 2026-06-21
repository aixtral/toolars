import { join } from "node:path";
import { isFreeTrialMode } from "@/lib/product/free-trial-mode";

type RuntimeEnv = Partial<Record<string, string | undefined>>;
type RuntimeStatus = "configured" | "fallback" | "missing";

export const TOOLARS_RUNTIME_FILES = {
  accountStore: "toolars-account-store.json",
  aiConsentLedger: "toolars-ai-consent-audit-ledger.json",
  authSessionLedger: "toolars-auth-session-ledger.json",
  pdfObjectStorage: "toolars-pdf-upload-objects",
  pdfUploadTempStore: "toolars-pdf-upload-temp-store.json"
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

export function getToolarsPdfObjectRoot({
  env = readToolarsRuntimeEnv(),
  fallbackRoot
}: {
  env?: RuntimeEnv;
  fallbackRoot: string;
}) {
  const explicitRoot = normalizeRuntimeValue(env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT);
  if (explicitRoot) return explicitRoot;

  const dataRoot = normalizeRuntimeValue(env.TOOLARS_DATA_DIR);
  if (dataRoot) return join(/*turbopackIgnore: true*/ dataRoot, TOOLARS_RUNTIME_FILES.pdfObjectStorage);

  return fallbackRoot;
}

export function getToolarsProductionRuntimeStatus(env = readToolarsRuntimeEnv()) {
  const hasDataRoot = hasRuntimeValue(env.TOOLARS_DATA_DIR);
  const status = {
    auth: {
      googleOAuth: getGroupedSecretStatus(env.GOOGLE_OAUTH_CLIENT_ID, env.GOOGLE_OAUTH_CLIENT_SECRET),
      sessionSecret: hasRuntimeValue(env.TOOLARS_AUTH_SESSION_SECRET) ? "configured" : "missing"
    },
    missing: [] as string[],
    mode: {
      freeTrial: isFreeTrialMode(env)
    },
    persistence: {
      accountStore: getRuntimePathStatus(env.TOOLARS_ACCOUNT_STORE_PATH, hasDataRoot),
      aiConsentLedger: getRuntimePathStatus(env.TOOLARS_AI_CONSENT_LEDGER_PATH, hasDataRoot),
      authSessionLedger: getRuntimePathStatus(env.TOOLARS_AUTH_SESSION_LEDGER_PATH, hasDataRoot),
      dataRoot: hasDataRoot ? "configured" : "fallback",
      pdfObjectStorage: getRuntimePathStatus(env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT, hasDataRoot),
      pdfUploadTempStore: getRuntimePathStatus(env.TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH, hasDataRoot)
    },
    providers: {
      aiProvider: getGroupedSecretStatus(env.TOOLARS_AI_PROVIDER_ENDPOINT, env.TOOLARS_AI_PROVIDER_API_KEY),
      billingProvider: getGroupedSecretStatus(env.TOOLARS_BILLING_PROVIDER_ENDPOINT, env.TOOLARS_BILLING_PROVIDER_API_KEY),
      objectEncryptionKey: hasRuntimeValue(env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY) ? "configured" : "fallback",
      uploadHandoffSecret: hasRuntimeValue(env.TOOLARS_UPLOAD_HANDOFF_SECRET) ? "configured" : "fallback"
    },
    version: 1 as const
  };

  if (status.auth.googleOAuth === "missing") status.missing.push("GOOGLE_OAUTH_CLIENT_ID/GOOGLE_OAUTH_CLIENT_SECRET");
  if (status.auth.sessionSecret === "missing") status.missing.push("TOOLARS_AUTH_SESSION_SECRET");
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

function getRuntimePathStatus(pathValue: string | undefined, hasDataRoot: boolean): RuntimeStatus {
  if (hasRuntimeValue(pathValue) || hasDataRoot) return "configured";
  return "fallback";
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
