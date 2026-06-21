import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";
import { createToolarsAuthSessionCookie } from "@/lib/auth/toolars-auth-session";
import {
  persistToolarsAuthSession,
  resetToolarsAuthSessionLedger,
  setToolarsAuthSessionLedgerStoragePathForTest
} from "@/lib/auth/toolars-auth-session-ledger";
import { setToolarsBillingDriverForTest } from "@/lib/billing/billing-account";
import { GET } from "./route";

describe("/api/billing/account", () => {
  let tempDirectory: string | null = null;
  const originalEndpoint = process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT;
  const originalApiKey = process.env.TOOLARS_BILLING_PROVIDER_API_KEY;
  const originalSessionSecret = process.env.TOOLARS_AUTH_SESSION_SECRET;

  afterEach(() => {
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = originalEndpoint;
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = originalApiKey;
    process.env.TOOLARS_AUTH_SESSION_SECRET = originalSessionSecret;
    setToolarsAuthSessionLedgerStoragePathForTest(null);
    setToolarsBillingDriverForTest(null);
    vi.unstubAllGlobals();
    if (tempDirectory) {
      rmSync(tempDirectory, { force: true, recursive: true });
      tempDirectory = null;
    }
  });

  it("rejects anonymous billing requests", async () => {
    const response = await GET(new Request("http://toolars.test/api/billing/account"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Authentication required for billing account");
    expect(payload.auth.isAuthenticated).toBe(false);
  });

  it("returns billing account state for a preview authenticated account", async () => {
    setToolarsBillingDriverForTest({
      getAccount: (accountId) => ({
        accountId,
        billingEmail: "owner@example.com",
        customerPortalUrl: "https://billing.toolars.test/session/acct-preview-123",
        invoices: [],
        planId: "pro",
        planName: "Toolars Pro",
        source: "billing-driver",
        status: "active",
        usage: {
          aiCreditsLimit: 5000,
          aiCreditsUsed: 3250,
          periodEnd: "2026-06-30T23:59:59Z",
          periodStart: "2026-06-01T00:00:00Z",
          storageBytesLimit: 10_737_418_240,
          storageBytesUsed: 4_509_715_660
        },
        version: 1
      })
    });

    const response = await GET(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          "x-toolars-account-email": "owner@example.com",
          "x-toolars-account-id": "acct-preview-123",
          "x-toolars-workspace-id": "toolars_ws_preview"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.auth).toMatchObject({
      accountId: "acct-preview-123",
      isAuthenticated: true,
      source: "preview-header"
    });
    expect(payload.billing).toMatchObject({
      accountId: "acct-preview-123",
      planId: "pro",
      status: "active"
    });
  });

  it("reads customer, subscription, invoice, and portal data from the configured billing provider for a session account", async () => {
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = "https://billing-provider.toolars.test";
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = "provider-secret";
    process.env.TOOLARS_AUTH_SESSION_SECRET = "test-session-secret";
    prepareSessionLedger();
    const { cookie, session } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_session_owner",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: "test-session-secret",
      sessionId: "sess_billing"
    });
    persistToolarsAuthSession(session);
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        customer: {
          email: "billing@example.com",
          id: "cus_toolars_123"
        },
        invoices: [
          {
            currency: "USD",
            id: "inv_toolars_001",
            issuedAt: "2026-06-15T12:00:00Z",
            status: "paid",
            totalCents: 4900
          }
        ],
        portal: {
          url: "https://billing-provider.toolars.test/portal/cus_toolars_123"
        },
        subscription: {
          currentPeriodEnd: "2026-07-01T00:00:00Z",
          currentPeriodStart: "2026-06-01T00:00:00Z",
          planId: "pro",
          planName: "Toolars Pro",
          status: "active"
        },
        usage: {
          aiCreditsLimit: 5000,
          aiCreditsUsed: 1200,
          storageBytesLimit: 10_737_418_240,
          storageBytesUsed: 2_147_483_648
        }
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie,
          "x-toolars-workspace-id": "toolars_ws_billing_session"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith("https://billing-provider.toolars.test/accounts/acct_session_owner", {
      headers: {
        Authorization: "Bearer provider-secret",
        Accept: "application/json"
      }
    });
    expect(payload.auth).toMatchObject({
      accountId: "acct_session_owner",
      isAuthenticated: true,
      source: "session"
    });
    expect(payload.billing).toMatchObject({
      accountId: "acct_session_owner",
      billingEmail: "billing@example.com",
      customerPortalUrl: "https://billing-provider.toolars.test/portal/cus_toolars_123",
      planId: "pro",
      planName: "Toolars Pro",
      source: "billing-provider",
      status: "active"
    });
    expect(payload.billing.invoices).toEqual([
      {
        amountCents: 4900,
        currency: "USD",
        invoiceId: "inv_toolars_001",
        issuedAt: "2026-06-15T12:00:00Z",
        status: "paid"
      }
    ]);
    expect(payload.billing.usage.aiCreditsUsed).toBe(1200);
  });

  it("returns a provider error instead of falling back to preview billing when the configured billing provider fails", async () => {
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = "https://billing-provider.toolars.test";
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = "provider-secret";
    process.env.TOOLARS_AUTH_SESSION_SECRET = "test-session-secret";
    prepareSessionLedger();
    const { cookie, session } = createToolarsAuthSessionCookie({
      accountEmail: "owner@example.com",
      accountId: "acct_session_owner",
      expiresAt: "2026-06-21T10:30:00Z",
      issuedAt: "2026-06-21T09:30:00Z",
      secret: "test-session-secret",
      sessionId: "sess_billing_failure"
    });
    persistToolarsAuthSession(session);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503
      })
    );

    const response = await GET(
      new Request("http://toolars.test/api/billing/account", {
        headers: {
          cookie,
          "x-toolars-workspace-id": "toolars_ws_billing_session"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe("Billing provider unavailable");
    expect(payload.auth).toMatchObject({
      accountId: "acct_session_owner",
      source: "session"
    });
  });

  function prepareSessionLedger() {
    tempDirectory = mkdtempSync(join(tmpdir(), "toolars-billing-session-"));
    setToolarsAuthSessionLedgerStoragePathForTest(join(tempDirectory, "sessions.json"));
    resetToolarsAuthSessionLedger();
  }
});
