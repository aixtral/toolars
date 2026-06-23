import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { SecuritySettingsView } from "./security-settings-view";

describe("SecuritySettingsView", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          revokedSession: {
            sessionId: "sess_security_001",
            status: "revoked"
          }
        }),
        ok: true
      })
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders security modules from the settings design", () => {
    const { container } = renderWithIntl(<SecuritySettingsView />);

    expect(container.querySelector('[data-security-settings-page="true"]')).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Security" })).toBeInTheDocument();
    expect(screen.getByText("Security overview")).toBeInTheDocument();
    expect(screen.getByText("Two-factor authentication")).toBeInTheDocument();
    expect(screen.getByText("Active sessions")).toBeInTheDocument();
    expect(screen.getByText("Login activity")).toBeInTheDocument();
    expect(screen.getByText("Recovery methods")).toBeInTheDocument();
    expect(screen.getByText("Upload deletion policy")).toBeInTheDocument();
    expect(screen.getByText("Security checklist")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign out all sessions" })).toBeInTheDocument();
  });

  it("updates two-factor state", () => {
    renderWithIntl(<SecuritySettingsView />);

    const twoFactor = screen.getByRole("button", { name: "Two-factor authentication" });
    expect(twoFactor).toHaveAttribute("aria-pressed", "true");

    fireEvent.click(twoFactor);

    expect(twoFactor).toHaveAttribute("aria-pressed", "false");
    expect(screen.getByText("Two-factor authentication paused.")).toBeInTheDocument();
  });

  it("confirms before revoking the active auth session", async () => {
    renderWithIntl(<SecuritySettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out all sessions" }));

    expect(screen.getByRole("dialog", { name: "Sign out all sessions?" })).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("3 active sessions are currently trusted for this account.")).toBeInTheDocument();
    expect(screen.queryByText("Session revoked. Sign in again to continue syncing account settings.")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(screen.queryByRole("dialog", { name: "Sign out all sessions?" })).not.toBeInTheDocument();
    expect(screen.getByText("3 active sessions are currently trusted for this account.")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign out all sessions" }));
    fireEvent.click(screen.getByRole("button", { name: "Sign out other sessions" }));

    expect(await screen.findByText("Session revoked. Sign in again to continue syncing account settings.")).toBeInTheDocument();
    expect(screen.queryByRole("dialog", { name: "Sign out all sessions?" })).not.toBeInTheDocument();
    expect(screen.getByText("0 active sessions are currently trusted for this account.")).toBeInTheDocument();
  });

  it("calls the auth session revoke API with workspace audit headers", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        revokedSession: {
          sessionId: "sess_security_002",
          status: "revoked"
        }
      }),
      ok: true
    });
    vi.stubGlobal("fetch", fetchMock);
    renderWithIntl(<SecuritySettingsView />);

    fireEvent.click(screen.getByRole("button", { name: "Sign out all sessions" }));
    fireEvent.click(screen.getByRole("button", { name: "Sign out other sessions" }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/auth/session",
        expect.objectContaining({
          credentials: "same-origin",
          headers: expect.objectContaining({
            "x-toolars-workspace-id": expect.stringMatching(/^toolars_ws_/)
          }),
          method: "DELETE"
        })
      );
    });
    expect(await screen.findByText("sess_security_002")).toBeInTheDocument();
  });

  it("focuses the sign-out confirmation dialog and restores the opener with Escape", () => {
    renderWithIntl(<SecuritySettingsView />);

    const trigger = screen.getByRole("button", { name: "Sign out all sessions" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Sign out all sessions?" });
    expect(dialog).toHaveFocus();

    fireEvent.keyDown(dialog, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Sign out all sessions?" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
