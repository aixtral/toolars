import { beforeEach, describe, expect, it } from "vitest";
import {
  WORKSPACE_IDENTITY_STORAGE_KEY,
  WORKSPACE_IDENTITY_CHANGED_EVENT,
  bindWorkspaceIdentityToAccount,
  buildWorkspaceAuditHeaders,
  buildWorkspaceScopedJsonHeaders,
  getOrCreateWorkspaceIdentity,
  loadWorkspaceIdentity
} from "./workspace-identity";

describe("workspace identity", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("creates and reuses a versioned anonymous local workspace identity", () => {
    const identity = getOrCreateWorkspaceIdentity({
      now: () => "2026-06-19T10:05:00Z",
      randomSuffix: () => "abc_123!"
    });
    const reusedIdentity = getOrCreateWorkspaceIdentity({
      now: () => "2026-06-19T11:05:00Z",
      randomSuffix: () => "different"
    });

    expect(WORKSPACE_IDENTITY_STORAGE_KEY).toBe("toolars.workspace-identity:v1");
    expect(identity).toEqual({
      createdAt: "2026-06-19T10:05:00Z",
      source: "anonymous-local",
      version: 1,
      workspaceId: "toolars_ws_20260619100500_abc_123"
    });
    expect(reusedIdentity).toEqual(identity);
    expect(loadWorkspaceIdentity()?.workspaceId).toBe("toolars_ws_20260619100500_abc_123");
  });

  it("builds audit API headers from the stable workspace identity", () => {
    const identity = getOrCreateWorkspaceIdentity({
      now: () => "2026-06-19T10:06:00Z",
      randomSuffix: () => "headers"
    });

    expect(buildWorkspaceAuditHeaders(identity)).toEqual({
      "x-toolars-workspace-id": "toolars_ws_20260619100600_headers"
    });
    expect(buildWorkspaceScopedJsonHeaders(identity)).toEqual({
      "Content-Type": "application/json",
      "x-toolars-workspace-id": "toolars_ws_20260619100600_headers"
    });
  });

  it("binds the anonymous workspace identity to a future account scope", () => {
    getOrCreateWorkspaceIdentity({
      now: () => "2026-06-19T10:12:00Z",
      randomSuffix: () => "account"
    });

    const boundIdentity = bindWorkspaceIdentityToAccount({
      accountEmail: "owner@example.com",
      accountId: "acct_preview_123",
      now: () => "2026-06-19T10:13:00Z"
    });

    expect(boundIdentity).toMatchObject({
      accountBinding: {
        accountEmail: "owner@example.com",
        accountId: "acct_preview_123",
        boundAt: "2026-06-19T10:13:00Z",
        source: "future-login"
      },
      workspaceId: "toolars_ws_20260619101200_account"
    });
    expect(buildWorkspaceAuditHeaders(boundIdentity)).toEqual({
      "x-toolars-account-email": "owner@example.com",
      "x-toolars-account-id": "acct_preview_123",
      "x-toolars-workspace-id": "toolars_ws_20260619101200_account"
    });
    expect(buildWorkspaceScopedJsonHeaders(boundIdentity)).toEqual({
      "Content-Type": "application/json",
      "x-toolars-account-email": "owner@example.com",
      "x-toolars-account-id": "acct_preview_123",
      "x-toolars-workspace-id": "toolars_ws_20260619101200_account"
    });
    expect(loadWorkspaceIdentity()?.accountBinding?.accountId).toBe("acct_preview_123");
  });

  it("notifies mounted pages when a workspace identity is bound to an account", () => {
    const events: CustomEvent[] = [];
    window.addEventListener(WORKSPACE_IDENTITY_CHANGED_EVENT, (event) => {
      events.push(event as CustomEvent);
    });

    const boundIdentity = bindWorkspaceIdentityToAccount({
      accountEmail: "owner@example.com",
      accountId: "acct_preview_123",
      now: () => "2026-06-19T10:13:00Z"
    });

    expect(events).toHaveLength(1);
    expect(events[0].detail).toEqual(boundIdentity);
  });
});
