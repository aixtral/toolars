import { render, screen, waitFor } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { bindWorkspaceIdentityToAccount } from "@/lib/workspace/workspace-identity";
import { BillingSettingsView } from "./billing-settings-view";

describe("BillingSettingsView", () => {
  const originalFreeTrialMode = process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE;

  beforeEach(() => {
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "enabled";
    window.localStorage.clear();
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Billing API not mocked")));
  });

  afterEach(() => {
    if (originalFreeTrialMode === undefined) {
      delete process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE;
    } else {
      process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = originalFreeTrialMode;
    }
    vi.unstubAllGlobals();
  });

  it("renders billing settings modules from the design", () => {
    const { container } = renderWithIntl(<BillingSettingsView />);

    expect(container.querySelector('[data-billing-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Trial usage" })).toBeInTheDocument();
    expect(screen.getByText("Trial")).toBeInTheDocument();
    expect(screen.getByText("AI credits")).toBeInTheDocument();
    expect(screen.getByText("Storage")).toBeInTheDocument();
    expect(screen.getByText("Trial window")).toBeInTheDocument();
    expect(screen.getByText("Trial controls")).toBeInTheDocument();
    expect(screen.queryByText("Customer portal")).not.toBeInTheDocument();
    expect(screen.queryByText("Billing details")).not.toBeInTheDocument();
    expect(screen.queryByText("Invoices")).not.toBeInTheDocument();
    expect(screen.getByText("Usage analytics")).toBeInTheDocument();
    expect(screen.queryByText("Invoice detail")).not.toBeInTheDocument();
    expect(screen.getByText("Usage policy")).toBeInTheDocument();
  });

  it("shows free trial values without paid portal or invoice handoffs", () => {
    renderWithIntl(<BillingSettingsView />);

    expect(screen.getByText("Free trial")).toBeInTheDocument();
    expect(screen.getByText("68%")).toBeInTheDocument();
    expect(screen.getByText("41%")).toBeInTheDocument();
    expect(screen.getByText("14 days")).toBeInTheDocument();
    expect(screen.queryByText("$12.00")).not.toBeInTheDocument();
    expect(screen.queryByText("Visa ending 4242")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Open portal" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Compare plans" })).not.toBeInTheDocument();
    expect(screen.queryByText("Paid")).not.toBeInTheDocument();
    expect(screen.getByText("PDF Summary Workflow")).toBeInTheDocument();
    expect(screen.getByText("1,360 credits used")).toBeInTheDocument();
    expect(screen.getByText("Paid plans are parked during the beta trial.")).toBeInTheDocument();
  });

  it("hydrates authenticated billing account data from the production API contract", async () => {
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "disabled";
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        auth: {
          accountEmail: "finance@example.com",
          accountId: "acct-team-001",
          isAuthenticated: true,
          source: "preview-header",
          workspaceId: "toolars_ws_billing_test"
        },
        billing: {
          accountId: "acct-team-001",
          billingEmail: "finance@example.com",
          customerPortalUrl: "https://billing.example.com/session/team-001",
          invoices: [
            {
              amountCents: 7900,
              currency: "USD",
              invoiceId: "inv_team_2026_06",
              issuedAt: "2026-06-28T00:00:00Z",
              status: "open"
            }
          ],
          planId: "team",
          planName: "Toolars Team",
          source: "billing-driver",
          status: "active",
          usage: {
            aiCreditsLimit: 5000,
            aiCreditsUsed: 4200,
            periodEnd: "2026-06-28T00:00:00Z",
            periodStart: "2026-05-28T00:00:00Z",
            storageBytesLimit: 10737418240,
            storageBytesUsed: 2684354560
          },
          version: 1
        }
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<BillingSettingsView />);

    expect(await screen.findByText("Billing account synced")).toBeInTheDocument();
    expect(screen.getByText("Toolars Team")).toBeInTheDocument();
    expect(screen.getAllByText("acct-team-001").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("finance@example.com").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("4,200 / 5,000")).toBeInTheDocument();
    expect(screen.getByText("2.5 GB used")).toBeInTheDocument();
    expect(screen.getAllByText("inv_team_2026_06").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByRole("link", { name: "Open portal" })).toHaveAttribute(
      "href",
      "https://billing.example.com/session/team-001"
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/billing/account",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-toolars-workspace-id": expect.stringMatching(/^toolars_ws_/)
        })
      })
    );
  });

  it("refreshes billing account data when the workspace identity changes after sign-in", async () => {
    process.env.NEXT_PUBLIC_TOOLARS_FREE_TRIAL_MODE = "disabled";
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({ error: "Authentication required for billing account" }),
        ok: false
      })
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          auth: {
            accountEmail: "owner@example.com",
            accountId: "acct-owner",
            isAuthenticated: true,
            source: "preview-header",
            workspaceId: "toolars_ws_20260621090000_refresh"
          },
          billing: {
            accountId: "acct-owner",
            billingEmail: "owner@example.com",
            customerPortalUrl: "https://billing.example.com/session/owner",
            invoices: [],
            planId: "team",
            planName: "Toolars Team",
            source: "billing-driver",
            status: "active",
            usage: {
              aiCreditsLimit: 5000,
              aiCreditsUsed: 500,
              periodEnd: "2026-06-30T23:59:59Z",
              periodStart: "2026-06-01T00:00:00Z",
              storageBytesLimit: 10737418240,
              storageBytesUsed: 1073741824
            },
            version: 1
          }
        }),
        ok: true
      });
    vi.stubGlobal("fetch", fetchMock);

    renderWithIntl(<BillingSettingsView />);

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));

    bindWorkspaceIdentityToAccount({
      accountEmail: "owner@example.com",
      accountId: "acct-owner",
      now: () => "2026-06-21T09:00:00Z"
    });

    expect(await screen.findByText("Toolars Team")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenLastCalledWith("/api/billing/account", {
      headers: {
        "x-toolars-account-email": "owner@example.com",
        "x-toolars-account-id": "acct-owner",
        "x-toolars-workspace-id": expect.stringMatching(/^toolars_ws_/)
      }
    });
  });
});
