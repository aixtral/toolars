import { readFileSync } from "node:fs";
import path from "node:path";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setToolarsSupabaseBrowserAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-client";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ToolarsAccountActions } from "./toolars-account-actions";

const accountMenuStyles = readFileSync(path.resolve(import.meta.dirname, "../../app/globals.css"), "utf8");

describe("ToolarsAccountActions", () => {
  afterEach(() => {
    setToolarsSupabaseBrowserAuthDriverForTest(null);
    window.localStorage.clear();
  });

  it("renders sign-in and sign-up actions when no Supabase user is available", async () => {
    renderWithIntl(<ToolarsAccountActions />);

    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders the cached account hint on first paint instead of flashing signed-out chrome", async () => {
    window.localStorage.setItem("toolars.account.hint", JSON.stringify({ accountEmail: "owner@example.com", accountId: "user_123" }));
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "owner@example.com", id: "user_123" } },
        error: null
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    renderWithIntl(<ToolarsAccountActions />);

    expect(screen.getByLabelText("Open account menu")).toBeInTheDocument();
    expect(screen.getByText("owner@example.com")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Sign in" })).not.toBeInTheDocument();
  });

  it("drops a stale account hint when the session refresh finds no user", async () => {
    window.localStorage.setItem("toolars.account.hint", JSON.stringify({ accountEmail: "owner@example.com", accountId: "user_123" }));
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    renderWithIntl(<ToolarsAccountActions />);

    expect(screen.getByLabelText("Open account menu")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument());
    expect(window.localStorage.getItem("toolars.account.hint")).toBeNull();
  });

  it("persists the refreshed account as the hint for the next navigation", async () => {
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "owner@example.com", id: "user_123" } },
        error: null
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    renderWithIntl(<ToolarsAccountActions />);

    await waitFor(() => {
      expect(window.localStorage.getItem("toolars.account.hint")).toBe(JSON.stringify({ accountEmail: "owner@example.com", accountId: "user_123" }));
    });
  });

  it("centers the compact account menu under its trigger while keeping menu text left aligned", () => {
    expect(accountMenuStyles).toMatch(/\.topbar-account-menu-panel\s*\{[\s\S]*?top: calc\(100% \+ 18px\);[\s\S]*?left: 50%;[\s\S]*?right: auto;[\s\S]*?width: 196px;[\s\S]*?transform: translateX\(-50%\);/);
    expect(accountMenuStyles).toMatch(/\.topbar-account-menu-link,[\s\S]*?\.topbar-account-menu-sign-out\s*\{[\s\S]*?justify-content: flex-start;[\s\S]*?text-align: left;/);
  });

  it("places signed-in workspace actions inside a compact account menu", async () => {
    const signOut = vi.fn().mockResolvedValue({ error: null });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getUser: vi.fn().mockResolvedValue({
        data: { user: { email: "owner@example.com", id: "user_123" } },
        error: null
      }),
      signInWithPassword: vi.fn(),
      signOut,
      signUp: vi.fn()
    });

    renderWithIntl(<ToolarsAccountActions />);

    expect(await screen.findByLabelText("Open account menu")).toBeInTheDocument();
    expect(screen.getByText("owner@example.com")).toBeInTheDocument();
    const myTools = screen.getByRole("link", { name: "My Tools" });
    const settings = screen.getByRole("link", { name: "Personal center" });
    const signOutButton = screen.getByRole("button", { name: "Sign out" });

    expect(myTools).toHaveAttribute("href", "/my-tools");
    expect(settings).toHaveAttribute("href", "/settings");
    expect(myTools.querySelector("svg")).toBeNull();
    expect(settings.querySelector("svg")).toBeNull();
    expect(signOutButton.querySelector("svg")).toBeNull();

    fireEvent.click(signOutButton);

    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("status")).toHaveClass("topbar-account-toast");
    expect(screen.getByRole("status")).toHaveTextContent("Signed out.");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });
});
