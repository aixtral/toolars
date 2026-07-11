import { createToolarsSupabaseBrowserClient } from "./client";
import { isToolarsSupabaseConfigured } from "./toolars-supabase-config";

export interface ToolarsSavedTool {
  locale: string;
  savedAt: string;
  toolSlug: string;
}

export interface ToolarsRecentTool {
  locale: string;
  openedAt: string;
  toolSlug: string;
}

export interface ToolarsWorkspaceSettings {
  locale: string;
  preferences: Record<string, unknown>;
}

export interface ToolarsSupabaseWorkspaceDriver {
  ensureWorkspace: (input: { accountId: string; locale: string }) => Promise<{ workspaceId: string } | null>;
  getCurrentUser: () => Promise<{ accountId: string } | null>;
  getRecentTools: (input: { accountId: string; workspaceId: string }) => Promise<ToolarsRecentTool[]>;
  getSavedTools: (input: { accountId: string; workspaceId: string }) => Promise<ToolarsSavedTool[]>;
  getSettings: (input: { workspaceId: string }) => Promise<ToolarsWorkspaceSettings | null>;
  recordRecentTool: (input: {
    accountId: string;
    locale: string;
    toolSlug: string;
    workspaceId: string;
  }) => Promise<boolean>;
  removeSavedTool: (input: { accountId: string; toolSlug: string; workspaceId: string }) => Promise<boolean>;
  saveTool: (input: {
    accountId: string;
    locale: string;
    toolSlug: string;
    workspaceId: string;
  }) => Promise<boolean>;
  updateSettings: (input: {
    locale: string;
    preferences: Record<string, unknown>;
    workspaceId: string;
  }) => Promise<boolean>;
}

export type ToolarsWorkspaceSnapshot =
  | { status: "not-configured" | "unauthenticated" | "workspace-unavailable" }
  | {
      accountId: string;
      recentTools: ToolarsRecentTool[];
      savedTools: ToolarsSavedTool[];
      settings: ToolarsWorkspaceSettings | null;
      status: "ready";
      workspaceId: string;
    };

export type ToolarsWorkspaceWriteResult =
  | { ok: true }
  | { errorCode: "not-configured" | "unauthenticated" | "workspace-unavailable" | "write-failed"; ok: false };

type ToolarsWorkspaceContext =
  | { status: "not-configured" | "unauthenticated" | "workspace-unavailable" }
  | { accountId: string; driver: ToolarsSupabaseWorkspaceDriver; status: "ready"; workspaceId: string };

let workspaceDriverForTest: ToolarsSupabaseWorkspaceDriver | null = null;

export function setToolarsSupabaseWorkspaceDriverForTest(driver: ToolarsSupabaseWorkspaceDriver | null) {
  workspaceDriverForTest = driver;
}

export async function getToolarsSupabaseWorkspaceSnapshot({ locale }: { locale: string }): Promise<ToolarsWorkspaceSnapshot> {
  const context = await getWorkspaceContext(locale);
  if (context.status !== "ready") return context;

  const workspaceScope = toWorkspaceScope(context);

  const [savedTools, recentTools, settings] = await Promise.all([
    safeWorkspaceRequest(() => context.driver.getSavedTools(workspaceScope)),
    safeWorkspaceRequest(() => context.driver.getRecentTools(workspaceScope)),
    safeWorkspaceRequest(() => context.driver.getSettings({ workspaceId: context.workspaceId }))
  ]);

  return {
    accountId: context.accountId,
    recentTools: recentTools ?? [],
    savedTools: savedTools ?? [],
    settings: settings ?? null,
    status: "ready",
    workspaceId: context.workspaceId
  };
}

export async function saveToolarsTool({
  locale,
  toolSlug
}: {
  locale: string;
  toolSlug: string;
}): Promise<ToolarsWorkspaceWriteResult> {
  const context = await getWorkspaceContext(locale);
  if (context.status !== "ready") return contextToWriteResult(context.status);

  return (await safeWorkspaceRequest(() => context.driver.saveTool({ ...toWorkspaceScope(context), locale, toolSlug })))
    ? { ok: true }
    : { errorCode: "write-failed", ok: false };
}

export async function removeToolarsSavedTool({ toolSlug }: { toolSlug: string }): Promise<ToolarsWorkspaceWriteResult> {
  const context = await getWorkspaceContext("en");
  if (context.status !== "ready") return contextToWriteResult(context.status);

  return (await safeWorkspaceRequest(() => context.driver.removeSavedTool({ ...toWorkspaceScope(context), toolSlug })))
    ? { ok: true }
    : { errorCode: "write-failed", ok: false };
}

export async function recordToolarsRecentTool({
  locale,
  toolSlug
}: {
  locale: string;
  toolSlug: string;
}): Promise<ToolarsWorkspaceWriteResult> {
  const context = await getWorkspaceContext(locale);
  if (context.status !== "ready") return contextToWriteResult(context.status);

  return (await safeWorkspaceRequest(() => context.driver.recordRecentTool({ ...toWorkspaceScope(context), locale, toolSlug })))
    ? { ok: true }
    : { errorCode: "write-failed", ok: false };
}

