import { afterEach, describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/api/system/production-health", () => {
  const originalEnv = {
    accountStorePath: process.env.TOOLARS_ACCOUNT_STORE_PATH,
    aiConsentLedgerPath: process.env.TOOLARS_AI_CONSENT_LEDGER_PATH,
    aiProviderApiKey: process.env.TOOLARS_AI_PROVIDER_API_KEY,
    aiProviderEndpoint: process.env.TOOLARS_AI_PROVIDER_ENDPOINT,
    authSessionLedgerPath: process.env.TOOLARS_AUTH_SESSION_LEDGER_PATH,
    authSessionSecret: process.env.TOOLARS_AUTH_SESSION_SECRET,
    billingProviderApiKey: process.env.TOOLARS_BILLING_PROVIDER_API_KEY,
    billingProviderEndpoint: process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT,
    dataDir: process.env.TOOLARS_DATA_DIR,
    googleClientId: process.env.GOOGLE_OAUTH_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
    objectEncryptionKey: process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY,
    pdfObjectRoot: process.env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT,
    pdfTempStorePath: process.env.TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH,
    uploadHandoffSecret: process.env.TOOLARS_UPLOAD_HANDOFF_SECRET
  };

  afterEach(() => {
    process.env.TOOLARS_ACCOUNT_STORE_PATH = originalEnv.accountStorePath;
    process.env.TOOLARS_AI_CONSENT_LEDGER_PATH = originalEnv.aiConsentLedgerPath;
    process.env.TOOLARS_AI_PROVIDER_API_KEY = originalEnv.aiProviderApiKey;
    process.env.TOOLARS_AI_PROVIDER_ENDPOINT = originalEnv.aiProviderEndpoint;
    process.env.TOOLARS_AUTH_SESSION_LEDGER_PATH = originalEnv.authSessionLedgerPath;
    process.env.TOOLARS_AUTH_SESSION_SECRET = originalEnv.authSessionSecret;
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = originalEnv.billingProviderApiKey;
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = originalEnv.billingProviderEndpoint;
    process.env.TOOLARS_DATA_DIR = originalEnv.dataDir;
    process.env.GOOGLE_OAUTH_CLIENT_ID = originalEnv.googleClientId;
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = originalEnv.googleClientSecret;
    process.env.TOOLARS_OBJECT_STORAGE_ENCRYPTION_KEY = originalEnv.objectEncryptionKey;
    process.env.TOOLARS_PDF_UPLOAD_OBJECT_ROOT = originalEnv.pdfObjectRoot;
    process.env.TOOLARS_PDF_UPLOAD_TEMP_STORE_PATH = originalEnv.pdfTempStorePath;
    process.env.TOOLARS_UPLOAD_HANDOFF_SECRET = originalEnv.uploadHandoffSecret;
  });

  it("reports production readiness without exposing secret values", async () => {
    process.env.TOOLARS_DATA_DIR = "/var/toolars/data";
    process.env.TOOLARS_AUTH_SESSION_SECRET = "super-secret-session-value";
    process.env.GOOGLE_OAUTH_CLIENT_ID = "google-client-id";
    process.env.GOOGLE_OAUTH_CLIENT_SECRET = "google-client-secret";
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
        googleOAuth: "configured",
        sessionSecret: "configured"
      },
      persistence: {
        accountStore: "configured",
        aiConsentLedger: "configured",
        authSessionLedger: "configured",
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
});
