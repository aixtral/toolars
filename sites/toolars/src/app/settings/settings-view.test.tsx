import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SettingsView } from "./settings-view";

describe("SettingsView", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal("fetch", undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders account settings modules from the design", () => {
    const { container } = render(<SettingsView />);

    expect(container.querySelector('[data-settings-page="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-settings-mobile-layout="account-controls"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument();
    expect(screen.getByText("Account settings")).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "View trial usage" }).every((link) => link.getAttribute("href") === "/settings/billing")).toBe(true);
    expect(screen.getByText("Free trial workspace")).toBeInTheDocument();
    expect(screen.getByText("Trial usage")).toBeInTheDocument();
    expect(screen.getByText("Trial usage details")).toBeInTheDocument();
    expect(screen.getByText("Phase 2 plan preview")).toBeInTheDocument();
    expect(screen.getByText("Privacy & AI defaults")).toBeInTheDocument();
    expect(screen.getByText("API keys")).toBeInTheDocument();
    expect(screen.getByText("Team workspace")).toBeInTheDocument();
    expect(screen.getByText("Connected apps")).toBeInTheDocument();
    expect(screen.getByText("Your storage")).toBeInTheDocument();
    expect(screen.getByText("Danger zone")).toBeInTheDocument();
  });

  it("renders the high-fidelity mobile account preview modules", () => {
    const { container } = render(<SettingsView />);

    expect(screen.getByText("Trust defaults on")).toBeInTheDocument();
    expect(container.querySelector('[data-settings-mobile-list="trust-defaults"]')).toBeInTheDocument();
    expect(container.querySelectorAll(".settings-mobile-toggle-card")).toHaveLength(3);
    expect(screen.getByText("API keys preview")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Copy" })).toBeInTheDocument();
    expect(screen.getByText("Team invite")).toBeInTheDocument();
  });

  it("shows trust defaults, trial usage, and beta handoffs", () => {
    const { container } = render(<SettingsView />);

    expect(screen.getByText("Free trial")).toBeInTheDocument();
    expect(screen.queryByText("Pro")).not.toBeInTheDocument();
    expect(screen.getAllByText("AI trial credits").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("1,360 / 2,000")).toBeInTheDocument();
    expect(screen.getAllByText("Ask before AI processing").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Auto-delete uploads after session").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Prefer local tools").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Save output history")).toBeInTheDocument();
    expect(screen.getAllByRole("switch").length).toBeGreaterThanOrEqual(4);
    expect(screen.getByRole("link", { name: "Account security" })).toHaveAttribute("href", "/settings/security");
    expect(screen.queryByRole("link", { name: "Manage billing" })).not.toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "See full pricing" })).not.toBeInTheDocument();
    expect(screen.getByText("Paid plans")).toBeInTheDocument();
    expect(screen.getByText("Parked for Phase 2")).toBeInTheDocument();
    expect(container.querySelector('a[href="/settings/api-keys"]')).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Manage privacy preferences" })).toHaveAttribute("href", "/settings/privacy-ai");
    expect(screen.getAllByRole("link", { name: /Invite members/ }).some((link) => link.getAttribute("href") === "/settings/team")).toBe(true);
    expect(screen.getByRole("link", { name: "Review trial storage" })).toHaveAttribute("href", "/settings/storage");
    expect(screen.getByRole("link", { name: "Manage notifications" })).toHaveAttribute("href", "/settings/notifications");
    expect(screen.getByRole("link", { name: "Manage connected apps" })).toHaveAttribute("href", "/settings/connected-apps");
    expect(screen.getByRole("link", { name: "Manage security" })).toHaveAttribute("href", "/settings/security");
  });

  it("prepares account data export from the danger zone", () => {
    render(<SettingsView />);

    expect(screen.getByText("Account data coverage")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Export data" }));

    expect(screen.getByText("Data export is being prepared.")).toBeInTheDocument();
    expect(screen.getByText("Archive link will appear in your email.")).toBeInTheDocument();
  });

  it("hydrates the current account session from the auth session API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        account: {
          accountEmail: "ops@example.com",
          accountId: "acct-settings-001",
          createdAt: "2026-06-20T10:00:00Z",
          lastSignedInAt: "2026-06-21T09:30:00Z",
          source: "session",
          updatedAt: "2026-06-21T09:30:00Z",
          version: 1
        },
        auth: {
          accountEmail: "ops@example.com",
          accountId: "acct-settings-001",
          isAuthenticated: true,
          sessionId: "sess_settings_001",
          source: "session",
          workspaceId: "toolars_ws_settings_test"
        },
        session: {
          accountEmail: "ops@example.com",
          accountId: "acct-settings-001",
          createdAt: "2026-06-21T09:30:00Z",
          expiresAt: "2026-07-21T09:30:00Z",
          issuedAt: "2026-06-21T09:30:00Z",
          lastSeenAt: "2026-06-21T09:45:00Z",
          sessionId: "sess_settings_001",
          status: "active",
          version: 1
        }
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<SettingsView />);

    expect(await screen.findByText("Account session synced")).toBeInTheDocument();
    expect(screen.getByText("ops@example.com")).toBeInTheDocument();
    expect(screen.getByText("acct-settings-001")).toBeInTheDocument();
    expect(screen.getByText("sess_settings_001")).toBeInTheDocument();
    expect(screen.getByText("session")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/auth/session",
      expect.objectContaining({
        headers: expect.objectContaining({
          "x-toolars-workspace-id": expect.stringMatching(/^toolars_ws_/)
        })
      })
    );
  });

  it("confirms before queuing account deletion", () => {
    render(<SettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Delete account" }));

    expect(screen.getByRole("dialog", { name: "Delete account?" })).toHaveAttribute("aria-modal", "true");
    expect(screen.queryByText("Account deletion request queued.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog", { name: "Delete account?" })).not.toBeInTheDocument();
    expect(screen.getByText("No account deletion request is active.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Delete account" }));
    fireEvent.click(screen.getByRole("button", { name: "Delete account permanently" }));

    expect(screen.queryByRole("dialog", { name: "Delete account?" })).not.toBeInTheDocument();
    expect(screen.getByText("Account deletion request queued.")).toBeInTheDocument();
  });

  it("focuses the delete confirmation dialog and restores the opener with Escape", () => {
    render(<SettingsView />);

    const trigger = screen.getByRole("button", { name: "Delete account" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Delete account?" });
    expect(dialog).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Delete account?" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
