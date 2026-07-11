import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { afterEach, describe, expect, it, vi } from "vitest";
import en from "../../../messages/en.json";
import { setToolarsSupabaseWorkspaceDriverForTest } from "@/lib/supabase/toolars-supabase-workspace-client";
import { ToolSaveButton } from "./tool-save-button";

describe("ToolSaveButton", () => {
  afterEach(() => {
    setToolarsSupabaseWorkspaceDriverForTest(null);
  });

  it("persists a signed-in user's saved tool instead of presenting a decorative bookmark", async () => {
    const saveTool = vi.fn().mockResolvedValue(true);
    setToolarsSupabaseWorkspaceDriverForTest({
      ensureWorkspace: vi.fn().mockResolvedValue({ workspaceId: "workspace_123" }),
      getCurrentUser: vi.fn().mockResolvedValue({ accountId: "user_123" }),
      getRecentTools: vi.fn(),
      getSavedTools: vi.fn(),
      getSettings: vi.fn(),
      recordRecentTool: vi.fn(),
      removeSavedTool: vi.fn(),
      saveTool,
      updateSettings: vi.fn()
    });

    render(
      <NextIntlClientProvider locale="en" messages={en}>
        <ToolSaveButton locale="en" toolSlug="json-repair" />
      </NextIntlClientProvider>
    );

    const button = screen.getByRole("button", { name: "Save" });
    fireEvent.click(button);

    await waitFor(() => {
      expect(saveTool).toHaveBeenCalledWith({
        accountId: "user_123",
        locale: "en",
        toolSlug: "json-repair",
        workspaceId: "workspace_123"
      });
    });
    expect(button).toHaveAttribute("aria-pressed", "true");
  });
});
