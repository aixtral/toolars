import { isPlanId } from '@/lib/plans';
import type { PlanId } from '@/lib/plans';
import type { ToolarsSession } from './index';

export type ToolarsWorkspaceRole = 'owner' | 'admin' | 'member';

export interface SupabaseVerifiedUser {
  id: string;
  email?: string | null;
}

export interface SupabaseAuthClientLike {
  auth: {
    getUser(): Promise<{
      data: {
        user: SupabaseVerifiedUser | null;
      };
      error: unknown;
    }>;
  };
}

export interface ToolarsWorkspaceMembership {
  workspaceId: string;
  planId: PlanId;
  role: ToolarsWorkspaceRole;
}

export interface ResolveToolarsSessionFromSupabaseInput {
  client: SupabaseAuthClientLike;
  loadWorkspaceForUser: (
    userId: string,
  ) => Promise<ToolarsWorkspaceMembership | null>;
}

function isWorkspaceRole(value: string): value is ToolarsWorkspaceRole {
  return value === 'owner' || value === 'admin' || value === 'member';
}

function validMembership(
  membership: ToolarsWorkspaceMembership | null,
): membership is ToolarsWorkspaceMembership {
  return Boolean(
    membership &&
      membership.workspaceId &&
      isPlanId(membership.planId) &&
      isWorkspaceRole(membership.role),
  );
}

export async function resolveToolarsSessionFromSupabase({
  client,
  loadWorkspaceForUser,
}: ResolveToolarsSessionFromSupabaseInput): Promise<ToolarsSession | null> {
  const { data, error } = await client.auth.getUser();
  const user = error ? null : data.user;

  if (!user?.id) return null;

  const membership = await loadWorkspaceForUser(user.id);
  if (!validMembership(membership)) return null;

  return {
    userId: user.id,
    email: user.email ?? null,
    workspaceId: membership.workspaceId,
    planId: membership.planId,
    role: membership.role,
    isAuthenticated: true,
  };
}
