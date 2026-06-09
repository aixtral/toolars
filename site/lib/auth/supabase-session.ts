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

type SupabaseError = {
  message?: string;
};

type SupabaseMembershipResult<T> = {
  data: T | null;
  error: SupabaseError | null;
};

type SupabaseWorkspaceMembershipQuery<T> = {
  select(columns: string): SupabaseWorkspaceMembershipQuery<T>;
  eq(column: string, value: unknown): SupabaseWorkspaceMembershipQuery<T>;
  order(
    column: string,
    options: { ascending: boolean },
  ): SupabaseWorkspaceMembershipQuery<T>;
  limit(count: number): SupabaseWorkspaceMembershipQuery<T>;
  maybeSingle(): Promise<SupabaseMembershipResult<T>>;
};

export interface SupabaseWorkspaceMembershipClient {
  from(table: 'workspace_members'): unknown;
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

function stringValue(value: unknown) {
  return typeof value === 'string' && value.length > 0 ? value : undefined;
}

function membershipTable(client: SupabaseWorkspaceMembershipClient) {
  return client.from(
    'workspace_members',
  ) as SupabaseWorkspaceMembershipQuery<Record<string, unknown>>;
}

export async function loadToolarsWorkspaceMembershipForUser(
  client: SupabaseWorkspaceMembershipClient,
  userId: string,
): Promise<ToolarsWorkspaceMembership | null> {
  const result = await membershipTable(client)
    .select('workspace_id, plan_id, role')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
    .limit(1)
    .maybeSingle();

  if (result.error) {
    throw new Error(
      `Failed to load Toolars workspace membership: ${
        result.error.message ?? 'Unknown Supabase auth error'
      }`,
    );
  }

  const workspaceId = stringValue(result.data?.workspace_id);
  const planId = stringValue(result.data?.plan_id);
  const role = stringValue(result.data?.role);

  if (!workspaceId || !planId || !role) return null;
  if (!isPlanId(planId) || !isWorkspaceRole(role)) return null;

  return {
    workspaceId,
    planId,
    role,
  };
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
