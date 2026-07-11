import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { setToolarsSupabaseBrowserAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-client";
// @ts-expect-error audit-i18n is a plain ESM script without TS declarations.
import { scanSourceText } from "../../../scripts/audit-i18n.mjs";
import { CoreActionModalButton } from "./core-action-modal";

describe("CoreActionModalButton", () => {
  beforeEach(() => {
    window.localStorage.clear();
    vi.restoreAllMocks();
  });

  afterEach(() => {
    setToolarsSupabaseBrowserAuthDriverForTest(null);
    vi.unstubAllGlobals();
  });

  it("moves focus into the dialog and restores the trigger after Close", () => {
    renderWithIntl(
      <CoreActionModalButton
        className="button button-outline-neutral"
        itemName="PDF Toolkit"
        kind="share"
        sharePath="/tools/pdf-toolkit/about"
      >
        Share
      </CoreActionModalButton>
    );

    const trigger = screen.getByRole("button", { name: "Share" });

    trigger.focus();
    fireEvent.click(trigger);

    const dialog = screen.getByRole("dialog", { name: "Share this tool" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveFocus();

    fireEvent.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.queryByRole("dialog", { name: "Share this tool" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("closes with Escape and restores focus to the opener", () => {
    renderWithIntl(
      <CoreActionModalButton className="button button-solid" itemName="PDF Ops Kit" kind="save-collection">
        Save collection
      </CoreActionModalButton>
    );

    const trigger = screen.getByRole("button", { name: "Save collection" });

    trigger.focus();
    fireEvent.click(trigger);

    expect(screen.getByRole("dialog", { name: "Save collection" })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("dialog", { name: "Save collection" })).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps only one core modal mounted when another action opens", () => {
    renderWithIntl(
      <>
        <CoreActionModalButton
          className="button button-outline-neutral"
          kind="share"
          sharePath="/tools/pdf-toolkit/about"
        >
          Share
        </CoreActionModalButton>
        <CoreActionModalButton className="button button-solid" kind="sign-in">
          Sign in
        </CoreActionModalButton>
      </>
    );

    fireEvent.click(screen.getByRole("button", { name: "Share" }));
    expect(screen.getByRole("dialog", { name: "Share this tool" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.queryByRole("dialog", { name: "Share this tool" })).not.toBeInTheDocument();
    expect(screen.getByRole("dialog", { name: "Continue to Toolars" })).toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("mounts modal overlays at document body so topbar stacking contexts cannot constrain them", () => {
    const { container } = renderWithIntl(
      <div className="topbar">
        <CoreActionModalButton className="button button-solid" kind="sign-in">
          Sign in
        </CoreActionModalButton>
      </div>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    const overlay = document.querySelector(".core-modal-overlay");
    expect(overlay).toBeInTheDocument();
    expect(overlay?.parentElement).toBe(document.body);
    expect(container.querySelector(".core-modal-overlay")).not.toBeInTheDocument();
  });

  it("starts Google OAuth from the sign-in modal without exposing Supabase or password auth", async () => {
    const signInWithOAuth = vi.fn().mockResolvedValue({
      data: { provider: "google", url: "https://project.supabase.co/auth/v1/authorize?provider=google" },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithOAuth,
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });
    renderWithIntl(
      <CoreActionModalButton className="button button-solid" kind="sign-in">
        Sign in
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.getByRole("button", { name: "Continue with Google" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Continue with GitHub" })).toBeInTheDocument();
    expect(screen.queryByLabelText("Email")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Password")).not.toBeInTheDocument();
    expect(screen.queryByText(/Supabase/i)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue with Google" }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Opening Google..."));
    expect(signInWithOAuth).toHaveBeenCalledWith({
      options: expect.objectContaining({
        redirectTo: expect.stringContaining("/")
      }),
      provider: "google"
    });
  });

  it("recovers the OAuth actions when the provider cannot start", async () => {
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithOAuth: vi.fn().mockRejectedValue(new Error("network unavailable")),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });
    renderWithIntl(
      <CoreActionModalButton className="button button-solid" kind="sign-in">
        Sign in
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    fireEvent.click(screen.getByRole("button", { name: "Continue with GitHub" }));

    await waitFor(() =>
      expect(screen.getByRole("status")).toHaveTextContent("We couldn't start GitHub. Try again.")
    );
    expect(screen.getByRole("button", { name: "Continue with GitHub" })).toBeEnabled();
  });

  it("keeps the selected OAuth panel when switching from sign-up to sign-in", async () => {
    const signInWithOAuth = vi.fn().mockResolvedValue({
      data: { provider: "github", url: "https://project.supabase.co/auth/v1/authorize?provider=github" },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn(),
      signInWithOAuth
    });
    renderWithIntl(
      <CoreActionModalButton className="button button-solid" kind="sign-up">
        Sign up
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    const dialog = screen.getByRole("dialog", { name: "Create your workspace" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.getByTestId("toolars-logo-mark")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(screen.getByRole("heading", { name: "Continue to Toolars" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Continue with GitHub" }));

    await waitFor(() => expect(signInWithOAuth).toHaveBeenCalledWith(expect.objectContaining({ provider: "github" })));
  });

  it("parks paid upgrade actions for Phase 2 instead of queuing a fake upgrade", () => {
    renderWithIntl(
      <CoreActionModalButton
        className="button button-solid"
        kind="upgrade"
        planFeatures={["Shared workflow history", "Centralized billing"]}
        planName="Pro"
        planPrice="$6.99 / month"
      >
        Upgrade to Pro
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Upgrade to Pro" }));

    expect(screen.getByRole("dialog", { name: "Upgrade workspace" })).toBeInTheDocument();
    expect(screen.getByText("Pro future plan")).toBeInTheDocument();
    expect(screen.getByText("Paid upgrades are parked for Phase 2.")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Phase 2 waitlist" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Start upgrade" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Phase 2 waitlist" }));

    expect(screen.queryByRole("status")).not.toBeInTheDocument();
  });

  it("keeps shared core modal and focus helpers clean for the i18n source scanner", () => {
    const sourceFiles = ["src/components/core/core-action-modal.tsx", "src/components/core/use-dialog-focus.ts"];

    for (const sourceFile of sourceFiles) {
      const scan = scanSourceText(readFileSync(resolve(process.cwd(), sourceFile), "utf8"), sourceFile);

      expect(scan.hardcodedText).toEqual([]);
      expect(scan.absoluteHrefs).toEqual([]);
    }
  });
});
