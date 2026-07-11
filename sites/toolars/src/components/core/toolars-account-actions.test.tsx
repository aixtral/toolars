import { fireEvent, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setToolarsSupabaseBrowserAuthDriverForTest } from "@/lib/supabase/toolars-supabase-auth-client";
import { renderWithIntl } from "@/test/i18n-test-utils";
import { ToolarsAccountActions } from "./toolars-account-actions";

describe("ToolarsAccountActions", () => {
  afterEach(() => {
    setToolarsSupabaseBrowserAuthDriverForTest(null);
  });

  it("renders sign-in and sign-up actions when no Supabase user is available", async () => {
    renderWithIntl(<ToolarsAccountActions />);

    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });

  it("renders the Supabase account and signs out from the topbar", async () => {
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

    expect(await screen.findByText("owner@example.com")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Sign out" }));

    await waitFor(() => expect(signOut).toHaveBeenCalledTimes(1));
    expect(screen.getByRole("status")).toHaveTextContent("Signed out.");
    expect(screen.getByRole("button", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Sign up" })).toBeInTheDocument();
  });
});
