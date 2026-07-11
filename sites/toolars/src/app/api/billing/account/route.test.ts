import { afterEach, describe, expect, it, vi } from "vitest";
import { setToolarsBillingDriverForTest } from "@/lib/billing/billing-account";
import { setToolarsSupabaseServerAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-server";
import { GET } from "./route";

describe("/api/billing/account", () => {
  const originalEndpoint = process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT;
  const originalApiKey = process.env.TOOLARS_BILLING_PROVIDER_API_KEY;
  const originalFreeTrialMode = process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE;
  const originalServerFreeTrialMode = process.env.TOOLARS_FREE_TRIAL_MODE;

  afterEach(() => {
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = originalEndpoint;
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = originalApiKey;
    restoreEnvValue("NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE", originalFreeTrialMode);
    restoreEnvValue("TOOLARS_FREE_TRIAL_MODE", originalServerFreeTrialMode);
    setToolarsBillingDriverForTest(null);
    setToolarsSupabaseServerAuthDriverForTest(null);
    vi.unstubAllGlobals();
  });

  it("parks billing account access during the free launch without touching billing providers", async () => {
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "enabled";
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = "https://billing-provider.toolars.test";
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = "provider-secret";
    const getAccount = vi.fn();
    const fetchMock = vi.fn();
    setToolarsBillingDriverForTest({ getAccount });
    setSupabaseUser({ email: "owner@example.com", id: "user_billing_parked" });
    vi.stubGlobal("fetch", fetchMock);

    const response = await GET(new Request("http://toolars.test/api/billing/account"));
    const payload = await response.json();

    expect(response.status).toBe(410);
    expect(payload).toMatchObject({
      auth: {
        accountId: "user_billing_parked",
        isAuthenticated: true,
        source: "supabase"
      },
      code: "billing_phase2_parked",
      error: "Billing is parked for Phase 2 free launch"
    });
    expect(getAccount).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("rejects anonymous billing requests", async () => {
    disableFreeTrialMode();
    const response = await GET(new Request("http://toolars.test/api/billing/account"));
    const payload = await response.json();

    expect(response.status).toBe(401);
    expect(payload.error).toBe("Authentication required for billing account");
    expect(payload.auth.isAuthenticated).toBe(false);
  });

  it("returns billing account state for a Supabase authenticated account", async () => {
    disableFreeTrialMode();
    setSupabaseUser({ email: "owner@example.com", id: "user_billing_123" });
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
          "x-toolars-workspace-id": "toolars_ws_preview"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(payload.auth).toMatchObject({
      accountId: "user_billing_123",
      isAuthenticated: true,
      source: "supabase"
    });
    expect(payload.billing).toMatchObject({
      accountId: "user_billing_123",
      planId: "pro",
      status: "active"
    });
  });

  it("reads customer, subscription, invoice, and portal data from the configured billing provider for a Supabase account", async () => {
    disableFreeTrialMode();
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = "https://billing-provider.toolars.test";
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = "provider-secret";
    setSupabaseUser({ email: "owner@example.com", id: "user_billing_provider" });
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
          "x-toolars-workspace-id": "toolars_ws_billing_session"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(200);
    expect(fetchMock).toHaveBeenCalledWith("https://billing-provider.toolars.test/accounts/user_billing_provider", {
      headers: {
        Authorization: "Bearer provider-secret",
        Accept: "application/json"
      }
    });
    expect(payload.auth).toMatchObject({
      accountId: "user_billing_provider",
      isAuthenticated: true,
      source: "supabase"
    });
    expect(payload.billing).toMatchObject({
      accountId: "user_billing_provider",
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
    disableFreeTrialMode();
    process.env.TOOLARS_BILLING_PROVIDER_ENDPOINT = "https://billing-provider.toolars.test";
    process.env.TOOLARS_BILLING_PROVIDER_API_KEY = "provider-secret";
    setSupabaseUser({ email: "owner@example.com", id: "user_billing_failure" });
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
          "x-toolars-workspace-id": "toolars_ws_billing_session"
        }
      })
    );
    const payload = await response.json();

    expect(response.status).toBe(502);
    expect(payload.error).toBe("Billing provider unavailable");
    expect(payload.auth).toMatchObject({
      accountId: "user_billing_failure",
      source: "supabase"
    });
  });
});

function setSupabaseUser(user: { email: string; id: string }) {
  setToolarsSupabaseServerAuthDriverForTest({
    getUser: vi.fn().mockResolvedValue({
      data: { user },
      error: null
    }),
    signOut: vi.fn()
  });
}

function disableFreeTrialMode() {
  process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "disabled";
  process.env.TOOLARS_FREE_TRIAL_MODE = "disabled";
}

function restoreEnvValue(key: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[key];
    return;
  }

  process.env[key] = value;
}
