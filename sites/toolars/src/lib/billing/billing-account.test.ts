import { afterEach, describe, expect, it } from "vitest";
import { getToolarsBillingAccount, setToolarsBillingDriverForTest } from "./billing-account";

describe("Toolars billing account", () => {
  afterEach(() => {
    setToolarsBillingDriverForTest(null);
  });

  it("requires an authenticated account before exposing billing state", async () => {
    expect(
      await getToolarsBillingAccount({
        accountEmail: null,
        accountId: null,
        isAuthenticated: false,
        source: "anonymous",
        workspaceId: "anonymous-local"
      })
    ).toBeNull();
  });

  it("resolves account billing state from an injected billing driver", async () => {
    setToolarsBillingDriverForTest({
      getAccount: (accountId) => ({
        accountId,
        billingEmail: "owner@example.com",
        customerPortalUrl: "https://billing.toolars.test/session/acct-preview-123",
        invoices: [
          {
            amountCents: 2900,
            currency: "USD",
            invoiceId: "inv_preview_001",
            issuedAt: "2026-06-01T00:00:00Z",
            status: "paid"
          }
        ],
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

    const billing = await getToolarsBillingAccount({
      accountEmail: "owner@example.com",
      accountId: "acct-preview-123",
      isAuthenticated: true,
      source: "preview-header",
      workspaceId: "toolars_ws_preview"
    });

    expect(billing).toMatchObject({
      accountId: "acct-preview-123",
      customerPortalUrl: "https://billing.toolars.test/session/acct-preview-123",
      planId: "pro",
      status: "active",
      usage: {
        aiCreditsLimit: 5000,
        aiCreditsUsed: 3250
      },
      version: 1
    });
  });
});
