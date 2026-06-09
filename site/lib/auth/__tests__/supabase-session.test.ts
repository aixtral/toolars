import { describe, expect, it, vi } from 'vitest';
import {
  loadToolarsWorkspaceMembershipForUser,
  resolveToolarsSessionFromSupabase,
} from '@/lib/auth/supabase-session';

function authClientFor(user: { id: string; email?: string | null } | null) {
  return {
    auth: {
      getUser: vi.fn(async () => ({
        data: { user },
        error: null,
      })),
    },
  };
}

describe('Supabase Toolars session resolver', () => {
  it('loads the first valid workspace membership for a verified user', async () => {
    const query = {
      select: vi.fn(() => query),
      eq: vi.fn(() => query),
      order: vi.fn(() => query),
      limit: vi.fn(() => query),
      maybeSingle: vi.fn(async () => ({
        data: {
          workspace_id: 'workspace_123',
          plan_id: 'team',
          role: 'admin',
        },
        error: null,
      })),
    };
    const client = {
      from: vi.fn(() => query),
    };

    await expect(
      loadToolarsWorkspaceMembershipForUser(client, 'user_123'),
    ).resolves.toEqual({
      workspaceId: 'workspace_123',
      planId: 'team',
      role: 'admin',
    });
    expect(client.from).toHaveBeenCalledWith('workspace_members');
    expect(query.eq).toHaveBeenCalledWith('user_id', 'user_123');
  });

  it('maps a verified Supabase user and workspace membership to a Toolars session', async () => {
    const loadWorkspaceForUser = vi.fn(async () => ({
      workspaceId: 'workspace_123',
      planId: 'pro' as const,
      role: 'owner' as const,
    }));

    await expect(
      resolveToolarsSessionFromSupabase({
        client: authClientFor({ id: 'user_123', email: 'founder@toolars.test' }),
        loadWorkspaceForUser,
      }),
    ).resolves.toEqual({
      userId: 'user_123',
      email: 'founder@toolars.test',
      workspaceId: 'workspace_123',
      planId: 'pro',
      role: 'owner',
      isAuthenticated: true,
    });
    expect(loadWorkspaceForUser).toHaveBeenCalledWith('user_123');
  });

  it('denies the session when the verified user has no workspace membership', async () => {
    await expect(
      resolveToolarsSessionFromSupabase({
        client: authClientFor({ id: 'user_123', email: 'founder@toolars.test' }),
        loadWorkspaceForUser: async () => null,
      }),
    ).resolves.toBeNull();
  });

  it('denies the session when Supabase cannot verify a user', async () => {
    await expect(
      resolveToolarsSessionFromSupabase({
        client: authClientFor(null),
        loadWorkspaceForUser: async () => ({
          workspaceId: 'workspace_123',
          planId: 'pro',
          role: 'owner',
        }),
      }),
    ).resolves.toBeNull();
  });
});
