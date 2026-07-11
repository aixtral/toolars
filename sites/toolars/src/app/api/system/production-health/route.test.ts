import { afterEach, describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/api/system/production-health", () => {
  const originalEnv = {
    accountStorePath: process.env.TOOLARS_ACCOUNT_STORE_PATH,
    aiConsentLedgerPath: process.env.TOOLARS_AI_CONSENT_LEDGER_PATH,
    aiProviderApiKey: process.env.TOOLARS_AI_PROVIDER_API_KEY,
    aiProviderEndpoint: process.env.TOOLARS_AI_PROVIDER_ENDPOINT,
    authSessionLedgerPath: process.env.TOOLARS_AUTH_SESSION_LEDGER_PATH,
    authSessionPreviousSecret: process.env.TOOLARS_AUTH_SESSION_SECRET_PREVIOUS,
    authSessionSecret: process.env.TOOLARS_AUTH_SESSION_SECRET,
    billingProviderApiKey: process.env.TOOLARS_BILLING_PROVIDER_API_KEY,
    billingProviderEndpoint: process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT,
    dataDir: process.env.TOOLARS_DATA_DIR,
    googleClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    supabasePublishableKey: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    supabaseSecretKey: process.env.SUPABASE_SECRET_KEY,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    objectEncryptionKey: process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY,
    pdfObjectRoot: process.env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT,
    pdfTempStorePath: process.env.TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH,
    uploadHandoffSecret: process.env.TOOLARS_UPLOAD_HANDOFF_SECRET
  };

  afterEach(() => {
    restoreEnvValue("TOOLARS_ACCOUNT_STORE_PATH", originalEnv.accountStorePath);
    restoreEnvValue("TOOLARS_AI_CONSENT_LEDGER_PATH", originalEnv.aiConsentLedgerPath);
    restoreEnvValue("TOOLARS_AI_PROVIDER_API_KEY", originalEnv.aiProviderApiKey);
    restoreEnvValue("TOOLARS_AI_PROVIDER_ENDPOINT", originalEnv.aiProviderEndpoint);
    restoreEnvValue("TOOLARS_AUTH_SESSION_LEDGER_PATH", originalEnv.authSessionLedgerPath);
    restoreEnvValue("TOOLARS_AUTH_SESSION_SECRET_PREVIOUS", originalEnv.authSessionPreviousSecret);
    restoreEnvValue("TOOLARS_AUTH_SESSION_SECRET", originalEnv.authSessionSecret);
    restoreEnvValue("TOOLARS_BILLING_PROVIDER_API_KEY", originalEnv.billingProviderApiKey);
    restoreEnvValue("TOOLARS_BILLING_PROVIDER_ENDPOINT", originalEnv.billingProviderEndpoint);
    restoreEnvValue("TOOLARS_DATA_DIR", originalEnv.dataDir);
    restoreEnvValue("GOOGLE_OAUTH_CLIENT_ID", originalEnv.googleClientId);
    restoreEnvValue("GOOGLE_OAUTH_CLIENT_SECRET", originalEnv.googleClientSecret);
    restoreEnvValue("NEXT_PUBLIC_SUPABASE_ANON_KEY", originalEnv.supabaseAnonKey);
    restoreEnvValue("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", originalEnv.supabasePublishableKey);
    restoreEnvValue("SUPABASE_SECRET_KEY", originalEnv.supabaseSecretKey);
    restoreEnvValue("SUPABASE_SERVICE_ROLE_KEY", originalEnv.supabaseServiceRoleKey);
    restoreEnvValue("NEXT_PUBLIC_SUPABASE_URL", originalEnv.supabaseUrl);
    restoreEnvValue("TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY", originalEnv.objectEncryptionKey);
    restoreEnvValue("TOOLARS_PDF_UPLOAD_OBJECT_ROOT", originalEnv.pdfObjectRoot);
    restoreEnvValue("TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH", originalEnv.pdfTempStorePath);
    restoreEnvValue("TOOLARS_UPLOAD_HANDOFF_SECRET", originalEnv.uploadHandoffSecret);
  });

  it("reports production readiness without exposing secret values", async () => {
    process.env.TOOLARS_DATA_DIR = "/var/toolars/data";
    delete process.env.TOOLARS_AUTH_SESSION_SECRET;
    delete process.env.TOOLARS_AUTH_SESSION_SECRET_PREVIOUS;
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://toolars.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_value";
    process.env.SUPABASE_SECRET_KEY = "sb_secret_server_value";
    process.env.TOOLARS_AI_PROVIDER_ENDPOINT = "https://ai-provider.toolars.test";
    process.env.TOOLARS_AI_PROVIDER_API_KEY = "ai-provider-secret";
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = "https://billing-provider.toolars.test";
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = "billing-provider-secret";
    process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY = "object-encryption-secret";
    process.env.TOOLARS_UPLOAD_HANDOFF_SECRET = "handoff-secret";

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload).toMatchObject({
      auth: {
        legacyGoogleOAuth: "missing",
        legacySessionSecret: "fallback",
        legacySessionSecretRotation: "fallback",
        supabase: "configured",
        supabaseSecret: "configured"
      },
      persistence: {
        accountStore: "legacy-disabled",
        aiConsentLedger: "configured",
        authSessionLedger: "legacy-disabled",
        dataRoot: "configured",
        pdfObjectStorage: "configured",
        pdfUploadTempStore: "configured"
      },
      providers: {
        aiProvider: "configured",
        billingProvider: "configured",
        objectEncryptionKey: "configured",
        uploadHandoffSecret: "configured"
      },
      version: 1
    });
    expect(payload.missing).toEqual([]);
    expect(JSON.stringify(payload)).not.toContain("secret");
    expect(JSON.stringify(payload)).not.toContain("/var/toolars/data");
  });

  it("reports Supabase public config as the auth launch blocker", async () => {
    process.env.TOOLARS_DATA_DIR = "/var/toolars/data";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    delete process.env.TOOLARS_AUTH_SESSION_SECRET;
    delete process.env.GOOGLE_OAUTH_CLIENT_ID;
    delete process.env.GOOGLE_OAUTH_CLIENT_SECRET;
    process.env.TOOLARS_AI_PROVIDER_ENDPOINT = "https://ai-provider.toolars.test";
    process.env.TOOLARS_AI_PROVIDER_API_KEY = "ai-provider-secret";
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = "https://billing-provider.toolars.test";
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = "billing-provider-secret";

    const response = await GET();
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.auth).toMatchObject({
      legacyGoogleOAuth: "missing",
      legacySessionSecret: "fallback",
      supabase: "missing"
    });
    expect(payload.missing).toEqual(["NEXT_PUBLIC_SUPABASE_URL/NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"]);
  });
});

function restoreEnvValue(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
