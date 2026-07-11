import { afterEach, describe, expect, it, vi } from "vitest";

import {
  getToolarsSupabaseWorkspaceSnapshot,
  recordToolarsRecentTool,
  saveToolarsTool,
  setToolarsSupabaseWorkspaceDriverForTest,
  updateToolarsWorkspacePreferences
} from "./toolars-supabase-workspace-client";

describe("toolars supabase workspace client", () => {
  afterEach(() => {
    setToolarsSupabaseWorkspaceDriverForTest(null);
  });

  it("returns an unauthenticated snapshot without issuing workspace queries", async () => {
    const ensureWorkspace = vi.fn();
    setToolarsSupabaseWorkspaceDriverForTest({
      ensureWorkspace,
      getCurrentUser: vi.fn().mockResolvedValue(null),
      getRecentTools: vi.fn(),
      getSavedTools: vi.fn(),
      getSettings: vi.fn(),
      recordRecentTool: vi.fn(),
      removeSavedTool: vi.fn(),
      saveTool: vi.fn(),
      updateSettings: vi.fn()
    });

    await expect(getToolarsSupabaseWorkspaceSnapshot({ locale: "zh-hans" })).resolves.toEqual({
      status: "unauthenticated"
    });
    expect(ensureWorkspace).not.toHaveBeenCalled();
  });

  it("hydrates a scoped workspace snapshot through the ensure-workspace RPC contract", async () => {
    const ensureWorkspace = vi.fn().mockResolvedValue({ workspaceId: "workspace_123" });
    const getSavedTools = vi.fn().mockResolvedValue([
      { locale: "zh-hans", savedAt: "2026-07-11T00:00:00.000Z", toolSlug: "json-repair" }
    ]);
    const getRecentTools = vi.fn().mockResolvedValue([
      { locale: "zh-hans", openedAt: "2026-07-11T01:00:00.000Z", toolSlug: "token-counter" }
    ]);
    const getSettings = vi.fn().mockResolvedValue({ locale: "zh-hans", preferences: { compactMode: true } });
    setToolarsSupabaseWorkspaceDriverForTest({
      ensureWorkspace,
      getCurrentUser: vi.fn().mockResolvedValue({ accountId: "user_123" }),
      getRecentTools,
      getSavedTools,
      getSettings,
      recordRecentTool: vi.fn(),
      removeSavedTool: vi.fn(),
      saveTool: vi.fn(),
      updateSettings: vi.fn()
    });

    await expect(getToolarsSupabaseWorkspaceSnapshot({ locale: "zh-hans" })).resolves.toEqual({
      accountId: "user_123",
      recentTools: [{ locale: "zh-hans", openedAt: "2026-07-11T01:00:00.000Z", toolSlug: "token-counter" }],
      savedTools: [{ locale: "zh-hans", savedAt: "2026-07-11T00:00:00.000Z", toolSlug: "json-repair" }],
      settings: { locale: "zh-hans", preferences: { compactMode: true } },
      status: "ready",
      workspaceId: "workspace_123"
    });
    expect(ensureWorkspace).toHaveBeenCalledWith({ accountId: "user_123", locale: "zh-hans" });
    expect(getSavedTools).toHaveBeenCalledWith({ accountId: "user_123", workspaceId: "workspace_123" });
    expect(getRecentTools).toHaveBeenCalledWith({ accountId: "user_123", workspaceId: "workspace_123" });
    expect(getSettings).toHaveBeenCalledWith({ workspaceId: "workspace_123" });
  });

  it("writes saved tools, recent tools, and preferences only inside the current workspace", async () => {
    const recordRecentTool = vi.fn().mockResolvedValue(true);
    const saveTool = vi.fn().mockResolvedValue(true);
    const updateSettings = vi.fn().mockResolvedValue(true);
    setToolarsSupabaseWorkspaceDriverForTest({
      ensureWorkspace: vi.fn().mockResolvedValue({ workspaceId: "workspace_456" }),
      getCurrentUser: vi.fn().mockResolvedValue({ accountId: "user_456" }),
      getRecentTools: vi.fn(),
      getSavedTools: vi.fn(),
      getSettings: vi.fn(),
      recordRecentTool,
      removeSavedTool: vi.fn(),
      saveTool,
      updateSettings
    });

    await expect(saveToolarsTool({ locale: "es", toolSlug: "json-repair" })).resolves.toEqual({ ok: true });
    await expect(recordToolarsRecentTool({ locale: "es", toolSlug: "token-counter" })).resolves.toEqual({ ok: true });
    await expect(
      updateToolarsWorkspacePreferences({ locale: "es", preferences: { compactMode: true } })
    ).resolves.toEqual({ ok: true });

    expect(saveTool).toHaveBeenCalledWith({
      accountId: "user_456",
      locale: "es",
      toolSlug: "json-repair",
      workspaceId: "workspace_456"
    });
    expect(recordRecentTool).toHaveBeenCalledWith({
      accountId: "user_456",
      locale: "es",
      toolSlug: "token-counter",
      workspaceId: "workspace_456"
    });
    expect(updateSettings).toHaveBeenCalledWith({
      locale: "es",
      preferences: { compactMode: true },
      workspaceId: "workspace_456"
    });
  });

  it("treats an unavailable workspace RPC as a recoverable persistence failure", async () => {
    setToolarsSupabaseWorkspaceDriverForTest({
      ensureWorkspace: vi.fn().mockResolvedValue(null),
      getCurrentUser: vi.fn().mockResolvedValue({ accountId: "user_789" }),
      getRecentTools: vi.fn(),
      getSavedTools: vi.fn(),
      getSettings: vi.fn(),
      recordRecentTool: vi.fn(),
      removeSavedTool: vi.fn(),
      saveTool: vi.fn(),
      updateSettings: vi.fn()
    });

    await expect(saveToolarsTool({ locale: "en", toolSlug: "json-repair" })).resolves.toEqual({
      errorCode: "workspace-unavailable",
      ok: false
    });
  });
});
