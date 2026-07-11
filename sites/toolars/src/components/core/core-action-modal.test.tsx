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
    expect(screen.getByRole("dialog", { name: "Sign in to Toolars" })).toBeInTheDocument();
    expect(screen.getAllByRole("dialog")).toHaveLength(1);
  });

  it("signs in with Supabase email auth instead of the legacy Google OAuth route", async () => {
    const signInWithPassword = vi.fn().mockResolvedValue({
      data: { user: { email: "owner@example.com", id: "user_123" } },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithPassword,
      signOut: vi.fn(),
      signUp: vi.fn()
    });
    renderWithIntl(
      <CoreActionModalButton className="button button-solid" kind="sign-in">
        Sign in
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(screen.queryByRole("link", { name: "Continue with Google" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "Owner@Example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "correct horse" } });
    fireEvent.click(screen.getByRole("button", { name: "Sign in with Supabase" }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Signed in. Your workspace is syncing."));
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: "owner@example.com",
      password: "correct horse"
    });
  });

  it("renders the sign-up modal with Supabase account creation", async () => {
    const signUp = vi.fn().mockResolvedValue({
      data: { session: null, user: { email: "owner@example.com", id: "user_456" } },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn(),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp
    });
    renderWithIntl(
      <CoreActionModalButton className="button button-solid" kind="sign-up">
        Sign up
      </CoreActionModalButton>
    );

    fireEvent.click(screen.getByRole("button", { name: "Sign up" }));

    const dialog = screen.getByRole("dialog", { name: "Create your Toolars account" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByText("Account")).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Continue with Google" })).not.toBeInTheDocument();
    fireEvent.change(screen.getByLabelText("Email"), { target: { value: "owner@example.com" } });
    fireEvent.change(screen.getByLabelText("Password"), { target: { value: "correct horse" } });
    fireEvent.click(screen.getByRole("button", { name: "Create Supabase account" }));

    await waitFor(() => expect(screen.getByRole("status")).toHaveTextContent("Check your email to confirm the account."));
    expect(signUp).toHaveBeenCalledWith({
      email: "owner@example.com",
      options: expect.objectContaining({
        emailRedirectTo: expect.stringContaining("/")
      }),
      password: "correct horse"
    });
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
