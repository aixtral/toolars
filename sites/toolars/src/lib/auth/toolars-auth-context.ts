export const DEFAULT_TOOLARS_WORKSPACE_ID = "anonymous-local";

export interface ToolarsAuthContext {
  accountEmail: string | null;
  accountId: string | null;
  isAuthenticated: boolean;
  source: "anonymous" | "preview-header" | "session" | "supabase";
  workspaceId: string;
}
