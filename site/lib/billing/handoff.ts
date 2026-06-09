import type { ToolarsSession } from '@/lib/auth';

export interface BillingHandoffConfig {
  proCheckoutUrl?: string;
  teamCheckoutUrl?: string;
  portalUrl?: string;
}

type EnvRecord = Partial<Record<string, string | undefined>>;

export interface BuildBillingCheckoutUrlInput {
  baseUrl: string;
  session: ToolarsSession;
  returnPath?: string;
}

function cleanEnvValue(value: string | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

export function readBillingHandoffConfig(
  env: EnvRecord = process.env,
): BillingHandoffConfig {
  return {
    proCheckoutUrl: cleanEnvValue(env.TOOLARS_LEMONSQUEEZY_PRO_CHECKOUT_URL),
    teamCheckoutUrl: cleanEnvValue(env.TOOLARS_LEMONSQUEEZY_TEAM_CHECKOUT_URL),
    portalUrl: cleanEnvValue(env.TOOLARS_LEMONSQUEEZY_PORTAL_URL),
  };
}

export function resolveSafeBillingUrl(value: string | undefined) {
  if (!value) return null;

  try {
    const url = new URL(value);
    if (url.protocol !== 'https:') return null;
    return url.toString();
  } catch {
    return null;
  }
}

export function buildBillingCheckoutUrl({
  baseUrl,
  session,
  returnPath = '/app/settings?tab=billing',
}: BuildBillingCheckoutUrlInput) {
  const safeUrl = resolveSafeBillingUrl(baseUrl);
  if (!safeUrl) return null;

  const url = new URL(safeUrl);
  url.searchParams.set('checkout[custom][workspace_id]', session.workspaceId);
  url.searchParams.set('checkout[custom][user_id]', session.userId);
  url.searchParams.set('checkout[custom][return_path]', returnPath);

  if (session.email) {
    url.searchParams.set('checkout[email]', session.email);
  }

  return url.toString();
}
