import { render, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { setToolarsSupabaseWorkspaceDriverForTest } from "@/lib/supabase/toolars-supabase-workspace-client";
import { ToolarsRecentToolRecorder } from "./toolars-recent-tool-recorder";

describe("ToolarsRecentToolRecorder", () => {
  afterEach(() => {
    setToolarsSupabaseWorkspaceDriverForTest(null);
  });

  it("records an authenticated tool visit in the active Supabase workspace", async () => {
    const recordRecentTool = vi.fn().mockResolvedValue(true);
    setToolarsSupabaseWorkspaceDriverForTest({
      ensureWorkspace: vi.fn().mockResolvedValue({ workspaceId: "workspace_123" }),
      getCurrentUser: vi.fn().mockResolvedValue({ accountId: "user_123" }),
      getRecentTools: vi.fn(),
      getSavedTools: vi.fn(),
      getSettings: vi.fn(),
      recordRecentTool,
      removeSavedTool: vi.fn(),
      saveTool: vi.fn(),
      updateSettings: vi.fn()
    });

    render(<ToolarsRecentToolRecorder locale="zh-hans" toolSlug="json-repair" />);

    await waitFor(() => {
      expect(recordRecentTool).toHaveBeenCalledWith({
        accountId: "user_123",
        locale: "zh-hans",
        toolSlug: "json-repair",
        workspaceId: "workspace_123"
      });
    });
  });
});
