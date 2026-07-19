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
    document.documentElement.removeAttribute("data-toolars-account-hint");
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
    expect(document.documentElement).not.toHaveAttribute("data-toolars-account-hint");
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
    expect(document.documentElement).toHaveAttribute("data-toolars-account-hint", "true");
  });

  it("resolves the account from the storage-local session without a network round-trip", async () => {
    const getUser = vi.fn();
    setToolarsSupabaseBrowserAuthDriverForTest({
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { email: "session@example.com", id: "user_session" } } },
        error: null
      }),
      getUser,
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    renderWithIntl(<ToolarsAccountActions />);

    expect(await screen.findByText("session@example.com")).toBeInTheDocument();
    expect(getUser).not.toHaveBeenCalled();
  });

  it("clears the account and hint on a real SIGNED_OUT event", async () => {
    const authListenerRef = { current: null as null | ((event: string) => void) };
    window.localStorage.setItem("toolars.account.hint", JSON.stringify({ accountEmail: "session@example.com", accountId: "user_session" }));
    setToolarsSupabaseBrowserAuthDriverForTest({
      getSession: vi.fn().mockResolvedValue({
        data: { session: { user: { email: "session@example.com", id: "user_session" } } },
        error: null
      }),
      getUser: vi.fn(),
      onAuthStateChange: vi.fn().mockImplementation((callback) => {
        authListenerRef.current = callback as (event: string) => void;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    renderWithIntl(<ToolarsAccountActions />);

    expect(await screen.findByText("session@example.com")).toBeInTheDocument();

    authListenerRef.current?.("SIGNED_OUT");

    await waitFor(() => expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument());
    expect(window.localStorage.getItem("toolars.account.hint")).toBeNull();
    expect(document.documentElement).not.toHaveAttribute("data-toolars-account-hint");
  });

  it("re-resolves the account on a SIGNED_IN event", async () => {
    const authListenerRef = { current: null as null | ((event: string) => void) };
    const getSession = vi.fn().mockResolvedValue({
      data: { session: { user: { email: "session@example.com", id: "user_session" } } },
      error: null
    });
    setToolarsSupabaseBrowserAuthDriverForTest({
      getSession,
      getUser: vi.fn(),
      onAuthStateChange: vi.fn().mockImplementation((callback) => {
        authListenerRef.current = callback as (event: string) => void;
        return { data: { subscription: { unsubscribe: vi.fn() } } };
      }),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      signUp: vi.fn()
    });

    renderWithIntl(<ToolarsAccountActions />);
    await waitFor(() => expect(getSession).toHaveBeenCalledTimes(1));

    authListenerRef.current?.("SIGNED_IN");

    await waitFor(() => expect(getSession).toHaveBeenCalledTimes(2));
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
    expect(await screen.findByRole("status")).toHaveClass("topbar-account-toast");
    expect(screen.getByRole("status")).toHaveTextContent("Signed out.");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });
});