export async function updateToolarsWorkspacePreferences({
  locale,
  preferences
}: {
  locale: string;
  preferences: Record<string, unknown>;
}): Promise<ToolarsWorkspaceWriteResult> {
  const context = await getWorkspaceContext(locale);
  if (context.status !== "ready") return contextToWriteResult(context.status);

  const currentSettings = await safeWorkspaceRequest(() => context.driver.getSettings({ workspaceId: context.workspaceId }));
  const nextPreferences = { ...(currentSettings?.preferences ?? {}), ...preferences };
  return (await safeWorkspaceRequest(() => context.driver.updateSettings({ locale, preferences: nextPreferences, workspaceId: context.workspaceId })))
    ? { ok: true }
    : { errorCode: "write-failed", ok: false };
}

async function getWorkspaceContext(locale: string): Promise<ToolarsWorkspaceContext> {
  const driver = getWorkspaceDriver();
  if (!driver) return { status: "not-configured" as const };

  const user = await safeWorkspaceRequest(() => driver.getCurrentUser());
  if (!user?.accountId) return { status: "unauthenticated" as const };

  const workspace = await safeWorkspaceRequest(() => driver.ensureWorkspace({ accountId: user.accountId, locale }));
  if (!workspace?.workspaceId) return { status: "workspace-unavailable" as const };

  return { accountId: user.accountId, driver, status: "ready", workspaceId: workspace.workspaceId };
}

function contextToWriteResult(status: "not-configured" | "unauthenticated" | "workspace-unavailable"): ToolarsWorkspaceWriteResult {
  return { errorCode: status, ok: false };
}

function toWorkspaceScope({ accountId, workspaceId }: { accountId: string; workspaceId: string }) {
  return { accountId, workspaceId };
}

function getWorkspaceDriver(): ToolarsSupabaseWorkspaceDriver | null {
  if (workspaceDriverForTest) return workspaceDriverForTest;
  if (!isToolarsSupabaseConfigured()) return null;

  const client = createToolarsSupabaseBrowserClient();
  return {
    async ensureWorkspace({ locale }) {
      const { data, error } = await client.rpc("ensure_toolars_workspace", { preferred_locale: locale });
      return error || typeof data !== "string" || !data ? null : { workspaceId: data };
    },
    async getCurrentUser() {
      const { data, error } = await client.auth.getUser();
      return error || !data.user?.id ? null : { accountId: data.user.id };
    },
    async getRecentTools({ accountId, workspaceId }) {
      const { data, error } = await client
        .from("recent_tools")
        .select("tool_slug, locale, opened_at")
        .eq("workspace_id", workspaceId)
        .eq("user_id", accountId)
        .order("opened_at", { ascending: false })
        .limit(24);
      if (error || !data) return [];
      return data.map((row) => ({ locale: row.locale, openedAt: row.opened_at, toolSlug: row.tool_slug }));
    },
    async getSavedTools({ accountId, workspaceId }) {
      const { data, error } = await client
        .from("saved_tools")
        .select("tool_slug, locale, created_at")
        .eq("workspace_id", workspaceId)
        .eq("user_id", accountId)
        .order("created_at", { ascending: false });
      if (error || !data) return [];
      return data.map((row) => ({ locale: row.locale, savedAt: row.created_at, toolSlug: row.tool_slug }));
    },
    async getSettings({ workspaceId }) {
      const { data, error } = await client
        .from("workspace_settings")
        .select("locale, preferences")
        .eq("workspace_id", workspaceId)
        .maybeSingle();
      if (error || !data) return null;
      return {
        locale: data.locale,
        preferences: isRecord(data.preferences) ? data.preferences : {}
      };
    },
    async recordRecentTool({ accountId, locale, toolSlug, workspaceId }) {
      const { error } = await client.from("recent_tools").insert({
        locale,
        tool_slug: toolSlug,
        user_id: accountId,
        workspace_id: workspaceId
      });
      return !error;
    },
    async removeSavedTool({ accountId, toolSlug, workspaceId }) {
      const { error } = await client
        .from("saved_tools")
        .delete()
        .eq("workspace_id", workspaceId)
        .eq("user_id", accountId)
        .eq("tool_slug", toolSlug);
      return !error;
    },
    async saveTool({ accountId, locale, toolSlug, workspaceId }) {
      const { error } = await client.from("saved_tools").upsert(
        {
          locale,
          tool_slug: toolSlug,
          user_id: accountId,
          workspace_id: workspaceId
        },
        { onConflict: "workspace_id,user_id,tool_slug" }
      );
      return !error;
    },
    async updateSettings({ locale, preferences, workspaceId }) {
      const { error } = await client.from("workspace_settings").upsert(
        { locale, preferences, workspace_id: workspaceId },
        { onConflict: "workspace_id" }
      );
      return !error;
    }
  };
}

async function safeWorkspaceRequest<T>(request: () => Promise<T>): Promise<T | null> {
  try {
    return await request();
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}
